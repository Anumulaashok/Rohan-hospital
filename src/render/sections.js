import { TREATMENT_GROUPS } from '../data/services.js';
import { TARIFF_TABS, TARIFF_FOOTNOTES } from '../data/tariffs.js';
import { REVIEWS } from '../data/reviews.js';
import { SPECIALISTS } from '../data/doctors.js';
import { DOCTOR } from '../data/doctor.js';
import { FAQS } from '../data/faqs.js';
import { INSIGHTS } from '../data/insights.js';
import { GOOGLE_REVIEWS } from '../config/hospital.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const initials = (name) => name.replace(/^Dr\.\s*/, '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const CHEVRON = '<svg class="mt-1 h-5 w-5 shrink-0 text-maroon transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>';
const TREATMENT_ICONS = ['🧬', '🩺', '🤱', '🔬'];

function treatments() {
  return TREATMENT_GROUPS.map(
    (group, i) => `
      <details class="treatment group rounded-2xl border border-rose-line bg-white shadow-card"${i === 0 ? ' open' : ''}>
        <summary class="flex cursor-pointer list-none items-start gap-4 p-5 sm:p-6">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-rose-tint text-2xl" aria-hidden="true">${TREATMENT_ICONS[i]}</span>
          <span class="flex-1">
            <span class="block font-display text-lg font-semibold text-slate-900">${esc(group.title)}</span>
            <span class="mt-1 block text-sm text-slate-600">${esc(group.summary)}</span>
          </span>
          ${CHEVRON}
        </summary>
        <ul class="grid gap-2 px-5 pb-6 sm:grid-cols-2 sm:px-6">
          ${group.items.map((item) => `<li class="flex items-start gap-2 text-sm text-slate-700"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon"></span>${esc(item)}</li>`).join('')}
        </ul>
      </details>`,
  ).join('');
}

function tariffs() {
  const tabs = TARIFF_TABS.map(
    (tab, i) => `<button type="button" role="tab" id="tab-${tab.id}" class="tab-btn" aria-selected="${i === 0}" aria-controls="panel-${tab.id}" tabindex="${i === 0 ? 0 : -1}" data-tab="${tab.id}">${esc(tab.label)}</button>`,
  ).join('');
  const panels = TARIFF_TABS.map((tab, i) => {
    const rows = tab.rows
      .map(([item, price]) => `<tr class="border-b border-rose-line last:border-0"><td class="py-2.5 pr-4 text-slate-700">${esc(item)}</td><td class="whitespace-nowrap py-2.5 text-right font-semibold text-maroon">${esc(price)}</td></tr>`)
      .join('');
    const cols = tab.rows.length > 12 ? 'md:columns-2 md:gap-10' : '';
    return `
      <div id="panel-${tab.id}" role="tabpanel" aria-labelledby="tab-${tab.id}" class="mt-4" tabindex="0"${i === 0 ? '' : ' hidden'}>
        <h3 class="sr-only">${esc(tab.label)} charges</h3>
        ${tab.note ? `<p class="mb-2 text-sm text-slate-500">${esc(tab.note)}</p>` : ''}
        <div class="${cols}"><table class="w-full text-sm sm:text-base"><tbody>${rows}</tbody></table></div>
      </div>`;
  }).join('');
  const notes = TARIFF_FOOTNOTES.map((n) => `<li>${esc(n)}</li>`).join('');
  return `
    <div id="tariff-tablist" role="tablist" aria-label="Tariff categories" class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">${tabs}</div>
    ${panels}
    <ul class="mt-6 list-disc space-y-1 border-t border-rose-line pl-5 pt-4 text-xs text-slate-500">${notes}</ul>`;
}

function reviews() {
  return REVIEWS.map(
    (r) => `
      <figure class="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-rose-line">
        <p class="text-amber-500" aria-label="Rated 5 out of 5">★★★★★</p>
        <blockquote class="mt-3 flex-1 text-sm leading-relaxed text-slate-700">“${esc(r.text)}”</blockquote>
        <figcaption class="mt-5 flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-full bg-rose-tint text-sm font-semibold text-maroon" aria-hidden="true">${initials(r.name)}</span>
          <span class="text-sm font-semibold text-slate-900">${esc(r.name)}</span>
        </figcaption>
      </figure>`,
  ).join('');
}

function team() {
  return SPECIALISTS.map(
    (d) => `
      <li class="flex items-start gap-3 rounded-2xl border border-rose-line bg-white p-4">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-maroon text-sm font-semibold text-white" aria-hidden="true">${initials(d.name)}</span>
        <span>
          <span class="block font-semibold text-slate-900">${esc(d.name)} <span class="font-normal text-slate-500">· ${esc(d.degree)}</span></span>
          <span class="block text-sm text-slate-600">${esc(d.role)}</span>
          ${d.note ? `<span class="mt-0.5 block text-xs text-slate-500">${esc(d.note)}</span>` : ''}
        </span>
      </li>`,
  ).join('');
}

function education() {
  return DOCTOR.education.map(
    (e) => `
      <li class="relative">
        <span class="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-maroon ring-4 ring-white" aria-hidden="true"></span>
        <p class="font-semibold text-slate-900">${esc(e.title)}</p>
        <p class="text-sm text-slate-600">${esc(e.detail)}</p>
      </li>`,
  ).join('');
}

function expertise() {
  return DOCTOR.expertise.map((x) => `<li class="rounded-full bg-rose-tint px-4 py-2">${esc(x)}</li>`).join('');
}

function faqs() {
  return FAQS.map(
    (f, i) => `
      <details class="group rounded-2xl border border-rose-line bg-white"${i === 0 ? ' open' : ''}>
        <summary class="flex cursor-pointer list-none items-start justify-between gap-4 p-5 font-semibold text-slate-900">
          <h3 class="font-sans text-base">${esc(f.q)}</h3>
          ${CHEVRON}
        </summary>
        <p class="px-5 pb-5 text-sm leading-relaxed text-slate-700">${esc(f.a)}</p>
      </details>`,
  ).join('');
}

function insights() {
  return INSIGHTS.map(
    (a) => `
      <article class="flex flex-col rounded-2xl border border-rose-line bg-white p-6 shadow-card">
        <div class="flex items-center gap-3">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-tint text-xl" aria-hidden="true">${a.icon}</span>
          <span class="text-xs font-semibold uppercase tracking-wide text-maroon-600">${esc(a.tag)}</span>
        </div>
        <h3 class="mt-4 text-lg font-semibold leading-snug">${esc(a.title)}</h3>
        <p class="mt-2 text-sm text-slate-600">${esc(a.summary)}</p>
        <details class="group mt-4">
          <summary class="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-maroon hover:underline">
            <span class="group-open:hidden">Read more</span><span class="hidden group-open:inline">Show less</span>
            <svg class="h-4 w-4 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
          </summary>
          <div class="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">${a.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        </details>
      </article>`,
  ).join('');
}

export const SECTIONS = {
  insights,
  treatments,
  tariffs,
  reviews,
  team,
  education,
  expertise,
  faqs,
  googleRating: () => GOOGLE_REVIEWS.rating.toFixed(1),
  googleCount: () => `${GOOGLE_REVIEWS.count} Google reviews · as of ${GOOGLE_REVIEWS.asOf}`,
  reviewWriteUrl: () => esc(GOOGLE_REVIEWS.writeUrl),
  reviewReadUrl: () => esc(GOOGLE_REVIEWS.readUrl),
};
