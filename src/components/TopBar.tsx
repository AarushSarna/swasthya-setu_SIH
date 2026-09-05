import React from 'react';
import { LanguageCode, StepId } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playTapTone } from '../utils/audio';

interface TopBarProps {
  currentStep: StepId;
  stepNumber: number;
  totalSteps: number;
  onBack: () => void;
  onOpenLanguage: () => void;
  language: LanguageCode;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentStep,
  stepNumber,
  totalSteps,
  onBack,
  onOpenLanguage,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header
      id="top-app-bar"
      className="flex justify-between items-center h-16 px-4 md:px-8 w-full z-50 bg-background border-b border-outline-variant sticky top-0 md:hidden"
    >
      <div className="flex items-center gap-3">
        {currentStep !== 'welcome' && (
          <button
            id="mobile-back-btn"
            onClick={() => {
              playTapTone(380, 0.04);
              onBack();
            }}
            aria-label="Go back"
            className="text-on-surface-variant hover:bg-surface-variant p-2 rounded-full h-10 w-10 flex items-center justify-center transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl fill">healing</span>
          <h1 className="text-xl font-bold text-primary tracking-tight">Swasthya Setu</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentStep !== 'welcome' && currentStep !== 'token' && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant">
            Step {stepNumber} of {totalSteps}
          </span>
        )}
        <button
          onClick={() => {
            playTapTone(440, 0.04);
            onOpenLanguage();
          }}
          className="text-xs font-semibold px-2 py-1 rounded-md bg-surface-container-high text-primary border border-outline-variant flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">translate</span>
          <span className="uppercase">{language}</span>
        </button>
      </div>
    </header>
  );
};
