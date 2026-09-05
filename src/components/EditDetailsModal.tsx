import React, { useState } from 'react';
import { ExtractedData, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playSuccessChime } from '../utils/audio';

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  initialData: ExtractedData;
  onSave: (data: ExtractedData) => void;
}

export const EditDetailsModal: React.FC<EditDetailsModalProps> = ({
  isOpen,
  onClose,
  language,
  initialData,
  onSave,
}) => {
  const [name, setName] = useState(initialData.patientName || '');
  const [date, setDate] = useState(initialData.dob || initialData.date || initialData.dateOfBirth || '');
  const [symptomsText, setSymptomsText] = useState((initialData.symptoms || []).join('\n'));
  const [medsText, setMedsText] = useState((initialData.medications || []).join('\n'));

  // Sync inputs whenever modal opens or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setName(initialData.patientName || '');
      setDate(initialData.dob || initialData.date || initialData.dateOfBirth || '');
      setSymptomsText((initialData.symptoms || []).join('\n'));
      setMedsText((initialData.medications || []).join('\n'));
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessChime();
    const parsedSymptoms = symptomsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedMeds = medsText
      .split('\n')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    onSave({
      ...initialData,
      patientName: name.trim() || null,
      date: date.trim() || null,
      dob: date.trim() || null,
      dateOfBirth: date.trim() || null,
      symptoms: parsedSymptoms,
      medications: parsedMeds,
      isAiExtracted: true,
    });
    onClose();
  };

  return (
    <div
      id="edit-details-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="edit-details-modal-content"
        className="w-full max-w-lg bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
            <h3 className="text-xl font-bold text-on-surface">{t.editDetails}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">
              {t.patientName}
            </label>
            <input
              type="text"
              value={name}
              placeholder="e.g. Rajesh Kumar"
              onChange={(e) => setName(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">
              {t.dateOfBirth}
            </label>
            <input
              type="text"
              value={date}
              placeholder="e.g. 15/08/1990 or Oct 24, 2023"
              onChange={(e) => setDate(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center justify-between">
              <span>{t.extractedSymptoms} (One per line)</span>
              <span className="text-[10px] text-primary">Patient complaints</span>
            </label>
            <textarea
              rows={3}
              value={symptomsText}
              placeholder="e.g. Fever, Headache, Cough"
              onChange={(e) => setSymptomsText(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary focus:outline-none text-sm font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center justify-between">
              <span>{t.medications} (One per line)</span>
              <span className="text-[10px] text-primary">Prescription / Drugs</span>
            </label>
            <textarea
              rows={4}
              value={medsText}
              placeholder="e.g. Paracetamol 500mg, 1 tablet twice daily"
              onChange={(e) => setMedsText(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary focus:outline-none text-sm font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-variant font-medium"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-on-primary hover:bg-primary-container transition-colors"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
