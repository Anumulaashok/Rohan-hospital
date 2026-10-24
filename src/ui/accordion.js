import { TREATMENT_GROUPS } from '../data/services.js';

const ICONS = ['🧬', '🩺', '🤱', '🔬'];

export function initTreatments() {
  const container = document.getElementById('treatments-list');
  if (!container) return;
  container.innerHTML = TREATMENT_GROUPS.map(
    (group, i) => `
      <details class="treatment group rounded-2xl border border-rose-line bg-white shadow-card" ${i === 0 ? 'open' : ''}>
        <summary class="flex cursor-pointer list-none items-start gap-4 p-5 sm:p-6">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-rose-tint text-2xl" aria-hidden="true">${ICONS[i]}</span>
          <span class="flex-1">
            <span class="block font-display text-lg font-semibold text-slate-900">${group.title}</span>
            <span class="mt-1 block text-sm text-slate-600">${group.summary}</span>
          </span>
          <svg class="mt-1 h-5 w-5 shrink-0 text-maroon transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
        </summary>
        <ul class="grid gap-2 px-5 pb-6 sm:grid-cols-2 sm:px-6">
          ${group.items.map((item) => `<li class="flex items-start gap-2 text-sm text-slate-700"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon"></span>${item}</li>`).join('')}
        </ul>
      </details>`,
  ).join('');
}
