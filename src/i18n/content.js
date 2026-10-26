import { BOOKING_SERVICES, TREATMENT_GROUPS } from '../data/services.js';
import { FACILITIES } from '../data/facilities.js';
import { CLINICS } from '../data/clinics.js';
import { DOCTOR } from '../data/doctor.js';
import { SPECIALISTS } from '../data/doctors.js';
import { TARIFF_TABS, TARIFF_FOOTNOTES } from '../data/tariffs.js';
import { FAQS } from '../data/faqs.js';
import { INSIGHTS } from '../data/insights.js';
import { FAMILY_PHOTOS, HOSPITAL_PHOTOS } from '../data/gallery.js';
import * as TE from '../data/te/content.js';

// Fail the build instead of silently showing English on a Telugu page.
function need(map, key, what) {
  if (!(key in map)) throw new Error(`Missing Telugu ${what}: "${key}"`);
  return map[key];
}
function aligned(en, te, what) {
  if (en.length !== te.length) throw new Error(`Telugu ${what} has ${te.length} entries, English has ${en.length}`);
  return te;
}
const isCode = (s) => /^[A-Z0-9 /&-]+$/.test(s);

function teContent() {
  const services = aligned(BOOKING_SERVICES, TE.TE_BOOKING_SERVICES, 'booking services');
  const famAlts = aligned(FAMILY_PHOTOS, TE.TE_FAMILY_ALTS, 'family photo alts');
  const hospAlts = aligned(HOSPITAL_PHOTOS, TE.TE_HOSPITAL_ALTS, 'hospital photo alts');
  return {
    bookingServices: BOOKING_SERVICES.map((value, i) => ({ value, label: services[i] })),
    treatmentGroups: TREATMENT_GROUPS.map((g) => {
      const t = need(TE.TE_TREATMENT_GROUPS, g.title, 'treatment group');
      return { ...g, title: t.title, summary: t.summary, items: aligned(g.items, t.items, `items for ${g.title}`) };
    }),
    facilities: FACILITIES.map((f) => ({ ...f, ...need(TE.TE_FACILITIES, f.icon, 'facility') })),
    clinics: aligned(CLINICS, TE.TE_CLINICS, 'clinics'),
    doctor: {
      ...DOCTOR,
      displayName: TE.TE_DOCTOR.name,
      role: TE.TE_DOCTOR.role,
      qualifications: aligned(DOCTOR.qualifications, TE.TE_DOCTOR.qualifications, 'qualifications'),
      education: aligned(DOCTOR.education, TE.TE_DOCTOR.education, 'education'),
      expertise: aligned(DOCTOR.expertise, TE.TE_DOCTOR.expertise, 'expertise'),
    },
    specialists: SPECIALISTS.map((d) => ({ ...d, ...need(TE.TE_SPECIALISTS, d.name, 'specialist') })),
    tariffTabs: TARIFF_TABS.map((tab) => {
      const t = need(TE.TE_TARIFF_TABS, tab.id, 'tariff tab');
      return {
        ...tab,
        label: t.label,
        note: tab.note ? t.note : undefined,
        rows: tab.rows.map(([item, price]) => [
          isCode(item) && !(item in TE.TE_TARIFF_ITEMS) ? item : need(TE.TE_TARIFF_ITEMS, item, 'tariff item'),
          TE.TE_PRICE_WORDS.reduce((p, [en, te]) => p.replace(en, te), price),
        ]),
      };
    }),
    tariffFootnotes: aligned(TARIFF_FOOTNOTES, TE.TE_TARIFF_FOOTNOTES, 'tariff footnotes'),
    faqs: aligned(FAQS, TE.TE_FAQS, 'FAQs'),
    insights: INSIGHTS.map((a) => ({ ...a, ...need(TE.TE_INSIGHTS, a.slug, 'insight') })),
    familyPhotos: FAMILY_PHOTOS.map((p, i) => ({ ...p, alt: famAlts[i] })),
    hospitalPhotos: HOSPITAL_PHOTOS.map((p, i) => ({ ...p, alt: hospAlts[i] })),
  };
}

const EN = {
  bookingServices: BOOKING_SERVICES.map((value) => ({ value, label: value })),
  treatmentGroups: TREATMENT_GROUPS,
  facilities: FACILITIES,
  clinics: CLINICS,
  doctor: { ...DOCTOR, displayName: DOCTOR.name, role: 'Clinical Director, fertility (IVF) specialist, gynaecologist and obstetrician' },
  specialists: SPECIALISTS,
  tariffTabs: TARIFF_TABS,
  tariffFootnotes: TARIFF_FOOTNOTES,
  faqs: FAQS,
  insights: INSIGHTS,
  familyPhotos: FAMILY_PHOTOS,
  hospitalPhotos: HOSPITAL_PHOTOS,
};

let teCache;
export function getContent(lang) {
  if (lang !== 'te') return EN;
  return (teCache ??= teContent());
}
