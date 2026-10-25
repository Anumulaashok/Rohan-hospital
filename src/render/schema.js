import { HOSPITAL, GEO, GOOGLE_MAPS_URL, OFFICIAL_SITE_URL } from '../config/hospital.js';
import { DOCTOR } from '../data/doctor.js';
import { FAQS } from '../data/faqs.js';
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

// Rating/review markup is intentionally omitted: Google treats self-served LocalBusiness reviews as ineligible.
export function buildSchema() {
  const graph = [
    {
      '@type': ['MedicalClinic', 'Hospital'],
      '@id': '#hospital',
      name: HOSPITAL.name,
      alternateName: ['Rohan Hospital', 'Rohan Fertility Centre', 'Rohan Fertility (IVF) Centre Karimnagar'],
      description:
        'Fertility (IVF) centre and women’s hospital in Karimnagar, Telangana, led by Dr. Anamalla Sridevi Naresh. Offers IVF, ICSI, IUI, painless delivery, high-risk pregnancy care, laparoscopy, hysteroscopy and in-house scans and lab.',
      image: '/images/hero-banner.jpg',
      telephone: HOSPITAL.phones.map((p) => p.tel),
      email: 'info@rohanhospitalknr.in',
      address,
      geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng },
      hasMap: GOOGLE_MAPS_URL,
      openingHours: 'Mo-Su 00:00-23:59',
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      medicalSpecialty: ['Obstetric', 'Gynecologic', 'Urologic', 'Pediatric', 'Radiography', 'Anesthesia'],
      availableService: TREATMENT_GROUPS.flatMap((g) => g.items).map((name) => ({ '@type': 'MedicalProcedure', name })),
      sameAs: [OFFICIAL_SITE_URL, GOOGLE_MAPS_URL],
      employee: [{ '@id': '#dr-sridevi-naresh' }, ...SPECIALISTS.map((d) => ({ '@type': 'Person', name: d.name, jobTitle: d.role, honorificSuffix: d.degree }))],
    },
    {
      '@type': 'Person',
      '@id': '#dr-sridevi-naresh',
      name: DOCTOR.name,
      alternateName: DOCTOR.alternateNames,
      honorificPrefix: 'Dr.',
      honorificSuffix: DOCTOR.qualifications.join(', '),
      jobTitle: DOCTOR.jobTitle,
      description:
        'Dr. Anamalla Sridevi Naresh is a fertility (IVF) specialist, gynaecologist and obstetrician in Karimnagar, Telangana, and Clinical Director of Rohan Hospital & Rohan Fertility (IVF) Centre. She holds an MBBS, a DGO and a Master of Reproductive Medicine from Homerton University, London, with accredited hands-on IVF training at Cleveland Clinic, USA.',
      image: '/images/doctor-profile.jpg',
      gender: 'Female',
      worksFor: { '@id': '#hospital' },
      workLocation: { '@id': '#hospital' },
      alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Homerton University, London' }],
      hasCredential: DOCTOR.education.map((e) => ({
        '@type': 'EducationalOccupationalCredential',
        name: e.title,
        description: e.detail,
        credentialCategory: e.title.includes('training') ? 'certificate' : 'degree',
      })),
      knowsAbout: DOCTOR.expertise,
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Fertility (IVF) Specialist, Obstetrician & Gynaecologist',
        occupationLocation: { '@type': 'City', name: 'Karimnagar, Telangana, India' },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
  // Escape "<" so JSON content cannot close the script tag.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2).replace(/</g, '\\u003c');
}
