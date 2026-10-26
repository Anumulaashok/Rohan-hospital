export function initVideoDialog() {
  const dialog = document.getElementById('video-dialog');
  if (!dialog) return;
  const box = dialog.querySelector('[data-frame]');

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-video]');
    if (!trigger) return;
    const short = trigger.hasAttribute('data-video-short');
    dialog.toggleAttribute('data-short', short);
    box.classList.toggle('aspect-video', !short);
    box.classList.toggle('aspect-[9/16]', short);
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${trigger.dataset.video}?autoplay=1&rel=0&playsinline=1`;
    frame.title = trigger.dataset.videoTitle || 'Rohan Fertility Centre video';
    frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    frame.allowFullscreen = true;
    frame.className = 'absolute inset-0 h-full w-full border-0';
    box.replaceChildren(frame);
    dialog.showModal();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });
  // Drop the iframe so playback stops when the dialog closes.
  dialog.addEventListener('close', () => box.replaceChildren());
}
