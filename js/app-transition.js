// app-transition.js — shared wipe transition between Feed & Speed and Converter
(function () {
  const overlay = document.createElement('div');
  overlay.id = 'wipe-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '99999',
    pointerEvents: 'none', transform: 'translateX(-100%)', transition: 'none'
  });
  document.documentElement.appendChild(overlay);

  // On page load: if arriving from a wipe, reveal the page
  window.addEventListener('DOMContentLoaded', () => {
    const color = sessionStorage.getItem('wipe-color');
    if (!color) return;
    sessionStorage.removeItem('wipe-color');
    overlay.style.backgroundColor = color;
    overlay.style.transition = 'none';
    overlay.style.transform  = 'translateX(0%)';
    overlay.style.pointerEvents = 'all';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.style.transition = 'transform 0.55s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.transform  = 'translateX(100%)';
      overlay.addEventListener('transitionend', () => {
        overlay.style.pointerEvents = 'none';
      }, { once: true });
    }));
  });

  // navigateTo: wipe out, then navigate
  window.navigateTo = function (url, color) {
    overlay.style.backgroundColor = color;
    overlay.style.transition = 'none';
    overlay.style.transform  = 'translateX(-100%)';
    overlay.style.pointerEvents = 'all';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.style.transition = 'transform 0.5s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.transform  = 'translateX(0%)';
      overlay.addEventListener('transitionend', () => {
        sessionStorage.setItem('wipe-color', color);
        window.location.href = url;
      }, { once: true });
    }));
  };
})();
