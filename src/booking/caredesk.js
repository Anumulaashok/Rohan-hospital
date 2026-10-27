// CareDesk reception inbox; unset PUBLIC_CAREDESK_URL disables the sync.
const BASE_URL = (import.meta.env.PUBLIC_CAREDESK_URL || '').replace(/\/$/, '');
const CLINIC = import.meta.env.PUBLIC_CAREDESK_CLINIC || 'rohan';

const text = (v) => (typeof v === 'string' ? v.trim() : '');

// Best effort only: any failure here must never block the WhatsApp booking.
export function sendToCareDesk(formData) {
  if (!BASE_URL || typeof fetch !== 'function') return;
  try {
    const body = JSON.stringify({
      name: text(formData.name),
      phone: text(formData.phone),
      age: text(formData.age),
      gender: text(formData.gender),
      service: text(formData.service),
      date: text(formData.date),
      slot: text(formData.slot),
      notes: text(formData.notes),
    });
    // text/plain skips the CORS preflight and keepalive lets it finish if WhatsApp replaces this tab
    fetch(`${BASE_URL}/api/public/${CLINIC}/requests`, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore: sync is optional
  }
}
