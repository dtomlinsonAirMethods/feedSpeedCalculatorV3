#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
//  OKUMA GENOS CONVERTER — Node.js standalone
//  Called by Mastercam after post — converts .MIN to Okuma format
//  Fetches tool library from Firebase, overwrites original file,
//  then launches CimcoEdit with the converted file.
// ══════════════════════════════════════════════════════════════

const fs      = require('fs');
const path    = require('path');
const https   = require('https');
const http    = require('http');
const { execFile, spawn } = require('child_process');

// ── Config ────────────────────────────────────────────────────
const FIREBASE_URL = 'https://okuma-tool-library-default-rtdb.firebaseio.com/data/toolLibrary.json';
const WCS_INC      = 1;
const SCRIPT_DIR   = require('path').dirname(process.argv[1] || __filename);
const CONFIG_FILE  = require('path').join(SCRIPT_DIR, 'OkumaConverter.config.json');

// Auto-detect CimcoEdit
function findCimco() {
  // 1. Check saved config
  try {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    if (cfg.cimcoPath && fs.existsSync(cfg.cimcoPath)) return cfg.cimcoPath;
  } catch(e) {}

  // 2. Check common install locations
  const candidates = [
    'C:\\Program Files\\Mastercam 2025\\common\\Editors\\CIMCOEdit\\CIMCOEdit.exe',
    'C:\\Program Files\\Mastercam 2024\\common\\Editors\\CIMCOEdit\\CIMCOEdit.exe',
    'C:\\Program Files\\Mastercam 2023\\common\\Editors\\CIMCOEdit\\CIMCOEdit.exe',
    'C:\\Program Files (x86)\\CIMCOEdit\\CIMCOEdit.exe',
    process.env.USERPROFILE + '\\Desktop\\CIMCOEdit.exe',
    process.env.USERPROFILE + '\\Desktop\\CIMCO\\CIMCOEdit.exe',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      // Save for next time
      try { fs.writeFileSync(CONFIG_FILE, JSON.stringify({ cimcoPath: c }, null, 2)); } catch(e) {}
      return c;
    }
  }

  // 3. Ask user to locate it
  const { execFileSync } = require('child_process');
  const tmpScript = require('os').tmpdir() + '\\cimco_picker.ps1';
  fs.writeFileSync(tmpScript, [
    'Add-Type -AssemblyName System.Windows.Forms',
    '$dlg = New-Object System.Windows.Forms.OpenFileDialog',
    '$dlg.Title = "Locate CIMCOEdit.exe"',
    '$dlg.Filter = "CIMCOEdit (CIMCOEdit.exe)|CIMCOEdit.exe|All Files (*.*)|*.*"',
    '$dlg.InitialDirectory = $env:USERPROFILE + "\\Desktop"',
    'if ($dlg.ShowDialog() -eq "OK") { Write-Output $dlg.FileName }',
  ].join('\n'));
  try {
    const result = execFileSync('powershell', ['-ExecutionPolicy','Bypass','-File',tmpScript], { encoding:'utf8' }).trim();
    try { fs.unlinkSync(tmpScript); } catch(e) {}
    if (result && fs.existsSync(result)) {
      try { fs.writeFileSync(CONFIG_FILE, JSON.stringify({ cimcoPath: result }, null, 2)); } catch(e) {}
      return result;
    }
  } catch(e) {
    try { fs.unlinkSync(tmpScript); } catch(e2) {}
  }
  return null;
}

const CIMCO_PATH = findCimco();
// ─────────────────────────────────────────────────────────────

let filePath = process.argv[2];
// Strip surrounding quotes if Mastercam passed the path quoted
if (filePath) filePath = filePath.replace(/^["']|["']$/g, '').trim();

const COORD_PORT  = 19236; // coordinator port — collects file paths before showing dialog
const SIGNAL_PORT = 19235;
const MAIN_PORT   = 19234;

// Debug log removed

// If no file passed (Mastercam didn't send it), open a file picker
if (!filePath || !fs.existsSync(filePath)) {
  const { execFileSync } = require('child_process');
  const os = require('os');
  const tmpScript = os.tmpdir() + '\\okuma_picker.ps1';
  const psLines = [
    'Add-Type -AssemblyName System.Windows.Forms',
    '$dlg = New-Object System.Windows.Forms.OpenFileDialog',
    '$dlg.Title = "Select .MIN file to convert"',
    '$dlg.Filter = "MIN Files (*.min)|*.min|All Files (*.*)|*.*"',
    '$dlg.InitialDirectory = "M:\\PROGRAMS\\OKUMA GENOS 660\\3 Axis"',
    'if ($dlg.ShowDialog() -eq "OK") { Write-Output $dlg.FileName }',
  ].join('\n');
  try {
    fs.writeFileSync(tmpScript, psLines);
    const result = execFileSync('powershell', [
      '-ExecutionPolicy', 'Bypass', '-File', tmpScript
    ], { encoding: 'utf8' }).trim();
    try { fs.unlinkSync(tmpScript); } catch(e) {}
    if (!result) process.exit(0);
    filePath = result;
  } catch(e) {
    try { fs.unlinkSync(tmpScript); } catch(e2) {}
    process.exit(0);
  }
}

if (!filePath || !fs.existsSync(filePath)) {
  process.exit(0);
}

const fileName = path.basename(filePath);

// ── Check if this is an Okuma program — .min extension is Okuma-specific ──
const isOkumaPath  = path.extname(filePath).toLowerCase() === '.min';
const fileContent0 = isOkumaPath ? (() => { try { return fs.readFileSync(filePath, 'utf8'); } catch(e) { return ''; } })() : '';

// ── Main flow ─────────────────────────────────────────────────
async function main() {
  if (!isOkumaPath) {
    launchCimco(filePath);
    return;
  }

  // Try to register with coordinator (another instance is collecting files)
  const registered = await new Promise(resolve => {
    const req = http.request({ hostname:'127.0.0.1', port:COORD_PORT,
      path:'/register', method:'POST',
      headers:{'Content-Type':'application/json'}
    }, res => { resolve(res.statusCode === 200); });
    req.on('error', () => resolve(false));
    req.setTimeout(500, () => { req.destroy(); resolve(false); });
    req.write(JSON.stringify({ filePath, fileName }));
    req.end();
  });

  if (registered) {
    // Another instance is coordinating — just exit, it will handle everything
    process.exit(0);
  }

  // We are the coordinator — collect files then show dialog
  const pendingFiles = [{ filePath, fileName }];

  // Start coordinator server to collect additional files
  const coordServer = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/register') {
      let body = '';
      req.on('data', d => body += d);
      req.on('end', () => {
        try {
          pendingFiles.push(JSON.parse(body));
          res.writeHead(200); res.end('ok');
        } catch(e) { res.writeHead(400); res.end(); }
      });
    } else { res.writeHead(404); res.end(); }
  });

  await new Promise(resolve => coordServer.listen(COORD_PORT, '127.0.0.1', resolve));

  // Wait 4 seconds for Mastercam to call bat for remaining files
  await new Promise(resolve => setTimeout(resolve, 4000));
  coordServer.close();

  // Show single consolidated checkbox dialog
  const filesToConvert = await showFileSelectionDialog(pendingFiles);

  if (!filesToConvert || filesToConvert.length === 0) {
    // User cancelled or deselected all — open all in CimcoEdit as-is
    pendingFiles.forEach(f => launchCimco(f.filePath));
    process.exit(0);
  }

  // Open non-selected files in CimcoEdit as-is
  pendingFiles.forEach(f => {
    if (!filesToConvert.find(c => c.filePath === f.filePath)) launchCimco(f.filePath);
  });

  // Fetch tool library from Firebase once for all files
  let toolLibrary = [];
  try {
    toolLibrary = await fetchLibrary();
    if (!toolLibrary || toolLibrary.length === 0) throw new Error('Empty library returned');
  } catch (e) {
    showDialog('warn', `Could not load Firebase library:\n${e.message}\n\nUsing fallback library.`);
    toolLibrary = getFallbackLibrary();
  }

  // Convert all selected files
  const allResults = [];
  for (const f of filesToConvert) {
    const fileContent = (() => { try { return fs.readFileSync(f.filePath, 'utf8'); } catch(e) { return ''; } })();
    const { output, toolMap, sameTools, unmapped, changedLines } = convertFile(fileContent, toolLibrary);
    try { fs.writeFileSync(f.filePath, output, 'utf8'); } catch(e) {
      showDialog('error', `Could not save:\n${f.fileName}\n${e.message}`);
    }
    launchCimco(f.filePath);

    const wcsCount  = output.split('\n').filter(l => /G15\s+H/.test(l)).length;
    const origArr   = fileContent.split(/\r?\n/);
    const convArr   = output.split(/\r?\n/);
    allResults.push({
      type:      'gcode',
      file:      f.fileName,
      toolMap,
      sameTools: Array.from(sameTools),
      unmapped,
      changedLines,
      wcsCount,
      diffLines: origArr.map((orig, i) => ({ orig, conv: convArr[i]||'', changed: orig!==(convArr[i]||'') })).slice(0,500),
      totalLines: origArr.length
    });
  }

  // Build result for this file
  const unmappedKeys = Object.keys(unmapped);
  const wcsCount     = output.split('\n').filter(l => /G15\s+H/.test(l)).length;
  const origLinesArr = content.split(/\r?\n/);
  const convLinesArr = output.split(/\r?\n/);
  const diffLines    = origLinesArr.map((orig, i) => ({
    orig, conv: convLinesArr[i] || '', changed: orig !== (convLinesArr[i] || '')
  }));

  const result = {
    type:        'gcode',
    file:        fileName,
    toolMap:     toolMap,
    sameTools:   Array.from(sameTools),
    unmapped:    unmapped,
    changedLines,
    wcsCount,
    diffLines:   diffLines.slice(0, 500),
    totalLines:  origLinesArr.length
  };

  const PORT        = 19234;
  const SIGNAL_PORT = 19235; // secondary port to signal existing server

  // Try to signal an existing server (another file already opened the PWA)
  const signalled = await new Promise(resolve => {
    const req = http.request({ hostname:'127.0.0.1', port:SIGNAL_PORT,
      path:'/add', method:'POST',
      headers:{'Content-Type':'application/json'}
    }, res => { resolve(res.statusCode === 200); });
    req.on('error', () => resolve(false));
    req.setTimeout(500, () => { req.destroy(); resolve(false); });
    req.write(JSON.stringify(result));
    req.end();
  });

  if (signalled) {
    // Another instance is already serving — just exit, PWA will update automatically
    process.exit(0);
  }

  // No existing server — start one, allResults built by convert loop above

  // Main server — serves all results to PWA
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(allResults));
    // Don't close yet — more files may come
  });

  // Signal server — receives additional results from other instances
  const signalServer = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/add') {
      let body = '';
      req.on('data', d => body += d);
      req.on('end', () => {
        try {
          allResults.push(JSON.parse(body));
          res.writeHead(200); res.end('ok');
        } catch(e) { res.writeHead(400); res.end('error'); }
      });
    } else {
      res.writeHead(404); res.end();
    }
  });

  // Start both servers then open PWA
  await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve));
  await new Promise(resolve => signalServer.listen(SIGNAL_PORT, '127.0.0.1', resolve));

  const baseUrl = 'https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3/converter.html';
  const url     = baseUrl + '?fromBat=1&type=gcode&port=' + PORT;

  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  const PWA_APP_ID = 'lnoadbjemimfchocihomjfgadfbhccnd';

  let launched = false;
  for (const chromePath of chromePaths) {
    if (fs.existsSync(chromePath)) {
      spawn(chromePath, [
        '--profile-directory=Default',
        '--app-id=' + PWA_APP_ID,
        '--app-launch-url-for-shortcuts-menu-item=' + url
      ], { detached: true, stdio: 'ignore' }).unref();
      launched = true;
      break;
    }
  }
  if (!launched) spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();

  // Keep alive — poll for new results and auto-close after 60s of inactivity
  let lastActivity = Date.now();
  const prevCount  = allResults.length;

  const keepAlive = setInterval(() => {
    if (allResults.length > prevCount) lastActivity = Date.now();
    if (Date.now() - lastActivity > 60000) {
      clearInterval(keepAlive);
      server.close();
      signalServer.close();
      process.exit(0);
    }
  }, 1000);

  server.on('close', () => { signalServer.close(); });
}

// ── Conversion logic ──────────────────────────────────────────
function convertFile(content, toolLibrary) {
  const lines      = content.split(/\r?\n/);
  const toolMap    = {};
  const sameTools  = new Set();
  const unmapped   = {};
  const outLines   = [];
  let   changedLines = 0;

  // Pass 1: build tool map from header comment lines
  // Format: (T5 - 1/4 SPOTDRILL - H5)
  for (const line of lines) {
    const m = line.match(/\(T(\d+)\s*-\s*(.+?)\s*-\s*H\d+\)/i);
    if (!m) continue;
    const haasNum  = m[1];
    const toolDesc = m[2].trim();
    if (toolMap[haasNum]) continue;

    for (const entry of toolLibrary) {
      if (matchesEntry(entry, toolDesc)) {
        const okumaNum = String(entry.okuma);
        toolMap[haasNum] = okumaNum;
        if (haasNum === okumaNum) sameTools.add(haasNum);
        break;
      }
    }

    if (!toolMap[haasNum] && !unmapped[haasNum]) {
      unmapped[haasNum] = toolDesc;
    }
  }

  // Pass 2: convert each line
  for (const line of lines) {
    let conv = line;

    // Replace T# (tool number)
    conv = conv.replace(/\bT(\d+)\b/g, (match, tNum) => {
      if (toolMap[tNum] && !sameTools.has(tNum)) return 'T' + toolMap[tNum];
      return match;
    });

    // Replace WCS G15 H# — increment by WCS_INC (must run BEFORE tool H replacement)
    conv = conv.replace(/\bG15\s+H(\d+)\b/g, (match, hNum) => {
      const newH = parseInt(hNum) + WCS_INC;
      return `G15 H${newH}`;
    });

    // Replace H# (tool length offset) — skip H0 and skip lines with G15
    if (!/\bG15\b/.test(conv)) {
      conv = conv.replace(/\bH(\d+)\b/g, (match, hNum) => {
        if (hNum === '0') return match;
        if (toolMap[hNum] && !sameTools.has(hNum)) return 'H' + toolMap[hNum];
        return match;
      });
    }

    if (conv !== line) changedLines++;
    outLines.push(conv);
  }

  return { output: outLines.join('\r\n'), toolMap, sameTools, unmapped, changedLines };
}

// ── Tool matching (mirrors browser converter logic) ───────────
function matchesEntry(entry, text) {
  text = text.toUpperCase().trim();
  const mType = (entry.matchType || 'serial').toLowerCase();
  const mVal  = (entry.matchVal  || '').toUpperCase().trim();

  if (mType === 'serial') {
    if (text.includes(mVal)) return true;
    if (entry.altVals) {
      for (const av of entry.altVals) {
        if (av && text.includes(av.toUpperCase().trim())) return true;
      }
    }
    return false;
  }

  // Keyword match with normalize
  const normText = normalize(text);
  const normVal  = normalize(mVal);
  if (normText.includes(normVal)) return true;
  if (entry.altVals) {
    for (const av of entry.altVals) {
      if (av && normText.includes(normalize(av.toUpperCase()))) return true;
    }
  }
  return false;
}

function normalize(str) {
  return str.toUpperCase()
    .replace(/NO\.\s*(\d+)/g,  'NO$1')
    .replace(/LTR\.\s*([A-Z])/g, 'LTR$1')
    .replace(/\./g,  ' ')
    .replace(/-/g,   ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Firebase fetch ─────────────────────────────────────────────
function fetchLibrary() {
  return new Promise((resolve, reject) => {
    https.get(FIREBASE_URL, { timeout: 8000 }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) resolve(parsed);
          else reject(new Error('Unexpected Firebase response format'));
        } catch (e) {
          reject(new Error('Failed to parse Firebase response'));
        }
      });
    }).on('error', reject).on('timeout', () => reject(new Error('Firebase request timed out')));
  });
}

// ── Launch CimcoEdit ──────────────────────────────────────────
function launchCimco(filePath) {
  if (!CIMCO_PATH) {
    showDialog('warn', 'CimcoEdit not found.\nFile converted successfully but could not open in CimcoEdit.\n\nDelete OkumaConverter.config.json and rerun to reconfigure.');
    return;
  }
  try {
    spawn(CIMCO_PATH, [filePath], { detached: true, stdio: 'ignore' }).unref();
  } catch (e) {
    showDialog('error', `Could not launch CimcoEdit:\n${e.message}\n\nPath: ${CIMCO_PATH}`);
  }
}

// ── File selection checkbox dialog ───────────────────────────
async function showFileSelectionDialog(files) {
  const { execFileSync } = require('child_process');
  const os = require('os');
  const tmpScript = os.tmpdir() + '\\okuma_select.ps1';

  const nl = '\n';
  let psLines = [];
  psLines.push('Add-Type -AssemblyName System.Windows.Forms');
  psLines.push('Add-Type -AssemblyName System.Drawing');
  psLines.push('$form = New-Object System.Windows.Forms.Form');
  psLines.push('$form.Text = "Okuma Genos Converter"');
  psLines.push('$form.Width = 520');
  psLines.push('$form.Height = ' + (140 + files.length * 28 + 60));
  psLines.push('$form.StartPosition = "CenterScreen"');
  psLines.push('$form.FormBorderStyle = "FixedDialog"');
  psLines.push('$form.MaximizeBox = $false');
  psLines.push('$form.MinimizeBox = $false');
  psLines.push('$lbl = New-Object System.Windows.Forms.Label');
  psLines.push('$lbl.Text = "Select files to convert to Okuma format:"');
  psLines.push('$lbl.Location = New-Object System.Drawing.Point(20, 20)');
  psLines.push('$lbl.Width = 460');
  psLines.push('$lbl.Height = 30');
  psLines.push('$form.Controls.Add($lbl)');

  files.forEach((f, i) => {
    const y = 60 + i * 28;
    psLines.push('$cb' + i + ' = New-Object System.Windows.Forms.CheckBox');
    psLines.push('$cb' + i + '.Text = "' + f.fileName.replace(/"/g, "'") + '"');
    psLines.push('$cb' + i + '.Checked = $true');
    psLines.push('$cb' + i + '.Width = 460');
    psLines.push('$cb' + i + '.Height = 24');
    psLines.push('$cb' + i + '.Location = New-Object System.Drawing.Point(20, ' + y + ')');
    psLines.push('$form.Controls.Add($cb' + i + ')');
  });

  const btnY = 60 + files.length * 28 + 14;
  psLines.push('$btn = New-Object System.Windows.Forms.Button');
  psLines.push('$btn.Text = "CONVERT"');
  psLines.push('$btn.Location = New-Object System.Drawing.Point(20, ' + btnY + ')');
  psLines.push('$btn.Width = 120');
  psLines.push('$btn.Height = 32');
  psLines.push('$btn.DialogResult = [System.Windows.Forms.DialogResult]::OK');
  psLines.push('$form.AcceptButton = $btn');
  psLines.push('$form.Controls.Add($btn)');
  psLines.push('$btnC = New-Object System.Windows.Forms.Button');
  psLines.push('$btnC.Text = "CANCEL"');
  psLines.push('$btnC.Location = New-Object System.Drawing.Point(160, ' + btnY + ')');
  psLines.push('$btnC.Width = 100');
  psLines.push('$btnC.Height = 32');
  psLines.push('$btnC.DialogResult = [System.Windows.Forms.DialogResult]::Cancel');
  psLines.push('$form.CancelButton = $btnC');
  psLines.push('$form.Controls.Add($btnC)');
  psLines.push('$result = $form.ShowDialog()');
  psLines.push('if ($result -eq [System.Windows.Forms.DialogResult]::OK) {');
  psLines.push('  $selected = @()');
  files.forEach((f, i) => {
    const safePath = f.filePath.split('\\').join('\\\\');
    const safeName = f.fileName.replace(/"/g, "'");
    psLines.push('  if ($cb' + i + '.Checked) { $selected += "' + safePath + '|' + safeName + '" }');
  });
  psLines.push('  $selected -join ";"');
  psLines.push('}');

  try {
    fs.writeFileSync(tmpScript, psLines.join('\n'));
    const result = execFileSync('powershell', [
      '-ExecutionPolicy', 'Bypass', '-File', tmpScript
    ], { encoding: 'utf8' }).trim();
    try { fs.unlinkSync(tmpScript); } catch(e) {}
    if (!result) return null;
    return result.split(';').filter(Boolean).map(entry => {
      const pipeIdx = entry.indexOf('|');
      return { filePath: entry.slice(0, pipeIdx), fileName: entry.slice(pipeIdx + 1) };
    });
  } catch(e) {
    try { fs.unlinkSync(tmpScript); } catch(e2) {}
    return null;
  }
}

// ── Dialog helpers (using PowerShell msgbox) ──────────────────
function showDialog(type, message) {
  const icons = { info: 64, warn: 48, error: 16 };
  const icon  = icons[type] || 64;
  const title = 'Okuma Genos Converter';
  const safe  = message.replace(/'/g, "''").replace(/`/g, '``');
  const cmd   = `Add-Type -AssemblyName PresentationFramework;[System.Windows.MessageBox]::Show('${safe}','${title}',0,${icon})`;
  require('child_process').execFileSync('powershell', ['-Command', cmd], { stdio: 'ignore' });
}

function askYesNo(message) {
  const title = 'Okuma Genos Converter';
  const safe  = message.replace(/'/g, "''").replace(/`/g, '``');
  const cmd   = `Add-Type -AssemblyName PresentationFramework;[System.Windows.MessageBox]::Show('${safe}','${title}','YesNo',32)`;
  try {
    const result = require('child_process').execFileSync(
      'powershell', ['-Command', cmd], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }
    ).trim();
    return result === 'Yes';
  } catch (e) {
    return false;
  }
}

// ── Minimal fallback library ───────────────────────────────────
function getFallbackLibrary() {
  return [
    { matchType:'serial',  matchVal:'82045',  okuma:1,   desc:'HELICAL 82045 3/4 ROUGHER' },
    { matchType:'serial',  matchVal:'48655',  okuma:2,   desc:'HELICAL 48655 3/4' },
    { matchType:'serial',  matchVal:'48665',  okuma:3,   desc:'HELICAL 48665 3/4 .06R' },
    { matchType:'serial',  matchVal:'48130',  okuma:8,   desc:'HELICAL 48130 1/4' },
    { matchType:'serial',  matchVal:'48395',  okuma:10,  desc:'HELICAL 48395 1/2' },
    { matchType:'keyword', matchVal:'1/4 90 DEGREE CHAMFER MILL', okuma:11, desc:'1/4 CHAMFER' },
    { matchType:'keyword', matchVal:'1/4 SPOTDRILL', okuma:12, desc:'1/4 SPOTDRILL' },
    { matchType:'keyword', matchVal:'NO. 16 STUB DRILL', okuma:17, desc:'NO. 16 STUB DRILL' },
  ];
}

main().catch(e => {
  showDialog('error', `Unexpected error:\n${e.message}`);
  process.exit(1);
});
