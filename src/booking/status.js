import { caredeskEnabled, caredeskFetch, dayLabel, formatPaise, slotLabel } from './caredesk.js';

const POLL_MS = 4000;
const MAX_POLLS = 45;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function summary(b) {
  const when = b.startsAt ? `${dayLabel(b.startsAt)}, ${slotLabel(b.startsAt)}` : b.day;
  const rows = [
    ['Doctor', b.doctor],
    ['When', when],
    ['Consultation', formatPaise(b.amounts.basePaise)],
    b.amounts.feePaise > 0 && ['Online convenience fee', formatPaise(b.amounts.feePaise)],
    b.amounts.gstPaise > 0 && ['GST on fee', formatPaise(b.amounts.gstPaise)],
    ['Total', formatPaise(b.amounts.totalPaise)],
  ].filter(Boolean);
  return `<dl class="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">${rows
    .map(([k, v]) => `<dt class="text-ink/60">${esc(k)}</dt><dd class="font-medium">${esc(v)}</dd>`)
    .join('')}</dl>`;
}

function render(el, b, token) {
  const head = (title, tone) => `<p class="text-sm font-semibold ${tone}">${esc(b.hospital)}</p><h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">${title}</h1>`;
  const terms = `<p class="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900"><span class="font-semibold">Please note:</span> ${esc(b.terms)}</p>`;

  if (b.status === 'paid') {
    el.innerHTML = `${head(`Your slot is booked, ${esc(b.patientFirstName)} ✓`, 'text-emerald-700')}
      <p class="mt-3 rounded-xl bg-emerald-50 px-4 py-3 font-medium text-emerald-800">Please reach ${b.arriveEarlyMinutes} minutes early to avoid any inconvenience.</p>
      ${summary(b)}
      <p class="mt-5 text-sm text-ink/60">${b.whatsappConfirmation ? 'A confirmation is on its way to your WhatsApp. ' : ''}Show this page or your payment receipt at the reception desk.</p>`;
    return 'done';
  }
  if (b.status === 'paid_after_release') {
    el.innerHTML = `${head('Payment received after the hold ended', 'text-amber-700')}
      <p class="mt-3 text-ink/80">Your payment came in after the slot was released. The hospital will call you to fix a new time.</p>${summary(b)}`;
    return 'done';
  }
  if (b.status === 'cancelled') {
    el.innerHTML = `${head('This booking has expired', 'text-ink/60')}
      <p class="mt-3 text-ink/80">The payment wasn't completed in time, so the slot was released. You haven't been charged for it.</p>
      <a href="/book/" class="btn-primary mt-6 w-full">Book again</a>`;
    return 'done';
  }
  if (b.status === 'claimed') {
    el.innerHTML = `${head('Payment details received', 'text-maroon')}
      <p class="mt-3 text-ink/80">We have your UPI transaction ID <span class="font-semibold">${esc(b.claimedUtr)}</span>. The hospital will confirm your slot shortly on WhatsApp.</p>${summary(b)}`;
    return 'wait';
  }
  // pending
  const deadline = b.holdUntil ? new Date(b.holdUntil).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : '';
  if (b.upi) {
    el.innerHTML = `${head('Pay to confirm your slot', 'text-maroon')}
      <p class="mt-2 text-sm text-ink/60">Your slot is held until ${esc(deadline)}.</p>
      ${summary(b)}${terms}
      <a href="${esc(b.upi.uri)}" class="btn-primary mt-6 w-full">Pay ${esc(formatPaise(b.amounts.totalPaise))} with a UPI app</a>
      <div class="mt-5 flex flex-col items-center gap-2 rounded-2xl bg-blush p-4">
        <p class="text-sm text-ink/60">Or scan with any UPI app</p>
        <div class="h-[220px] w-[220px] bg-white">${b.upi.qrSvg}</div>
        <p class="text-sm">${esc(b.upi.payee)} · ${esc(b.upi.vpa)}</p>
      </div>
      <form id="utr-form" class="mt-5 space-y-2">
        <label for="utr" class="field-label">Paid? Enter the UPI transaction ID (UTR)</label>
        <input id="utr" name="utr" class="field" autocomplete="off" required />
        <p id="utr-error" class="field-error" hidden></p>
        <button class="btn-outline w-full">I've paid</button>
      </form>`;
    el.querySelector('#utr-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = el.querySelector('#utr-error');
      try {
        await caredeskFetch(`/checkout/${encodeURIComponent(token)}/claim`, { method: 'POST', body: { utr: el.querySelector('#utr').value.trim() } });
        refresh(el, token);
      } catch (ex) {
        err.textContent = ex.message;
        err.hidden = false;
      }
    });
    return 'manual';
  }
  el.innerHTML = `${head('Waiting for your payment', 'text-maroon')}
    <p class="mt-2 text-sm text-ink/60">If you've just paid, this page updates in a few seconds. Your slot is held until ${esc(deadline)}.</p>
    ${summary(b)}${terms}
    ${b.checkoutUrl ? `<a href="${esc(b.checkoutUrl)}" class="btn-primary mt-6 w-full">Pay ${esc(formatPaise(b.amounts.totalPaise))} now</a>` : ''}`;
  return 'wait';
}

async function refresh(el, token) {
  const b = await caredeskFetch(`/checkout/${encodeURIComponent(token)}`);
  return render(el, b, token);
}

/** Shows the booking from ?booking=; polls while a gateway payment may still be settling. */
export async function initBookingStatus(el) {
  const token = new URLSearchParams(window.location.search).get('booking');
  if (!caredeskEnabled() || !token || !/^[A-Za-z0-9_-]{22,64}$/.test(token)) {
    el.innerHTML = '<p>We couldn’t find this booking. Please <a class="link" href="/book/">book again</a> or call the hospital.</p>';
    return;
  }
  for (let i = 0; i < MAX_POLLS; i++) {
    let state;
    try {
      state = await refresh(el, token);
    } catch (e) {
      el.innerHTML = `<p class="text-red-700">${esc(e.message)}</p>`;
      return;
    }
    if (state === 'done' || state === 'manual') return;
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
}
