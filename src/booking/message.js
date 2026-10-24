import { HOSPITAL } from '../config/hospital.js';

const DIVIDER = '━━━━━━━━━━━━━━━━━━━━━━';
const BLANK = '—';

export function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function buildMessage(data) {
  const phone = data.phone ? `+91 ${data.phone}` : BLANK;
  const extras = [data.age && `${data.age} yrs`, data.gender].filter(Boolean).join(', ');
  const lines = [
    '🏥 *NEW APPOINTMENT REQUEST - ROHAN HOSPITAL*',
    DIVIDER,
    `👤 *Patient Name:* ${data.name.trim() || BLANK}`,
    `📞 *Phone:* ${phone}`,
  ];
  if (extras) lines.push(`🧾 *Age / Gender:* ${extras}`);
  lines.push(
    `🩺 *Department/Service:* ${data.service || 'Not specified'}`,
    `📅 *Preferred Date:* ${formatDate(data.date) || BLANK}`,
    `⏰ *Preferred Time Slot:* ${data.slot || BLANK}`,
    `📝 *Symptoms / Notes:* ${data.notes.trim() || 'None'}`,
    DIVIDER,
    '_Sent via Rohan Hospital Online Portal_',
  );
  return lines.join('\n');
}

export function buildWhatsAppUrl(message, number = HOSPITAL.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
