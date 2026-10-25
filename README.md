# Rohan Hospital & Rohan Fertility (IVF) Centre

Multi-page website for Rohan Hospital, Karimnagar, with an appointment scheduler that opens a pre-filled WhatsApp booking message to `+91 97041 55550`.

## Stack
[Astro](https://astro.build) 7 (static output) + Tailwind CSS v3 (via PostCSS) + vanilla JS for the booking form, tariff tabs, nav and lightbox. Pages ship as plain HTML; only those interactive pieces load JavaScript.

Requires Node 22.23.4 or newer.

## Commands
```bash
npm install
npm run dev       # local dev server at http://localhost:4321
npm run build     # production build to dist/
npm run preview   # serve the built site
```

## Production URL
Canonical links, the sitemap and JSON-LD ids use `site` in `astro.config.mjs`, which defaults to `https://www.rohanhospitalknr.in`. Build for another domain with:
```bash
SITE_URL=https://example.com npm run build
```

## Structure
| Path | Purpose |
|---|---|
| `src/pages/` | One file per page: home, doctors, treatments, facilities, tariffs, insights (+ one page per article), gallery, book, contact, 404 |
| `src/layouts/Base.astro` | `<head>` (SEO, Open Graph, JSON-LD, fonts), header, footer, mobile action bar, lightbox |
| `src/components/` | Page sections (doctor intro, treatments, facilities, reviews, FAQ, booking form, tariffs, location…) |
| `src/config/hospital.js` | Name, address, phones, WhatsApp, email, hours, social links, map and review URLs |
| `src/data/` | Doctor profile, team, FAQs, reviews, services, clinics, facilities, gallery photos, insights, slots, tariffs |
| `src/lib/` | JSON-LD builder, nav items, icon set (Lucide + Simple Icons, inlined at build) |
| `src/booking/` | Scheduler: store, message builder, validation, form binding, submit handler |
| `src/ui/` | Nav, tariff tabs, image lightbox |
| `src/assets/images/` | Photos; Astro converts them to responsive WebP at build time |
| `public/` | `robots.txt`, `llms.txt` (AI-crawler summary), redirect pages for old `.html` URLs |

## Updating content
- **Phone / WhatsApp number:** `src/config/hospital.js`. Some `tel:`/`wa.me` links in components also use the number directly; search for `9704155550`.
- **Prices:** `src/data/tariffs.js`
- **Doctor bio / FAQs / reviews / insights / facilities:** the matching file in `src/data/`. Keep `public/llms.txt` in sync.
- **New insight article:** add an entry with a unique `slug` to `src/data/insights.js`; its page is generated automatically.
- **Photos:** drop the file in `src/assets/images/` and import it; add family photos to `src/data/gallery.js`.
- **Google rating:** `GOOGLE_REVIEWS` in `src/config/hospital.js` (update the rating/count periodically).
- **Time slots:** `src/data/slots.js`

## Next phase: payments & slot locking
`handleAppointmentSubmission()` in `src/booking/submit.js` is async and has commented hooks for:
1. `createPaymentOrder()` + `openRazorpayModal()` (Razorpay/Stripe checkout)
2. `lockCalendarSlot()` (Google Calendar or a DB-backed slot lock)
3. `sendConfirmationWhatsApp()` (WhatsApp Business API / Twilio)

These need a backend (e.g. serverless functions) to keep API secrets off the client.
