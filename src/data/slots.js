export const SLOT_GROUPS = [
  { id: 'morning', label: 'Morning', slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'] },
  { id: 'evening', label: 'Evening', slots: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'] },
];

export function slotToMinutes(slot) {
  const [, h, m, period] = slot.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  const hours = (Number(h) % 12) + (period === 'PM' ? 12 : 0);
  return hours * 60 + Number(m);
}
