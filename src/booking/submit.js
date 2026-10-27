import { sendToCareDesk } from './caredesk.js';
import { buildMessage, buildWhatsAppUrl } from './message.js';
import { validateBooking } from './validate.js';

export function redirectToWhatsApp(formData) {
  const url = buildWhatsAppUrl(buildMessage(formData));
  const win = window.open(url, '_blank', 'noopener');
  // Popup blockers return null; fall back to same-tab navigation.
  if (!win) window.location.href = url;
}

export async function handleAppointmentSubmission(formData) {
  const errors = validateBooking(formData);
  if (Object.keys(errors).length) return { ok: false, errors };

  // Phase 1: immediate WhatsApp dispatch, then a best-effort copy to CareDesk.
  redirectToWhatsApp(formData);
  sendToCareDesk(formData);

  // Phase 2 hooks (payments + slot locking), enable once a backend exists:
  // const order = await createPaymentOrder(formData.service, formData.serviceFee);
  // openRazorpayModal(order, async (paymentResponse) => {
  //   await lockCalendarSlot(formData.date, formData.slot);
  //   await sendConfirmationWhatsApp(formData, paymentResponse.razorpay_payment_id);
  // });

  return { ok: true, errors: {} };
}
