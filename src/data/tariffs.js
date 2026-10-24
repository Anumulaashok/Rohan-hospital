// Transcribed from the hospital's printed tariff board; amounts in INR.
export const TARIFF_TABS = [
  {
    id: 'consultation',
    label: 'Consultation',
    rows: [
      ['OP Specialist Consultation', '₹500'],
      ['Super Specialist Consultation', '₹1,000'],
      ['IP Specialist / IP Super Specialist', '₹1,000 per visit'],
    ],
  },
  {
    id: 'rooms',
    label: 'Rooms',
    note: 'Per day',
    rows: [
      ['Special Room', '₹2,000'],
      ['A/c Deluxe Room', '₹3,500'],
      ['A/c Suite Room', '₹5,000'],
      ['ICU', '₹5,000'],
    ],
  },
  {
    id: 'procedures',
    label: 'Procedures',
    rows: [
      ['Normal Delivery / Operation (LSCS)', '₹25,000'],
      ['Open Hysterectomy', '₹40,000'],
      ['LAVH (Hysterectomy)', '₹50,000'],
      ['D & C', '₹15,000'],
      ['Circlage', '₹15,000'],
      ['Laparotomy', '₹60,000'],
      ['Diagnostic Lap & Hysteroscopy', '₹50,000'],
      ['Tubal Recanalization', '₹65,000'],
      ['Microwave Ablation (Adenomyosis)', '₹1,00,000'],
      ['Myomectomy (Uterine Fibroids)', '₹45,000'],
      ['Hysteroscopic Polypectomy', '₹35,000'],
      ['Hysteroscopy & PRP', '₹35,000'],
      ['Testicular Biopsy', '₹30,000'],
    ],
  },
  {
    id: 'scans',
    label: 'Ultrasound Scans',
    rows: [
      ['TVS Scan', '₹1,500'],
      ['TVS with Abdomen', '₹1,800'],
      ['Antenatal', '₹1,000 (Twins ₹2,000)'],
      ['Tiffa', '₹2,500 (Twins ₹5,000)'],
      ['Single Breast', '₹950'],
      ['Both Breast', '₹1,900'],
      ['3D TVS', '₹2,000'],
      ['3D TVS with Abdomen', '₹2,800'],
      ['Abdomen and Pelvis', '₹1,000'],
      ['Pelvis Scan', '₹800'],
      ['NT Scan', '₹2,000 (Twins ₹4,000)'],
      ['Doppler Antenatal', '₹1,900 (Twins ₹3,000)'],
      ['Follicular Study', '₹1,500'],
    ],
  },
  {
    id: 'lab',
    label: 'Lab Tests',
    rows: [
      ['ECG', '₹300'], ['CBP', '₹250'], ['VDRL', '₹400'], ['HIV', '₹500'],
      ['HBSAG', '₹500'], ['HCV', '₹500'], ['BTCT', '₹100'], ['RBS', '₹100'],
      ['Thyroid Profile', '₹500'], ['E2', '₹1,000'], ['FSH', '₹600'], ['LH', '₹600'],
      ['AMH', '₹2,700'], ['Prolactin', '₹500'], ['Semen Analysis', '₹1,200'], ['Serum Creatinine', '₹200'],
      ['Serum Electrolytes', '₹550'], ['Urine Culture', '₹800'], ['HBA1C', '₹600'], ['PT INR / APTT', '₹800'],
      ['LFT', '₹550'], ['BHCG', '₹1,000'], ['Pregnancy Test', '₹200'], ['Chest X-Ray', '₹400'],
      ['OGTT', '₹600'], ['GCT', '₹400'],
    ],
  },
  {
    id: 'anaesthesia',
    label: 'Anaesthesia & OT',
    rows: [
      ['Spinal Anaesthesia', '₹3,000 per hr'],
      ['General Anaesthesia', '₹5,000 per hr'],
      ['SGA', '₹2,000'],
      ['Operation Theatre Charge', '₹5,000 per hr'],
      ['Oxygen Charge', '₹1,500 per day'],
    ],
  },
];

export const TARIFF_FOOTNOTES = [
  'High-risk & complicated cases will be charged accordingly.',
  'More than 12 hrs of admission is considered one day if the patient is discharged within 24 hrs.',
  'Terms and conditions apply.',
];
