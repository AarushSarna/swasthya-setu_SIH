import { LanguageCode } from '../types';

interface TranslationSet {
  appName: string;
  appSubtitle: string;
  stepProgress: string;
  intakeProcess: string;
  trustBadge: string;
  selectLanguage: string;
  tapToBegin: string;
  back: string;
  continue: string;
  next: string;
  confirm: string;
  edit: string;
  cancel: string;
  save: string;
  close: string;
  
  // Footer
  copyright: string;
  footerLanguage: string;
  footerHelp: string;
  footerPrivacy: string;

  // Identity / ABHA
  provideAbha: string;
  provideAbhaSub: string;
  abhaLabel: string;
  abhaPlaceholder: string;
  scanQrCode: string;
  verifyAbha: string;
  continueWithoutAbha: string;
  abhaVerifiedSuccess: string;

  // Symptoms
  symptomsTitle: string;
  symptomsSub: string;
  tapToSpeak: string;
  listening: string;
  typeInstead: string;
  send: string;
  typePlaceholder: string;
  quickSymptoms: string;
  botQ1: string;
  botQ2: string;
  botQ3: string;

  // AYUSH
  modernConsultation: string;
  ayushConsultation: string;
  dashavidhaPariksha: string;
  ayushHeadline: string;
  ayushSub: string;
  vataTitle: string;
  vataDesc: string;
  pittaTitle: string;
  pittaDesc: string;
  kaphaTitle: string;
  kaphaDesc: string;
  mixedTitle: string;
  mixedDesc: string;

  // Documents
  uploadDocsTitle: string;
  uploadDocsSub: string;
  scanPrescription: string;
  scanPrescriptionSub: string;
  extractedData: string;
  extractedDataSub: string;
  patientName: string;
  date: string;
  dateOfBirth: string;
  extractedSymptoms: string;
  medications: string;
  editDetails: string;
  scannedDocuments: string;
  notDetected: string;
  ocrProcessing: string;
  ocrPleaseReview: string;
  ocrVerified: string;
  ocrAiScanned: string;
  deleteDocument: string;

  // Summary
  reviewSummaryTitle: string;
  reviewSummarySub: string;
  symptomsCardTitle: string;
  currentSymptomsCardTitle: string;
  currentSymptomsSub: string;
  medicalHistoryCardTitle: string;
  medicalHistorySub: string;
  historicalSymptomsConditions: string;
  noCurrentSymptoms: string;
  noDocMedications: string;
  duration: string;
  historyCardTitle: string;
  conditions: string;
  ayushCardTitle: string;
  currentTreatments: string;
  ayushNote: string;
  documentsCardTitle: string;
  confirmAndSend: string;
  getWhatsappSummary: string;
  dataSentSuccess: string;
  showQrToDoctor: string;
  doctorScanNotice: string;

  // Token
  intakeCompleteTitle: string;
  intakeCompleteSub: string;
  yourTokenNumber: string;
  estimatedWait: string;
  returnToHome: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationSet> = {
  en: {
    appName: 'Swasthya Setu',
    appSubtitle: 'Digital Health Mission Intake',
    stepProgress: 'Step Progress',
    intakeProcess: 'Intake Process',
    trustBadge: 'ABHA',
    selectLanguage: 'Select Language',
    tapToBegin: 'Tap to Begin',
    back: 'Back',
    continue: 'Continue',
    next: 'Next',
    confirm: 'Confirm',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save Changes',
    close: 'Close',

    copyright: '© Swasthya Setu - Digital Health Mission',
    footerLanguage: 'Language',
    footerHelp: 'Help Support',
    footerPrivacy: 'Privacy Policy',

    provideAbha: 'Provide your ABHA Number',
    provideAbhaSub: 'Enter your Ayushman Bharat Health Account number to proceed securely.',
    abhaLabel: 'ABHA Number',
    abhaPlaceholder: '14-digit ABHA Number',
    scanQrCode: 'Scan QR Code',
    verifyAbha: 'Verify ABHA',
    continueWithoutAbha: 'Continue without ABHA',
    abhaVerifiedSuccess: 'ABHA verified successfully',

    symptomsTitle: 'What brings you to the hospital today?',
    symptomsSub: 'Please describe your main symptoms.',
    tapToSpeak: 'Tap to Speak',
    listening: 'Listening... Speak now',
    typeInstead: 'Type Instead',
    send: 'Send',
    typePlaceholder: 'Describe your symptoms or health concern...',
    quickSymptoms: 'Common Symptoms:',
    botQ1: 'Please state your full name.',
    botQ2: 'Can you confirm your date of birth?',
    botQ3: 'What brings you to the hospital today? Please describe your main symptoms.',

    modernConsultation: 'Modern Consultation',
    ayushConsultation: 'AYUSH Consultation',
    dashavidhaPariksha: 'Dashavidha Pariksha',
    ayushHeadline: 'Describe your dietary habits and lifestyle.',
    ayushSub: 'Select the options that best describe your routine to help determine your Prakriti.',
    vataTitle: 'Variable & Light',
    vataDesc: 'Irregular appetite, prefer warm foods, light sleeper.',
    pittaTitle: 'Strong & Sharp',
    pittaDesc: 'Strong digestion, prefer cold foods, irritable if hungry.',
    kaphaTitle: 'Steady & Heavy',
    kaphaDesc: 'Slow digestion, prefer light/warm foods, deep sleeper.',
    mixedTitle: 'Mixed / Unsure',
    mixedDesc: 'A combination of above traits, or I am not certain.',

    uploadDocsTitle: 'Upload Documents',
    uploadDocsSub: 'Please scan any relevant prescriptions, lab reports, or referral letters.',
    scanPrescription: 'Scan Prescription or Report',
    scanPrescriptionSub: 'Tap to open camera and capture a clear image of your document.',
    extractedData: 'Extracted Data',
    extractedDataSub: "Review the details below. Tap 'Edit' if corrections are needed.",
    patientName: 'Patient Name',
    date: 'Date',
    dateOfBirth: 'Date of Birth',
    extractedSymptoms: 'Symptoms (Complaints)',
    medications: 'Medications',
    editDetails: 'Edit Details',
    scannedDocuments: 'Scanned Documents',
    notDetected: 'Not detected — tap Edit to add manually',
    ocrProcessing: 'Processing Document with AI...',
    ocrPleaseReview: 'AI Extracted — Please Review',
    ocrVerified: 'Verified OCR',
    ocrAiScanned: 'AI Scanned',
    deleteDocument: 'Remove Document',

    reviewSummaryTitle: 'Review Summary',
    reviewSummarySub: 'Please confirm the details collected during intake before sending to the doctor.',
    symptomsCardTitle: 'Symptoms',
    currentSymptomsCardTitle: 'Current Symptoms (reported today)',
    currentSymptomsSub: 'Reported today via conversational intake',
    medicalHistoryCardTitle: 'Medical History (from uploaded documents)',
    medicalHistorySub: 'Historical clinical findings from uploaded document — not current complaints',
    historicalSymptomsConditions: 'Historical Symptoms / Conditions',
    noCurrentSymptoms: 'No symptoms reported today',
    noDocMedications: 'No medications recorded in uploaded documents',
    duration: 'Duration',
    historyCardTitle: 'History',
    conditions: 'Conditions',
    ayushCardTitle: 'AYUSH',
    currentTreatments: 'Current Treatments',
    ayushNote: 'Note: Consider potential interactions with allopathic prescriptions.',
    documentsCardTitle: 'Documents',
    confirmAndSend: 'Confirm & Send to Doctor',
    getWhatsappSummary: 'Get summary on WhatsApp/SMS',
    dataSentSuccess: 'Data Sent Successfully',
    showQrToDoctor: "Show this QR to the doctor's screen",
    doctorScanNotice: 'The doctor can scan this to immediately load your intake summary into their system.',

    intakeCompleteTitle: 'Intake Complete',
    intakeCompleteSub: "Your summary has been sent to Dr. Sharma's desk.",
    yourTokenNumber: 'Your Token Number',
    estimatedWait: 'Estimated Wait',
    returnToHome: 'Return to Home',
  },

  hi: {
    appName: 'स्वास्थ्य सेतु (Swasthya Setu)',
    appSubtitle: 'डिजिटल स्वास्थ्य मिशन इनटेक',
    stepProgress: 'प्रक्रिया की स्थिति',
    intakeProcess: 'पंजीकरण प्रक्रिया',
    trustBadge: 'आभा (ABHA)',
    selectLanguage: 'भाषा चुनें (Select Language)',
    tapToBegin: 'शुरू करने के लिए टैप करें',
    back: 'पीछे जाएं',
    continue: 'आगे बढ़ें',
    next: 'अगला',
    confirm: 'पुष्टि करें',
    edit: 'संपादित करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    close: 'बंद करें',

    copyright: '© स्वास्थ्य सेतु - आयुष्मान भारत डिजिटल मिशन',
    footerLanguage: 'भाषा',
    footerHelp: 'सहायता एवं समर्थन',
    footerPrivacy: 'गोपनीयता नीति',

    provideAbha: 'अपना आभा (ABHA) नंबर दर्ज करें',
    provideAbhaSub: 'सुरक्षित रूप से आगे बढ़ने के लिए अपना 14 अंकों का आयुष्मान भारत स्वास्थ्य खाता नंबर दर्ज करें।',
    abhaLabel: 'आभा संख्या (ABHA)',
    abhaPlaceholder: '14-अंकीय आभा संख्या',
    scanQrCode: 'क्यूआर कोड स्कैन करें',
    verifyAbha: 'आभा सत्यापित करें',
    continueWithoutAbha: 'आभा के बिना आगे बढ़ें',
    abhaVerifiedSuccess: 'आभा सफलतापूर्वक सत्यापित हुआ',

    symptomsTitle: 'आज आप अस्पताल किस कारण आए हैं?',
    symptomsSub: 'कृपया अपने मुख्य लक्षणों का विवरण दें।',
    tapToSpeak: 'बोलने के लिए टैप करें',
    listening: 'सुन रहे हैं... कृपया बोलें',
    typeInstead: 'टाइप करके बताएं',
    send: 'भेजें',
    typePlaceholder: 'अपने लक्षण या स्वास्थ्य संबंधी परेशानी लिखें...',
    quickSymptoms: 'सामान्य लक्षण:',
    botQ1: 'कृपया अपना पूरा नाम बताएं।',
    botQ2: 'क्या आप अपनी जन्मतिथि की पुष्टि कर सकते हैं?',
    botQ3: 'आज आप अस्पताल किस कारण आए हैं? कृपया अपने मुख्य लक्षण बताएं।',

    modernConsultation: 'एलोपैथिक परामर्श',
    ayushConsultation: 'आयुष परामर्श (AYUSH)',
    dashavidhaPariksha: 'दशविध परीक्षा (प्रकृति निर्धारण)',
    ayushHeadline: 'अपने खान-पान और जीवनशैली की आदतों का वर्णन करें।',
    ayushSub: 'अपनी प्रकृति निर्धारित करने में मदद के लिए सबसे उपयुक्त विकल्प चुनें।',
    vataTitle: 'परिवर्तनशील और हल्का (वात)',
    vataDesc: 'अनियमित भूख, गर्म भोजन पसंद, हल्की नींद।',
    pittaTitle: 'तीव्र और उष्ण (पित्त)',
    pittaDesc: 'तेज पाचन, ठंडा भोजन पसंद, भूख लगने पर चिड़चिड़ापन।',
    kaphaTitle: 'स्थिर और भारी (कफ)',
    kaphaDesc: 'धीमा पाचन, हल्का/गर्म भोजन पसंद, गहरी नींद।',
    mixedTitle: 'मिश्रित / अनिश्चित',
    mixedDesc: 'उपरोक्त लक्षणों का संयोजन, या मुझे निश्चित नहीं है।',

    uploadDocsTitle: 'दस्तावेज़ अपलोड करें',
    uploadDocsSub: 'कृपया कोई भी प्रासंगिक पर्ची, लैब रिपोर्ट या रेफरल पत्र स्कैन करें।',
    scanPrescription: 'पर्ची या रिपोर्ट स्कैन करें',
    scanPrescriptionSub: 'कैमरा खोलने और दस्तावेज़ की स्पष्ट तस्वीर लेने के लिए टैप करें।',
    extractedData: 'निकाला गया विवरण (OCR)',
    extractedDataSub: "नीचे दिए गए विवरण की समीक्षा करें। यदि सुधार की आवश्यकता हो तो 'संपादित करें' पर टैप करें।",
    patientName: 'मरीज़ का नाम',
    date: 'तारीख',
    dateOfBirth: 'जन्मतिथि',
    extractedSymptoms: 'लक्षण (शिकायतें)',
    medications: 'दवाइयाँ',
    editDetails: 'विवरण बदलें',
    scannedDocuments: 'स्कैन किए गए दस्तावेज़',
    notDetected: 'पहचान नहीं हो सकी — मैन्युअल जोड़ने के लिए संपादित करें',
    ocrProcessing: 'AI द्वारा दस्तावेज़ की जाँच जारी है...',
    ocrPleaseReview: 'AI द्वारा निकाला गया — कृपया समीक्षा करें',
    ocrVerified: 'सत्यापित OCR',
    ocrAiScanned: 'AI स्कैन किया गया',
    deleteDocument: 'दस्तावेज़ हटाएँ',

    reviewSummaryTitle: 'सारांश की समीक्षा करें',
    reviewSummarySub: 'डॉक्टर को भेजने से पहले पंजीकरण के दौरान एकत्र किए गए विवरणों की पुष्टि करें।',
    symptomsCardTitle: 'लक्षण',
    currentSymptomsCardTitle: 'वर्तमान लक्षण (आज दर्ज किए गए)',
    currentSymptomsSub: 'आज चैटबॉट व आवाज़ इनटेक द्वारा दर्ज लक्षण',
    medicalHistoryCardTitle: 'पिछला चिकित्सा इतिहास (अपलोड किए गए दस्तावेज़ों से)',
    medicalHistorySub: 'अपलोड किए गए दस्तावेज़ से पिछला रिकॉर्ड — वर्तमान शिकायत नहीं',
    historicalSymptomsConditions: 'पूर्व लक्षण / स्थितियाँ',
    noCurrentSymptoms: 'आज कोई लक्षण दर्ज नहीं किया गया',
    noDocMedications: 'अपलोड किए गए दस्तावेज़ों में कोई दवा दर्ज नहीं है',
    duration: 'अवधि',
    historyCardTitle: 'पिछला इतिहास',
    conditions: 'बीमारियाँ',
    ayushCardTitle: 'आयुष (AYUSH)',
    currentTreatments: 'वर्तमान उपचार',
    ayushNote: 'नोट: एलोपैथिक दवाओं के साथ संभावित पारस्परिक प्रभाव पर विचार करें।',
    documentsCardTitle: 'दस्तावेज़',
    confirmAndSend: 'पुष्टि करें और डॉक्टर को भेजें',
    getWhatsappSummary: 'व्हाट्सएप/एसएमएस पर सारांश प्राप्त करें',
    dataSentSuccess: 'डेटा सफलतापूर्वक भेजा गया',
    showQrToDoctor: 'यह क्यूआर कोड डॉक्टर की स्क्रीन पर दिखाएं',
    doctorScanNotice: 'डॉक्टर इसे स्कैन करके तुरंत आपकी पर्ची अपने सिस्टम में लोड कर सकते हैं।',

    intakeCompleteTitle: 'पंजीकरण पूर्ण हुआ',
    intakeCompleteSub: 'आपका सारांश डॉ. शर्मा के डेस्क पर भेज दिया गया है।',
    yourTokenNumber: 'आपका टोकन नंबर',
    estimatedWait: 'अनुमानित प्रतीक्षा समय',
    returnToHome: 'मुख्य पृष्ठ पर लौटें',
  },
};
