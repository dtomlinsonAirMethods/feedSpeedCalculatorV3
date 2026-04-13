let currentToolType = "Flat Endmill";
let lastEndmillDia  = 0.5;

// ── Corner radius auto-set based on tool type ──
function updateCornerRadiusState(reason) {
  const cr    = document.getElementById("cornerRadius");
  const diaEl = document.getElementById("dia");
  if (!cr || !diaEl) return;

  const dia      = parseSmartInput(diaEl.value) || 0;
  const selected = document.querySelector('input[name="toolType"]:checked');
  const toolType = (selected ? selected.value : currentToolType).toLowerCase();
  if (selected) currentToolType = selected.value;

  cr.disabled = false;

  if (toolType.includes("flat")) {
    cr.value    = 0;
    cr.disabled = true;
  } else if (toolType.includes("bull")) {
    cr.value = dia <= 0.125 ? 0.010 : 0.0625;
  } else if (toolType.includes("ball")) {
    cr.value = +(dia / 2).toFixed(4);
  }
  // shell mill: leave cr unchanged
}

// ── Smart math input — supports expressions like "1/2" or "0.25+0.125" ──
function parseSmartInput(input, isPercent = false) {
  if (!input) return 0;
  input = input.toString().replace(/[^0-9.+\-*/()]/g, "").trim();
  if (!input || /[+\-*/(]$/.test(input)) return 0;

  let result;
  try {
    result = Function('"use strict"; return (' + input + ')')();
  } catch {
    result = parseFloat(input) || 0;
  }

  if (!isFinite(result) || result < 0) return 0;
  if (isPercent && result < 1) result *= 100;
  return isPercent ? Math.round(result) : Number(result.toFixed(4));
}

// ── Feed lookup — handles both IPT (endmill) and IPR (drill/reamer/etc.) ──
function getDynamicFeed(toolType, material, dia) {
  const t      = toolType.toLowerCase();
  const useIpr = ["drill", "reamer", "spotter", "countersink", "center drill"].some(k => t.includes(k));
  const source = useIpr ? window.iprData : window.iptData;
  const key    = useIpr ? (source?.[t] ? t : "drill") : (t.includes("shell") ? "shellmill" : "endmill");

  const dataSet = source?.[key]?.[material];
  if (!dataSet || !Array.isArray(dataSet)) return 0.002;

  const match = dataSet.find(e => dia <= e.max) || dataSet[dataSet.length - 1];

  if (match.slot && match.rough && match.finish) {
    const so = parseSmartInput(document.getElementById("stepover")?.value, true) / 100;
    const feedType = so >= 1.0 ? "slot" : so <= 0.06 ? "finish" : "rough";
    return match[feedType].ipt;
  }

  return match.val;
}

// ── DOC recommendation text based on stepover bucket ──
function getDocRecommendation(toolType, material, dia) {
  const t      = toolType.toLowerCase();
  const useIpr = ["drill", "reamer", "spotter", "center drill"].some(k => t.includes(k));
  const source = useIpr ? window.iprData : window.iptData;
  const key    = useIpr ? (source?.[t] ? t : "drill") : "endmill";
  const dataSet = source?.[key]?.[material];
  if (!dataSet) return "";

  const entry = dataSet.find(e => dia <= e.max) || dataSet[dataSet.length - 1];
  if (!entry) return "";

  const sp = parseSmartInput(document.getElementById("stepover")?.value, true);
  const bucket = Math.abs(sp - 100) < 0.001 ? "slot" : sp <= 6 ? "finish" : "rough";

  if (bucket === "finish") return "💡 Recommended DOC: Max LOC";

  const pctMin = entry[bucket]?.DOC_pct?.min ?? (bucket === "slot" ? 75  : 125);
  const pctMax = entry[bucket]?.DOC_pct?.max ?? (bucket === "slot" ? 125 : 200);
  return `💡 Recommended DOC: ${pctMin}% - ${pctMax}% of diameter`;
}

// ── Endmill calculation ──
function calculateEndmill() {
  try {
    const isHsm        = document.getElementById("hsm").checked;
    const isThinWall   = !!document.getElementById("thinWall")?.checked;
    const dia          = parseSmartInput(document.getElementById("dia").value);
    const flutes       = parseInt(document.getElementById("flutes").value);
    const engagedTeeth = parseSmartInput(document.getElementById("engagedTeeth").value);
    const stickout     = parseSmartInput(document.getElementById("stickout").value);
    const stepover     = parseSmartInput(document.getElementById("stepover").value, true) / 100;
    const depth        = parseSmartInput(document.getElementById("depth").value);
    const toolType     = document.querySelector('input[name="toolType"]:checked').value;
    const mat          = document.getElementById("material").value;
    const cornerRadius = (toolType === "Bull Nose" || toolType === "Ball Nose")
      ? parseSmartInput(document.getElementById("cornerRadius").value) : 0;

    if (!dia || !flutes) { alert("Enter valid diameter and flutes."); return; }

    const isShell    = toolType === "Shell Mill";
    const feedKey    = isShell ? "shellmill" : "endmill";
    let   ipt        = getDynamicFeed(feedKey, mat, dia);
    let   sfm        = isShell
      ? (materialsData[mat].SFM_shellmill || materialsData[mat].SFM_endmill)
      : materialsData[mat].SFM_endmill;

    let   effTeeth   = isShell ? flutes * (engagedTeeth / 100) : flutes;
    let   warningText = "";

    if (isThinWall) ipt *= 0.8;
    if (toolType === "Bull Nose") ipt *= 0.95;
    if (toolType === "Ball Nose") ipt *= 0.90;

    if (toolType === "Bull Nose" && cornerRadius > dia / 2)
      warningText += `⚠️ Corner radius (${cornerRadius}) > half diameter (${(dia/2).toFixed(3)})\n`;

    const sdRatio  = stickout / dia;
    let   reduction = 1.0;
    if (sdRatio > 3.0)      { reduction = 0.70; warningText += `⚠️ Stickout very high (S/D=${sdRatio.toFixed(1)}), feed -30%\n`; }
    else if (sdRatio > 2.0) { reduction = 0.85; warningText += `⚠️ Stickout high (S/D=${sdRatio.toFixed(1)}), feed -15%\n`; }

    if (stepover > 0.5) warningText += "⚠️ Stepover >50%\n";
    if (depth > dia)    warningText += "⚠️ Depth of cut > diameter\n";

    if (isHsm && !isShell) {
      let recSo = dia <= 0.1875 ? 9 : dia <= 0.25 ? 10 : dia <= 0.3125 ? 11 :
                  dia <= 0.375  ? 12 : dia <= 0.5  ? 13 : 14;
      const docRatio = depth / dia;
      if (docRatio > 3.0)     recSo *= 0.75;
      else if (docRatio > 2.0) recSo *= 0.85;
      if (sdRatio > 3.0)      recSo *= 0.70;
      else if (sdRatio > 2.0) recSo *= 0.85;
      else if (sdRatio > 1.5) recSo *= 0.90;
      recSo = Math.max(6, Math.min(recSo, 16));
      warningText += `💡 Recommended Stepover: ${recSo.toFixed(1)}%\n`;
    }

    warningText += getDocRecommendation(toolType, mat, dia) + "\n";

    if (isHsm) {
      warningText += "⚡ HSM Active\n";
      let sfmBoost = 1.0, iptBoost = 1.0;
      if (mat.includes("7075") || mat.includes("6061")) {
        sfmBoost = 1.15; iptBoost = 1.1;
        if (stepover > 0.5)        { sfmBoost -= 0.05; iptBoost -= 0.05; }
        else if (stepover <= 0.2)  { sfmBoost += 0.05; iptBoost += 0.03; }
        if (depth > dia * 0.5)     { sfmBoost -= 0.05; iptBoost -= 0.05; }
        else if (depth <= dia*0.25){ sfmBoost += 0.03; iptBoost += 0.02; }
      } else if (mat.includes("Stainless")) { sfmBoost = 1.10; iptBoost = 1.05; }
        else if (mat.includes("HRS"))       { sfmBoost = 1.05; iptBoost = 1.03; }
      sfm *= sfmBoost;
      ipt *= iptBoost;
    }

    const machines = window.machinesData;
    if (!machines) { alert("Machine data not loaded."); return; }
    const machineKey = Object.keys(machines).find(
      k => k.toLowerCase() === document.getElementById("machineSelect").value.trim().toLowerCase()
    );
    if (!machineKey) { alert("Machine not found."); return; }

    const machineMaxRpm  = machines[machineKey].maxRPM;
    let   rpmLimit       = isHsm ? machineMaxRpm * 1.05 : machineMaxRpm;
    if (sdRatio > 2.5 || flutes > 4 || stepover > 0.6)
      rpmLimit = Math.min(rpmLimit, machineMaxRpm * 0.95);

    const theoreticalRpm = Math.round((sfm * 3.82) / dia);
    const rpm            = Math.min(theoreticalRpm, rpmLimit);
    if (theoreticalRpm > rpmLimit) warningText += "⚠️ RPM capped by machine max\n";

    const ipm        = rpm * effTeeth * ipt * reduction;
    const sfmActual  = (rpm * dia) / 3.82;
    const iptActual  = rpm && effTeeth ? ipm / (rpm * effTeeth) : 0;

    document.getElementById("rpm").innerText     = `RPM: ${rpm}`;
    document.getElementById("feedRate").innerText = `Feed Rate (IPM): ${ipm.toFixed(1)}`;
    document.getElementById("sfmOut").innerText  = `SFM: ${sfmActual.toFixed(1)}`;
    document.getElementById("iptOut").innerText  = `Feed per Tooth (IPT): ${iptActual.toFixed(5)}`;

    document.getElementById("rpm-val").textContent  = rpm.toLocaleString();
    document.getElementById("feed-val").textContent = ipm.toFixed(1);
    document.getElementById("sfm-val").textContent  = sfmActual.toFixed(1);
    document.getElementById("ipt-val").textContent  = iptActual.toFixed(5);

    const warnBox = document.getElementById("em-warn-box");
    if (warnBox) { warnBox.textContent = warningText.trim(); warnBox.style.display = warningText.trim() ? "block" : "none"; }

  } catch (err) { alert("Input Error: " + err); }
}

// ── Drill calculation ──
function calculateDrill() {
  try {
    const drillType = document.getElementById("drillType").value.toLowerCase();
    const dia       = parseSmartInput(document.getElementById("diaDrill").value);
    const flutes    = parseInt(document.getElementById("flutesDrill").value) || 2;
    const stickout  = parseSmartInput(document.getElementById("stickoutDrill").value);
    const depth     = parseSmartInput(document.getElementById("depthDrill").value);
    const pecking   = document.getElementById("pecking")?.checked;
    const mat       = document.getElementById("drillMaterial").value;

    if (!dia) { alert("Enter valid diameter."); return; }

    let sfm = materialsData[mat]?.SFM_drill || 200;
    let ipr = getDynamicFeed("drill", mat, dia);
    let peckText = "";

    if (drillType === "reamer") {
      ipr = getDynamicFeed("reamer", mat, dia);
      sfm = materialsData[mat]?.SFM_reamer || sfm * 0.6;
    } else if (drillType === "spotter" || drillType === "center drill") {
      ipr = getDynamicFeed("spotter", mat, dia);
      sfm = materialsData[mat]?.SFM_spot || sfm;
    } else if (drillType === "countersink") {
      ipr = getDynamicFeed("countersink", mat, dia);
      sfm = materialsData[mat]?.SFM_countersink || materialsData[mat]?.SFM_spot || sfm;
      if (pecking) peckText = "No peck (countersink)";
    } else {
      ipr = getDynamicFeed("drill", mat, dia);
    }

    const ratio            = stickout / dia;
    let   reduction        = 1.0;
    let   warningText      = "";
    if (ratio > 5)      { reduction = 0.70; warningText = "⚠️ Stickout very high (S/D > 5), feed -30%"; }
    else if (ratio > 3) { reduction = 0.85; warningText = "⚠️ Stickout high (S/D > 3), feed -15%"; }

    let rpm = Math.min(Math.floor((sfm * 3.82) / dia), 9500);
    const effectiveReduction = drillType === "reamer" ? 1.0 : reduction;
    const ipm = rpm * flutes * ipr * effectiveReduction;

    if (!peckText) {
      if (!pecking) {
        peckText = "No pecking";
      } else {
        const depthToDia = depth / dia;
        let peckAmount = 0;
        if (dia < 0.125)         peckAmount = Math.min(0.10, dia * 0.75);
        else if (depthToDia > 6) peckAmount = dia * 1.0;
        else if (depthToDia > 3) peckAmount = dia * 1.5;
        peckAmount = Math.min(peckAmount, depth);
        peckText = peckAmount > 0 ? `Suggested Peck: ${peckAmount.toFixed(3)} in` : "No pecking";
      }
    }

    document.getElementById("rpmDrill").innerText  = `RPM: ${rpm}`;
    document.getElementById("feedDrill").innerText = `Feed Rate (IPM): ${ipm.toFixed(2)}`;
    document.getElementById("peckOut").innerText   = peckText;
    const warn = document.getElementById("drillWarn");
    warn.innerText  = warningText;
    warn.style.color = warningText ? "orange" : "var(--accent)";

    document.getElementById("drill-rpm-val").textContent  = rpm.toLocaleString();
    document.getElementById("drill-feed-val").textContent = ipm.toFixed(2);
    const peckDisp = document.getElementById("drill-peck-val");
    if (peckDisp) peckDisp.textContent = peckText;
    const warnBox = document.getElementById("drill-warn-box");
    if (warnBox) { warnBox.textContent = warningText; warnBox.style.display = warningText ? "block" : "none"; }

  } catch (err) { alert("Input Error: " + err); }
}

// ── Thread dropdown population ──
function updateThreadSizes() {
  const ttype    = document.getElementById("threadType").value;
  const sizeMenu = document.getElementById("threadSize");
  sizeMenu.innerHTML = "";
  Object.keys(threadsData?.[ttype] || {}).forEach(s => {
    const opt = document.createElement("option");
    opt.value = opt.textContent = s;
    sizeMenu.appendChild(opt);
  });
  updateThreadClasses();
}

function updateThreadClasses() {
  const ttype     = document.getElementById("threadType").value;
  const tsize     = document.getElementById("threadSize").value;
  const classMenu = document.getElementById("threadClass");
  classMenu.innerHTML = "";
  Object.keys(threadsData?.[ttype]?.[tsize] || {})
    .filter(k => k !== "pitch")
    .forEach(c => {
      const opt = document.createElement("option");
      opt.value = opt.textContent = c;
      classMenu.appendChild(opt);
    });
}

// ── Tapping calculation ──
function calculateTapping() {
  try {
    const ttype    = document.getElementById("threadType").value;
    const tsize    = document.getElementById("threadSize").value;
    const tclass   = document.getElementById("threadClass").value;
    const mat      = document.getElementById("threadMaterial").value;
    const depth    = parseSmartInput(document.getElementById("threadDepth").value);
    const holeType = document.getElementById("holeType").value;
    const tapType  = document.getElementById("tapType").value;

    const typeData  = threadsData?.[ttype];
    if (!typeData) throw `Thread type '${ttype}' not found.`;
    const sizeData  = typeData?.[tsize];
    if (!sizeData)  throw `Thread size '${tsize}' not found.`;
    const classData = sizeData?.[tclass];
    if (!classData) throw `Thread class '${tclass}' not found.`;

    const pitch    = parseFloat(sizeData.pitch ?? 0);
    const majorMin = classData.major_dia_min ?? null;
    const majorMax = classData.major_dia_max ?? null;
    const pitchMin = classData.pitch_dia_min ?? null;
    const pitchMax = classData.pitch_dia_max ?? null;
    const tolerance = classData.allowance ?? null;

    let minorMin = null, minorMax = null;
    if (classData.type === "internal") {
      minorMin = classData.minor_dia_min ?? null;
      minorMax = classData.minor_dia_max ?? null;
    } else {
      minorMax = classData.unr_minor_dia_max ?? null;
    }

    const sfmThread = materialsData[mat]?.SFM_thread || 200;
    const rpm       = Math.min(majorMin ? Math.floor((sfmThread * 3.82) / majorMin) : 0, 800);
    const ipm       = rpm * pitch;
    const peckText  = holeType === "Blind"
      ? `Suggested Peck: ${Math.min(depth, (majorMin || 0) * 1.5).toFixed(3)} in`
      : "No pecking";

    document.getElementById("rpmThread").innerText  = `RPM: ${rpm}`;
    document.getElementById("feedThread").innerText = `Feed Rate (IPM): ${ipm.toFixed(3)} | Pitch: ${pitch.toFixed(5)} in/rev`;
    document.getElementById("threadPeck").innerText = peckText;

    document.getElementById("tap-rpm-val").textContent  = rpm.toLocaleString();
    document.getElementById("tap-feed-val").textContent = ipm.toFixed(3);
    const peckDisp = document.getElementById("tap-peck-val");
    if (peckDisp) peckDisp.textContent = peckText;

    const safe      = v => v == null ? "n/a" : typeof v === "number" ? v.toFixed(4) : v;
    const makeRange = (a, b) => `${safe(a)} – ${safe(b)}`;

    let html = `<strong>${ttype} ${tsize} ${tclass}</strong><br>`;
    html += `Major Dia: ${makeRange(majorMin, majorMax)}<br>`;
    html += classData.type === "internal"
      ? `Minor Dia: ${makeRange(minorMin, minorMax)}<br>`
      : `Minor Dia (UNR Max): ${safe(minorMax)}<br>`;
    html += `Pitch Dia: ${makeRange(pitchMin, pitchMax)}<br>`;
    html += `Tolerance: ${safe(tolerance)}`;

    const geom = document.getElementById("threadGeometry");
    geom.innerHTML = html;
    geom.style.color = html.includes("n/a") ? "var(--yellow)" : "var(--text)";

  } catch (err) { alert("Input Error: " + err); }
}

// ── Shell Mill UI toggle (engaged teeth + diameter defaults) ──
document.querySelectorAll('input[name="toolType"]').forEach(radio => {
  radio.addEventListener("change", () => {
    requestAnimationFrame(() => {
      const selected  = document.querySelector('input[name="toolType"]:checked');
      if (selected) currentToolType = selected.value;
      const isShell   = selected?.value === "Shell Mill";
      const engGroup  = document.getElementById("engagedTeethGroup");
      const flutesLbl = document.getElementById("flutesLabel");
      const diaInput  = document.getElementById("dia");

      if (isShell) {
        lastEndmillDia = parseSmartInput(diaInput.value) || lastEndmillDia;
        diaInput.value = "3.000";
        document.getElementById("flutes").value   = "6";
        document.getElementById("stepover").value = "50";
        document.getElementById("depth").value    = "0.075";
        if (engGroup)  engGroup.style.display  = "block";
        if (flutesLbl) flutesLbl.textContent   = "Inserts";
      } else {
        diaInput.value = lastEndmillDia.toFixed(3);
        if (engGroup)  engGroup.style.display  = "none";
        if (flutesLbl) flutesLbl.textContent   = "Flutes";
      }
      updateCornerRadiusState("tool change");
    });
  });
});

// ── Smart input blur formatting ──
document.addEventListener("blur", e => {
  const el = e.target;
  if (el.tagName !== "INPUT" || el.type === "radio" || el.type === "checkbox") return;
  if (el.classList.contains("shop-search") || el.classList.contains("lib-search")) return;
  const val = el.value.trim();
  if (!val) return;
  const isPercent = el.dataset.percent === "true";
  const result    = parseSmartInput(val, isPercent);
  if (!isNaN(result)) el.value = isPercent ? Math.round(result) : Number(result.toFixed(4));
  if (el.id === "dia") updateCornerRadiusState("blur");
}, true);

document.addEventListener("input", e => {
  if (e.target.id === "dia") updateCornerRadiusState("typing");
});

// ── Init ──
window.addEventListener("DOMContentLoaded", () => {
  updateCornerRadiusState("init");
  updateThreadSizes();
  // Show hint on load
  renderShopPicker('endmill');
  renderShopPicker('drill');
});
