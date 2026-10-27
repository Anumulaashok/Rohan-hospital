import { caredeskEnabled, caredeskFetch, formatPaise, slotLabel } from './caredesk.js';
import { slotToMinutes } from '../data/slots.js';

const AFTERNOON_FROM = 14 * 60;

function renderLiveSlots(grid, slots) {
  if (slots.length === 0) {
    grid.innerHTML = '<p class="rounded-xl bg-blush px-4 py-3 text-sm text-ink/70">No free slots on this day. Please pick another date or doctor.</p>';
    return;
  }
  const groups = [
    { label: 'Morning', items: slots.filter((s) => slotToMinutes(s.label) < AFTERNOON_FROM) },
    { label: 'Afternoon & evening', items: slots.filter((s) => slotToMinutes(s.label) >= AFTERNOON_FROM) },
  ].filter((g) => g.items.length);
  grid.innerHTML = groups
    .map(
      (g) => `
      <div>
        <p class="mb-2 text-sm font-medium text-ink/60">${g.label}</p>
        <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
          ${g.items.map((s) => `<button type="button" class="slot-pill" data-slot="${s.label}" aria-pressed="false">${s.label}</button>`).join('')}
        </div>
      </div>`,
    )
    .join('');
}

/**
 * Switches the form to CareDesk-driven booking: real doctors and free slots, and payment online to confirm.
 * Any failure leaves the original WhatsApp form working as before.
 */
export async function initOnlineBooking(form, store, { showErrors, validateBooking }) {
  if (!caredeskEnabled()) return;
  let info;
  try {
    info = await caredeskFetch('/slots');
  } catch {
    return;
  }
  if (!info?.doctors?.length) return;

  const doctorField = form.querySelector('#doctor-field');
  const doctorSelect = form.querySelector('#booking-doctor');
  const grid = form.querySelector('#slot-grid');
  const payBlock = form.querySelector('#pay-online-block');
  const payButton = form.querySelector('#pay-online');
  const payLabel = form.querySelector('#pay-online-label');
  const payError = form.querySelector('#pay-online-error');
  const waLabel = form.querySelector('#booking-submit-label');
  const waHint = form.querySelector('#booking-submit-hint');

  doctorSelect.innerHTML =
    '<option value="">Choose a doctor</option>' +
    info.doctors.map((d) => `<option value="${d.id}">${d.name}${d.specialty ? ` — ${d.specialty}` : ''}</option>`).join('');
  doctorField.hidden = false;
  if (info.doctors.length === 1) {
    doctorSelect.value = info.doctors[0].id;
    store.set({ doctor: info.doctors[0].id, doctorName: info.doctors[0].name });
  }
  doctorSelect.addEventListener('change', () => {
    const d = info.doctors.find((x) => x.id === doctorSelect.value);
    store.set({ doctor: d?.id ?? '', doctorName: d?.name ?? '', slot: '' });
  });

  if (info.onlinePayment) {
    form.querySelector('#online-terms-text').textContent = info.terms;
    form.querySelector('#online-hold-text').textContent = `Your slot is held for ${info.holdMinutes} minutes while you pay.`;
    payBlock.hidden = false;
    waLabel.textContent = 'Pay at hospital — send request on WhatsApp';
    waHint.textContent = 'The front desk confirms your visit on WhatsApp. Pay at the hospital.';
    form.querySelector('#booking-submit').classList.replace('btn-wa', 'btn-outline');
  }
  form.querySelector('#accept-terms').addEventListener('change', (e) => store.set({ acceptTerms: e.target.checked }));

  // live slots per doctor and date; the label → instant map is what the checkout sends
  let live = new Map();
  let loadedFor = '';
  async function loadSlots({ doctor, date }) {
    const key = `${doctor}|${date}`;
    if (key === loadedFor) return;
    loadedFor = key;
    live = new Map();
    if (!doctor || !date) {
      grid.innerHTML = '<p class="rounded-xl bg-blush px-4 py-3 text-sm text-ink/70">Choose a doctor and date to see free times.</p>';
      return;
    }
    grid.innerHTML = '<p class="px-1 py-3 text-sm text-ink/60">Checking free times…</p>';
    try {
      const data = await caredeskFetch(`/slots?doctor=${encodeURIComponent(doctor)}&date=${encodeURIComponent(date)}`);
      if (loadedFor !== key) return;
      const slots = data.slots.map((s) => ({ ...s, label: slotLabel(s.startsAt) }));
      live = new Map(slots.map((s) => [s.label, s]));
      renderLiveSlots(grid, slots);
      if (!live.has(store.get().slot)) store.set({ slot: '' });
      else store.set({});
    } catch (e) {
      if (loadedFor !== key) return;
      loadedFor = '';
      grid.innerHTML = `<p class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">${e.message}</p>`;
    }
  }

  const onlineErrors = (state) => {
    const errors = validateBooking(state);
    if (!state.doctor) errors.doctor = 'Please choose a doctor.';
    if (state.slot && !live.has(state.slot)) errors.slot = 'Please pick one of the free times shown.';
    if (!state.acceptTerms) errors.acceptTerms = 'Please accept the payment terms to continue.';
    return errors;
  };
  // after a failed attempt, errors clear as the patient fixes them
  let showLive = false;

  store.subscribe((state) => {
    loadSlots(state);
    if (showLive) showErrors(form, onlineErrors(state));
    const chosen = live.get(state.slot);
    payLabel.textContent = chosen ? `Pay ${formatPaise(chosen.payOnlinePaise)} online to confirm` : 'Pay online to confirm';
  });

  payButton.addEventListener('click', async () => {
    const state = store.get();
    const errors = onlineErrors(state);
    showLive = Object.keys(errors).length > 0;
    showErrors(form, errors);
    payError.hidden = true;
    if (Object.keys(errors).length) {
      form.querySelector(`[data-field="${Object.keys(errors)[0]}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    payButton.disabled = true;
    payLabel.textContent = 'Holding your slot…';
    try {
      const res = await caredeskFetch('/checkout', {
        method: 'POST',
        body: {
          name: state.name.trim(),
          phone: state.phone,
          age: state.age,
          gender: state.gender,
          service: state.service,
          notes: state.notes.trim(),
          practitionerId: state.doctor,
          startsAt: live.get(state.slot).startsAt,
          acceptTerms: true,
          returnUrl: `${window.location.origin}/booking-status/`,
        },
      });
      window.location.href = res.checkoutUrl || `/booking-status/?booking=${encodeURIComponent(res.booking)}`;
    } catch (e) {
      payError.textContent = e.message;
      payError.hidden = false;
      payButton.disabled = false;
      loadedFor = '';
      loadSlots(store.get());
    }
  });
}
