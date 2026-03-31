// ============================================================
//  app.js — Feed & Speed Calculator UI Logic
//  Handles: tab switching, result display mirroring,
//           tool library (localStorage), quick-select,
//           field population from selected tool
// ============================================================

// ══════════════════════════════════════════
//  TAB SWITCHING
// ══════════════════════════════════════════
function openAppTab(name, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  if (name === 'library') renderFSLibrary();
}

// ══════════════════════════════════════════
//  RESULT MIRRORING
//  script.js writes to hidden legacy <p> tags.
//  We use MutationObserver to mirror those
//  values into the new styled result boxes.
// ══════════════════════════════════════════
function mirrorText(sourceId, destId, transform) {
  const src  = document.getElementById(sourceId);
  const dest = document.getElementById(destId);
  if (!src || !dest) return;

  function update() {
    const raw = src.innerText || src.textContent || '';
    dest.textContent = transform ? transform(raw) : raw;
    // Show/hide dim state
    if (dest.classList.contains('result-val')) {
      dest.classList.toggle('dim', !raw || raw === '—');
    }
  }

  const obs = new MutationObserver(update);
  obs.observe(src, { childList: true, subtree: true, characterData: true });
}

// Extract numeric value after "Label: " prefix
function extractNum(label) {
  return raw => {
    const val = raw.replace(label, '').trim().split(' ')[0].split('|')[0].trim();
    return val || '—';
  };
}

// Set up all mirrors once DOM is ready
function setupMirrors() {
  // Endmill
  mirrorText('rpm',      'rpm-val',  extractNum('RPM:'));
  mirrorText('feedRate', 'feed-val', extractNum('Feed Rate (IPM):'));
  mirrorText('sfmOut',   'sfm-val',  extractNum('SFM:'));
  mirrorText('iptOut',   'ipt-val',  extractNum('Feed per Tooth (IPT):'));

  // Mirror warnings
  const warnSrc  = document.getElementById('warnings');
  const warnDest = document.getElementById('em-warn-box');
  if (warnSrc && warnDest) {
    new MutationObserver(() => {
      const txt = warnSrc.innerText || '';
      warnDest.textContent = txt;
      warnDest.classList.toggle('show', txt.trim().length > 0);
      warnDest.style.color = txt.includes('⚠️') ? 'var(--yellow)' : 'var(--accent)';
    }).observe(warnSrc, { childList: true, subtree: true, characterData: true });
  }

  // Drill
  mirrorText('rpmDrill',  'drill-rpm-val',  extractNum('RPM:'));
  mirrorText('feedDrill', 'drill-feed-val', extractNum('Feed Rate (IPM):'));

  const peckSrc  = document.getElementById('peckOut');
  const peckDest = document.getElementById('drill-peck-val');
  if (peckSrc && peckDest) {
    new MutationObserver(() => {
      const txt = peckSrc.innerText || '';
      peckDest.textContent = txt;
      peckDest.classList.toggle('show', txt.trim().length > 0);
    }).observe(peckSrc, { childList: true, subtree: true, characterData: true });
  }

  const drWarnSrc  = document.getElementById('drillWarn');
  const drWarnDest = document.getElementById('drill-warn-box');
  if (drWarnSrc && drWarnDest) {
    new MutationObserver(() => {
      const txt = drWarnSrc.innerText || '';
      drWarnDest.textContent = txt;
      drWarnDest.classList.toggle('show', txt.trim().length > 0);
    }).observe(drWarnSrc, { childList: true, subtree: true, characterData: true });
  }

  // Tapping
  mirrorText('rpmThread',  'tap-rpm-val',  extractNum('RPM:'));
  mirrorText('feedThread', 'tap-feed-val', raw => {
    // "Feed Rate (IPM): 12.345 | Pitch: 0.04167 in/rev" → just the IPM number
    const part = raw.replace('Feed Rate (IPM):', '').trim().split('|')[0].trim();
    return part || '—';
  });

  const tapPeckSrc  = document.getElementById('threadPeck');
  const tapPeckDest = document.getElementById('tap-peck-val');
  if (tapPeckSrc && tapPeckDest) {
    new MutationObserver(() => {
      const txt = tapPeckSrc.innerText || '';
      tapPeckDest.textContent = txt;
      tapPeckDest.classList.toggle('show', txt.trim().length > 0);
    }).observe(tapPeckSrc, { childList: true, subtree: true, characterData: true });
  }
}

// ══════════════════════════════════════════
//  TOOL LIBRARY (localStorage)
//  Separate from the Okuma converter library.
//  Stores: { type, name, tnum, dia, fl, so, loc, rad, mat }
// ══════════════════════════════════════════
let fsLib     = [];
let fsSortKey = 'tnum';
let fsSortDir = 1;

function saveFSLib() {
  try { localStorage.setItem('fsToolLibrary_v1', JSON.stringify(fsLib)); } catch(e) {}
}

function loadFSLib() {
  try {
    const s = localStorage.getItem('fsToolLibrary_v1');
    if (s) fsLib = JSON.parse(s);
  } catch(e) { fsLib = []; }
}

// ── Add tool ──
function addFSTool() {
  const type = document.querySelector('input[name="addType"]:checked')?.value || 'EM';
  const name = document.getElementById('add-name').value.trim();
  const tnum = document.getElementById('add-tnum').value.trim();
  const dia  = parseFloat(document.getElementById('add-dia').value)     || 0;
  const fl   = parseInt(document.getElementById('add-flutes').value)    || 0;
  const so   = parseFloat(document.getElementById('add-stickout').value) || 0;
  const loc  = parseFloat(document.getElementById('add-loc').value)     || 0;
  const rad  = parseFloat(document.getElementById('add-rad').value)     || 0;
  const mat  = document.getElementById('add-mat').value;

  if (!name) { alert('Tool name is required.'); return; }

  fsLib.push({ type, name, tnum, dia, fl, so, loc, rad, mat,
    id: Date.now() + Math.random() });
  saveFSLib();
  renderFSLibrary();
  renderQuickCards();

  // Clear inputs
  ['add-name','add-tnum','add-dia','add-flutes','add-stickout','add-loc','add-rad']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const matEl = document.getElementById('add-mat');
  if (matEl) matEl.value = '';
}

// ── Remove tool ──
function removeFSTool(id) {
  fsLib = fsLib.filter(t => t.id !== id);
  saveFSLib();
  renderFSLibrary();
  renderQuickCards();
}

// ── Select tool → populate calc fields ──
function selectFSTool(id, tabHint) {
  const t = fsLib.find(x => x.id === id);
  if (!t) return;

  // Mark all cards selected/deselected
  document.querySelectorAll('.tool-card[data-fsid]').forEach(c => {
    c.classList.toggle('selected', c.dataset.fsid === String(id));
  });

  // Determine which tab to update based on tool type
  const isEndmill = ['EM'].includes(t.type);
  const isDrill   = ['DRILL','CSINK'].includes(t.type);

  if (isEndmill || tabHint === 'endmill') {
    updateEndmillBanner(t);
    populateEndmillFields(t);
  } else if (isDrill || tabHint === 'drill') {
    updateDrillBanner(t);
    populateDrillFields(t);
  }
}

function updateEndmillBanner(t) {
  const banner = document.getElementById('em-sel-banner');
  const name   = document.getElementById('em-sel-name');
  const props  = document.getElementById('em-sel-props');
  if (!banner) return;
  name.textContent = (t.tnum ? 'T' + t.tnum + ' — ' : '') + t.name;
  props.textContent = [
    t.dia  ? 'ø' + t.dia.toFixed(3) + '"' : null,
    t.fl   ? t.fl + 'FL' : null,
    t.so   ? t.so.toFixed(3) + '" SO' : null,
    t.loc  ? t.loc.toFixed(3) + '" LOC' : null,
  ].filter(Boolean).join('  ·  ');
  banner.classList.add('show');
}

function updateDrillBanner(t) {
  const banner = document.getElementById('dr-sel-banner');
  const name   = document.getElementById('dr-sel-name');
  const props  = document.getElementById('dr-sel-props');
  if (!banner) return;
  name.textContent = (t.tnum ? 'T' + t.tnum + ' — ' : '') + t.name;
  props.textContent = [
    t.dia  ? 'ø' + t.dia.toFixed(3) + '"' : null,
    t.so   ? t.so.toFixed(3) + '" SO' : null,
  ].filter(Boolean).join('  ·  ');
  banner.classList.add('show');
}

function populateEndmillFields(t) {
  setFieldFlash('dia',          t.dia  ? t.dia.toFixed(3)  : '');
  setFieldFlash('flutes',       t.fl   ? String(t.fl)       : '');
  setFieldFlash('stickout',     t.so   ? t.so.toFixed(3)   : '');
  setFieldFlash('cornerRadius', t.rad  ? t.rad.toFixed(3)  : '0.000');
  if (t.mat) setSelectVal('material', t.mat);
  // Trigger corner radius state update
  if (typeof updateCornerRadiusState === 'function') {
    updateCornerRadiusState('tool select');
  }
}

function populateDrillFields(t) {
  setFieldFlash('diaDrill',     t.dia ? t.dia.toFixed(3) : '');
  setFieldFlash('flutesDrill',  t.fl  ? String(t.fl)     : '');
  setFieldFlash('stickoutDrill',t.so  ? t.so.toFixed(3)  : '');
  if (t.mat) setSelectVal('drillMaterial', t.mat);
}

function setFieldFlash(id, val) {
  const el = document.getElementById(id);
  if (!el || val === '') return;
  el.value = val;
  el.style.borderColor = 'var(--accent)';
  el.style.background  = 'rgba(0,230,118,0.06)';
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.background  = '';
  }, 700);
}

function setSelectVal(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  for (const opt of el.options) {
    if (opt.value === val || opt.text === val) { el.value = opt.value; break; }
  }
}

// ── Clear selected tool ──
function clearSelectedTool(tab) {
  if (tab === 'endmill') {
    document.getElementById('em-sel-banner')?.classList.remove('show');
  } else if (tab === 'drill') {
    document.getElementById('dr-sel-banner')?.classList.remove('show');
  }
  document.querySelectorAll('.tool-card[data-fsid]')
    .forEach(c => c.classList.remove('selected'));
}

// ── Sort ──
function setFSSort(key, btn) {
  if (fsSortKey === key) fsSortDir *= -1;
  else { fsSortKey = key; fsSortDir = 1; }
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderFSLibrary();
}

// ── Render library ──
function renderFSLibrary() {
  const container = document.getElementById('lib-tool-cards');
  const cntEl     = document.getElementById('lib-count');
  if (!container) return;

  const q = (document.getElementById('lib-search')?.value || '').toLowerCase();

  let rows = fsLib.filter(t =>
    t.name.toLowerCase().includes(q) ||
    String(t.tnum).toLowerCase().includes(q) ||
    t.type.toLowerCase().includes(q) ||
    String(t.dia).includes(q)
  );

  rows.sort((a, b) => {
    let av, bv;
    if      (fsSortKey === 'tnum') { av = parseInt(a.tnum)||0; bv = parseInt(b.tnum)||0; }
    else if (fsSortKey === 'name') { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
    else if (fsSortKey === 'dia')  { av = a.dia; bv = b.dia; }
    else if (fsSortKey === 'type') { av = a.type; bv = b.type; }
    if (av < bv) return -fsSortDir;
    if (av > bv) return fsSortDir;
    return 0;
  });

  if (cntEl) cntEl.textContent = fsLib.length + ' TOOLS';

  if (rows.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--dim);font-family:var(--mono);font-size:11px;line-height:1.9;">
      ${fsLib.length === 0
        ? 'No tools yet.<br>Use the form to add your first tool.'
        : 'No tools match your search.'}
    </div>`;
    return;
  }

  const badgeMap = { EM:'badge-em', DRILL:'badge-drill', TAP:'badge-tap', CSINK:'badge-csink' };

  container.innerHTML = rows.map(t => {
    const meta = [
      t.dia  ? 'ø' + t.dia.toFixed(3) : null,
      t.fl   ? t.fl + 'FL' : null,
      t.so   ? t.so.toFixed(3) + ' SO' : null,
      t.loc  ? t.loc.toFixed(3) + ' LOC' : null,
      t.rad  > 0 ? t.rad.toFixed(3) + ' RAD' : null,
    ].filter(Boolean).join(' · ');

    return `<div class="tool-card" data-fsid="${t.id}" onclick="selectFSTool(${t.id})">
      <div class="tc-num">T${escH(String(t.tnum||'—'))}</div>
      <div class="tc-info">
        <div class="tc-name">${escH(t.name)}</div>
        <div class="tc-meta">${escH(meta)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">
        <div class="tc-badge ${badgeMap[t.type]||'badge-csink'}">${escH(t.type)}</div>
        <button class="tc-delete" onclick="event.stopPropagation();removeFSTool(${t.id})">✕</button>
      </div>
    </div>`;
  }).join('');
}

// ── Quick-pick cards in calc tabs ──
function renderQuickCards() {
  renderQuickList('em-quick-cards',
    t => t.type === 'EM',
    'endmill',
    'No endmill tools in library yet.<br>Add tools in the Tool Library tab.'
  );
  renderQuickList('dr-quick-cards',
    t => t.type === 'DRILL' || t.type === 'CSINK',
    'drill',
    'No drill tools in library yet.<br>Add tools in the Tool Library tab.'
  );
}

function renderQuickList(containerId, filterFn, tabHint, emptyMsg) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tools = fsLib.filter(filterFn);
  if (tools.length === 0) {
    container.innerHTML = `<div class="empty-quick">${emptyMsg}</div>`;
    return;
  }

  const badgeMap = { EM:'badge-em', DRILL:'badge-drill', TAP:'badge-tap', CSINK:'badge-csink' };

  container.innerHTML = tools
    .sort((a, b) => (parseInt(a.tnum)||0) - (parseInt(b.tnum)||0))
    .map(t => {
      const meta = [
        t.dia ? 'ø' + t.dia.toFixed(3) : null,
        t.fl  ? t.fl + 'FL' : null,
        t.so  ? t.so.toFixed(3) + ' SO' : null,
      ].filter(Boolean).join(' · ');

      return `<div class="tool-card" data-fsid="${t.id}"
          onclick="selectFSTool(${t.id}, '${tabHint}')">
        <div class="tc-num" style="font-size:14px;min-width:36px;">T${escH(String(t.tnum||'?'))}</div>
        <div class="tc-info">
          <div class="tc-name" style="font-size:12px;">${escH(t.name)}</div>
          <div class="tc-meta">${escH(meta)}</div>
        </div>
        <div class="tc-badge ${badgeMap[t.type]||'badge-csink'}" style="font-size:8px;">${escH(t.type)}</div>
      </div>`;
    }).join('');
}

// ── Export / Import ──
function exportFSLib() {
  const blob = new Blob([JSON.stringify(fsLib, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'fs_tool_library.json';
  a.click();
}

function importFSLib(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error('Expected JSON array');
      // Ensure all items have an id
      fsLib = data.map(t => ({ ...t, id: t.id || Date.now() + Math.random() }));
      saveFSLib();
      renderFSLibrary();
      renderQuickCards();
    } catch(err) { alert('Import failed: ' + err.message); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ── Search listener ──
document.addEventListener('input', e => {
  if (e.target.id === 'lib-search') renderFSLibrary();
});

// ── Utility ──
function escH(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
loadFSLib();
renderFSLibrary();
renderQuickCards();
setupMirrors();
