import React from 'react';
import { TRANSLATIONS } from '../data/translations';
import { LanguageCode } from '../types';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  return (
    <div
      id="privacy-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="privacy-modal-content"
        className="w-full max-w-lg bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
            <h3 className="text-xl font-bold text-on-surface">{t.footerPrivacy}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-6 flex flex-col gap-4 text-sm text-on-surface-variant">
          <div className="bg-primary/10 border border-primary/30 p-3.5 rounded-xl">
            <p className="text-primary font-bold text-sm">Ayushman Bharat Digital Mission (ABDM) Compliance</p>
            <p className="text-on-surface text-xs mt-1">
              Swasthya Setu adheres to the Health Data Management Policy (HDMP) issued by the National Health Authority of India.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-on-surface text-sm mb-1">1. Patient Consent Framework</h4>
            <p className="text-xs leading-relaxed">
              Your health intake answers, medical history, and scanned documents are only transmitted to your attending physician upon your direct confirmation at Step 6.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-on-surface text-sm mb-1">2. End-to-End Encryption</h4>
            <p className="text-xs leading-relaxed">
              All digital transmission between the intake terminal and the hospital Electronic Health Record (EHR) is encrypted using AES-256 and TLS 1.3 standards.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-on-surface text-sm mb-1">3. Zero Third-Party Monetization</h4>
            <p className="text-xs leading-relaxed">
              Your diagnostic files and biometric data are never sold, indexed for commercial advertising, or retained past your active clinical consultation session without consent.
            </p>
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
