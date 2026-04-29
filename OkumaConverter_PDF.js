#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
//  OKUMA GENOS PDF CONVERTER — Node.js standalone
//  Right-click a Mastercam PDF setup sheet to convert tool
//  numbers and work offsets to Okuma format.
//  Fetches tool library from Firebase, overwrites original PDF,
//  then opens in Adobe Acrobat.
// ══════════════════════════════════════════════════════════════

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const http  = require('http');
const { execFileSync, spawn } = require('child_process');

// ── Config ────────────────────────────────────────────────────
const FIREBASE_URL = 'https://okuma-tool-library-default-rtdb.firebaseio.com/data/toolLibrary.json';
const WO_INC       = 1;
const PWA_URL      = 'https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3/converter.html';
const PWA_APP_ID   = 'lnoadbjemimfchocihomjfgadfbhccnd';
const LOCK_FILE    = require('os').tmpdir() + '\\okuma_server.json';
// ─────────────────────────────────────────────────────────────

let filePath = process.argv[2];
if (filePath) filePath = filePath.replace(/^["']|["']$/g, '').trim();

const _DBG = require('os').homedir() + '\\Desktop\\okuma_pdf_debug.txt';
try { fs.writeFileSync(_DBG, 'STARTED\nargv: ' + JSON.stringify(process.argv) + '\nfilePath: ' + filePath + '\nexists: ' + (filePath ? fs.existsSync(filePath) : 'no') + '\n'); } catch(e) {}

if (!filePath || !fs.existsSync(filePath)) {
  showDialog('error', 'No PDF file received.\nRight-click a PDF and choose "Convert to Okuma Format".');
  process.exit(1);
}

const fileName = path.basename(filePath);

main().catch(e => {
  showDialog('error', 'Unexpected error:\n' + e.message);
  process.exit(1);
});

async function main() {
  // Confirm with user
  const doConvert = await askYesNo(`Convert ${fileName} to Okuma format?`);
  try { fs.appendFileSync(_DBG, 'doConvert: ' + doConvert + '\n'); } catch(e) {}
  if (!doConvert) process.exit(0);

  const scriptDir = path.dirname(process.argv[1] || __filename);
  process.chdir(scriptDir); // ensure node_modules resolves from script folder

  // Check node_modules exists
  const nodeModules = path.join(scriptDir, 'node_modules');
  try { fs.appendFileSync(_DBG, 'scriptDir: ' + scriptDir + '\nnode_modules exists: ' + fs.existsSync(nodeModules) + '\n'); } catch(e) {}

  if (!fs.existsSync(nodeModules)) {
    showDialog('error', 'Missing node_modules folder.\nOpen Command Prompt in your OkumaConverter folder and run:\nnpm install pdfjs-dist@3.11.174 pdf-lib');
    process.exit(1);
  }

  let pdfjsLib, PDFDocument, rgb, StandardFonts;
  try {
    pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    const pdflib = require('pdf-lib');
    PDFDocument = pdflib.PDFDocument;
    rgb = pdflib.rgb;
    StandardFonts = pdflib.StandardFonts;
    fs.appendFileSync(_DBG, 'Libraries loaded OK\n');
  } catch(e) {
    fs.appendFileSync(_DBG, 'Library load error: ' + e.message + '\n');
    showDialog('error', 'Could not load PDF libraries.\nOpen Command Prompt in your OkumaConverter folder and run:\nnpm install pdfjs-dist@3.11.174 pdf-lib\n\nError: ' + e.message);
    process.exit(1);
  }

  // Fetch tool library
  let toolLibrary = [];
  try {
    toolLibrary = await fetchLibrary();
    if (!toolLibrary || toolLibrary.length === 0) throw new Error('Empty');
  } catch(e) {
    showDialog('warn', 'Could not load Firebase library.\nUsing fallback.');
    toolLibrary = getFallbackLibrary();
  }

  // Read PDF
  const pdfBytes = fs.readFileSync(filePath);

  // ── Extract text with positions (mirrors browser logic exactly) ──
  const pdfDoc   = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) }).promise;
  const numPages = pdfDoc.numPages;
  const allWords = [];

  for (let pi = 0; pi < numPages; pi++) {
    const page    = await pdfDoc.getPage(pi + 1);
    const vp      = page.getViewport({ scale: 1.0 });
    const content = await page.getTextContent();
    const pageH   = vp.height;
    for (const item of content.items) {
      if (!item.str || !item.str.trim()) continue;
      const x = item.transform[4];
      const y = item.transform[5];
      const h = item.height || 8;
      const tokens = item.str.split(/(\s+)/);
      let curX = x;
      for (const tok of tokens) {
        if (tok.trim().length === 0) {
          curX += (item.width / Math.max(item.str.length, 1)) * tok.length;
          continue;
        }
        const tokW = (item.width / Math.max(item.str.length, 1)) * tok.length;
        allWords.push({ text: tok.trim(), x: curX, y, w: tokW, h, fontSize: h, pageIndex: pi, pageH });
        curX += tokW + (item.width / Math.max(item.str.length, 1));
      }
    }
  }

  // ── Build line map ──
  const lineMap = {};
  for (const w of allWords) {
    const key = w.pageIndex + '_' + Math.round(w.y);
    if (!lineMap[key]) lineMap[key] = [];
    lineMap[key].push(w);
  }
  const lines = Object.keys(lineMap)
    .sort((a, b) => {
      const [pa, ya] = a.split('_').map(Number);
      const [pb, yb] = b.split('_').map(Number);
      return pa !== pb ? pa - pb : yb - ya;
    })
    .map(key => ({
      key,
      words: lineMap[key].sort((a, b) => a.x - b.x),
      text:  lineMap[key].sort((a, b) => a.x - b.x).map(w => w.text).join(' ')
    }));

  // ── Match tools ──
  const mcamToOkuma  = {};
  const unmatchedTools = {};

  for (let li = 0; li < lines.length; li++) {
    const curTxt = lines[li].text.trim();
    const [curPage, curY] = lines[li].key.split('_').map(Number);
    const mH = curTxt.match(/^#\s*(\d+)\s*$/);
    if (!mH) continue;
    const mcamNum = mH[1];
    if (mcamToOkuma[mcamNum]) continue;
    let bestTxt = '';
    for (let lj = 0; lj < lines.length; lj++) {
      if (lj === li) continue;
      const [pg2, y2] = lines[lj].key.split('_').map(Number);
      if (pg2 !== curPage || Math.abs(y2 - curY) > 15) continue;
      const txt = lines[lj].text.trim();
      if (txt.length < 5 || /^(STICKOUT|TOOL LIST|OPERATION LIST|PART CYCLE|PROGRAM NUMBER)/i.test(txt)) continue;
      if (!bestTxt && txt.length > 5) bestTxt = txt;
      for (const entry of toolLibrary) {
        if (matchesEntry(entry, txt)) {
          mcamToOkuma[mcamNum] = String(entry.okuma);
          break;
        }
      }
      if (mcamToOkuma[mcamNum]) break;
    }
    if (!mcamToOkuma[mcamNum] && !(mcamNum in unmatchedTools))
      unmatchedTools[mcamNum] = bestTxt;
  }

  // Op list pass
  for (let li = 0; li < lines.length; li++) {
    const mOp = lines[li].text.match(/^\s*\d+\s+#(\d+)\s*-/);
    if (!mOp) continue;
    const mcamNum = mOp[1];
    if (mcamToOkuma[mcamNum]) continue;
    for (const entry of toolLibrary) {
      if (matchesEntry(entry, lines[li].text)) {
        mcamToOkuma[mcamNum] = String(entry.okuma);
        break;
      }
    }
  }

  // ── Build replacements (mirrors browser logic exactly) ──
  const replacements = [];
  const addRep = (word, newText, extra = {}) => {
    const dupe = replacements.some(r =>
      r.pageIndex === word.pageIndex &&
      Math.abs(r.x - word.x) < 2 &&
      Math.abs(r.y - word.y) < 2
    );
    if (!dupe) replacements.push({ ...word, oldText: word.text, newText, ...extra });
  };

  // Tool list header numbers
  for (const cur of lines) {
    const curTxt = cur.text.trim();
    if (!/^#\s*\d+\s*$/.test(curTxt)) continue;
    const mN = curTxt.match(/^#\s*(\d+)/);
    if (!mN || !mcamToOkuma[mN[1]]) continue;
    const hashWord = cur.words.find(w => w.text === '#');
    const numWord  = cur.words.find(w => /^\d+$/.test(w.text) && w.text === mN[1]);
    if (hashWord && numWord) {
      addRep(hashWord, '# ' + mcamToOkuma[mN[1]], { isHeaderNum: true, w: (numWord.x + numWord.w) - hashWord.x });
    } else if (numWord) {
      addRep(numWord, mcamToOkuma[mN[1]], { isHeaderNum: true });
    }
  }

  // Operation rows — word stream scan
  const sortedWords = allWords.slice().sort((a, b) =>
    a.pageIndex !== b.pageIndex ? a.pageIndex - b.pageIndex :
    Math.abs(a.y - b.y) > 1    ? b.y - a.y :
    a.x - b.x
  );

  for (let wi = 0; wi < sortedWords.length - 2; wi++) {
    const w0 = sortedWords[wi];
    const w1 = sortedWords[wi + 1];
    const w2 = sortedWords[wi + 2];
    if (w1.pageIndex !== w0.pageIndex) continue;
    if (Math.abs(w1.y - w0.y) > 3)    continue;
    if (!/^\d{1,3}$/.test(w0.text))   continue;

    let mcamNum = null, hashToken = null;
    if (/^#\d+$/.test(w1.text)) {
      mcamNum = w1.text.slice(1); hashToken = w1;
    } else if (w1.text === '#' && w2 && w2.pageIndex === w0.pageIndex &&
               Math.abs(w2.y - w0.y) <= 3 && /^\d+$/.test(w2.text)) {
      const w3 = sortedWords[wi + 3];
      if (w3 && w3.pageIndex === w0.pageIndex && Math.abs(w3.y - w0.y) <= 3 &&
          (w3.text === '-' || w3.text.startsWith('-'))) {
        mcamNum = w2.text; hashToken = w2;
      }
    }
    if (!mcamNum || !mcamToOkuma[mcamNum]) continue;

    const checkW = hashToken === w1 ? w2 : sortedWords[wi + 3];
    if (!checkW || checkW.pageIndex !== w0.pageIndex) continue;
    if (Math.abs(checkW.y - w0.y) > 3) continue;
    if (!checkW.text.startsWith('-') && checkW.text !== '-') continue;

    addRep(hashToken, '#' + mcamToOkuma[mcamNum]);

    const rowY    = w0.y;
    const rowPg   = w0.pageIndex;
    const rowWords = sortedWords.filter(w =>
      w.pageIndex === rowPg && Math.abs(w.y - rowY) <= 3
    ).sort((a, b) => a.x - b.x);

    for (let ri = 0; ri < rowWords.length; ri++) {
      const rw = rowWords[ri];
      if (rw.text === 'H:' || rw.text === 'D:') {
        for (let rj = ri + 1; rj < rowWords.length; rj++) {
          const cand = rowWords[rj];
          if (cand.text === 'Z:' || cand.text === 'WO:') break;
          if (/^\d+$/.test(cand.text)) {
            if (mcamToOkuma[cand.text]) addRep(cand, mcamToOkuma[cand.text]);
            break;
          }
        }
      }
      if (rw.text === 'WO:' && WO_INC > 0) {
        for (let rj = ri + 1; rj < rowWords.length; rj++) {
          const cand = rowWords[rj];
          if (/^\d+$/.test(cand.text)) {
            addRep(cand, String(parseInt(cand.text) + WO_INC), { isWO: true });
            break;
          }
        }
      }
    }
  }

  if (replacements.length === 0) {
    showDialog('warn', 'No replacements found.\nCheck tool library or PDF format.');
    process.exit(0);
  }

  // ── Apply replacements with pdf-lib (mirrors browser logic exactly) ──
  const libDoc   = await PDFDocument.load(pdfBytes);
  const font     = await libDoc.embedFont(StandardFonts.HelveticaBold);
  const libPages = libDoc.getPages();
  let repCount   = 0;

  for (const rep of replacements) {
    const pg  = libPages[rep.pageIndex];
    const fs  = (!rep.isHeaderNum && !rep.isWO && String(rep.newText).trim().length >= 4)
                  ? Math.max((rep.fontSize || 8) - 1.5, 6)
                  : Math.max(rep.fontSize || 8, 6);
    const isWO = rep.isWO === true;
    const oldW = font.widthOfTextAtSize(String(rep.oldText), fs);
    const newW = font.widthOfTextAtSize(String(rep.newText), fs);
    let stampX = rep.x;
    if (rep.isHeaderNum && newW > oldW)  stampX = rep.x + oldW - newW + 13;
    if (rep.isHeaderNum && newW <= oldW) stampX = rep.x + 4;
    if (isWO)                            stampX = rep.x - 1;
    if (!isWO && !rep.isHeaderNum)       stampX = rep.x - 3;

    const padL = isWO?4:rep.isHeaderNum?4:2;
    const padR = isWO?2:1;
    const padB = isWO?3:1;
    const padT = isWO?1:rep.isHeaderNum?2:0;
    const whiteL = Math.min(rep.x, stampX) - padL;
    const whiteR = Math.max(rep.x + oldW, stampX + newW) + padR;

    pg.drawRectangle({
      x: whiteL, y: rep.y - padB,
      width:  whiteR - whiteL,
      height: (!rep.isHeaderNum && !rep.isWO && !String(rep.newText).startsWith('#')
                ? (rep.h || fs) * 0.9
                : (rep.h || fs)) + padB + padT,
      color: rgb(1, 1, 1)
    });
    pg.drawText(String(rep.newText), {
      x: stampX,
      y: rep.y - (!rep.isHeaderNum && !rep.isWO && !String(rep.newText).startsWith('#') ? 2 : 0),
      size: fs, font, color: rgb(0, 0, 0)
    });
    repCount++;
  }

  // ── Save converted PDF over original ──
  const outBytes = await libDoc.save();
  fs.writeFileSync(filePath, outBytes);

  // ── Open in Adobe ──
  launchAdobe(filePath);

  // ── If unmapped tools — open PWA ──
  const unmappedList = Object.keys(unmatchedTools);
  if (unmappedList.length > 0) {
    openPWAWithUnmapped(unmatchedTools);
  }

  // Show completion dialog
  const msg = '✓ CONVERSION COMPLETE\n'
    + '────────────────────────────\n'
    + 'File:      ' + fileName + '\n'
    + 'Pages:     ' + numPages + '\n'
    + 'Replaced:  ' + repCount + ' numbers\n'
    + (unmappedList.length > 0 ? '\n⚠ ' + unmappedList.length + ' tool(s) not in library\nCheck the Converter app to add them.' : '');
  showDialog('info', msg);
}

// ── Open PWA with unmapped tools ─────────────────────────────
function openPWAWithUnmapped(unmappedTools) {
  const unmappedEntries = Object.entries(unmappedTools);
  const hints = unmappedEntries.map(([, desc]) => encodeURIComponent(desc || '')).join(',');
  const url   = PWA_URL + '?addTool=1&hints=' + hints + '&tab=pdf';

  // Try lock file first (existing PWA open from G-code conversion)
  let existingPort = null;
  try {
    const lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
    existingPort = lock.port;
  } catch(e) {}

  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

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
}

// ── Launch Adobe ──────────────────────────────────────────────
function launchAdobe(filePath) {
  // Try common Adobe Acrobat locations
  const adobePaths = [
    'C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe',
    'C:\\Program Files (x86)\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe',
    'C:\\Program Files\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe',
    'C:\\Program Files (x86)\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe',
    'C:\\Program Files\\Adobe\\Acrobat 2020\\Acrobat\\Acrobat.exe',
    'C:\\Program Files (x86)\\Adobe\\Acrobat 2020\\Acrobat\\Acrobat.exe',
  ];
  for (const adobePath of adobePaths) {
    if (fs.existsSync(adobePath)) {
      spawn(adobePath, [filePath], { detached: true, stdio: 'ignore' }).unref();
      return;
    }
  }
  // Fallback — open with default PDF handler
  spawn('cmd', ['/c', 'start', '', filePath], { detached: true, stdio: 'ignore' }).unref();
}

// ── Tool matching ─────────────────────────────────────────────
function matchesEntry(entry, text) {
  text = text.toUpperCase().trim();
  const mType = (entry.matchType || 'serial').toLowerCase();
  const mVal  = (entry.matchVal  || '').toUpperCase().trim();
  if (mType === 'serial') {
    if (text.includes(mVal)) return true;
    if (entry.altVals) for (const av of entry.altVals) if (av && text.includes(av.toUpperCase().trim())) return true;
    return false;
  }
  const normText = normalize(text);
  const normVal  = normalize(mVal);
  if (normText.includes(normVal)) return true;
  if (entry.altVals) for (const av of entry.altVals) if (av && normText.includes(normalize(av.toUpperCase()))) return true;
  return false;
}

function normalize(str) {
  return str.toUpperCase()
    .replace(/NO\.\s*(\d+)/g, 'NO$1')
    .replace(/LTR\.\s*([A-Z])/g, 'LTR$1')
    .replace(/\./g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Firebase fetch ────────────────────────────────────────────
function fetchLibrary() {
  return new Promise((resolve, reject) => {
    https.get(FIREBASE_URL, { timeout: 8000 }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) resolve(parsed);
          else reject(new Error('Bad response'));
        } catch(e) { reject(e); }
      });
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

// ── Dialogs ───────────────────────────────────────────────────
function showDialog(type, message) {
  const icons = { info: 64, warn: 48, error: 16 };
  const icon  = icons[type] || 64;
  const safe  = message.replace(/'/g, "''").replace(/`/g, '``');
  const cmd   = `Add-Type -AssemblyName PresentationFramework;[System.Windows.MessageBox]::Show('${safe}','Okuma PDF Converter',0,${icon})`;
  try { execFileSync('powershell', ['-Command', cmd], { stdio: 'ignore' }); } catch(e) {}
}

function askYesNo(message) {
  const safe = message.replace(/'/g, "''").replace(/`/g, '``');
  const cmd  = `Add-Type -AssemblyName PresentationFramework;[System.Windows.MessageBox]::Show('${safe}','Okuma PDF Converter','YesNo',32)`;
  try {
    const result = execFileSync('powershell', ['-Command', cmd],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return result === 'Yes';
  } catch(e) { return false; }
}

// ── Fallback library ──────────────────────────────────────────
function getFallbackLibrary() {
  return [
    { matchType:'serial',  matchVal:'82045', okuma:1,  desc:'HELICAL 82045 3/4 ROUGHER' },
    { matchType:'serial',  matchVal:'48655', okuma:2,  desc:'HELICAL 48655 3/4' },
    { matchType:'serial',  matchVal:'48130', okuma:8,  desc:'HELICAL 48130 1/4' },
    { matchType:'serial',  matchVal:'48395', okuma:10, desc:'HELICAL 48395 1/2' },
    { matchType:'keyword', matchVal:'1/4 SPOTDRILL', okuma:12, desc:'1/4 SPOTDRILL' },
  ];
}
