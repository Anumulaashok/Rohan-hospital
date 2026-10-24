import { BOOKING_SERVICES } from '../data/services.js';
import { SLOT_GROUPS } from '../data/slots.js';
import { createStore } from './state.js';
import { buildMessage } from './message.js';
import { isSlotPast, todayISO, validateBooking } from './validate.js';
import { handleAppointmentSubmission } from './submit.js';

const FIELD_ORDER = ['name', 'phone', 'service', 'date', 'slot'];

function renderServiceChips(container) {
  container.innerHTML = BOOKING_SERVICES.map(
    (service, i) => `
      <label class="chip">
        <input type="radio" name="service" value="${service}" class="sr-only peer" id="service-${i}" />
        <span class="chip-face">${service}</span>
      </label>`,
  ).join('');
}

function renderSlotGrid(container) {
  container.innerHTML = SLOT_GROUPS.map(
    (group) => `
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">${group.label}</p>
        <div class="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
          ${group.slots.map((slot) => `<button type="button" class="slot-pill" data-slot="${slot}" aria-pressed="false">${slot}</button>`).join('')}
        </div>
      </div>`,
  ).join('');
}

function renderPreview(container, message) {
  container.replaceChildren(
    ...message.split('\n').map((line) => {
      const row = document.createElement('div');
      row.textContent = line || '\u00a0';
      // Clip divider rows instead of letting them wrap on narrow screens.
      if (line.startsWith('━')) row.className = 'overflow-hidden whitespace-nowrap';
      return row;
    }),
  );
}

function showErrors(form, errors) {
  FIELD_ORDER.forEach((field) => {
    const el = form.querySelector(`[data-error="${field}"]`);
    if (!el) return;
    el.textContent = errors[field] || '';
    el.hidden = !errors[field];
  });
  form.querySelectorAll('[data-field]').forEach((input) => {
    input.setAttribute('aria-invalid', errors[input.dataset.field] ? 'true' : 'false');
  });
}

export function initBookingForm(form) {
  if (!form) return;
  const store = createStore();
  const preview = document.getElementById('wa-preview');
  const dateInput = form.querySelector('#booking-date');
  const slotGrid = form.querySelector('#slot-grid');

  renderServiceChips(form.querySelector('#service-chips'));
  renderSlotGrid(slotGrid);
  dateInput.min = todayISO();

  let showLiveErrors = false;

  form.addEventListener('input', (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      let digits = value.replace(/\D/g, '');
      // Accept pasted numbers with a +91 or leading-0 prefix.
      if (digits.length > 10) digits = digits.replace(/^(91|0)/, '');
      digits = digits.slice(0, 10);
      e.target.value = digits;
      store.set({ phone: digits });
      return;
    }
    if (name in store.get()) store.set({ [name]: value });
  });

  form.addEventListener('change', (e) => {
    const { name, value } = e.target;
    if (name in store.get()) store.set({ [name]: value });
  });

  slotGrid.addEventListener('click', (e) => {
    const pill = e.target.closest('.slot-pill');
    if (!pill || pill.disabled) return;
    const slot = pill.dataset.slot;
    store.set({ slot: store.get().slot === slot ? '' : slot });
  });

  store.subscribe((state) => {
    slotGrid.querySelectorAll('.slot-pill').forEach((pill) => {
      const past = state.date ? isSlotPast(state.date, pill.dataset.slot) : false;
      pill.disabled = past;
      pill.setAttribute('aria-pressed', String(pill.dataset.slot === state.slot));
      pill.title = past ? 'This time has already passed today' : '';
    });
    if (state.slot && state.date && isSlotPast(state.date, state.slot)) {
      store.set({ slot: '' });
      return;
    }
    renderPreview(preview, buildMessage(state));
    // Re-validate live only after a failed submit, so errors clear as the user fixes them.
    if (showLiveErrors) showErrors(form, validateBooking(state));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { ok, errors } = await handleAppointmentSubmission(store.get());
    showLiveErrors = !ok;
    showErrors(form, errors);
    if (!ok) {
      const first = FIELD_ORDER.find((f) => errors[f]);
      form.querySelector(`[data-field="${first}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.querySelector(`[data-field="${first}"]`)?.focus({ preventScroll: true });
    }
  });
}
