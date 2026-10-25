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
| `src/data/` | Doctor profile, team, FAQs, reviews, services, time slots, tariffs |
| `src/render/` | Build-time HTML + JSON-LD renderers, injected via `<!--@name-->` markers by `vite.config.js` |
| `src/booking/` | Scheduler: store, message builder, validation, form binding, submit handler |
| `src/ui/` | Nav, tariff tabs, image lightbox |
| `public/` | Optimised photos, `robots.txt`, `llms.txt` (AI-crawler summary) |

Data-driven sections are pre-rendered into the HTML at build time so search engines and AI crawlers see the full content without running JS. Restart `npm run dev` after editing `src/data/` or `src/render/`.

## Updating content
- **Phone / WhatsApp number:** `src/config/hospital.js`. The hard-coded `tel:`/`wa.me` links in `index.html` also need updating.
- **Prices:** `src/data/tariffs.js`
- **Doctor bio / FAQs / reviews / fertility insights:** `src/data/doctor.js`, `src/data/faqs.js`, `src/data/reviews.js`, `src/data/insights.js`. Keep `public/llms.txt` in sync.
- **Google rating:** `GOOGLE_REVIEWS` in `src/config/hospital.js` (update the rating/count periodically).
- **Time slots:** `src/data/slots.js`

## Next phase: payments & slot locking
`handleAppointmentSubmission()` in `src/booking/submit.js` is async and has commented hooks for:
1. `createPaymentOrder()` + `openRazorpayModal()` (Razorpay/Stripe checkout)
2. `lockCalendarSlot()` (Google Calendar or a DB-backed slot lock)
3. `sendConfirmationWhatsApp()` (WhatsApp Business API / Twilio)

These need a backend (e.g. serverless functions) to keep API secrets off the client.
