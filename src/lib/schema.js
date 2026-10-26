import { HOSPITAL, GEO, GOOGLE_MAPS_URL, EMAIL, SOCIAL } from '../config/hospital.js';
import { DOCTOR } from '../data/doctor.js';
import { TREATMENT_GROUPS } from '../data/services.js';
import { SPECIALISTS } from '../data/doctors.js';

const address = {
  '@type': 'PostalAddress',
  streetAddress: '3-6-397, Choppadandi Rd, Near Subhash Statue, Subhash Nagar',
  addressLocality: 'Karimnagar',
  addressRegion: 'Telangana',
  postalCode: '505001',
  addressCountry: 'IN',
};

function hospitalNode(site, images) {
  return {
    '@type': ['MedicalClinic', 'Hospital'],
    '@id': `${site}#hospital`,
    name: HOSPITAL.name,
    alternateName: ['Rohan Hospital', 'Rohan Fertility Centre', 'Rohan Fertility (IVF) Centre Karimnagar'],
    description:
      'Fertility (IVF) centre and women’s hospital in Karimnagar, Telangana, led by Dr. Anamalla Sridevi Naresh. Offers IVF, ICSI, IUI, painless delivery, high-risk pregnancy care, laparoscopy, hysteroscopy and in-house scans and lab.',
    url: site,
    image: images.hospital,
    logo: images.logo,
    telephone: HOSPITAL.phones.map((p) => p.tel),
    email: EMAIL,
    address,
    geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng },
    hasMap: GOOGLE_MAPS_URL,
    openingHours: 'Mo-Su 00:00-23:59',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    medicalSpecialty: ['Obstetric', 'Gynecologic', 'Urologic', 'Pediatric', 'Radiography', 'Anesthesia'],
    availableService: TREATMENT_GROUPS.flatMap((g) => g.items).map((name) => ({ '@type': 'MedicalProcedure', name })),
    sameAs: [GOOGLE_MAPS_URL, ...SOCIAL.map((s) => s.url)],
    employee: [{ '@id': `${site}#dr-sridevi-naresh` }, ...SPECIALISTS.map((d) => ({ '@type': 'Person', name: d.name, jobTitle: d.role, honorificSuffix: d.degree }))],
  };
}

function doctorNode(site, images) {
  return {
    '@type': 'Person',
    '@id': `${site}#dr-sridevi-naresh`,
    name: DOCTOR.name,
    alternateName: DOCTOR.alternateNames,
    honorificPrefix: 'Dr.',
    honorificSuffix: DOCTOR.qualifications.join(', '),
    jobTitle: DOCTOR.jobTitle,
    description:
      'Dr. Anamalla Sridevi Naresh is a fertility (IVF) specialist, gynaecologist and obstetrician in Karimnagar, Telangana, and Clinical Director of Rohan Hospital & Rohan Fertility (IVF) Centre. She holds an MBBS, a DGO and a Master of Reproductive Medicine from Homerton University, London, with accredited hands-on IVF training at Cleveland Clinic, USA.',
    url: `${site}doctors/`,
    image: images.doctor,
    gender: 'Female',
    worksFor: { '@id': `${site}#hospital` },
    workLocation: { '@id': `${site}#hospital` },
    alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Homerton University, London' }],
    hasCredential: DOCTOR.education.map((e) => ({
      '@type': 'EducationalOccupationalCredential',
      name: e.title,
      description: e.detail,
      credentialCategory: e.title.includes('training') ? 'certificate' : 'degree',
    })),
    knowsAbout: DOCTOR.expertise,
  };
}

// Rating/review markup is intentionally omitted: Google treats self-served LocalBusiness reviews as ineligible.
export function buildSchema({ site, images, faqs = null, lang = 'en', extra = [] }) {
  const graph = [hospitalNode(site, images), doctorNode(site, images), ...extra];
  if (faqs) {
    graph.push({
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  // Escape "<" so JSON content cannot close the script tag.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}
