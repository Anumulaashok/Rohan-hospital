export function initLightbox() {
  const dialog = document.getElementById('lightbox');
  if (!dialog) return;
  const img = dialog.querySelector('img');

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox]');
    if (!trigger) return;
    img.src = trigger.dataset.lightbox;
    img.alt = trigger.dataset.lightboxAlt || '';
    dialog.showModal();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });
}
