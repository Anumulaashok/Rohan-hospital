import { slotToMinutes } from '../data/slots.js';

export const PHONE_PATTERN = /^[6-9]\d{9}$/;

export function todayISO(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function isSlotPast(date, slot, now = new Date()) {
  if (date !== todayISO(now)) return false;
  return slotToMinutes(slot) <= now.getHours() * 60 + now.getMinutes();
}

export function validateBooking(data, now = new Date()) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Please enter the patient’s full name.';
  if (!PHONE_PATTERN.test(data.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (!data.date) errors.date = 'Please pick a preferred date.';
  else if (data.date < todayISO(now)) errors.date = 'Please pick today or a future date.';
  if (!data.slot) errors.slot = 'Please select a time slot.';
  else if (data.date && isSlotPast(data.date, data.slot, now)) errors.slot = 'This slot has already passed. Please choose a later one.';
  return errors;
}
