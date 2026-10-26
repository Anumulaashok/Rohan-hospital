import { slotToMinutes } from '../data/slots.js';

export const PHONE_PATTERN = /^[6-9]\d{9}$/;

export const MESSAGES = {
  name: 'Please enter the patient’s full name.',
  phone: 'Enter a valid 10-digit mobile number.',
  date: 'Please pick a preferred date.',
  datePast: 'Please pick today or a future date.',
  slot: 'Please select a time slot.',
  slotPast: 'This slot has already passed. Please choose a later one.',
};

export function todayISO(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function isSlotPast(date, slot, now = new Date()) {
  if (date !== todayISO(now)) return false;
  return slotToMinutes(slot) <= now.getHours() * 60 + now.getMinutes();
}

export function validateBooking(data, now = new Date(), messages = MESSAGES) {
  const m = { ...MESSAGES, ...messages };
  const errors = {};
  if (!data.name.trim()) errors.name = m.name;
  if (!PHONE_PATTERN.test(data.phone)) errors.phone = m.phone;
  if (!data.date) errors.date = m.date;
  else if (data.date < todayISO(now)) errors.date = m.datePast;
  if (!data.slot) errors.slot = m.slot;
  else if (data.date && isSlotPast(data.date, data.slot, now)) errors.slot = m.slotPast;
  return errors;
}
