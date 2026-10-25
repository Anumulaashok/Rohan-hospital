export function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  const header = document.getElementById('site-header');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  const onScroll = () => header?.classList.toggle('shadow-soft', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
