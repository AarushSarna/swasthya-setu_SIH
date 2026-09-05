import React, { useRef, useState, useEffect } from 'react';
import { DocumentItem, ExtractedData, LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { MOCKUP_IMAGES } from '../../data/constants';
import { playSuccessChime, playTapTone } from '../../utils/audio';

interface DocumentsScreenProps {
  language: LanguageCode;
  documents: DocumentItem[];
  extractedData: ExtractedData;
  patientName?: string | null;
  dob?: string | null;
  onOpenEditModal: () => void;
  onConfirmData: () => void;
  onAddDocument: (doc: DocumentItem) => void;
  onRemoveDocument: (docId: string) => void;
  onUpdateExtractedData: (data: ExtractedData) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  language,
  documents,
  extractedData,
  patientName,
  dob,
  onOpenEditModal,
  onConfirmData,
  onAddDocument,
  onRemoveDocument,
  onUpdateExtractedData,
  onBack,
  onContinue,
}) => {
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDataConfirmed, setIsDataConfirmed] = useState(false);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string>(
    extractedData.documentImageUrl ||
      (documents.length > 0 ? documents[0].imageUrl : MOCKUP_IMAGES.prescriptionScanned)
  );
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    rawResponse?: string;
    modelUsed?: string;
    error?: string;
  } | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Keep preview synced if extractedData updates with new document image
  useEffect(() => {
    if (extractedData.documentImageUrl) {
      setCurrentPreviewUrl(extractedData.documentImageUrl);
    } else if (documents.length > 0 && !currentPreviewUrl) {
      setCurrentPreviewUrl(documents[0].imageUrl);
    }
  }, [extractedData.documentImageUrl, documents]);

  const hasPatientName = Boolean(extractedData.patientName || patientName);
  const displayPatientName = extractedData.patientName || patientName || null;

  const hasDob = Boolean(extractedData.dob || extractedData.date || extractedData.dateOfBirth || dob);
  const displayDob = extractedData.dob || extractedData.date || extractedData.dateOfBirth || dob || null;

  const hasSymptoms =
    Array.isArray(extractedData.symptoms) && extractedData.symptoms.length > 0;

  const hasMedications =
    Array.isArray(extractedData.medications) && extractedData.medications.length > 0;

  const handleTriggerUpload = () => {
    playTapTone(440, 0.04);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setIsProcessing(true);
      setIsDataConfirmed(false);
      setOcrError(null);
      playTapTone(500, 0.05);

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        // Immediately show the uploaded document in preview
        setCurrentPreviewUrl(dataUrl);

        console.log(
          `[OCR Frontend] Uploading document: "${file.name}" (${(file.size / 1024).toFixed(1)} KB, type: "${file.type || 'image/jpeg'}")`
        );
        console.log(`[OCR Frontend] Passing base64 image data to POST /api/ocr-document...`);

        try {
          const response = await fetch('/api/ocr-document', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: dataUrl,
              mimeType: file.type || 'image/jpeg',
            }),
          });

          let ocrResult: any = null;
          try {
            ocrResult = await response.json();
          } catch (jsonErr) {
            console.error('[OCR Frontend] Failed to parse JSON response:', jsonErr);
          }

          if (!response.ok) {
            const apiErrorMsg =
              ocrResult?.error ||
              `API returned HTTP status ${response.status} (${response.statusText})`;
            console.error('[OCR Frontend] API call returned error status:', apiErrorMsg);
            setDebugInfo({
              error: apiErrorMsg,
              rawResponse: ocrResult?.rawResponse,
              modelUsed: ocrResult?.modelUsed,
            });
            throw new Error(apiErrorMsg);
          }

          // Log the raw response and parsed fields as requested
          console.log(
            '[OCR Frontend] Raw response returned by Gemini:\n',
            ocrResult?.rawGeminiResponse
          );
          console.log('[OCR Frontend] Model used:', ocrResult?.modelUsed);
          console.log('[OCR Frontend] Parsed OCR result:', {
            patientName: ocrResult?.patientName,
            dateOfBirth: ocrResult?.dateOfBirth || ocrResult?.date,
            symptoms: ocrResult?.symptoms,
            medications: ocrResult?.medications,
          });

          setDebugInfo({
            rawResponse: ocrResult?.rawGeminiResponse,
            modelUsed: ocrResult?.modelUsed,
          });
          setOcrError(null);

          const newExtractedData: ExtractedData = {
            patientName: ocrResult.patientName || null,
            date: ocrResult.dateOfBirth || ocrResult.date || null,
            dob: ocrResult.dateOfBirth || ocrResult.date || null,
            dateOfBirth: ocrResult.dateOfBirth || ocrResult.date || null,
            symptoms: Array.isArray(ocrResult.symptoms) ? ocrResult.symptoms : [],
            medications: Array.isArray(ocrResult.medications) ? ocrResult.medications : [],
            documentImageUrl: dataUrl,
            isAiExtracted: true,
          };

          onUpdateExtractedData(newExtractedData);

          const newDoc: DocumentItem = {
            id: `doc-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, '') || 'Prescription',
            category: 'prescription',
            imageUrl: dataUrl,
            verified: false,
          };
          onAddDocument(newDoc);
          playSuccessChime();
        } catch (err: any) {
          console.error('[OCR Frontend] Error thrown during OCR call or parsing:', err);
          const errorMsg =
            err?.message ||
            (language === 'hi'
              ? 'दस्तावेज़ पढ़ने में समस्या हुई।'
              : 'Could not read document automatically.');
          setOcrError(errorMsg);
          setDebugInfo((prev) => ({
            ...prev,
            error: errorMsg,
          }));

          const newDoc: DocumentItem = {
            id: `doc-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, '') || 'Uploaded Document',
            category: 'prescription',
            imageUrl: dataUrl,
            verified: false,
          };
          onAddDocument(newDoc);

          onUpdateExtractedData({
            patientName: null,
            date: null,
            dob: null,
            dateOfBirth: null,
            symptoms: [],
            medications: [],
            documentImageUrl: dataUrl,
            isAiExtracted: false,
          });
        } finally {
          setIsProcessing(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };

      reader.onerror = () => {
        setIsProcessing(false);
        setOcrError('Failed to read image file.');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleConfirmClick = () => {
    playSuccessChime();
    setIsDataConfirmed(true);
    onConfirmData();
  };

  const handleRemoveDocument = (docId: string) => {
    playTapTone(300, 0.04);
    const docToRemove = documents.find((d) => d.id === docId);
    onRemoveDocument(docId);

    // If the removed document was currently in preview, switch to remaining or default
    if (docToRemove && currentPreviewUrl === docToRemove.imageUrl) {
      const remaining = documents.filter((d) => d.id !== docId);
      if (remaining.length > 0) {
        setCurrentPreviewUrl(remaining[0].imageUrl);
      } else {
        setCurrentPreviewUrl(MOCKUP_IMAGES.prescriptionScanned);
      }
    }
  };

  return (
    <div
      id="documents-screen"
      className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-20"
    >
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
          {t.uploadDocsTitle}
        </h2>
        <p className="text-sm md:text-base text-on-surface-variant max-w-2xl">
          {t.uploadDocsSub}
        </p>
      </div>

      {/* Hidden File Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Primary Scan CTA Area */}
      <div
        id="scan-prescription-box"
        onClick={handleTriggerUpload}
        className="flex flex-col sm:flex-row items-center justify-between p-5 sm:p-6 rounded-3xl bg-surface-container border-2 border-dashed border-primary/50 hover:border-primary hover:bg-surface-container-high transition-all cursor-pointer group shadow-sm mb-8"
      >
        <div className="flex items-center gap-4 text-center sm:text-left mb-4 sm:mb-0">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-on-primary transition-all flex-shrink-0">
            {isProcessing ? (
              <span className="material-symbols-outlined text-3xl animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-0.5">
              {isProcessing ? t.ocrProcessing : t.scanPrescription}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              {t.scanPrescriptionSub}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm hover:bg-primary-container shadow flex items-center gap-2 group-hover:shadow-primary/20 transition-all flex-shrink-0"
        >
          <span className="material-symbols-outlined text-base">add_a_photo</span>
          <span>{isProcessing ? t.ocrProcessing : 'Open Camera / Upload'}</span>
        </button>
      </div>

      {ocrError && (
        <div
          id="ocr-error-banner"
          className="mb-6 p-4 rounded-2xl bg-error/10 border border-error/30 text-on-surface text-xs sm:text-sm flex flex-col gap-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-error text-xl flex-shrink-0 mt-0.5">
                error
              </span>
              <div>
                <span className="font-bold text-error block">
                  {language === 'hi' ? 'दस्तावेज़ पढ़ने में त्रुटि (OCR Error)' : 'Document Extraction Error'}
                </span>
                <p className="text-on-surface mt-0.5 font-mono text-xs break-all">{ocrError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowDebug(true)}
                className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs text-on-surface hover:bg-surface-variant transition-colors"
              >
                Debug Log
              </button>
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            You can still use the <strong>Edit Details</strong> button below to manually enter or fix the patient name, date, and medications.
          </p>
        </div>
      )}

      {/* Extracted Data OCR Card */}
      <div
        id="extracted-data-card"
        className="bg-surface-container rounded-3xl border border-outline-variant p-5 sm:p-6 mb-8 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline-variant/60 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">
                document_scanner
              </span>
              <h3 className="text-lg font-bold text-on-surface">{t.extractedData}</h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{t.extractedDataSub}</p>
          </div>

          <div className="flex items-center gap-2">
            {isProcessing ? (
              <span
                id="badge-ocr-processing"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{t.ocrProcessing}</span>
              </span>
            ) : isDataConfirmed ? (
              <span
                id="badge-ocr-verified"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
              >
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>{t.ocrVerified}</span>
              </span>
            ) : (
              <span
                id="badge-ocr-review"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40"
              >
                <span className="material-symbols-outlined text-sm">rate_review</span>
                <span>{t.ocrPleaseReview}</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Document Scanned Preview Image */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-outline-variant bg-surface-container-lowest shadow-inner group">
              <img
                src={currentPreviewUrl}
                alt="Scanned Document"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white flex items-center gap-1 z-10">
                <span className="material-symbols-outlined text-xs text-primary">
                  auto_awesome
                </span>
                <span>{t.ocrAiScanned}</span>
              </div>
            </div>
          </div>

          {/* Extracted Fields */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient Name */}
              <div
                id="ocr-field-patient-name"
                className="bg-surface p-3.5 rounded-xl border border-outline-variant/60"
              >
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                  {t.patientName}
                </span>
                {hasPatientName ? (
                  <span className="text-base font-bold text-on-surface">
                    {displayPatientName}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 italic flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">
                      info
                    </span>
                    <span>{t.notDetected}</span>
                  </span>
                )}
              </div>

              {/* Date of Birth / Consultation Date */}
              <div
                id="ocr-field-dob"
                className="bg-surface p-3.5 rounded-xl border border-outline-variant/60"
              >
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                  {t.dateOfBirth}
                </span>
                {hasDob ? (
                  <span className="text-base font-bold text-on-surface font-mono">
                    {displayDob}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 italic flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">
                      info
                    </span>
                    <span>{t.notDetected}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Symptoms Section (Explicitly separated from medications) */}
            <div
              id="ocr-field-symptoms"
              className="bg-surface p-4 rounded-2xl border border-outline-variant/70 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-outline-variant/40">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">sick</span>
                  </span>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    {t.extractedSymptoms}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-sans text-[10px] font-semibold">
                  Patient Complaints
                </span>
              </div>

              {hasSymptoms ? (
                <div className="flex flex-wrap gap-2">
                  {extractedData.symptoms!.map((sym, idx) => (
                    <span
                      key={idx}
                      id={`ocr-symptom-tag-${idx}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-100 border border-amber-500/30 text-xs sm:text-sm font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{sym}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="py-2.5 px-3 rounded-xl bg-surface-container-high/40 border border-dashed border-outline-variant/60 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 dark:text-amber-300 text-base flex-shrink-0">
                    info
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 italic">
                    {t.notDetected}
                  </span>
                </div>
              )}
            </div>

            {/* Medications Section (Explicitly separated from symptoms) */}
            <div
              id="ocr-field-medications"
              className="bg-surface p-4 rounded-2xl border border-outline-variant/70 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-outline-variant/40">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">medication</span>
                  </span>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    {t.medications}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-sans text-[10px] font-semibold">
                  Rx / Drugs & Dosage
                </span>
              </div>

              {hasMedications ? (
                <ul className="flex flex-col gap-2">
                  {extractedData.medications.map((med, idx) => (
                    <li
                      key={idx}
                      id={`ocr-medication-item-${idx}`}
                      className="text-xs sm:text-sm font-medium text-on-surface flex items-start gap-2.5 bg-surface-container-high/60 px-3 py-2 rounded-xl border border-outline-variant/40"
                    >
                      <span className="material-symbols-outlined text-primary text-base flex-shrink-0 mt-0.5">
                        pill
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-semibold">{med}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-2.5 px-3 rounded-xl bg-surface-container-high/40 border border-dashed border-outline-variant/60 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 dark:text-amber-300 text-base flex-shrink-0">
                    info
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 italic">
                    {t.notDetected}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons for Extracted OCR */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                id="btn-edit-ocr"
                onClick={() => {
                  playTapTone(400, 0.04);
                  onOpenEditModal();
                }}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-outline-variant bg-surface-container-high hover:bg-surface-variant text-on-surface transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>{t.editDetails}</span>
              </button>

              <button
                type="button"
                id="btn-confirm-ocr"
                onClick={handleConfirmClick}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow ${
                  isDataConfirmed
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-primary text-on-primary hover:bg-primary-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isDataConfirmed ? 'check_circle' : 'check'}
                </span>
                <span>
                  {isDataConfirmed
                    ? language === 'hi'
                      ? 'पुष्टीकृत'
                      : 'Confirmed'
                    : t.confirm}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visible AI OCR Debug Output (Requirement 2 & 4) */}
      {(debugInfo || ocrError) && (
        <div
          id="ocr-debug-panel"
          className="mb-8 rounded-2xl border border-outline-variant bg-surface-container-low p-4 text-xs font-mono text-on-surface-variant transition-all shadow-sm"
        >
          <div
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setShowDebug(!showDebug)}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="material-symbols-outlined text-primary text-base">code</span>
              <span className="font-sans font-bold text-on-surface text-xs">
                Gemini OCR Live Debug & Raw Output
              </span>
              {debugInfo?.modelUsed && (
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px]">
                  {debugInfo.modelUsed}
                </span>
              )}
              {ocrError && (
                <span className="px-2 py-0.5 rounded-md bg-error/15 text-error font-sans text-[10px] font-semibold">
                  Error detected
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-sans font-medium">
              <span>{showDebug ? 'Hide Details' : 'Show Details'}</span>
              <span className="material-symbols-outlined text-base">
                {showDebug ? 'expand_less' : 'expand_more'}
              </span>
            </div>
          </div>

          {showDebug && (
            <div className="mt-3 pt-3 border-t border-outline-variant/60 flex flex-col gap-3 font-mono text-[11px]">
              {debugInfo?.modelUsed && (
                <div>
                  <span className="font-semibold text-on-surface">Model Invoked:</span>{' '}
                  <span className="text-primary">{debugInfo.modelUsed}</span>
                </div>
              )}

              {debugInfo?.rawResponse ? (
                <div>
                  <span className="font-semibold text-on-surface block mb-1">
                    (a) Raw response returned by Gemini:
                  </span>
                  <pre className="p-3 rounded-xl bg-surface-container-lowest text-emerald-600 dark:text-emerald-400 border border-outline-variant overflow-x-auto whitespace-pre-wrap font-mono">
                    {debugInfo.rawResponse}
                  </pre>
                </div>
              ) : (
                <div className="text-on-surface-variant italic">
                  No raw response returned yet (or request failed before completion).
                </div>
              )}

              {ocrError && (
                <div>
                  <span className="font-semibold text-error block mb-1">
                    (b) Error thrown during API call or JSON parsing:
                  </span>
                  <pre className="p-3 rounded-xl bg-error/10 text-error border border-error/20 overflow-x-auto whitespace-pre-wrap font-mono">
                    {ocrError}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Scanned Documents Gallery */}
      <div className="mb-8">
        <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">
            folder_open
          </span>
          <span>{t.scannedDocuments}</span>
          <span className="text-xs text-on-surface-variant font-normal">
            ({documents.length} attached)
          </span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {documents.map((doc) => {
            const isSelected = currentPreviewUrl === doc.imageUrl;
            return (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                onClick={() => {
                  playTapTone(400, 0.03);
                  setCurrentPreviewUrl(doc.imageUrl);
                }}
                className={`relative bg-surface-container rounded-2xl border transition-all shadow-sm overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-outline-variant hover:border-primary/50'
                }`}
              >
                {/* Delete / Remove (X) Button */}
                <button
                  type="button"
                  id={`btn-remove-doc-${doc.id}`}
                  aria-label={`${t.deleteDocument}: ${doc.title}`}
                  title={t.deleteDocument}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveDocument(doc.id);
                  }}
                  className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-surface-container-lowest/90 hover:bg-error text-on-surface hover:text-white flex items-center justify-center shadow-md transition-all active:scale-90 border border-outline-variant/50"
                >
                  <span className="material-symbols-outlined text-base leading-none">
                    close
                  </span>
                </button>

                <div className="aspect-[4/3] bg-surface-container-lowest overflow-hidden relative">
                  <img
                    src={doc.imageUrl}
                    alt={doc.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white backdrop-blur-sm">
                    {doc.category === 'lab_report'
                      ? 'Lab Report'
                      : doc.category === 'referral'
                      ? 'Referral'
                      : 'Prescription'}
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface truncate pr-2">
                    {doc.title}
                  </span>
                  <span className="material-symbols-outlined text-primary text-sm">
                    {doc.verified || isDataConfirmed ? 'check_circle' : 'visibility'}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Add Another Document Card */}
          <button
            type="button"
            id="btn-add-document-tile"
            onClick={handleTriggerUpload}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-outline-variant/60 hover:border-primary hover:bg-surface-container transition-all text-on-surface-variant hover:text-primary aspect-[4/3]"
          >
            <span className="material-symbols-outlined text-3xl mb-1">
              add_photo_alternate
            </span>
            <span className="text-xs font-bold">+ Add File</span>
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-auto">
        <button
          id="btn-docs-back"
          onClick={() => {
            playTapTone(380, 0.04);
            onBack();
          }}
          className="py-3.5 px-6 rounded-full border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-variant font-bold text-sm transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>{t.back}</span>
        </button>

        <button
          id="btn-docs-continue"
          onClick={() => {
            playTapTone(520, 0.05);
            onContinue();
          }}
          className="py-4 px-10 rounded-full bg-primary text-on-primary font-extrabold text-base hover:bg-primary-container shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <span>{t.continue}</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
