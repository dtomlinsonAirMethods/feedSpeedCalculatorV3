// app-transition.js — shared wipe transition between Feed & Speed and Converter
(function () {
  const overlay = document.createElement('div');
  overlay.id = 'wipe-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:99999',
    'pointer-events:none', 'transform:translateX(-100%)', 'transition:none'
  ].join(';') + ';';
  document.documentElement.appendChild(overlay);

  // Arrive animation: uncover the page by sliding overlay off to the right.
  // offsetHeight forces a reflow so the browser commits the starting position
  // before the transition begins — more reliable than double-rAF.
  try {
    const color = sessionStorage.getItem('wipe-color');
    if (color) {
      sessionStorage.removeItem('wipe-color');
      overlay.style.backgroundColor = color;
      overlay.style.transition = 'none';
      overlay.style.transform = 'translateX(0%)';
      overlay.style.pointerEvents = 'all';
      overlay.offsetHeight; // force reflow
      overlay.style.transition = 'transform 0.55s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.transform = 'translateX(100%)';
      setTimeout(() => { overlay.style.pointerEvents = 'none'; }, 600);
    }
  } catch (e) {}

  // Navigate away: cover screen then redirect.
  window.navigateTo = function (url, color) {
    overlay.style.backgroundColor = color;
    overlay.style.transition = 'none';
    overlay.style.transform = 'translateX(-100%)';
    overlay.style.pointerEvents = 'all';
    overlay.offsetHeight; // force reflow
    overlay.style.transition = 'transform 0.5s cubic-bezier(0.76,0,0.24,1)';
    overlay.style.transform = 'translateX(0%)';
    setTimeout(() => {
      try { sessionStorage.setItem('wipe-color', color); } catch (e) {}
      window.location.href = url;
    }, 520);
  };
})();
