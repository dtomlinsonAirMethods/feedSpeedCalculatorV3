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
const { execFile, spawn } = require('child_process');

// ── Config ────────────────────────────────────────────────────
const CIMCO_PATH   = 'C:\\Program Files\\Mastercam 2025\\common\\Editors\\CIMCOEdit\\CIMCOEdit.exe';
const FIREBASE_URL = 'https://okuma-tool-library-default-rtdb.firebaseio.com/data/toolLibrary.json';
const WCS_INC      = 1;
// ─────────────────────────────────────────────────────────────

let filePath = process.argv[2];

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
    `Convert to Okuma format?\n\nFile: ${fileName}\n\nYES = convert then open in CimcoEdit\nNO  = open as-is in CimcoEdit`
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
  const { output, toolMap, unmapped, changedLines } = convertFile(content, toolLibrary);

  // Overwrite original
  try {
    fs.writeFileSync(filePath, output, 'utf8');
  } catch (e) {
    showDialog('error', `Could not save converted file:\n${e.message}`);
    process.exit(1);
  }

  // Launch CimcoEdit first
  launchCimco(filePath);

  // Build full conversion results to pass to PWA
  const unmappedKeys = Object.keys(unmapped);
  const results = {
    file:      fileName,
    mapped:    Object.entries(toolMap).map(([h, o]) => h + ':' + o).join(','),
    unmapped:  unmappedKeys.map(t => t + '=' + encodeURIComponent(unmapped[t] || '')).join(','),
    lines:     changedLines,
    wcs:       output.split('\n').filter(l => /G15\s+H/.test(l)).length,
    hasUnmapped: unmappedKeys.length > 0 ? '1' : '0'
  };

  const baseUrl = 'https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3/converter.html';
  const params  = new URLSearchParams({
    fromBat:   '1',
    file:      results.file,
    mapped:    results.mapped,
    unmapped:  results.unmapped,
    lines:     results.lines,
    wcs:       results.wcs,
    hasUnmapped: results.hasUnmapped
  });
  const url = baseUrl + '?' + params.toString();

  // Launch as installed PWA using Chrome app ID
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
  if (!launched) {
    spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
  }
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

    // Replace H# (tool length offset) — skip H0
    conv = conv.replace(/\bH(\d+)\b/g, (match, hNum) => {
      if (hNum === '0') return match;
      if (toolMap[hNum] && !sameTools.has(hNum)) return 'H' + toolMap[hNum];
      return match;
    });

    // Replace WCS G15 H# — increment by WCS_INC
    conv = conv.replace(/\bG15\s+H(\d+)\b/g, (match, hNum) => {
      const newH = parseInt(hNum) + WCS_INC;
      return `G15 H${newH}`;
    });

    if (conv !== line) changedLines++;
    outLines.push(conv);
  }

  return { output: outLines.join('\r\n'), toolMap, unmapped, changedLines };
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
