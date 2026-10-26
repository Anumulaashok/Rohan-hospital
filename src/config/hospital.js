export const HOSPITAL = {
  name: 'Rohan Hospital & Rohan Fertility (IVF) Centre',
  tagline: 'Fertility & Women Health Care',
  doctor: 'Dr. Anamalla Sridevi Naresh',
  address: '3-6-397, Choppadandi Rd, Near Subhash Statue, Subhash Nagar, Karimnagar, Telangana 505001',
  phones: [
    { label: '+91 97041 55550', tel: '+919704155550' },
    { label: '+91 96766 03113', tel: '+919676603113' },
    { label: '0878-2228222', tel: '08782228222' },
  ],
  whatsappNumber: '919704155550',
};

const mapQuery = encodeURIComponent('Rohan Hospital, Choppadandi Rd, Subhash Nagar, Karimnagar, Telangana 505001');

export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
export const WHATSAPP_BASE_URL = `https://wa.me/${HOSPITAL.whatsappNumber}`;

const GOOGLE_PLACE_ID = 'ChIJy_bqIufYzDsRK9tjZEZTro0';

export const GEO = { lat: 18.450288, lng: 79.1333762 };
export const GOOGLE_MAPS_URL = 'https://maps.google.com/?cid=10209188967092575019';
export const OFFICIAL_SITE_URL = 'https://www.rohanhospitalknr.in/';

export const GOOGLE_REVIEWS = {
  rating: 4.4,
  count: 169,
  asOf: 'Oct 2026',
  readUrl: `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`,
  writeUrl: `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`,
};

export const EMAIL = 'info@rohanhospitalknr.in';

export const HOURS = [
  { label: 'Morning OP', value: '9:00 AM – 2:00 PM' },
  { label: 'Lunch break', value: '2:00 PM – 3:00 PM' },
  { label: 'Afternoon & evening OP', value: '3:00 PM – 8:00 PM' },
  { label: 'Maternity & emergency', value: 'Open 24/7' },
];

export const SOCIAL = [
  { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/rohanfertilitycentre/' },
  { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/people/Rohan-Fertility-Centre-Karimnagar/61556053951075/' },
  { name: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/@rohanfertilitycentre' },
  { name: 'X', icon: 'x', url: 'https://x.com/RohanHospital' },
];

export const TOUR_VIDEO_ID = 'hcnYCejv_GU';
