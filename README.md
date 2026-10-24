# Rohan Hospital & Rohan Fertility (IVF) Centre

Single-page website for Rohan Hospital, Karimnagar, with an appointment scheduler that opens a pre-filled WhatsApp booking message to `+91 97041 55550`.

## Stack
Vite + vanilla JS (ES modules) + Tailwind CSS v3.

## Commands
```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # serve the built site
```

## Structure
| Path | Purpose |
|---|---|
| `index.html` | All page sections |
| `src/config/hospital.js` | Name, address, phone numbers, WhatsApp number, map URLs |
| `src/data/` | Booking services, treatments, time slots, tariffs (from the hospital tariff board) |
| `src/booking/` | Scheduler: store, message builder, validation, form binding, submit handler |
| `src/ui/` | Nav, treatments accordion, tariff tabs, image lightbox |
| `public/images/` | Optimised hospital photos |

## Updating content
- **Phone / WhatsApp number:** `src/config/hospital.js`. The hard-coded `tel:`/`wa.me` links in `index.html` also need updating.
- **Prices:** `src/data/tariffs.js`
- **Time slots:** `src/data/slots.js`
- **Diet chart:** add `public/images/diet-chart.jpg` and place it at the `TODO` in the Nutrition section.

## Next phase: payments & slot locking
`handleAppointmentSubmission()` in `src/booking/submit.js` is async and has commented hooks for:
1. `createPaymentOrder()` + `openRazorpayModal()` (Razorpay/Stripe checkout)
2. `lockCalendarSlot()` (Google Calendar or a DB-backed slot lock)
3. `sendConfirmationWhatsApp()` (WhatsApp Business API / Twilio)

These need a backend (e.g. serverless functions) to keep API secrets off the client.
