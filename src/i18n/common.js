const TE_HOURS = ['ఉదయం OP', 'సాయంత్రం OP', 'ప్రసూతి & అత్యవసర సేవలు'];
const TE_ADDRESS = '3-6-397, చొప్పదండి రోడ్, సుభాష్ విగ్రహం దగ్గర, సుభాష్ నగర్, కరీంనగర్, తెలంగాణ 505001';

export function hoursFor(lang, hours) {
  if (lang !== 'te') return hours;
  if (hours.length !== TE_HOURS.length) throw new Error('Telugu hours labels out of sync');
  return hours.map((h, i) => ({ label: TE_HOURS[i], value: h.value.replace('Open 24/7', '24/7 అందుబాటులో') }));
}

export function addressFor(lang, address) {
  return lang === 'te' ? TE_ADDRESS : address;
}

export const hospitalName = (lang) => (lang === 'te' ? 'రోహన్ హాస్పిటల్ & రోహన్ ఫెర్టిలిటీ (IVF) సెంటర్' : 'Rohan Hospital & Rohan Fertility (IVF) Centre');
