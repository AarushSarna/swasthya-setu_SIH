import { DocumentItem, ExtractedData, LanguageOption } from '../types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
];

export const MOCKUP_IMAGES = {
  // Prescription scanner preview
  prescriptionScanned: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoQo2IATXPstHeupIWTwzaORlZKtoifz1gpPG5shhmZYW7MHmEe_wMHQ9FfmXn6maHaHnRnOLGcB9S8_TPCR09YGE00S9kxYpfFUyVfAQSQLEKO_YAyKsBPuXLx-ljHGnETQbE1MgfqMnzQV90QEu9kkDmxWGGXWOI5UcyLGtmj1Ime72g1Q5hD3Eymacm8NxEVs99iLk5R-MKojhedtacKHD8lz6O2Bzbu0p7iTnpyegW9xzUw446rA',
  
  // Lab report thumbnail
  labReport: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdTW6aA2WP8feWq0rRrPAV5NrDk32sq_EMAK7sIm4SyZrLVGEGq7owydF_j_p8bRJE3z-e-LCSazgpBM0raKwjMDqEKxtImMwo3v_-ex-ecLX4LTIDJ8qwF-_lKk-hAlty2zbCG7x1hjVCpHr6CwveuUMYlrKfWZZbxwj1eW8qmfwr31U2s1HCe1JIUS_rfePLYjejBUMdoSZMcPCQ6m11YQXP_xDr5FXTCAuZXB1SQNZqTNJzIndfKw',
  
  // Referral letter thumbnail
  referral: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKOeB5AhSewg7QA54tOB8f2Gl7RknKQrg7xb92D1jLtl88SjRnEszeIH6aZLc_J145LV-5DbXuonQF7FeHRY6hYJ98XPbCYmJ9yn8APFRvZqPsQ-7kwOWqVFTwJp9V6vGpXRsa92-9xIiwgKBqGwRov0lJAv7ymzNif2TIAHdanfZjEsW-mkrOgP3hJ60WsWUL-zxZ-755gX-1SqZLdz0urjoqfpyuy2aJeBBkmxyoVL9fPnSuua0hCw',
  
  // Clinical doctor handover QR code
  handoverQr: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVPuOhGWCIWLg5YBQAZ-5GtXAXj6ivTsoEFrGy_1Sm6iTidnmquI5HJxAAeJk3xYDX1CnkPCRD0rCInMMijqXwJ00UaQlVicG30N9vNsOQVutMs8lZdxnmBAab9i3QdG4w1xSV7i7M7vMm5oMEKFzplD60fk3GX_Ywsb0OHKaprvpdtsInG1LeUabpy1sNx89Pluzmn5SlVbzGEIdgIwmuU8A9JFGej1NzXnefbQ5WG_bDAPVsEIQ4OA',
};

export const INITIAL_EXTRACTED_DATA: ExtractedData = {
  patientName: null,
  date: null,
  dob: null,
  dateOfBirth: null,
  symptoms: [],
  medications: [],
  documentImageUrl: MOCKUP_IMAGES.prescriptionScanned,
  isAiExtracted: false,
};

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-lab-1',
    title: 'Lab Report',
    category: 'lab_report',
    imageUrl: MOCKUP_IMAGES.labReport,
    verified: true,
  },
  {
    id: 'doc-ref-1',
    title: 'Referral',
    category: 'referral',
    imageUrl: MOCKUP_IMAGES.referral,
    verified: true,
  },
];

export const QUICK_SYMPTOMS = [
  'Fever',
  'Cough',
  'Fatigue',
  'Headache',
  'Sore Throat',
  'Chest Congestion',
  'Joint Pain',
  'Stomach Ache',
  'Nausea',
  'Shortness of breath',
];

export const STEPS_CONFIG = [
  { id: 'welcome', label: 'Welcome', icon: 'door_open', stepNum: 1 },
  { id: 'identity', label: 'Identity', icon: 'person', stepNum: 2 },
  { id: 'symptoms', label: 'Symptoms', icon: 'medical_services', stepNum: 3 },
  { id: 'ayush', label: 'AYUSH', icon: 'spa', stepNum: 4 },
  { id: 'documents', label: 'Documents', icon: 'description', stepNum: 5 },
  { id: 'summary', label: 'Summary', icon: 'fact_check', stepNum: 6 },
  { id: 'token', label: 'Token', icon: 'confirmation_number', stepNum: 7 },
] as const;
