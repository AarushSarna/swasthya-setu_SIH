import React from 'react';
import { TRANSLATIONS } from '../data/translations';
import { LanguageCode } from '../types';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  return (
    <div
      id="help-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="help-modal-content"
        className="w-full max-w-lg bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">help</span>
            <h3 className="text-xl font-bold text-on-surface">{t.footerHelp}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-6 flex flex-col gap-5 text-sm">
          {/* ABHA National Helpline */}
          <div className="bg-surface p-4 rounded-xl border border-outline-variant">
            <div className="flex items-center gap-2 text-primary font-bold text-base mb-1">
              <span className="material-symbols-outlined text-xl">phone_in_talk</span>
              <span>National Health Authority (ABHA) Toll-Free</span>
            </div>
            <p className="text-on-surface text-lg font-mono font-bold tracking-wider">14477 / 1800-11-4477</p>
            <p className="text-on-surface-variant text-xs mt-1">Available 24/7 in 12 Indian Languages</p>
          </div>

          {/* Hospital Helpdesk */}
          <div className="bg-surface p-4 rounded-xl border border-outline-variant">
            <div className="flex items-center gap-2 text-on-surface font-bold text-base mb-1">
              <span className="material-symbols-outlined text-primary text-xl">local_hospital</span>
              <span>Hospital Triage & OPD Assistance</span>
            </div>
            <p className="text-on-surface-variant">
              If you have trouble using the kiosk, please approach the <strong>Ground Floor Helpdesk (Counter 4)</strong> or request our Care Navigator for hands-on assistance.
            </p>
          </div>

          {/* Common Questions */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider">Frequently Asked Questions</h4>
            <div className="bg-surface-container-high p-3 rounded-lg border border-outline-variant">
              <p className="font-semibold text-primary text-xs">What if I do not have an ABHA Card?</p>
              <p className="text-on-surface-variant text-xs mt-0.5">
                You can tap &quot;Continue without ABHA&quot; on Step 2. You will still receive your token and can create an ABHA account later with the hospital clerk.
              </p>
            </div>
            <div className="bg-surface-container-high p-3 rounded-lg border border-outline-variant">
              <p className="font-semibold text-primary text-xs">What is Dashavidha Pariksha (AYUSH)?</p>
              <p className="text-on-surface-variant text-xs mt-0.5">
                It is a traditional 10-fold clinical assessment determining your physiological constitution (Vata, Pitta, Kapha) to provide personalized Ayurvedic integrative care.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-outline-variant">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary-container transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
