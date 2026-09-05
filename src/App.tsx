import React, { useState } from 'react';
import {
  ChatMessage,
  DocumentItem,
  ExtractedData,
  LanguageCode,
  PatientIntakeState,
  StepId,
} from './types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_EXTRACTED_DATA,
  STEPS_CONFIG,
} from './data/constants';
import { NavigationSidebar } from './components/NavigationSidebar';
import { TopBar } from './components/TopBar';
import { SharedFooter } from './components/SharedFooter';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { HelpSupportModal } from './components/HelpSupportModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { WhatsAppSMSModal } from './components/WhatsAppSMSModal';
import { EditDetailsModal } from './components/EditDetailsModal';
import { QRScannerModal } from './components/QRScannerModal';

// Screens
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { IdentityScreen } from './components/screens/IdentityScreen';
import { SymptomsScreen } from './components/screens/SymptomsScreen';
import { AyushScreen } from './components/screens/AyushScreen';
import { DocumentsScreen } from './components/screens/DocumentsScreen';
import { SummaryScreen } from './components/screens/SummaryScreen';
import { TokenScreen } from './components/screens/TokenScreen';
import { playTapTone } from './utils/audio';

const INITIAL_STATE: PatientIntakeState = {
  language: 'en',
  abhaNumber: '',
  isAbhaVerified: false,
  hasSkippedAbha: false,
  fullName: '',
  dob: '',
  gender: '',
  symptoms: [],
  symptomDuration: '3 Days',
  symptomNotes: '',
  chatHistory: [],
  ayush: {
    consultationType: 'ayush',
    dietLifestyle: 'vata',
    currentTreatments: 'Ayurvedic consultation for joint pain. Note: Consider potential interactions with allopathic prescriptions.',
  },
  extractedDocData: {
    ...INITIAL_EXTRACTED_DATA,
  },
  documents: INITIAL_DOCUMENTS,
  tokenNumber: 'A-101',
  estimatedWaitMinutes: 10,
  doctorName: 'Dr. Sharma',
  isSubmitted: false,
};

export function App() {
  const [state, setState] = useState<PatientIntakeState>(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState<StepId>('welcome');

  // Modals
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Step calculations
  const stepIndex = STEPS_CONFIG.findIndex((s) => s.id === currentStep);
  const stepNumber = stepIndex >= 0 ? stepIndex + 1 : 1;
  const totalSteps = STEPS_CONFIG.length;

  const handleStepChange = (newStep: StepId) => {
    setCurrentStep(newStep);
  };

  const handleGoBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS_CONFIG[stepIndex - 1].id);
    }
  };

  const handleSelectLanguage = (lang: LanguageCode) => {
    setState((prev) => ({ ...prev, language: lang }));
  };

  const handleResetIntake = () => {
    playTapTone(400, 0.05);
    setState({
      ...INITIAL_STATE,
      tokenNumber: `A-${Math.floor(100 + Math.random() * 900)}`,
      language: state.language,
    });
    setCurrentStep('welcome');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans relative selection:bg-primary selection:text-on-primary">
      {/* Top Bar for Mobile & Tablet */}
      <TopBar
        currentStep={currentStep}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        onBack={handleGoBack}
        onOpenLanguage={() => setIsLangModalOpen(true)}
        language={state.language}
      />

      {/* Main Layout Container */}
      <div className="flex flex-1 w-full min-h-[calc(100vh-56px)] md:min-h-screen">
        {/* Left Navigation Sidebar (Hidden on Welcome Screen) */}
        {currentStep !== 'welcome' && (
          <NavigationSidebar
            currentStep={currentStep}
            onSelectStep={handleStepChange}
            language={state.language}
          />
        )}

        {/* Content View Area */}
        <main
          className={`flex-1 flex flex-col transition-all duration-300 w-full ${
            currentStep !== 'welcome' ? 'md:pl-80' : ''
          }`}
        >
          {/* Top Progress Bar for Multi-Step Flow */}
          {currentStep !== 'welcome' && currentStep !== 'token' && (
            <div className="w-full bg-surface-container-high h-1.5 sticky top-0 md:relative z-30">
              <div
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              />
            </div>
          )}

          {/* Screen Switcher */}
          <div className="flex-1 flex flex-col w-full">
            {currentStep === 'welcome' && (
              <WelcomeScreen
                currentLanguage={state.language}
                onSelectLanguage={handleSelectLanguage}
                onBegin={() => {
                  setState((prev) => ({
                    ...prev,
                    fullName: '',
                    dob: '',
                    gender: '',
                    symptoms: [],
                    chatHistory: [],
                    abhaNumber: '',
                    isAbhaVerified: false,
                    hasSkippedAbha: false,
                    isSubmitted: false,
                    extractedDocData: {
                      ...INITIAL_EXTRACTED_DATA,
                      patientName: '',
                      date: '',
                      dob: '',
                    },
                  }));
                  setCurrentStep('identity');
                }}
              />
            )}

            {currentStep === 'identity' && (
              <IdentityScreen
                language={state.language}
                abhaNumber={state.abhaNumber}
                onUpdateAbha={(val) => setState((prev) => ({ ...prev, abhaNumber: val }))}
                onVerify={() => {
                  setState((prev) => ({
                    ...prev,
                    isAbhaVerified: true,
                    fullName: '',
                    dob: '',
                    symptoms: [],
                    chatHistory: [],
                    extractedDocData: {
                      ...INITIAL_EXTRACTED_DATA,
                      patientName: '',
                      date: '',
                      dob: '',
                    },
                  }));
                  setCurrentStep('symptoms');
                }}
                onSkip={() => {
                  setState((prev) => ({
                    ...prev,
                    hasSkippedAbha: true,
                    fullName: '',
                    dob: '',
                    symptoms: [],
                    chatHistory: [],
                    extractedDocData: {
                      ...INITIAL_EXTRACTED_DATA,
                      patientName: '',
                      date: '',
                      dob: '',
                    },
                  }));
                  setCurrentStep('symptoms');
                }}
                onOpenQrScanner={() => setIsQrScannerOpen(true)}
              />
            )}

            {currentStep === 'symptoms' && (
              <SymptomsScreen
                language={state.language}
                chatHistory={state.chatHistory}
                onAddMessage={(msg) =>
                  setState((prev) => {
                    if (
                      prev.chatHistory.some(
                        (m) =>
                          m.id === msg.id ||
                          (m.sender === msg.sender &&
                            m.text === msg.text &&
                            prev.chatHistory.length <= 1)
                      )
                    ) {
                      return prev;
                    }
                    return {
                      ...prev,
                      chatHistory: [...prev.chatHistory, msg],
                    };
                  })
                }
                symptoms={state.symptoms}
                onToggleSymptom={(sym) =>
                  setState((prev) => ({
                    ...prev,
                    symptoms: prev.symptoms.some((s) => s.toLowerCase() === sym.toLowerCase())
                      ? prev.symptoms.filter((s) => s.toLowerCase() !== sym.toLowerCase())
                      : [...prev.symptoms, sym],
                  }))
                }
                onAddSymptom={(sym) =>
                  setState((prev) => ({
                    ...prev,
                    symptoms: prev.symptoms.some((s) => s.toLowerCase() === sym.toLowerCase())
                      ? prev.symptoms
                      : [...prev.symptoms, sym],
                  }))
                }
                onNext={() => setCurrentStep('ayush')}
                patientName={state.fullName}
                dob={state.dob}
                onUpdatePatientName={(name) =>
                  setState((prev) => ({
                    ...prev,
                    fullName: name,
                    extractedDocData: {
                      ...prev.extractedDocData,
                      patientName: name,
                    },
                  }))
                }
                onUpdateDob={(dob) =>
                  setState((prev) => ({
                    ...prev,
                    dob,
                    extractedDocData: {
                      ...prev.extractedDocData,
                      date: dob,
                      dob,
                    },
                  }))
                }
                onResetSession={() =>
                  setState((prev) => ({
                    ...prev,
                    fullName: '',
                    dob: '',
                    symptoms: [],
                    chatHistory: [],
                    extractedDocData: {
                      ...INITIAL_EXTRACTED_DATA,
                    },
                  }))
                }
              />
            )}

            {currentStep === 'ayush' && (
              <AyushScreen
                language={state.language}
                ayush={state.ayush}
                onUpdateAyush={(data) =>
                  setState((prev) => ({
                    ...prev,
                    ayush: { ...prev.ayush, ...data },
                  }))
                }
                onNext={() => setCurrentStep('documents')}
              />
            )}

            {currentStep === 'documents' && (
              <DocumentsScreen
                language={state.language}
                documents={state.documents}
                extractedData={state.extractedDocData}
                patientName={state.fullName}
                dob={state.dob}
                onOpenEditModal={() => setIsEditModalOpen(true)}
                onConfirmData={() => {
                  // Confirmed
                }}
                onAddDocument={(doc) =>
                  setState((prev) => ({
                    ...prev,
                    documents: [doc, ...prev.documents],
                  }))
                }
                onRemoveDocument={(docId) =>
                  setState((prev) => ({
                    ...prev,
                    documents: prev.documents.filter((d) => d.id !== docId),
                  }))
                }
                onUpdateExtractedData={(data) =>
                  setState((prev) => ({
                    ...prev,
                    fullName: data.patientName || prev.fullName,
                    dob: data.dob || data.date || data.dateOfBirth || prev.dob,
                    extractedDocData: data,
                  }))
                }
                onBack={() => setCurrentStep('ayush')}
                onContinue={() => setCurrentStep('summary')}
              />
            )}

            {currentStep === 'summary' && (
              <SummaryScreen
                state={state}
                onJumpToStep={handleStepChange}
                onConfirmAndSend={() =>
                  setState((prev) => ({
                    ...prev,
                    isSubmitted: true,
                    submittedAt: new Date().toLocaleTimeString(),
                  }))
                }
                onOpenWhatsappModal={() => setIsWhatsappModalOpen(true)}
                onViewToken={() => setCurrentStep('token')}
              />
            )}

            {currentStep === 'token' && (
              <TokenScreen
                language={state.language}
                tokenNumber={state.tokenNumber}
                estimatedWaitMinutes={state.estimatedWaitMinutes}
                doctorName={state.doctorName}
                onReturnHome={handleResetIntake}
              />
            )}
          </div>
        </main>
      </div>

      {/* Shared Persistent Footer */}
      <SharedFooter
        language={state.language}
        onOpenLanguage={() => setIsLangModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        hideOnMobileIntake={currentStep === 'symptoms'}
      />

      {/* Global Modals */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={state.language}
        onSelectLanguage={handleSelectLanguage}
      />

      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        language={state.language}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        language={state.language}
      />

      <WhatsAppSMSModal
        isOpen={isWhatsappModalOpen}
        onClose={() => setIsWhatsappModalOpen(false)}
        language={state.language}
        tokenNumber={state.tokenNumber}
        patientName={state.fullName}
      />

      <EditDetailsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        language={state.language}
        initialData={{
          ...state.extractedDocData,
          patientName: state.fullName || state.extractedDocData.patientName,
          date: state.extractedDocData.date || state.extractedDocData.dateOfBirth || state.extractedDocData.dob || state.dob,
          dob: state.extractedDocData.dob || state.extractedDocData.dateOfBirth || state.extractedDocData.date || state.dob,
          dateOfBirth: state.extractedDocData.dateOfBirth || state.extractedDocData.dob || state.extractedDocData.date || state.dob,
          symptoms: state.extractedDocData.symptoms || [],
        }}
        onSave={(data: ExtractedData) =>
          setState((prev) => ({
            ...prev,
            fullName: data.patientName || prev.fullName,
            dob: data.dob || data.date || data.dateOfBirth || prev.dob,
            extractedDocData: data,
          }))
        }
      />

      <QRScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        language={state.language}
        onScanned={(scannedAbha) => {
          setState((prev) => ({
            ...prev,
            abhaNumber: scannedAbha,
            isAbhaVerified: true,
          }));
        }}
      />
    </div>
  );
}

export default App;
