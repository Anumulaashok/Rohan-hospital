import { TARIFF_TABS, TARIFF_FOOTNOTES } from '../data/tariffs.js';

function renderPanel(tab) {
  const rows = tab.rows
    .map(([item, price]) => `<tr class="border-b border-rose-line last:border-0"><td class="py-2.5 pr-4 text-slate-700">${item}</td><td class="py-2.5 text-right font-semibold text-maroon whitespace-nowrap">${price}</td></tr>`)
    .join('');
  const cols = tab.rows.length > 12 ? 'md:columns-2 md:gap-10' : '';
  return `
    ${tab.note ? `<p class="mb-2 text-sm text-slate-500">${tab.note}</p>` : ''}
    <div class="${cols}">
      <table class="w-full text-sm sm:text-base"><tbody>${rows}</tbody></table>
    </div>`;
}

export function initTariffTabs() {
  const list = document.getElementById('tariff-tablist');
  const panel = document.getElementById('tariff-panel');
  const notes = document.getElementById('tariff-notes');
  if (!list || !panel) return;

  list.innerHTML = TARIFF_TABS.map(
    (tab, i) => `<button type="button" role="tab" id="tab-${tab.id}" class="tab-btn" aria-selected="${i === 0}" aria-controls="tariff-panel" tabindex="${i === 0 ? 0 : -1}" data-tab="${tab.id}">${tab.label}</button>`,
  ).join('');
  notes.innerHTML = TARIFF_FOOTNOTES.map((n) => `<li>${n}</li>`).join('');

  const select = (id, focus = false) => {
    const tab = TARIFF_TABS.find((t) => t.id === id);
    list.querySelectorAll('[role="tab"]').forEach((btn) => {
      const active = btn.dataset.tab === id;
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
      if (active && focus) btn.focus();
    });
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.innerHTML = renderPanel(tab);
  };

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[role="tab"]');
    if (btn) select(btn.dataset.tab);
  });
  list.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const ids = TARIFF_TABS.map((t) => t.id);
    const current = ids.indexOf(list.querySelector('[aria-selected="true"]').dataset.tab);
    const next = (current + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length;
    select(ids[next], true);
  });

  select(TARIFF_TABS[0].id);
}
