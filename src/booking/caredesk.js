// CareDesk reception inbox; unset PUBLIC_CAREDESK_URL disables the sync.
const BASE_URL = (import.meta.env.PUBLIC_CAREDESK_URL || '').replace(/\/$/, '');
const CLINIC = import.meta.env.PUBLIC_CAREDESK_CLINIC || 'rohan';

export function sendToCareDesk(formData) {
  if (!BASE_URL) return;
  const body = JSON.stringify({
    name: formData.name.trim(),
    phone: formData.phone,
    age: formData.age,
    gender: formData.gender,
    service: formData.service,
    date: formData.date,
    slot: formData.slot,
    notes: formData.notes.trim(),
  });
  // text/plain skips the CORS preflight and keepalive lets it finish if WhatsApp replaces this tab
  fetch(`${BASE_URL}/api/public/${CLINIC}/requests`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body,
    keepalive: true,
  }).catch(() => {});
}
