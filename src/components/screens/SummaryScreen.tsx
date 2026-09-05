import React, { useState } from 'react';
import { PatientIntakeState, StepId } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { MOCKUP_IMAGES } from '../../data/constants';
import { playSuccessChime, playTapTone } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface SummaryScreenProps {
  state: PatientIntakeState;
  onJumpToStep: (step: StepId) => void;
  onConfirmAndSend: () => void;
  onOpenWhatsappModal: () => void;
  onViewToken: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  state,
  onJumpToStep,
  onConfirmAndSend,
  onOpenWhatsappModal,
  onViewToken,
}) => {
  const t = TRANSLATIONS[state.language];
  const [showQrConfirmation, setShowQrConfirmation] = useState(state.isSubmitted);

  const handleSendToDoctor = () => {
    playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#61f9b1', '#3ddc97', '#ffffff', '#ffd8b6'],
    });
    setShowQrConfirmation(true);
    onConfirmAndSend();
  };

  return (
    <div
      id="summary-screen"
      className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-20"
    >
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
          {showQrConfirmation ? t.dataSentSuccess : t.reviewSummaryTitle}
        </h2>
        <p className="text-sm md:text-base text-on-surface-variant max-w-2xl">
          {showQrConfirmation ? t.doctorScanNotice : t.reviewSummarySub}
        </p>
      </div>

      {showQrConfirmation ? (
        /* Post-Confirmation Doctor QR Handover State */
        <div className="flex flex-col items-center justify-center bg-surface-container rounded-3xl border border-outline-variant p-6 sm:p-10 shadow-xl text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-4xl fill">check_circle</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">
            {t.showQrToDoctor}
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mb-6">
            {t.doctorScanNotice}
          </p>

          {/* Doctor Scan QR Image */}
          <div className="p-4 bg-white rounded-3xl border-4 border-primary shadow-2xl mb-6 max-w-[240px]">
            <img
              src={MOCKUP_IMAGES.handoverQr}
              alt="Doctor Handover QR Code"
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-xl"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
            <button
              id="btn-open-whatsapp-modal"
              onClick={() => {
                playTapTone(440, 0.04);
                onOpenWhatsappModal();
              }}
              className="w-full py-3.5 px-6 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold text-sm border border-outline-variant transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-primary text-lg">chat</span>
              <span>{t.getWhatsappSummary}</span>
            </button>

            <button
              id="btn-view-queue-token"
              onClick={() => {
                playTapTone(520, 0.05);
                onViewToken();
              }}
              className="w-full py-4 px-8 rounded-full bg-primary text-on-primary font-extrabold text-base hover:bg-primary-container shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>View Queue Token</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>
      ) : (
        /* Bento Grid Summary Cards */
        <>
          {/* Patient Profile Header */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-base flex-shrink-0">
                {state.fullName ? state.fullName.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <h3 className="font-bold text-base text-on-surface">
                  {state.fullName || (state.language === 'hi' ? 'मरीज' : 'Patient')}
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-2 flex-wrap">
                  {state.dob && <span>{state.language === 'hi' ? 'जन्मतिथि' : 'DOB'}: {state.dob}</span>}
                  {state.isAbhaVerified && (
                    <span className="text-primary font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      <span>ABHA: {state.abhaNumber}</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => onJumpToStep('symptoms')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 self-end sm:self-auto"
            >
              <span>{t.edit}</span>
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>

          {(() => {
            const docDate = (
              state.extractedDocData.date ||
              state.extractedDocData.dateOfBirth ||
              state.extractedDocData.dob ||
              ''
            ).trim();

            const docSymptoms = (
              Array.isArray(state.extractedDocData.symptoms) ? state.extractedDocData.symptoms : []
            )
              .map((s) => (typeof s === 'string' ? s.trim() : ''))
              .filter((s) => s.length > 0);

            const hasDocSymptoms = docSymptoms.length > 0;

            const docMedications = (
              Array.isArray(state.extractedDocData.medications) ? state.extractedDocData.medications : []
            )
              .map((m) => (typeof m === 'string' ? m.trim() : ''))
              .filter((m) => m.length > 0);

            const hasDocMedications = docMedications.length > 0;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* 1. Chatbot-Derived Symptoms Card */}
                <div
                  id="summary-card-current-symptoms"
                  className="bg-surface-container rounded-2xl border border-outline-variant p-5 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between pb-3 border-b border-outline-variant/60 mb-3 gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-primary text-xl mt-0.5 flex-shrink-0">
                          medical_services
                        </span>
                        <div>
                          <h3 className="font-bold text-base text-on-surface leading-snug">
                            {t.currentSymptomsCardTitle}
                          </h3>
                          <p className="text-[11px] text-primary font-medium mt-0.5">
                            {t.currentSymptomsSub}
                          </p>
                        </div>
                      </div>
                      <button
                        id="btn-edit-current-symptoms"
                        onClick={() => onJumpToStep('symptoms')}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 flex-shrink-0"
                      >
                        <span>{t.edit}</span>
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {state.symptoms.length > 0 ? (
                        state.symptoms.map((sym, idx) => (
                          <span
                            key={`${sym}-${idx}`}
                            id={`summary-current-symptom-${idx}`}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-highest text-primary border border-primary/20 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{sym}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-on-surface-variant italic">
                          {t.noCurrentSymptoms}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-on-surface-variant flex items-center gap-2">
                      <span className="font-bold text-on-surface">{t.duration}:</span>
                      <span>{state.symptomDuration || (state.language === 'hi' ? '3 दिन' : '3 Days')}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Document-Extracted Medical History Card (Shown only if document symptoms exist; omitted if no symptoms detected) */}
                {hasDocSymptoms ? (
                  <div
                    id="summary-card-medical-history"
                    className="bg-surface-container rounded-2xl border border-outline-variant p-5 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between pb-3 border-b border-outline-variant/60 mb-3 gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5 flex-shrink-0">
                            history
                          </span>
                          <div>
                            <h3 className="font-bold text-base text-on-surface leading-snug">
                              {state.language === 'hi'
                                ? `पिछला चिकित्सा इतिहास (अपलोड किए गए दस्तावेज़ों से${docDate ? ` - ${docDate}` : ''})`
                                : `Medical History (from uploaded documents${docDate ? ` - ${docDate}` : ''})`}
                            </h3>
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                              {state.language === 'hi'
                                ? `दस्तावेज़ रिकॉर्ड${docDate ? ` (${docDate})` : ''} • वर्तमान शिकायत नहीं`
                                : `Historical findings from document${docDate ? ` (${docDate})` : ''} • Not current complaints`}
                            </p>
                          </div>
                        </div>
                        <button
                          id="btn-edit-medical-history"
                          onClick={() => onJumpToStep('documents')}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 flex-shrink-0"
                        >
                          <span>{t.edit}</span>
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>

                      {/* Historical symptoms / complaints extracted from document */}
                      <div className="mb-3.5">
                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                          {t.historicalSymptomsConditions}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {docSymptoms.map((sym, idx) => (
                            <span
                              key={`doc-sym-${idx}`}
                              id={`summary-doc-symptom-${idx}`}
                              className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/30 flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xs">
                                history
                              </span>
                              <span>{sym}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Document medications (only if extracted, no dummy data) */}
                      {hasDocMedications && (
                        <div>
                          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                            {t.medications}
                          </span>
                          <ul className="flex flex-col gap-1.5">
                            {docMedications.map((med, idx) => (
                              <li
                                key={`doc-med-${idx}`}
                                className="text-xs text-on-surface flex items-start gap-2 bg-surface-container-high/60 px-2.5 py-1.5 rounded-lg border border-outline-variant/40"
                              >
                                <span className="material-symbols-outlined text-primary text-sm flex-shrink-0 mt-0.5">
                                  pill
                                </span>
                                <span className="font-mono text-xs font-semibold">{med}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : hasDocMedications ? (
                  /* When document has medications but no symptoms, render medications only without dummy conditions */
                  <div
                    id="summary-card-document-medications"
                    className="bg-surface-container rounded-2xl border border-outline-variant p-5 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between pb-3 border-b border-outline-variant/60 mb-3 gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-primary text-xl mt-0.5 flex-shrink-0">
                            medication
                          </span>
                          <div>
                            <h3 className="font-bold text-base text-on-surface leading-snug">
                              {state.language === 'hi'
                                ? `दवाइयाँ (अपलोड किए गए दस्तावेज़ों से${docDate ? ` - ${docDate}` : ''})`
                                : `Medications (from uploaded documents${docDate ? ` - ${docDate}` : ''})`}
                            </h3>
                            <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                              {state.language === 'hi'
                                ? `दस्तावेज़ से निकाली गई दवाइयाँ${docDate ? ` (${docDate})` : ''}`
                                : `Prescription drugs extracted from document${docDate ? ` (${docDate})` : ''}`}
                            </p>
                          </div>
                        </div>
                        <button
                          id="btn-edit-doc-medications"
                          onClick={() => onJumpToStep('documents')}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 flex-shrink-0"
                        >
                          <span>{t.edit}</span>
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>

                      <div>
                        <ul className="flex flex-col gap-1.5">
                          {docMedications.map((med, idx) => (
                            <li
                              key={`doc-med-only-${idx}`}
                              className="text-xs text-on-surface flex items-start gap-2 bg-surface-container-high/60 px-2.5 py-1.5 rounded-lg border border-outline-variant/40"
                            >
                              <span className="material-symbols-outlined text-primary text-sm flex-shrink-0 mt-0.5">
                                pill
                              </span>
                              <span className="font-mono text-xs font-semibold">{med}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* 3. AYUSH Card */}
                <div className="bg-surface-container rounded-2xl border border-outline-variant p-5 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">spa</span>
                        <h3 className="font-bold text-base text-on-surface">
                          {t.ayushCardTitle}
                        </h3>
                      </div>
                      <button
                        onClick={() => onJumpToStep('ayush')}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>{t.edit}</span>
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 text-xs">
                      <div>
                        <span className="font-bold text-on-surface block mb-0.5">
                          Prakriti / {t.currentTreatments}
                        </span>
                        <span className="text-on-surface-variant uppercase font-semibold text-primary">
                          {state.ayush.dietLifestyle} Constitution ({state.ayush.consultationType} consultation)
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-[11px] bg-surface p-2 rounded-lg border border-outline-variant/60">
                        {t.ayushNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Documents Card */}
                <div className="bg-surface-container rounded-2xl border border-outline-variant p-5 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">
                          description
                        </span>
                        <h3 className="font-bold text-base text-on-surface">
                          {t.documentsCardTitle}
                        </h3>
                      </div>
                      <button
                        onClick={() => onJumpToStep('documents')}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>{t.edit}</span>
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>

                    {state.documents.length === 0 ? (
                      <span className="text-xs text-on-surface-variant italic">
                        {state.language === 'hi' ? 'कोई दस्तावेज़ संलग्न नहीं है' : 'No documents attached'}
                      </span>
                    ) : (
                      <div className="flex items-center gap-3 overflow-x-auto pb-1">
                        {state.documents.slice(0, 3).map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-outline-variant/60 max-w-[150px] flex-shrink-0"
                          >
                            <div className="w-10 h-10 rounded-lg bg-surface-container-highest overflow-hidden flex-shrink-0">
                              <img
                                src={doc.imageUrl}
                                alt={doc.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[11px] font-medium text-on-surface truncate">
                              {doc.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
            <button
              id="btn-whatsapp-summary"
              onClick={() => {
                playTapTone(440, 0.04);
                onOpenWhatsappModal();
              }}
              className="w-full sm:w-auto py-3.5 px-6 rounded-full border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-variant font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-primary text-base">chat</span>
              <span>{t.getWhatsappSummary}</span>
            </button>

            <button
              id="btn-confirm-send-doctor"
              onClick={handleSendToDoctor}
              className="w-full sm:w-auto py-4 px-10 rounded-full bg-primary text-on-primary font-extrabold text-base hover:bg-primary-container shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>{t.confirmAndSend}</span>
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
