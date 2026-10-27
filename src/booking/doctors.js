import { caredeskEnabled, caredeskFetch, formatPaise } from './caredesk.js';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Monday-first so Mon–Sat runs group together
const ORDER = [1, 2, 3, 4, 5, 6, 0];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function time12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** "Mon–Sat · 9:00 AM–2:00 PM, 3:00 PM–8:00 PM" lines from CareDesk's weekly slot templates. */
export function summariseTimings(timings) {
  const byDay = new Map();
  for (const t of timings) byDay.set(t.weekday, [...(byDay.get(t.weekday) ?? []), `${time12(t.from)}–${time12(t.to)}`]);
  const lines = [];
  let run = null;
  for (const day of ORDER) {
    const hours = byDay.get(day)?.join(', ');
    if (hours && run && run.hours === hours) run.to = day;
    else {
      if (run) lines.push(run);
      run = hours ? { from: day, to: day, hours } : null;
    }
  }
  if (run) lines.push(run);
  return lines.map((r) => `${DAYS[r.from]}${r.to !== r.from ? `–${DAYS[r.to]}` : ''} · ${r.hours}`);
}

const initials = (name) =>
  name
    .replace(/^Dr\.\s*/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

function card(d) {
  const photo = d.photoUrl
    ? `<img src="${esc(d.photoUrl)}" alt="${esc(d.name)}" loading="lazy" class="h-16 w-16 shrink-0 rounded-full object-cover" />`
    : `<span class="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-maroon text-lg font-semibold text-white" aria-hidden="true">${esc(initials(d.name))}</span>`;
  const timings = summariseTimings(d.timings);
  return `
    <li class="flex flex-col rounded-2xl border border-blush-line p-5">
      <div class="flex items-start gap-4">
        ${photo}
        <div>
          <p class="font-semibold text-ink">${esc(d.name)}${d.qualifications ? `, <span class="font-normal">${esc(d.qualifications)}</span>` : ''}</p>
          ${d.specialty ? `<p class="text-[15px] text-maroon">${esc(d.specialty)}</p>` : ''}
          ${d.languages ? `<p class="text-sm text-ink/60">Speaks ${esc(d.languages)}</p>` : ''}
        </div>
      </div>
      ${d.bio ? `<p class="mt-4 text-[15px] text-ink/75">${esc(d.bio)}</p>` : ''}
      <div class="mt-4 text-sm text-ink/80">
        <p class="font-medium text-ink">OP timings</p>
        ${timings.length ? timings.map((t) => `<p>${esc(t)}</p>`).join('') : '<p class="text-ink/60">By appointment — please call</p>'}
        ${d.feePaise ? `<p class="mt-1 text-ink/60">Consultation from ${esc(formatPaise(d.feePaise))}</p>` : ''}
      </div>
      ${timings.length ? `<a href="/book/?doctor=${encodeURIComponent(d.id)}" class="btn-outline mt-5 self-start">Book with ${esc(d.name.replace(/^Dr\.\s*/, 'Dr. '))}</a>` : ''}
    </li>`;
}

/** Replaces the static team list with CareDesk's doctors; leaves the static list if CareDesk is off or unreachable. */
export async function initDoctorsFromCareDesk(list, heading) {
  if (!list || !caredeskEnabled()) return;
  try {
    const { doctors } = await caredeskFetch('/doctors');
    if (!doctors?.length) return;
    list.innerHTML = doctors.map(card).join('');
    list.className = 'mt-8 grid gap-4 sm:grid-cols-2';
    if (heading) heading.textContent = 'Book with our doctors';
  } catch {
    // keep the static list
  }
}
