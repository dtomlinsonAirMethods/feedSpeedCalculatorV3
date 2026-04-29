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
    // Not an Okuma program — just open in CimcoEdit silently
    launchCimco(filePath);
    return;
  }

  // Ask user whether to convert
  const doConvert = await askYesNo(
    `Convert ${fileName} to Okuma format?`
  );

  if (!doConvert) {
    launchCimco(filePath);
    return;
  }

  // Fetch tool library from Firebase
  let toolLibrary = [];
  try {
    toolLibrary = await fetchLibrary();
    if (!toolLibrary || toolLibrary.length === 0) throw new Error('Empty library returned');
  } catch (e) {
    showDialog('warn', `Could not load Firebase library:\n${e.message}\n\nUsing fallback library.`);
    toolLibrary = getFallbackLibrary();
  }

  // Reuse already-read content
  const content = fileContent0;

  // Convert
  const { output, toolMap, sameTools, unmapped, changedLines } = convertFile(content, toolLibrary);

  // Overwrite original
  try {
    fs.writeFileSync(filePath, output, 'utf8');
  } catch (e) {
    showDialog('error', `Could not save converted file:\n${e.message}`);
    process.exit(1);
  }

  // Launch CimcoEdit first
  launchCimco(filePath);

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

  // No existing server — start one
  const allResults = [result];

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

  // Keep process alive — close after 60s
  server.on('close', () => { signalServer.close(); process.exit(0); });
  setTimeout(() => { server.close(); }, 60000).unref();
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
  const { execFileSync } = require('child_process');
  const os = require('os');
  const tmp = os.tmpdir() + '\\okuma_ask.ps1';
  const safe = message.replace(/"/g, "'");
  const ps = [
    'Add-Type -AssemblyName System.Windows.Forms',
    'Add-Type -AssemblyName System.Drawing',
    // Detect dark mode
    '$dark = $false',
    'try {',
    '  $reg = Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name AppsUseLightTheme -ErrorAction Stop',
    '  $dark = ($reg.AppsUseLightTheme -eq 0)',
    '} catch {}',
    '$bg  = if ($dark) { [System.Drawing.Color]::FromArgb(32,32,32) }  else { [System.Drawing.Color]::White }',
    '$fg  = if ($dark) { [System.Drawing.Color]::White }               else { [System.Drawing.Color]::Black }',
    '$btn1bg = [System.Drawing.Color]::FromArgb(0,200,118)',
    '$form = New-Object System.Windows.Forms.Form',
    '$form.Text = "Okuma Genos Converter"',
    '$form.Width = 420',
    '$form.Height = 150',
    '$form.StartPosition = "CenterScreen"',
    '$form.FormBorderStyle = "FixedDialog"',
    '$form.MaximizeBox = $false',
    '$form.MinimizeBox = $false',
    '$form.TopMost = $true',
    '$form.BackColor = $bg',
    '$lbl = New-Object System.Windows.Forms.Label',
    '$lbl.Text = "' + safe + '"',
    '$lbl.Location = New-Object System.Drawing.Point(20,18)',
    '$lbl.Width = 370',
    '$lbl.Height = 40',
    '$lbl.Font = New-Object System.Drawing.Font("Segoe UI",10)',
    '$lbl.ForeColor = $fg',
    '$form.Controls.Add($lbl)',
    '$btnY = New-Object System.Windows.Forms.Button',
    '$btnY.Text = "YES — CONVERT"',
    '$btnY.Location = New-Object System.Drawing.Point(20,70)',
    '$btnY.Width = 140',
    '$btnY.Height = 34',
    '$btnY.BackColor = $btn1bg',
    '$btnY.ForeColor = [System.Drawing.Color]::Black',
    '$btnY.Font = New-Object System.Drawing.Font("Segoe UI",9,[System.Drawing.FontStyle]::Bold)',
    '$btnY.DialogResult = [System.Windows.Forms.DialogResult]::Yes',
    '$form.AcceptButton = $btnY',
    '$form.Controls.Add($btnY)',
    '$btnN = New-Object System.Windows.Forms.Button',
    '$btnN.Text = "NO"',
    '$btnN.Location = New-Object System.Drawing.Point(175,70)',
    '$btnN.Width = 80',
    '$btnN.Height = 34',
    '$btnN.BackColor = if ($dark) { [System.Drawing.Color]::FromArgb(60,60,60) } else { [System.Drawing.Color]::LightGray }',
    '$btnN.ForeColor = $fg',
    '$btnN.Font = New-Object System.Drawing.Font("Segoe UI",9)',
    '$btnN.DialogResult = [System.Windows.Forms.DialogResult]::No',
    '$form.CancelButton = $btnN',
    '$form.Controls.Add($btnN)',
    '$result = $form.ShowDialog()',
    'if ($result -eq [System.Windows.Forms.DialogResult]::Yes) { Write-Output "Yes" } else { Write-Output "No" }',
  ].join('\n');
  try {
    require('fs').writeFileSync(tmp, ps);
    const result = execFileSync('powershell', ['-ExecutionPolicy','Bypass','-File',tmp],
      { encoding:'utf8', stdio:['ignore','pipe','ignore'] }).trim();
    try { require('fs').unlinkSync(tmp); } catch(e) {}
    return result === 'Yes';
  } catch(e) {
    try { require('fs').unlinkSync(tmp); } catch(e2) {}
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
