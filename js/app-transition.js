// app-transition.js — shared wipe transition between Feed & Speed and Converter
(function () {
  const overlay = document.createElement('div');
  overlay.id = 'wipe-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '99999',
    pointerEvents: 'none', transform: 'translateX(-100%)', transition: 'none'
  });
  document.documentElement.appendChild(overlay);

  // Arrive animation: script loads after DOM is ready so run immediately,
  // not inside DOMContentLoaded (which has already fired by this point).
  const arrivedColor = sessionStorage.getItem('wipe-color');
  if (arrivedColor) {
    sessionStorage.removeItem('wipe-color');
    overlay.style.backgroundColor = arrivedColor;
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
  }

  // Navigate away with wipe transition.
  // Timeout fallback ensures navigation always completes even if
  // transitionend fails to fire (which would otherwise leave the overlay
  // blocking the page and make the button appear broken).
  window.navigateTo = function (url, color) {
    overlay.style.backgroundColor = color;
    overlay.style.transition = 'none';
    overlay.style.transform  = 'translateX(-100%)';
    overlay.style.pointerEvents = 'all';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.style.transition = 'transform 0.5s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.transform  = 'translateX(0%)';
      let done = false;
      const doNav = () => {
        if (done) return;
        done = true;
        sessionStorage.setItem('wipe-color', color);
        window.location.href = url;
      };
      overlay.addEventListener('transitionend', doNav, { once: true });
      setTimeout(doNav, 600);
    }));
  };
})();
