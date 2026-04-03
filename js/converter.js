// ============================================================
//  converter.js — Okuma Genos Converter Logic
//  Handles: tool library, G-code conversion, PDF conversion,
//           Mastercam HTML report import
// ============================================================

// ── Tool Library defaults (overridden by localStorage on load) ──
let toolLibrary = [
  { matchType: 'serial',  matchVal: '48410', okuma: 39,  desc: '1/2 DIA X 1.25 LOC X 0.06 RAD Helical EM' },
  { matchType: 'serial',  matchVal: '03690', okuma: 12,  desc: '3/4 DIA X 3.25 LOC Helical EM' },
  { matchType: 'serial',  matchVal: '48470', okuma: 41,  desc: '1/2 DIA X 2.0 LOC X 0.06 RAD Helical EM' },
  { matchType: 'serial',  matchVal: '82397', okuma: 25,  desc: '1/2 DIA X 3.125 LOC Helical EM' },
  { matchType: 'serial',  matchVal: '48115', okuma: 52,  desc: '1/4 DIA X 3/4 LOC' },
  { matchType: 'serial',  matchVal: '48425', okuma: 38,  desc: '1/2 DIA X 1.625 LOC' },
  { matchType: 'keyword', matchVal: '1/4 90 DEGREE SPOTDRILL',      okuma: 12,  desc: '1/4 90 Degree Spot Drill' },
  { matchType: 'keyword', matchVal: 'NO. 40 STUB DRILL',            okuma: 13,  desc: 'NO. 40 STUB DRILL' },
  { matchType: 'keyword', matchVal: '1/4 -90 DEG CHAMFER MILL',     okuma: 11,  desc: '1/4 -90 DEG CHAMFER MILL' },
  { matchType: 'keyword', matchVal: '1/4 90 DEG CHAMFER MILL',      okuma: 11,  desc: '1/4 90 DEG CHAMFER MILL' },
  { matchType: 'keyword', matchVal: '1/4 - 100 DEGREE COUNTERSINK', okuma: 160, desc: '1/4 - 100 DEGREE COUNTERSINK' },
  { matchType: 'keyword', matchVal: 'LTR. H STUB DRILL',            okuma: 174, desc: 'LTR. H STUB DRILL' },
];

let fileContent         = null;
let fileName            = null;
let pdfBytes            = null;
let pdfFileName         = null;
let currentMatchType    = 'serial';
let pdfCurrentMatchType = 'serial';

// ════════════════════════════════════════
//  TOOL LIBRARY
// ════════════════════════════════════════

function saveLibrary() {
  try { localStorage.setItem('okumaToolLibrary', JSON.stringify(toolLibrary)); } catch(e) {}
}

function loadLibrary() {
  try {
    const s = localStorage.getItem('okumaToolLibrary');
    if (s) toolLibrary = JSON.parse(s);
  } catch(e) {}
}

function renderToolTable(bodyId, countId, filter) {
  const q = (filter || '').toLowerCase();
  const rows = toolLibrary.filter(t =>
    (t.matchVal || '').toLowerCase().includes(q) ||
    (t.desc || '').toLowerCase().includes(q) ||
    String(t.okuma).includes(q)
  );
  const badgeHtml = t => {
    const isSerial = t.matchType !== 'keyword';
    const col = isSerial ? 'var(--orange)' : 'var(--accent)';
    const lbl = isSerial ? 'SERIAL' : 'KEYWORD';
    return `<span style="font-size:9px;font-weight:700;letter-spacing:1px;padding:2px 6px;border-radius:2px;border:1px solid ${col};color:${col};">${lbl}</span>`;
  };
  const uid = t => esc(t.matchVal + '|' + t.okuma);
  document.getElementById(bodyId).innerHTML = rows.length
    ? rows.map(t => `<tr>
        <td>${badgeHtml(t)}</td>
        <td class="serial">${esc(t.matchVal || '')}</td>
        <td class="okuma-num">T${t.okuma}</td>
        <td class="desc" title="${esc(t.desc || '')}">${esc(t.desc || '—')}</td>
        <td><button class="btn-remove" onclick="removeTool('${uid(t)}')" title="Remove">&#10005;</button></td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="color:var(--dim);text-align:center;padding:20px;">No tools found</td></tr>`;
  if (document.getElementById(countId))
    document.getElementById(countId).textContent = toolLibrary.length + ' TOOLS';
}

function renderAllTables() {
  renderToolTable('toolBody',    'toolCount',    document.getElementById('toolSearch')?.value    || '');
  renderToolTable('pdfToolBody', 'pdfToolCount', document.getElementById('pdfToolSearch')?.value || '');
}

function removeTool(uid) {
  const parts    = uid.split('|');
  const matchVal = parts[0];
  const okuma    = parseInt(parts[1]);
  toolLibrary = toolLibrary.filter(t => !(t.matchVal === matchVal && t.okuma === okuma));
  saveLibrary();
  renderAllTables();
  log('warn', 'Removed: ' + matchVal + ' (T' + okuma + ')');
}

// ── Match type toggles ──
function setMatchType(type) {
  currentMatchType = type;
  const isSer = type === 'serial';
  document.getElementById('btnSerial').classList.toggle('active', isSer);
  document.getElementById('btnKeyword').classList.toggle('active', !isSer);
  document.getElementById('matchHint').textContent       = isSer ? 'SERIAL: exact number found in tool comment (e.g. 48410)' : 'KEYWORD: all words must appear in tool comment (e.g. NO. 40 STUB DRILL)';
  document.getElementById('matchValLabel').textContent   = isSer ? 'Serial Number' : 'Keyword / Phrase';
  document.getElementById('newSerial').placeholder       = isSer ? 'e.g. 48410' : 'e.g. NO. 40 STUB DRILL';
}

function setPdfMatchType(type) {
  pdfCurrentMatchType = type;
  const isSer = type === 'serial';
  document.getElementById('pdfBtnSerial').classList.toggle('active', isSer);
  document.getElementById('pdfBtnKeyword').classList.toggle('active', !isSer);
  document.getElementById('pdfMatchHint').textContent    = isSer ? 'SERIAL: exact number found in tool comment (e.g. 48410)' : 'KEYWORD: all words must appear in tool comment (e.g. NO. 40 STUB DRILL)';
  document.getElementById('pdfMatchValLabel').textContent = isSer ? 'Serial Number' : 'Keyword / Phrase';
  document.getElementById('pdfNewSerial').placeholder    = isSer ? 'e.g. 48410' : 'e.g. NO. 40 STUB DRILL';
}

// ── Add tool forms ──
function toggleAddForm()    { document.getElementById('addToolForm').classList.toggle('open'); }
function togglePdfAddForm() { document.getElementById('pdfAddToolForm').classList.toggle('open'); }

function _addToolEntry(matchType, matchVal, okuma, desc, logFn, clearIds) {
  if (!matchVal)         { alert('Serial number or keyword is required.'); return; }
  if (!okuma || okuma<1) { alert('Okuma tool number is required.'); return; }
  if (toolLibrary.find(t => t.matchVal === matchVal && t.okuma === okuma)) {
    alert('This entry already exists.'); return;
  }
  toolLibrary.push({ matchType, matchVal, okuma, desc });
  saveLibrary();
  renderAllTables();
  clearIds.forEach(id => { document.getElementById(id).value = ''; });
  logFn('ok', 'Added: ' + matchVal + ' → T' + okuma);
}

function addTool() {
  _addToolEntry(
    currentMatchType,
    document.getElementById('newSerial').value.trim(),
    parseInt(document.getElementById('newOkuma').value),
    document.getElementById('newDesc').value.trim(),
    log,
    ['newSerial','newOkuma','newDesc']
  );
}

function addToolFromPdfTab() {
  _addToolEntry(
    pdfCurrentMatchType,
    document.getElementById('pdfNewSerial').value.trim(),
    parseInt(document.getElementById('pdfNewOkuma').value),
    document.getElementById('pdfNewDesc').value.trim(),
    pdfLog,
    ['pdfNewSerial','pdfNewOkuma','pdfNewDesc']
  );
}

// ── Export ──
function exportLibrary() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(toolLibrary, null, 2)], { type: 'application/json' }));
  a.download = 'okuma_tool_library.json';
  a.click();
}

// ── Import dispatcher — .json = library import, .html = Mastercam report ──
function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const name   = file.name.toLowerCase();
  const reader = new FileReader();
  if (name.endsWith('.json')) {
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('Expected JSON array');
        toolLibrary = data;
        saveLibrary();
        renderAllTables();
        log('ok', 'Imported ' + data.length + ' tools from ' + file.name);
      } catch(err) { log('error', 'Import failed: ' + err.message); }
    };
    reader.readAsText(file);
  } else if (name.endsWith('.html') || name.endsWith('.htm')) {
    reader.onload = ev => {
      try {
        const tools = parseMastercamReport(ev.target.result);
        showMcImportPreview(tools);
      } catch(err) {
        log('error', 'Mastercam import failed: ' + err.message);
        console.error(err);
      }
    };
    reader.readAsText(file);
  } else {
    alert('Unsupported file. Use .json for library backup or .html for Mastercam Detail Report.');
  }
  e.target.value = '';
}

// ════════════════════════════════════════
//  MASTERCAM HTML REPORT PARSER
// ════════════════════════════════════════

function parseMastercamReport(html) {
  const parser    = new DOMParser();
  const doc       = parser.parseFromString(html, 'text/html');
  const pages     = doc.querySelectorAll('div[style*="position:relative"]');
  const allTools  = [];
  const seenTools = new Set();

  const NUMBER_LEFT   = 0.076;
  const TOOLNAME_LEFT = 0.514;
  const DIA_LEFT      = 2.764;
  const RAD_LEFT      = 3.364;
  const TOLERANCE     = 0.04;

  for (const page of pages) {
    const items = [];
    for (const span of page.querySelectorAll('span')) {
      const style = span.getAttribute('style') || '';
      const topM  = style.match(/top:([\d.]+)in/);
      const leftM = style.match(/left:([\d.]+)in/);
      if (!topM || !leftM) continue;
      const text = span.textContent.replace(/\s+/g, ' ').trim();
      if (!text) continue;
      items.push({ top: parseFloat(topM[1]), left: parseFloat(leftM[1]), text });
    }
    items.sort((a, b) => a.top - b.top || a.left - b.left);

    const numItems = items.filter(i =>
      Math.abs(i.left - NUMBER_LEFT) < TOLERANCE && /^\d+$/.test(i.text)
    );

    for (const numItem of numItems) {
      const toolNum = parseInt(numItem.text);
      if (toolNum === 0 || seenTools.has(toolNum)) continue;

      const nameItem = items.find(i =>
        Math.abs(i.left - TOOLNAME_LEFT) < TOLERANCE &&
        Math.abs(i.top - numItem.top) < 0.03
      );
      if (!nameItem || nameItem.text.length < 3) continue;

      seenTools.add(toolNum);

      const toolName    = nameItem.text;
      const serialMatch = toolName.match(/-\s*(\d{4,6})\s*-/);
      const serial      = serialMatch ? serialMatch[1] : null;

      const diaItem = items.find(i => Math.abs(i.left - DIA_LEFT) < TOLERANCE && Math.abs(i.top - numItem.top) < 0.03);
      const radItem = items.find(i => Math.abs(i.left - RAD_LEFT) < TOLERANCE && Math.abs(i.top - numItem.top) < 0.03);

      allTools.push({
        toolNum,
        toolName,
        serial,
        dia: diaItem ? parseFloat(diaItem.text) : null,
        rad: radItem ? parseFloat(radItem.text)  : null,
      });
    }
  }

  allTools.sort((a, b) => a.toolNum - b.toolNum);
  return allTools;
}

// Normalize for keyword matching — strip dashes, collapse spaces, uppercase
function normalizeName(str) {
  return str.toUpperCase().replace(/-/g, '').replace(/\s+/g, ' ').trim();
}

// ── Mastercam import preview modal ──
function showMcImportPreview(tools) {
  const existing = document.getElementById('mcPreviewModal');
  if (existing) existing.remove();

  const isDuplicate = t => {
    const val = t.serial || normalizeName(t.toolName);
    return toolLibrary.some(e => e.okuma === t.toolNum && e.matchVal === val);
  };

  const newTools   = tools.filter(t => !isDuplicate(t));
  const serialCnt  = tools.filter(t => t.serial).length;
  const keywordCnt = tools.length - serialCnt;

  const rows = tools.map(t => {
    const dup      = isDuplicate(t);
    const isSer    = !!t.serial;
    const typeCol  = isSer ? 'var(--orange)' : 'var(--accent)';
    const typeLabel= isSer ? 'SERIAL'        : 'KEYWORD';
    const val      = t.serial || normalizeName(t.toolName);
    return `<tr style="${dup ? 'opacity:0.4;' : ''}">
      <td style="padding:5px 8px;font-family:var(--mono);font-size:11px;color:var(--accent);">T${t.toolNum}</td>
      <td style="padding:5px 8px;"><span style="font-size:9px;font-weight:700;padding:2px 5px;border-radius:2px;border:1px solid ${typeCol};color:${typeCol};">${typeLabel}</span></td>
      <td style="padding:5px 8px;font-family:var(--mono);font-size:11px;color:var(--text);">${esc(val)}</td>
      <td style="padding:5px 8px;font-family:var(--mono);font-size:10px;color:var(--dim);">
        ${esc(t.toolName)}${dup ? ' <span style="color:var(--yellow);font-size:9px;">ALREADY IN LIBRARY</span>' : ''}
      </td>
    </tr>`;
  }).join('');

  const modal = document.createElement('div');
  modal.id = 'mcPreviewModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;width:100%;max-width:860px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="font-family:var(--sans);font-size:18px;font-weight:700;letter-spacing:2px;color:var(--accent);">MASTERCAM IMPORT PREVIEW</div>
        <div style="font-family:var(--mono);font-size:11px;color:var(--dim);margin-left:auto;">
          ${tools.length} tools &nbsp;·&nbsp;
          <span style="color:var(--orange);">${serialCnt} serial</span> &nbsp;·&nbsp;
          <span style="color:var(--accent);">${keywordCnt} keyword</span> &nbsp;·&nbsp;
          <span style="color:var(--green);">${newTools.length} new</span>
        </div>
      </div>
      <div style="overflow-y:auto;flex:1;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--border);">
              <th style="padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);text-align:left;">TOOL #</th>
              <th style="padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);text-align:left;">TYPE</th>
              <th style="padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);text-align:left;">MATCH VALUE</th>
              <th style="padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);text-align:left;">TOOL NAME</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="padding:14px 20px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end;">
        <button onclick="document.getElementById('mcPreviewModal').remove()"
          style="padding:10px 20px;background:transparent;border:1px solid var(--border);color:var(--text);font-family:var(--sans);font-size:14px;font-weight:700;letter-spacing:1px;border-radius:3px;cursor:pointer;">
          CANCEL
        </button>
        <button onclick="confirmMcImport()"
          style="padding:10px 24px;background:var(--green);border:none;color:#000;font-family:var(--sans);font-size:14px;font-weight:700;letter-spacing:1px;border-radius:3px;cursor:pointer;">
          ADD ${newTools.length} NEW TOOLS
        </button>
      </div>
    </div>`;

  modal._tools = tools;
  document.body.appendChild(modal);
}

function confirmMcImport() {
  const modal = document.getElementById('mcPreviewModal');
  if (!modal) return;
  let added = 0;
  for (const t of modal._tools) {
    const matchType = t.serial ? 'serial' : 'keyword';
    const matchVal  = t.serial || normalizeName(t.toolName);
    if (toolLibrary.some(e => e.okuma === t.toolNum && e.matchVal === matchVal)) continue;
    toolLibrary.push({ matchType, matchVal, okuma: t.toolNum, desc: t.toolName });
    added++;
  }
  saveLibrary();
  renderAllTables();
  modal.remove();
  log('ok', 'Imported ' + added + ' tools from Mastercam report');
}

// ════════════════════════════════════════
//  UI — SEARCH, TABS, FILE HANDLING
// ════════════════════════════════════════

document.addEventListener('input', e => {
  if (e.target.id === 'toolSearch')    renderToolTable('toolBody',    'toolCount',    e.target.value);
  if (e.target.id === 'pdfToolSearch') renderToolTable('pdfToolBody', 'pdfToolCount', e.target.value);
});

function switchConvTab(name) {
  document.querySelectorAll('.conv-tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.conv-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('ctab-' + name + '-pane').classList.add('active');
  document.getElementById('ctab-' + name).classList.add('active');
}

// G-code file drop/select
(function() {
  const dz = document.getElementById('dropZone');
  const fi = document.getElementById('fileInput');
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('drag-over'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
  fi.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });
})();

function handleFile(file) {
  fileName = file.name;
  const reader = new FileReader();
  reader.onload = ev => {
    fileContent = ev.target.result;
    const lc = fileContent.split('\n').length;
    document.getElementById('dropZone').innerHTML = `
      <input type="file" id="fileInput" accept=".min,.MIN,.nc,.NC,.txt">
      <div class="file-loaded">
        <div class="file-name">&#10004; ${esc(file.name)}</div>
        <div class="file-meta">${lc.toLocaleString()} lines &nbsp;&middot;&nbsp; ${(file.size/1024).toFixed(1)} KB</div>
        <div class="file-change">Click to change file</div>
      </div>`;
    document.getElementById('fileInput').addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });
    document.getElementById('convertBtn').disabled = false;
    log('ok', 'Loaded: ' + file.name + ' (' + lc.toLocaleString() + ' lines)');
    clearResults();
  };
  reader.readAsText(file);
}

// PDF file drop/select
(function() {
  const dz = document.getElementById('pdfDropZone');
  const fi = document.getElementById('pdfFileInput');
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('drag-over'); if (e.dataTransfer.files[0]) handlePdfFile(e.dataTransfer.files[0]); });
  fi.addEventListener('change', e => { if (e.target.files[0]) handlePdfFile(e.target.files[0]); });
})();

function handlePdfFile(file) {
  pdfFileName = file.name;
  const reader = new FileReader();
  reader.onload = ev => {
    pdfBytes = new Uint8Array(ev.target.result);
    document.getElementById('pdfDropZone').innerHTML = `
      <input type="file" id="pdfFileInput" accept=".pdf,.PDF">
      <div class="file-loaded">
        <div class="file-name">&#10004; ${esc(file.name)}</div>
        <div class="file-meta">${(file.size/1024).toFixed(1)} KB</div>
        <div class="file-change">Click to change file</div>
      </div>`;
    document.getElementById('pdfFileInput').addEventListener('change', e => { if (e.target.files[0]) handlePdfFile(e.target.files[0]); });
    document.getElementById('pdfConvertBtn').disabled    = false;
    document.getElementById('pdfLogBox').innerHTML       = '';
    pdfLog('ok', 'Loaded: ' + file.name);
    document.getElementById('pdfDownloadBar').classList.remove('show');
    document.getElementById('pdfStatsRow').style.display    = 'none';
    document.getElementById('pdfPreviewPanel').style.display = 'none';
    document.getElementById('pdfEmptyState').style.display   = 'block';
  };
  reader.readAsArrayBuffer(file);
}

// ════════════════════════════════════════
//  LOGGING
// ════════════════════════════════════════

function log(type, msg) {
  const box  = document.getElementById('logBox');
  const span = document.createElement('span');
  span.className   = 'log-' + type;
  span.textContent = '[' + new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + '] ' + msg + '\n';
  box.appendChild(span); box.scrollTop = box.scrollHeight;
}

function pdfLog(type, msg) {
  const box  = document.getElementById('pdfLogBox');
  const span = document.createElement('span');
  span.className   = 'log-' + type;
  span.textContent = '[' + new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + '] ' + msg + '\n';
  box.appendChild(span); box.scrollTop = box.scrollHeight;
}

function clearResults() {
  document.getElementById('downloadBar').classList.remove('show');
  document.getElementById('statsRow').style.display     = 'none';
  document.getElementById('previewPanel').style.display = 'none';
  document.getElementById('emptyState').style.display   = 'block';
}

// ════════════════════════════════════════
//  G-CODE CONVERSION ENGINE
// ════════════════════════════════════════

function runConversion() {
  if (!fileContent) { alert('Please upload a .MIN file first.'); return; }
  document.getElementById('logBox').innerHTML = '';
  log('info', '══════════════════════════════════════════');
  log('info', ' STARTING CONVERSION');
  log('info', '══════════════════════════════════════════');

  const wcsInc   = parseInt(document.getElementById('wcsIncrement').value) || 1;
  const lines    = fileContent.split('\n');
  const toolMap  = {};
  const unmapped = [];
  const headerRe = /^\(T(\d+)\s*[-–]/i;

  log('info', 'Scanning header for tool definitions...');
  for (const line of lines) {
    const s = line.trim();
    if (!s.startsWith('(')) continue;
    const m = s.match(headerRe);
    if (!m) continue;
    const tNum = m[1];
    const sUp  = s.toUpperCase();
    let matched = false;
    for (const entry of toolLibrary) {
      const val = (entry.matchVal || '').toUpperCase();
      let hit = false;
      if (entry.matchType === 'keyword') {
        const normVal = val.replace(/-/g,'').replace(/\s+/g,' ').trim();
        const normS   = sUp.replace(/-/g,'').replace(/\s+/g,' ').trim();
        hit = normVal.split(' ').filter(t=>t).every(tok => normS.includes(tok));
      } else {
        hit = val.length > 0 && sUp.includes(val);
      }
      if (hit) {
        toolMap[tNum] = entry.okuma;
        log('map', '  T' + tNum + ' → Okuma T' + entry.okuma + '  [' + val + ']  ' + (entry.desc || ''));
        matched = true; break;
      }
    }
    if (!matched && /T\d+\s*[-–].{4,}/.test(s)) unmapped.push({ tNum, line: s });
  }
  if (unmapped.length) {
    log('warn', unmapped.length + ' tool(s) NOT in library — keeping original T#:');
    unmapped.forEach(u => log('warn', '  T' + u.tNum + ': ' + u.line));
  }

  log('info', 'Converting lines... (WCS +' + wcsInc + ')');
  const origLines = [], convLines = [];
  let wcsCount = 0, toolCount = 0;

  for (const rawLine of lines) {
    const orig      = rawLine.replace(/\r$/, '');
    let conv        = orig;
    const isComment = orig.trim().startsWith('(');

    conv = conv.replace(/G15\s+H(\d+)/g, (_, h) => { wcsCount++; return 'G15 H' + (parseInt(h) + wcsInc); });

    if (!isComment) {
      conv = conv.replace(/\bT(\d+)\b/g, (match, tNum) => {
        if (toolMap[tNum] !== undefined) { toolCount++; return 'T' + toolMap[tNum]; }
        return match;
      });
    } else {
      conv = conv.replace(/^\(T(\d+)([\s\-])/, (match, tNum, sep) => {
        if (toolMap[tNum] !== undefined) return '(T' + toolMap[tNum] + sep;
        return match;
      });
      conv = conv.replace(/([\-\s]+H)(\d+)(\s*\))\s*$/, (match, prefix, hNum, suffix) => {
        if (toolMap[hNum] !== undefined) return prefix + toolMap[hNum] + suffix;
        return match;
      });
    }

    const changed = conv !== orig;
    origLines.push({ text: orig, changed });
    convLines.push({ text: conv, changed });
  }

  const convertedText = convLines.map(l => l.text).join('\n');
  const changedCount  = convLines.filter(l => l.changed).length;

  log('ok', '══════════════════════════════════════════');
  log('ok', ' DONE — ' + lines.length.toLocaleString() + ' lines processed');
  log('ok', '   WCS offsets changed : ' + wcsCount);
  log('ok', '   Tool numbers changed: ' + toolCount);
  log('ok', '   Total lines changed : ' + changedCount);
  if (unmapped.length) log('warn', '   Unmapped tools      : ' + unmapped.length);
  log('ok', '══════════════════════════════════════════');

  document.getElementById('statLines').textContent    = lines.length.toLocaleString();
  document.getElementById('statWcs').textContent      = wcsCount;
  document.getElementById('statTools').textContent    = toolCount;
  document.getElementById('statUnmapped').textContent = unmapped.length;
  document.getElementById('statsRow').style.display   = 'flex';

  const outName = fileName.replace(/\.[^.]+$/, '') + '_OKUMA.MIN';
  const url     = URL.createObjectURL(new Blob([convertedText], { type: 'text/plain' }));
  document.getElementById('downloadBtn').href          = url;
  document.getElementById('downloadBtn').download      = outName;
  document.getElementById('dlMeta').textContent        = '  ·  ' + outName + '  ·  ' + changedCount + ' lines modified';
  document.getElementById('downloadBar').classList.add('show');

  const buildHtml = arr => arr.slice(0, 300).map(l =>
    '<span class="' + (l.changed ? 'line-changed' : 'line-normal') + '">' + esc(l.text) + '</span>'
  ).join('');
  document.getElementById('origCode').innerHTML        = buildHtml(origLines);
  document.getElementById('convCode').innerHTML        = buildHtml(convLines);
  document.getElementById('previewPanel').style.display = 'block';
  document.getElementById('emptyState').style.display   = 'none';

  const panes = document.querySelectorAll('.code-scroll');
  panes.forEach(p => { p.onscroll = () => panes.forEach(o => { if (o !== p) o.scrollTop = p.scrollTop; }); });
}

// ════════════════════════════════════════
//  PDF CONVERSION ENGINE
// ════════════════════════════════════════

async function runPdfConversion() {
  if (!pdfBytes) { alert('Please upload a PDF first.'); return; }
  const btn = document.getElementById('pdfConvertBtn');
  btn.disabled = true; btn.innerHTML = 'PROCESSING...';
  document.getElementById('pdfLogBox').innerHTML = '';
  pdfLog('info', '══════════════════════════════════════════');
  pdfLog('info', ' STARTING PDF CONVERSION');
  pdfLog('info', '══════════════════════════════════════════');

  try {
    const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
    const woInc = parseInt(document.getElementById('pdfWoIncrement').value) || 0;

    pdfLog('info', 'Extracting text positions...');
    const pdfDoc   = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;
    const numPages = pdfDoc.numPages;
    pdfLog('info', 'PDF has ' + numPages + ' pages.');

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
          if (tok.trim().length === 0) { curX += (item.width / Math.max(item.str.length,1)) * tok.length; continue; }
          const tokW = (item.width / Math.max(item.str.length,1)) * tok.length;
          allWords.push({ text: tok.trim(), x: curX, y, w: tokW, h, fontSize: h, pageIndex: pi, pageH });
          curX += tokW + (item.width / Math.max(item.str.length,1));
        }
      }
    }
    pdfLog('info', 'Extracted ' + allWords.length + ' tokens across ' + numPages + ' pages.');

    // Group into visual lines
    const lineMap = {};
    for (const w of allWords) {
      const key = w.pageIndex + '_' + Math.round(w.y);
      if (!lineMap[key]) lineMap[key] = [];
      lineMap[key].push(w);
    }
    const lines = Object.keys(lineMap)
      .sort((a,b) => { const [pa,ya]=a.split('_').map(Number); const [pb,yb]=b.split('_').map(Number); return pa!==pb?pa-pb:yb-ya; })
      .map(key => ({ key, words: lineMap[key].sort((a,b)=>a.x-b.x), text: lineMap[key].sort((a,b)=>a.x-b.x).map(w=>w.text).join(' ') }));

    // Match library
    function matchLib(descStr) {
      const up = descStr.toUpperCase();
      for (const entry of toolLibrary) {
        const val = (entry.matchVal || '').toUpperCase();
        let hit = false;
        if (entry.matchType === 'keyword') {
          const normVal = val.replace(/-/g,'').replace(/\s+/g,' ').trim();
          const normUp  = up.replace(/-/g,'').replace(/\s+/g,' ').trim();
          const toks = normVal.split(' ').filter(t=>t);
          hit = toks.length > 0 && toks.every(tok => normUp.includes(tok));
        } else {
          hit = val.length > 0 && up.includes(val);
        }
        if (hit) return entry;
      }
      return null;
    }

    const mcamToOkuma = {};
    pdfLog('info', 'Matching tools...');

    // Pass A: "# N" header rows
    for (let li = 0; li < lines.length; li++) {
      const curTxt = lines[li].text.trim();
      const [curPage, curY] = lines[li].key.split('_').map(Number);
      const mH = curTxt.match(/^#\s*(\d+)\s*$/);
      if (!mH) continue;
      const mcamNum = mH[1];
      if (mcamToOkuma[mcamNum]) continue;
      for (let lj = 0; lj < lines.length; lj++) {
        if (lj === li) continue;
        const [pg2, y2] = lines[lj].key.split('_').map(Number);
        if (pg2 !== curPage || Math.abs(y2 - curY) > 15) continue;
        const txt = lines[lj].text.trim();
        if (txt.length < 5 || /^(STICKOUT|TOOL LIST|OPERATION LIST|PART CYCLE|PROGRAM NUMBER)/i.test(txt)) continue;
        const entry = matchLib(txt);
        if (entry) {
          mcamToOkuma[mcamNum] = String(entry.okuma);
          pdfLog('map', '  #' + mcamNum + ' → T' + entry.okuma + '  [' + entry.matchType + ': ' + entry.matchVal + ']');
          break;
        }
      }
      if (!mcamToOkuma[mcamNum]) pdfLog('warn', '  #' + mcamNum + ' not matched');
    }

    // Pass B: operation rows "N #M - ..."
    for (let li = 0; li < lines.length; li++) {
      const mOp = lines[li].text.match(/^\d+\s+#(\d+)\s+-/);
      if (!mOp) continue;
      const mcamNum = mOp[1];
      if (mcamToOkuma[mcamNum]) continue;
      const entry = matchLib(lines[li].text);
      if (entry) {
        mcamToOkuma[mcamNum] = String(entry.okuma);
        pdfLog('map', '  #' + mcamNum + ' → T' + entry.okuma + '  (op list)');
      }
    }

    if (!Object.keys(mcamToOkuma).length) pdfLog('warn', 'WARNING: No tools matched. Check library.');
    else pdfLog('info', 'Tool map: ' + Object.keys(mcamToOkuma).length + ' tools resolved.');

    // Collect replacements
    const replacements = [];

    for (let li = 0; li < lines.length; li++) {
      const cur    = lines[li];
      const curTxt = cur.text.trim();

      if (/^#\s*\d+\s*$/.test(curTxt)) {
        const mN = curTxt.match(/^#\s*(\d+)/);
        if (mN && mcamToOkuma[mN[1]]) {
          const hashWord = cur.words.find(w => w.text === '#');
          const numWord  = cur.words.find(w => /^\d+$/.test(w.text) && w.text === mN[1]);
          if (hashWord && numWord) {
            replacements.push({ ...hashWord, oldText:'# '+mN[1], newText:'# '+mcamToOkuma[mN[1]], isHeaderNum:true, x:hashWord.x, w:(numWord.x+numWord.w)-hashWord.x });
          } else if (numWord) {
            replacements.push({ ...numWord, oldText:numWord.text, newText:mcamToOkuma[mN[1]], isHeaderNum:true });
          }
        }
        continue;
      }

      const mOp = curTxt.match(/^\d+\s+#(\d+)\s+-/);
      if (mOp) {
        const mcamNum = mOp[1];
        if (mcamToOkuma[mcamNum]) {
          for (const w of cur.words) {
            if (w.text === '#'+mcamNum) { replacements.push({...w, oldText:w.text, newText:'#'+mcamToOkuma[mcamNum]}); break; }
          }
        }
        const [curPg, curYy] = cur.key.split('_').map(Number);
        const sameRow = [...cur.words];
        for (const ol of lines) {
          if (ol.key === cur.key) continue;
          const [pg2,y2] = ol.key.split('_').map(Number);
          if (pg2===curPg && Math.abs(y2-curYy)<=3) sameRow.push(...ol.words);
        }
        sameRow.sort((a,b)=>a.x-b.x);

        for (let wi = 0; wi < sameRow.length; wi++) {
          const wt = sameRow[wi].text;
          if (wt==='H:' || wt==='D:') {
            for (let wj=wi+1; wj<sameRow.length; wj++) {
              const cand = sameRow[wj];
              if (/^\d+$/.test(cand.text)) {
                if (mcamToOkuma[cand.text]) {
                  const dupe = replacements.some(r=>r.pageIndex===cand.pageIndex&&Math.abs(r.x-cand.x)<2&&Math.abs(r.y-cand.y)<2);
                  if (!dupe) replacements.push({...cand, oldText:cand.text, newText:mcamToOkuma[cand.text]});
                }
                break;
              }
              if (cand.text==='Z:'||cand.text==='WO:') break;
            }
          }
          if (wt==='WO:' && woInc>0) {
            for (let wj=wi+1; wj<sameRow.length; wj++) {
              const cand = sameRow[wj];
              if (/^\d+$/.test(cand.text)) {
                const dupe = replacements.some(r=>r.pageIndex===cand.pageIndex&&Math.abs(r.x-cand.x)<2&&Math.abs(r.y-cand.y)<2);
                if (!dupe) replacements.push({...cand, oldText:cand.text, newText:String(parseInt(cand.text)+woInc), isWO:true});
                break;
              }
            }
          }
        }
        continue;
      }
    }

    pdfLog('info', 'Found ' + replacements.length + ' tokens to replace.');
    if (replacements.length === 0) {
      pdfLog('warn', 'No replacements found. Check library or PDF format.');
      btn.disabled = false; btn.innerHTML = '&#128196; CONVERT PDF';
      return;
    }

    pdfLog('info', 'Applying replacements...');
    const libDoc   = await PDFDocument.load(pdfBytes.slice());
    const font     = await libDoc.embedFont(StandardFonts.HelveticaBold);
    const libPages = libDoc.getPages();
    let repCount   = 0;

    for (const rep of replacements) {
      const pg   = libPages[rep.pageIndex];
      const fs   = Math.max(rep.fontSize || 8, 6);
      const isWO = rep.isWO === true;
      const oldW = font.widthOfTextAtSize(String(rep.oldText), fs);
      const newW = font.widthOfTextAtSize(String(rep.newText), fs);
      let stampX = rep.x;
      if (rep.isHeaderNum && newW > oldW) stampX = rep.x + oldW - newW + 8;
      if (isWO)                           stampX = rep.x - 1;
      if (!isWO && !rep.isHeaderNum)      stampX = rep.x - 3;

      const padL = isWO?4:2, padR = isWO?2:1, padB = isWO?3:1, padT = isWO?5:2;
      const whiteL = Math.min(rep.x,stampX)-padL;
      const whiteR = Math.max(rep.x+oldW,stampX+newW)+padR;
      pg.drawRectangle({ x:whiteL, y:rep.y-padB, width:whiteR-whiteL, height:(rep.h||fs)+padB+padT, color:rgb(1,1,1) });
      pg.drawText(String(rep.newText), { x:stampX, y:rep.y, size:fs, font, color:rgb(0,0,0) });
      repCount++;
    }

    pdfLog('ok', '══════════════════════════════════════════');
    pdfLog('ok', ' DONE — ' + repCount + ' replacements applied');
    pdfLog('ok', '══════════════════════════════════════════');

    document.getElementById('pdfStatPages').textContent    = numPages;
    document.getElementById('pdfStatTools').textContent    = Object.keys(mcamToOkuma).length;
    document.getElementById('pdfStatNums').textContent     = repCount;
    document.getElementById('pdfStatUnmapped').textContent = document.getElementById('pdfLogBox').querySelectorAll('.log-warn').length;
    document.getElementById('pdfStatsRow').style.display   = 'flex';

    const outBytes = await libDoc.save();
    const outName  = pdfFileName.replace(/\.[^.]+$/, '') + '_OKUMA.pdf';
    const url      = URL.createObjectURL(new Blob([outBytes], { type:'application/pdf' }));
    document.getElementById('pdfDownloadBtn').href          = url;
    document.getElementById('pdfDownloadBtn').download      = outName;
    document.getElementById('pdfDlMeta').textContent        = '  ·  ' + outName + '  ·  ' + repCount + ' numbers updated';
    document.getElementById('pdfDownloadBar').classList.add('show');

    pdfLog('info', 'Rendering preview...');
    const prevDoc = await pdfjsLib.getDocument({ data: outBytes }).promise;
    const wrap    = document.getElementById('pdfPreviewWrap');
    wrap.innerHTML = '';
    for (let pi = 0; pi < prevDoc.numPages; pi++) {
      const pg     = await prevDoc.getPage(pi+1);
      const vp     = pg.getViewport({ scale:1.4 });
      const canvas = document.createElement('canvas');
      canvas.className = 'pdf-page-canvas';
      canvas.width = vp.width; canvas.height = vp.height;
      wrap.appendChild(canvas);
      await pg.render({ canvasContext:canvas.getContext('2d'), viewport:vp }).promise;
    }
    document.getElementById('pdfPreviewPanel').style.display = 'block';
    document.getElementById('pdfEmptyState').style.display   = 'none';
    pdfLog('ok', 'Preview rendered. Ready to download.');

  } catch(err) {
    pdfLog('error', 'ERROR: ' + err.message);
    console.error(err);
  }
  btn.disabled = false; btn.innerHTML = '&#128196; CONVERT PDF';
}

// ════════════════════════════════════════
//  UTILITY
// ════════════════════════════════════════

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ──
loadLibrary();
renderAllTables();
