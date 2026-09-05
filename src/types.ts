export type StepId = 
  | 'welcome' 
  | 'identity' 
  | 'symptoms' 
  | 'ayush' 
  | 'documents' 
  | 'summary' 
  | 'token';

export type LanguageCode = 'en' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'prescription' | 'lab_report' | 'referral' | 'id_card';
  imageUrl: string;
  extractedText?: string;
  verified?: boolean;
}

export interface ExtractedData {
  patientName: string | null;
  date: string | null;
  dob?: string | null;
  dateOfBirth?: string | null;
  symptoms?: string[];
  medications: string[];
  documentImageUrl?: string;
  isAiExtracted?: boolean;
}

export type PrakritiType = 'vata' | 'pitta' | 'kapha' | 'mixed';

export interface AyushDetails {
  consultationType: 'modern' | 'ayush';
  dietLifestyle: PrakritiType;
  prakritiScores?: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  currentTreatments: string;
  additionalNotes?: string;
}

export interface PatientIntakeState {
  language: LanguageCode;
  abhaNumber: string;
  isAbhaVerified: boolean;
  hasSkippedAbha: boolean;
  fullName: string;
  dob: string;
  gender: string;
  symptoms: string[];
  symptomDuration: string;
  symptomNotes: string;
  chatHistory: ChatMessage[];
  ayush: AyushDetails;
  extractedDocData: ExtractedData;
  documents: DocumentItem[];
  tokenNumber: string;
  estimatedWaitMinutes: number;
  doctorName: string;
  isSubmitted: boolean;
  submittedAt?: string;
}
