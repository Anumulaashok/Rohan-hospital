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

export const MAP_EMBED_URL = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
export const WHATSAPP_BASE_URL = `https://wa.me/${HOSPITAL.whatsappNumber}`;
