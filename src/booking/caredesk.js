// CareDesk backend for live slots, online payment and the reception inbox; unset PUBLIC_CAREDESK_URL keeps the site static.
const BASE_URL = (import.meta.env.PUBLIC_CAREDESK_URL || '').replace(/\/$/, '');
const CLINIC = import.meta.env.PUBLIC_CAREDESK_CLINIC || 'rohan';

export const caredeskEnabled = () => Boolean(BASE_URL) && typeof fetch === 'function';

const text = (v) => (typeof v === 'string' ? v.trim() : '');

export function apiUrl(path) {
  return `${BASE_URL}/api/public/${CLINIC}${path}`;
}

/** JSON call to CareDesk; throws with the server's message so the form can show it. */
export async function caredeskFetch(path, { method = 'GET', body, timeoutMs = 15000 } = {}) {
  const res = await fetch(apiUrl(path), {
    method,
    // text/plain avoids a CORS preflight; CareDesk parses the JSON either way
    headers: body ? { 'content-type': 'text/plain' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again or call the hospital.');
  return data;
}

// Best effort only: any failure here must never block the WhatsApp booking.
export function sendToCareDesk(formData) {
  if (!caredeskEnabled()) return;
  try {
    const body = JSON.stringify({
      name: text(formData.name),
      phone: text(formData.phone),
      age: text(formData.age),
      gender: text(formData.gender),
      service: text(formData.service),
      date: text(formData.date),
      slot: text(formData.slot),
      notes: [text(formData.doctorName) && `Doctor: ${text(formData.doctorName)}`, text(formData.notes)].filter(Boolean).join(' · '),
    });
    fetch(apiUrl('/requests'), {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore: sync is optional
  }
}

const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 0 });
export const formatPaise = (paise) => rupees.format(paise / 100);

const timeFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
/** IST label in the site's slot format, e.g. "09:30 AM". */
export const slotLabel = (iso) => timeFmt.format(new Date(iso)).replace(/\s/g, ' ');

const dayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
export const dayLabel = (iso) => dayFmt.format(new Date(iso));
