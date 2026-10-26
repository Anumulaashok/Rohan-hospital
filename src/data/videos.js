// Videos from youtube.com/@rohanfertilitycentre; `short` marks vertical YouTube Shorts.
export const VIDEOS = {
  pcos: { id: 'gUC0nklndNU', short: true, title: 'PCOS symptoms, treatment and pregnancy' },
  pcosDiet: { id: 'Jam0gmsaZS8', short: true, title: 'Diet habits for PCOS' },
  notOnlyIvf: { id: '9GzvdkpGGiY', short: true, title: 'IVF is not the only way to get pregnant' },
  ectopic: { id: 'bme2sqMhLRU', short: true, title: 'What is an ectopic pregnancy?' },
  vomiting: { id: 'QARvgHxEnY0', short: true, title: 'Vomiting in pregnancy: when to see a doctor' },
  azoospermia: { id: 'b7z2R4aGOfs', short: true, title: 'Azoospermia: can you have your own baby?' },
  lowSperm: { id: 'jbrIyDjgWlk', short: true, title: 'Low sperm count: the real causes' },
  maleDiet: { id: 'R11-OaO5Zss', short: true, title: 'Diet for male fertility' },
  smoking: { id: 'TYjNncWi4dc', short: true, title: 'How smoking affects male fertility' },
  endometriosis: { id: 'Tkl1H-OhNXE', short: false, title: 'Endometriosis: symptoms, causes and treatment' },
  uti: { id: '8liaJiHgg2M', short: true, title: 'Why urinary infections are more common in women' },
  story: { id: 'BFjPSwXxOrI', short: true, title: 'After 6 pregnancy losses, a baby boy' },
};

export const FEATURED_VIDEOS = [
  VIDEOS.notOnlyIvf, VIDEOS.pcos, VIDEOS.story, VIDEOS.azoospermia, VIDEOS.vomiting,
  VIDEOS.ectopic, VIDEOS.uti, VIDEOS.pcosDiet, VIDEOS.lowSperm, VIDEOS.endometriosis,
];

export const thumbnail = (v) => `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
