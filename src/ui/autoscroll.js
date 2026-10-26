const SPEED = 0.06; // px per ms

export function initAutoScroll(strip) {
  if (strip.dataset.autoscrollReady) return;
  strip.dataset.autoscrollReady = 'true';
  const firstClone = strip.querySelector('[data-clone]');
  const stop = () => {
    if (strip.classList.contains('is-stopped')) return;
    const loopWidth = firstClone ? firstClone.offsetLeft - strip.firstElementChild.offsetLeft : 0;
    const left = strip.scrollLeft;
    strip.classList.add('is-stopped');
    strip.scrollLeft = loopWidth && left >= loopWidth ? left - loopWidth : left;
  };
  if (!firstClone || matchMedia('(prefers-reduced-motion: reduce)').matches) return stop();

  ['pointerdown', 'touchstart', 'keydown', 'focusin'].forEach((type) =>
    strip.addEventListener(type, stop, { once: true, passive: true }),
  );
  // Vertical page scrolling over the strip shouldn't count as stopping it.
  strip.addEventListener('wheel', (e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && stop(), { passive: true });

  let visible = false;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(strip);

  // Track position as a float since scrollLeft rounds sub-pixel steps.
  let pos = strip.scrollLeft;
  let last = performance.now();
  const tick = (now) => {
    if (strip.classList.contains('is-stopped')) return;
    const dt = Math.min(now - last, 50);
    last = now;
    if (visible && !document.hidden) {
      const loopWidth = firstClone.offsetLeft - strip.firstElementChild.offsetLeft;
      pos += SPEED * dt;
      if (pos >= loopWidth) pos -= loopWidth;
      strip.scrollLeft = pos;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
