import { LanguageCode } from '../types';

export interface TranslationSet {
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

  // Steps / Sidebar navigation
  stepWelcome: string;
  stepIdentity: string;
  stepSymptoms: string;
  stepAyush: string;
  stepDocuments: string;
  stepSummary: string;
  stepToken: string;
  stepWord: string;
  ofWord: string;

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
  conversationLanguageNote: string;
  symptomsLabels: Record<string, string>;

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
  vataSublabel: string;
  pittaSublabel: string;
  kaphaSublabel: string;
  mixedSublabel: string;
  ayushNoticeTitle: string;
  ayushNoticeText: string;

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
  viewQueueToken: string;

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

    stepWelcome: 'Welcome',
    stepIdentity: 'Identity',
    stepSymptoms: 'Symptoms',
    stepAyush: 'AYUSH',
    stepDocuments: 'Documents',
    stepSummary: 'Summary',
    stepToken: 'Token',
    stepWord: 'Step',
    ofWord: 'of',

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
    conversationLanguageNote: 'Conversation available in English & Hindi',
    symptomsLabels: {
      'Fever': 'Fever',
      'Cough': 'Cough',
      'Fatigue': 'Fatigue',
      'Headache': 'Headache',
      'Sore Throat': 'Sore Throat',
      'Chest Congestion': 'Chest Congestion',
      'Joint Pain': 'Joint Pain',
      'Stomach Ache': 'Stomach Ache',
      'Nausea': 'Nausea',
      'Shortness of breath': 'Shortness of breath',
    },

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
    vataSublabel: 'Vata Dominant',
    pittaSublabel: 'Pitta Dominant',
    kaphaSublabel: 'Kapha Dominant',
    mixedSublabel: 'Tridoshic / Mixed',
    ayushNoticeTitle: 'Integrative AYUSH Clinical Record:',
    ayushNoticeText: 'This lifestyle information helps your physician evaluate metabolic Agni, Dhatu nutrition, and customize holistic prescriptions safely alongside modern medication.',

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
    viewQueueToken: 'View Queue Token',

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

    stepWelcome: 'स्वागत',
    stepIdentity: 'पहचान',
    stepSymptoms: 'लक्षण',
    stepAyush: 'आयुष',
    stepDocuments: 'दस्तावेज़',
    stepSummary: 'सारांश',
    stepToken: 'टोकन',
    stepWord: 'चरण',
    ofWord: 'का',

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
    conversationLanguageNote: 'बातचीत अंग्रेजी और हिंदी में उपलब्ध है',
    symptomsLabels: {
      'Fever': 'बुखार',
      'Cough': 'खांसी',
      'Fatigue': 'थकान',
      'Headache': 'सिरदर्द',
      'Sore Throat': 'गले में खराश',
      'Chest Congestion': 'सीने में जकड़न',
      'Joint Pain': 'जोड़ों का दर्द',
      'Stomach Ache': 'पेट दर्द',
      'Nausea': 'जी मिचलाना',
      'Shortness of breath': 'सांस लेने में तकलीफ',
    },

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
    vataSublabel: 'वात प्रधान',
    pittaSublabel: 'पित्त प्रधान',
    kaphaSublabel: 'कफ प्रधान',
    mixedSublabel: 'त्रिदोषज / मिश्रित',
    ayushNoticeTitle: 'एकीकृत आयुष नैदानिक रिकॉर्ड:',
    ayushNoticeText: 'यह जीवनशैली जानकारी आपके चिकित्सक को जठराग्नि व धातु पोषण का मूल्यांकन करने और आधुनिक दवाओं के साथ समग्र उपचार सुरक्षित रूप से तैयार करने में मदद करती है।',

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
    viewQueueToken: 'कतार टोकन देखें',

    intakeCompleteTitle: 'पंजीकरण पूर्ण हुआ',
    intakeCompleteSub: 'आपका सारांश डॉ. शर्मा के डेस्क पर भेज दिया गया है।',
    yourTokenNumber: 'आपका टोकन नंबर',
    estimatedWait: 'अनुमानित प्रतीक्षा समय',
    returnToHome: 'मुख्य पृष्ठ पर लौटें',
  },

  ta: {
    appName: 'ஸ்வஸ்த்ய சேது (Swasthya Setu)',
    appSubtitle: 'டிஜிட்டல் சுகாதார மிஷன் பதிவு',
    stepProgress: 'படிவ நிலை',
    intakeProcess: 'சேர்க்கை செயல்முறை',
    trustBadge: 'ஆபா (ABHA)',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    tapToBegin: 'தொடங்க தட்டவும்',
    back: 'பின்செல்',
    continue: 'தொடரவும்',
    next: 'அடுத்து',
    confirm: 'உறுதிப்படுத்து',
    edit: 'திருத்து',
    cancel: 'ரத்துசெய்',
    save: 'மாற்றங்களைச் சேமி',
    close: 'மூடு',

    stepWelcome: 'வரவேற்பு',
    stepIdentity: 'அடையாளம்',
    stepSymptoms: 'அறிகுறிகள்',
    stepAyush: 'ஆயுஷ்',
    stepDocuments: 'ஆவணங்கள்',
    stepSummary: 'சுருக்கம்',
    stepToken: 'டோக்கன்',
    stepWord: 'படி',
    ofWord: '/',

    copyright: '© ஸ்வஸ்த்ய சேது - டிஜிட்டல் சுகாதார மிஷன்',
    footerLanguage: 'மொழி',
    footerHelp: 'உதவி மற்றும் ஆதரவு',
    footerPrivacy: 'தனியுரிமைக் கொள்கை',

    provideAbha: 'உங்கள் ஆபா (ABHA) எண்ணை உள்ளிடவும்',
    provideAbhaSub: 'பாதுகாப்பாக தொடர உங்கள் 14 இலக்க ஆயுஷ்மான் பாரத் சுகாதார கணக்கு எண்ணை உள்ளிடவும்.',
    abhaLabel: 'ஆபா எண் (ABHA)',
    abhaPlaceholder: '14 இலக்க ஆபா எண்',
    scanQrCode: 'QR குறியீட்டை ஸ்கேன் செய்யவும்',
    verifyAbha: 'ஆபாவைச் சரிபார்க்கவும்',
    continueWithoutAbha: 'ஆபா இல்லாமல் தொடரவும்',
    abhaVerifiedSuccess: 'ஆபா வெற்றிகரமாக சரிபார்க்கப்பட்டது',

    symptomsTitle: 'இன்று நீங்கள் மருத்துவமனைக்கு வந்த காரணம் என்ன?',
    symptomsSub: 'தயவுசெய்து உங்கள் முக்கிய அறிகுறிகளை விவரிக்கவும்.',
    tapToSpeak: 'பேச தட்டவும்',
    listening: 'கேட்கிறது... இப்போது பேசுங்கள்',
    typeInstead: 'தட்டச்சு செய்யவும்',
    send: 'அனுப்பு',
    typePlaceholder: 'உங்கள் அறிகுறிகள் அல்லது உடல்நலப் பிரச்சனையை விவரிக்கவும்...',
    quickSymptoms: 'பொதுவான அறிகுறிகள்:',
    botQ1: 'Please state your full name.',
    botQ2: 'Can you confirm your date of birth?',
    botQ3: 'What brings you to the hospital today? Please describe your main symptoms.',
    conversationLanguageNote: 'Conversation available in English & Hindi (உரையாடல் ஆங்கிலம் மற்றும் இந்தியில் மட்டுமே கிடைக்கிறது)',
    symptomsLabels: {
      'Fever': 'காய்ச்சல்',
      'Cough': 'இருமல்',
      'Fatigue': 'சோர்வு',
      'Headache': 'தலைவலி',
      'Sore Throat': 'தொண்டை வலி',
      'Chest Congestion': 'மார்பு சளி',
      'Joint Pain': 'மூட்டு வலி',
      'Stomach Ache': 'வயிற்று வலி',
      'Nausea': 'குமட்டல்',
      'Shortness of breath': 'மூச்சுத் திணறல்',
    },

    modernConsultation: 'நவீன மருத்துவ ஆலோசனை',
    ayushConsultation: 'ஆயுஷ் ஆலோசனை (AYUSH)',
    dashavidhaPariksha: 'தசவித பரீட்சை (பிரகிருதி நிர்ணயம்)',
    ayushHeadline: 'உங்கள் உணவுப் பழக்கம் மற்றும் வாழ்க்கை முறையை விவரிக்கவும்.',
    ayushSub: 'உங்கள் பிரகிருதியைத் தீர்மானிக்க உதவும் வகையில் உங்கள் வழக்கத்தை விவரிக்கும் விருப்பங்களைத் தேர்ந்தெடுக்கவும்.',
    vataTitle: 'மாறுபடக்கூடிய மற்றும் இலகுவான (வாதம்)',
    vataDesc: 'ஒழுங்கற்ற பசி, சூடான உணவை விரும்புதல், இலகுவான தூக்கம்.',
    pittaTitle: 'தீவிரமான மற்றும் வெப்பமான (பித்தம்)',
    pittaDesc: 'வலுவான செரிமானம், குளிர்ந்த உணவை விரும்புதல், பசியின் போது எரிச்சல்.',
    kaphaTitle: 'நிலையான மற்றும் கனமான (கபம்)',
    kaphaDesc: 'மெதுவான செரிமானம், இலகுவான/சூடான உணவை விரும்புதல், ஆழ்ந்த தூக்கம்.',
    mixedTitle: 'கலவையான / உறுதியற்ற',
    mixedDesc: 'மேற்கூறிய பண்புகளின் கலவை, அல்லது எனக்கு நிச்சயமாகத் தெரியவில்லை.',
    vataSublabel: 'வாதம் பிரதானம்',
    pittaSublabel: 'பித்தம் பிரதானம்',
    kaphaSublabel: 'கபம் பிரதானம்',
    mixedSublabel: 'முத்தோஷம் / கலவை',
    ayushNoticeTitle: 'ஒருங்கிணைந்த ஆயுஷ் மருத்துவப் பதிவு:',
    ayushNoticeText: 'இந்த வாழ்க்கை முறை விவரங்கள் மருத்துவர் செரிமான அக்னி மற்றும் தாது ஊட்டச்சத்தை மதிப்பீடு செய்யவும், நவீன மருந்துகளுடன் பாதுகாப்பாக ஒருங்கிணைந்த சிகிச்சையை வழங்கவும் உதவுகிறது.',

    uploadDocsTitle: 'ஆவணங்களைப் பதிவேற்றவும்',
    uploadDocsSub: 'தொடர்புடைய மருந்துக் குறிப்பு, ஆய்வக அறிக்கை அல்லது பரிந்துரைக் கடிதங்களை ஸ்கேன் செய்யவும்.',
    scanPrescription: 'மருந்துக் குறிப்பு அல்லது அறிக்கையை ஸ்கேன் செய்யவும்',
    scanPrescriptionSub: 'கேமராவைத் திறந்து ஆவணத்தின் தெளிவான புகைப்படத்தை எடுக்க தட்டவும்.',
    extractedData: 'பிரித்தெடுக்கப்பட்ட விவரங்கள் (OCR)',
    extractedDataSub: "கீழேயுள்ள விவரங்களை மதிப்பாய்வு செய்யவும். திருத்தங்கள் தேவைப்பட்டால் 'திருத்து' என்பதைத் தட்டவும்.",
    patientName: 'நோயாளி பெயர்',
    date: 'தேதி',
    dateOfBirth: 'பிறந்த தேதி',
    extractedSymptoms: 'அறிகுறிகள் (புகார்கள்)',
    medications: 'மருந்துகள்',
    editDetails: 'விவரங்களைத் திருத்து',
    scannedDocuments: 'ஸ்கேன் செய்யப்பட்ட ஆவணங்கள்',
    notDetected: 'கண்டறியப்படவில்லை — கைமுறையாகச் சேர்க்க திருத்தவும்',
    ocrProcessing: 'AI மூலம் ஆவணம் செயலாக்கப்படுகிறது...',
    ocrPleaseReview: 'AI பிரித்தெடுத்தது — மதிப்பாய்வு செய்யவும்',
    ocrVerified: 'சரிபார்க்கப்பட்ட OCR',
    ocrAiScanned: 'AI ஸ்கேன் செய்யப்பட்டது',
    deleteDocument: 'ஆவணத்தை நீக்கு',

    reviewSummaryTitle: 'சுருக்கத்தை மதிப்பாய்வு செய்யவும்',
    reviewSummarySub: 'மருத்துவரிடம் அனுப்புவதற்கு முன் பதிவு செய்யப்பட்ட விவரங்களை உறுதிப்படுத்தவும்.',
    symptomsCardTitle: 'அறிகுறிகள்',
    currentSymptomsCardTitle: 'தற்போதைய அறிகுறிகள் (இன்று கூறப்பட்டவை)',
    currentSymptomsSub: 'இன்றைய சேர்க்கை மூலம் தெரிவிக்கப்பட்ட அறிகுறிகள்',
    medicalHistoryCardTitle: 'மருத்துவ வரலாறு (பதிவேற்றிய ஆவணங்களிலிருந்து)',
    medicalHistorySub: 'பதிவேற்றிய ஆவணத்திலிருந்து பெறப்பட்ட முந்தைய விவரங்கள் — தற்போதைய புகார் அல்ல',
    historicalSymptomsConditions: 'முந்தைய அறிகுறிகள் / நிலைகள்',
    noCurrentSymptoms: 'இன்று அறிகுறிகள் எதுவும் தெரிவிக்கப்படவில்லை',
    noDocMedications: 'பதிவேற்றிய ஆவணங்களில் மருந்துகள் எதுவும் பதிவு செய்யப்படவில்லை',
    duration: 'கால அளவு',
    historyCardTitle: 'வரலாறு',
    conditions: 'நிலைகள்',
    ayushCardTitle: 'ஆயுஷ் (AYUSH)',
    currentTreatments: 'தற்போதைய சிகிச்சைகள்',
    ayushNote: 'குறிப்பு: அலோபதி மருந்துகளுடனான தொடர்புகளைக் கவனியுங்கள்.',
    documentsCardTitle: 'ஆவணங்கள்',
    confirmAndSend: 'உறுதிசெய்து மருத்துவருக்கு அனுப்பவும்',
    getWhatsappSummary: 'வாட்ஸ்அப்/எஸ்எம்எஸ்ஸில் சுருக்கத்தைப் பெறவும்',
    dataSentSuccess: 'விவரங்கள் வெற்றிகரமாக அனுப்பப்பட்டன',
    showQrToDoctor: 'இந்த QR-ஐ மருத்துவரின் திரையில் காட்டவும்',
    doctorScanNotice: 'மருத்துவர் இதை ஸ்கேன் செய்து உங்கள் பதிவுச் சுருக்கத்தை உடனே கணினியில் ஏற்றலாம்.',
    viewQueueToken: 'வரிசை டோக்கனைப் பார்க்கவும்',

    intakeCompleteTitle: 'பதிவு நிறைவடைந்தது',
    intakeCompleteSub: 'உங்கள் மருத்துவச் சுருக்கம் மருத்துவரின் மேசைக்கு அனுப்பப்பட்டுள்ளது.',
    yourTokenNumber: 'உங்கள் டோக்கன் எண்',
    estimatedWait: 'மதிப்பிடப்பட்ட காத்திருப்பு நேரம்',
    returnToHome: 'முகப்புக்குத் திரும்பு',
  },

  bn: {
    appName: 'স্বাস্থ্য সেতু (Swasthya Setu)',
    appSubtitle: 'ডিজিটাল স্বাস্থ্য মিশন ইনটেক',
    stepProgress: 'অগ্রগতির ধাপ',
    intakeProcess: 'ভর্তি প্রক্রিয়া',
    trustBadge: 'আভা (ABHA)',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    tapToBegin: 'শুরু করতে ট্যাপ করুন',
    back: 'পেছনে',
    continue: 'এগিয়ে যান',
    next: 'পরবর্তী',
    confirm: 'নিশ্চিত করুন',
    edit: 'সম্পাদনা',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ করুন',
    close: 'বন্ধ করুন',

    stepWelcome: 'স্বাগতম',
    stepIdentity: 'পরিচয়',
    stepSymptoms: 'উপসর্গ',
    stepAyush: 'আয়ুষ',
    stepDocuments: 'নথিপত্র',
    stepSummary: 'সারসংক্ষেপ',
    stepToken: 'টোকেন',
    stepWord: 'ধাপ',
    ofWord: '/',

    copyright: '© স্বাস্থ্য সেতু - ডিজিটাল স্বাস্থ্য মিশন',
    footerLanguage: 'ভাষা',
    footerHelp: 'সহায়তা ও সমর্থন',
    footerPrivacy: 'গোপনীয়তা নীতি',

    provideAbha: 'আপনার আভা (ABHA) নম্বর লিখুন',
    provideAbhaSub: 'নিরাপদে এগিয়ে যেতে আপনার ১৪ সংখ্যার আয়ুষ্মান ভারত স্বাস্থ্য অ্যাকাউন্ট নম্বর লিখুন।',
    abhaLabel: 'আভা নম্বর (ABHA)',
    abhaPlaceholder: '১৪-সংখ্যার আভা নম্বর',
    scanQrCode: 'QR কোড স্ক্যান করুন',
    verifyAbha: 'আভা যাচাই করুন',
    continueWithoutAbha: 'আভা ছাড়াই এগিয়ে যান',
    abhaVerifiedSuccess: 'আভা সফলভাবে যাচাই করা হয়েছে',

    symptomsTitle: 'আজ আপনি হাসপাতালে কী কারণে এসেছেন?',
    symptomsSub: 'অনুগ্রহ করে আপনার প্রধান উপসর্গগুলি বর্ণনা করুন।',
    tapToSpeak: 'বলতে ট্যাপ করুন',
    listening: 'শুনছি... এখন বলুন',
    typeInstead: 'টাইপ করুন',
    send: 'পাঠান',
    typePlaceholder: 'আপনার উপসর্গ বা স্বাস্থ্য সমস্যা লিখুন...',
    quickSymptoms: 'সাধারণ উপসর্গ:',
    botQ1: 'Please state your full name.',
    botQ2: 'Can you confirm your date of birth?',
    botQ3: 'What brings you to the hospital today? Please describe your main symptoms.',
    conversationLanguageNote: 'Conversation available in English & Hindi (কথোপকথন ইংরেজি এবং হিন্দিতে উপলব্ধ)',
    symptomsLabels: {
      'Fever': 'জ্বর',
      'Cough': 'কাশি',
      'Fatigue': 'ক্লান্তি',
      'Headache': 'মাথাব্যথা',
      'Sore Throat': 'গলা ব্যথা',
      'Chest Congestion': 'বুকে কফ/জমাট',
      'Joint Pain': 'জয়েন্টে ব্যথা',
      'Stomach Ache': 'পেট ব্যথা',
      'Nausea': 'বমি বমি ভাব',
      'Shortness of breath': 'শ্বাসকষ্ট',
    },

    modernConsultation: 'আধুনিক চিকিৎসা পরামর্শ',
    ayushConsultation: 'আয়ুষ পরামর্শ (AYUSH)',
    dashavidhaPariksha: 'দশবিধ পরীক্ষা (প্রকৃতি নির্ধারণ)',
    ayushHeadline: 'আপনার খাদ্যাভ্যাস এবং জীবনযাত্রার বর্ণনা দিন।',
    ayushSub: 'আপনার প্রকৃতি নির্ধারণে সহায়তা করতে আপনার রুটিন সবচেয়ে ভালো বর্ণনা করে এমন বিকল্পটি বেছে নিন।',
    vataTitle: 'পরিবর্তনশীল ও হালকা (বাত)',
    vataDesc: 'অনিয়মিত ক্ষুধা, গরম খাবার পছন্দ, হালকা ঘুম।',
    pittaTitle: 'তীব্র ও উষ্ণ (পিত্ত)',
    pittaDesc: 'দ্রুত হজম, ঠান্ডা খাবার পছন্দ, ক্ষুধা পেলে খিটখিটে মেজাজ।',
    kaphaTitle: 'স্থির ও ভারী (কফ)',
    kaphaDesc: 'ধীরগতির হজম, হালকা/গরম খাবার পছন্দ, গভীর ঘুম।',
    mixedTitle: 'মিশ্র / নিশ্চিত নই',
    mixedDesc: 'উপরের লক্ষণগুলির সংমিশ্রণ, অথবা আমি নিশ্চিত নই।',
    vataSublabel: 'বাত প্রধান',
    pittaSublabel: 'পিত্ত প্রধান',
    kaphaSublabel: 'কফ প্রধান',
    mixedSublabel: 'ত্রিভাষিক / মিশ্র',
    ayushNoticeTitle: 'সমন্বিত আয়ুষ ক্লিনিকাল রেকর্ড:',
    ayushNoticeText: 'এই জীবনযাত্রার তথ্য আপনার চিকিৎসককে হজম ক্ষমতা ও ধাতুপুষ্টি মূল্যায়ন করতে এবং আধুনিক ওষুধের পাশাপাশি সামগ্রিক প্রেসক্রিপশন তৈরি করতে সাহায্য করে।',

    uploadDocsTitle: 'নথিপত্র আপলোড করুন',
    uploadDocsSub: 'অনুগ্রহ করে প্রাসঙ্গিক প্রেসক্রিপশন, ল্যাব রিপোর্ট বা রেফারেল চিঠি স্ক্যান করুন।',
    scanPrescription: 'প্রেসক্রিপশন বা রিপোর্ট স্ক্যান করুন',
    scanPrescriptionSub: 'ক্যামেরা খুলতে এবং ডকুমেন্টের একটি পরিষ্কার ছবি তুলতে ট্যাপ করুন।',
    extractedData: 'শনাক্তকৃত তথ্য (OCR)',
    extractedDataSub: "নিচের বিবরণ পর্যালোচনা করুন। সংশোধনের প্রয়োজন হলে 'সম্পাদনা' ট্যাপ করুন।",
    patientName: 'রোগীর নাম',
    date: 'তারিখ',
    dateOfBirth: 'জন্ম তারিখ',
    extractedSymptoms: 'উপসর্গ (অভিযোগ)',
    medications: 'ওষুধসমূহ',
    editDetails: 'তথ্য সম্পাদনা',
    scannedDocuments: 'স্ক্যান করা নথিপত্র',
    notDetected: 'শনাক্ত করা যায়নি — নিজে যোগ করতে সম্পাদনা করুন',
    ocrProcessing: 'AI দ্বারা নথি প্রক্রিয়াকরণ হচ্ছে...',
    ocrPleaseReview: 'AI সংগৃহীত — অনুগ্রহ করে পর্যালোচনা করুন',
    ocrVerified: 'যাচাইকৃত OCR',
    ocrAiScanned: 'AI স্ক্যান করা',
    deleteDocument: 'নথি অপসারণ করুন',

    reviewSummaryTitle: 'সারসংক্ষেপ পর্যালোচনা করুন',
    reviewSummarySub: 'ডাক্তারের কাছে পাঠানোর আগে ইনটেকে সংগৃহীত বিবরণ নিশ্চিত করুন।',
    symptomsCardTitle: 'উপসর্গ',
    currentSymptomsCardTitle: 'বর্তমান উপসর্গ (আজকের রিপোর্ট)',
    currentSymptomsSub: 'কথোপকথনের মাধ্যমে আজকে জানানো উপসর্গ',
    medicalHistoryCardTitle: 'চিকিৎসার ইতিহাস (আপলোড করা নথি থেকে)',
    medicalHistorySub: 'আপলোড করা নথি থেকে পূর্ববর্তী তথ্য — বর্তমান অভিযোগ নয়',
    historicalSymptomsConditions: 'পূর্ববর্তী উপসর্গ / অবস্থা',
    noCurrentSymptoms: 'আজকে কোনো উপসর্গ জানানো হয়নি',
    noDocMedications: 'আপলোড করা নথিতে কোনো ওষুধ নথিভুক্ত নেই',
    duration: 'সময়কাল',
    historyCardTitle: 'ইতিহাস',
    conditions: 'শারীরিক অবস্থা',
    ayushCardTitle: 'আয়ুষ (AYUSH)',
    currentTreatments: 'বর্তমান চিকিৎসা',
    ayushNote: 'নোট: অ্যালোপ্যাথিক প্রেসক্রিপশনের সাথে সম্ভাব্য মিথস্ক্রিয়া বিবেচনা করুন।',
    documentsCardTitle: 'নথিপত্র',
    confirmAndSend: 'নিশ্চিত করুন ও ডাক্তারকে পাঠান',
    getWhatsappSummary: 'হোয়াটসঅ্যাপ/এসএমএস-এ সারসংক্ষেপ পান',
    dataSentSuccess: 'তথ্য সফলভাবে পাঠানো হয়েছে',
    showQrToDoctor: 'ডাক্তারের স্ক্রিনে এই QR কোডটি দেখান',
    doctorScanNotice: 'ডাক্তার এটি স্ক্যান করে তাৎক্ষণিকভাবে আপনার ইনটেক সারাংশ সিস্টেমে লোড করতে পারেন।',
    viewQueueToken: 'সারি টোকেন দেখুন',

    intakeCompleteTitle: 'ইনটেক সম্পন্ন হয়েছে',
    intakeCompleteSub: 'আপনার বিবরণ ডাঃ শর্মার ডেস্কে পাঠানো হয়েছে।',
    yourTokenNumber: 'আপনার টোকেন নম্বর',
    estimatedWait: 'আনুমানিক অপেক্ষার সময়',
    returnToHome: 'মূল পাতায় ফিরে যান',
  },
};
