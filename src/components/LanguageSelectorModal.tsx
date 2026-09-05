import React from 'react';
import { LANGUAGES } from '../data/constants';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playTapTone } from '../utils/audio';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[currentLanguage];

  return (
    <div
      id="language-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="language-modal-content"
        className="w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">translate</span>
            <h3 className="text-xl font-bold text-on-surface">{t.selectLanguage}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 py-6">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                id={`modal-lang-btn-${lang.code}`}
                onClick={() => {
                  playTapTone(500, 0.05);
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-outline-variant bg-surface hover:border-primary/50 text-on-surface'
                }`}
              >
                <span className="text-3xl mb-1">{lang.flag}</span>
                <span className="font-bold text-base">{lang.nativeName}</span>
                <span className="text-xs text-on-surface-variant">{lang.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-medium hover:bg-surface-variant transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
