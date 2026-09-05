import React from 'react';
import { LANGUAGES } from '../../data/constants';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { playTapTone } from '../../utils/audio';

interface WelcomeScreenProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onBegin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  currentLanguage,
  onSelectLanguage,
  onBegin,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <div
      id="welcome-screen"
      className="flex flex-col min-h-screen w-full relative bg-background text-on-surface select-none pb-24 md:pb-16"
    >
      {/* Top Header / Trust Badge */}
      <header className="flex justify-between items-center w-full px-6 md:px-16 pt-8 md:pt-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl fill">healing</span>
          <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">Swasthya Setu</span>
        </div>

        {/* ABHA Badge */}
        <div
          id="abha-trust-badge"
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container border border-outline-variant shadow-sm"
        >
          <span className="material-symbols-outlined text-primary text-xl fill">verified</span>
          <span className="text-xs md:text-sm font-bold text-primary tracking-wide">
            {t.trustBadge}
          </span>
          <span className="text-[11px] text-on-surface-variant hidden sm:inline">
            Digital Health Mission
          </span>
        </div>
      </header>

      {/* Main Hero & Language Bento */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-8 max-w-4xl mx-auto my-auto py-10 w-full">
        {/* Large Decorative Icon & Titles */}
        <div className="mb-8 md:mb-12 flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-surface-container border border-outline-variant flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 transition-opacity group-hover:opacity-20" />
            <span className="material-symbols-outlined text-primary text-5xl md:text-6xl fill transition-transform duration-300 group-hover:scale-110">
              healing
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-3">
            {t.appName}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-on-surface-variant max-w-xl">
            {t.appSubtitle}
          </p>
        </div>

        {/* Language Selection Bento Grid */}
        <div className="w-full max-w-xl mb-10 md:mb-12">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-4">
            {t.selectLanguage}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`welcome-lang-btn-${lang.code}`}
                  onClick={() => {
                    playTapTone(480, 0.04);
                    onSelectLanguage(lang.code);
                  }}
                  className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                    isSelected
                      ? 'border-primary bg-surface-container-highest shadow-md ring-2 ring-primary/20'
                      : 'border-outline-variant/60 bg-surface-container hover:border-outline hover:bg-surface-container-high'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-base sm:text-lg text-on-surface">
                      {lang.nativeName}
                    </div>
                    <div className="text-xs text-on-surface-variant font-medium">
                      {lang.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lang.flag}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-xl fill">
                        check_circle
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Tap to Begin CTA */}
        <button
          id="btn-tap-to-begin"
          onClick={() => {
            playTapTone(520, 0.06);
            onBegin();
          }}
          className="group relative inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-5 rounded-full bg-primary text-on-primary font-extrabold text-lg sm:text-xl shadow-xl hover:bg-primary-container transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <span>{t.tapToBegin}</span>
          <span className="material-symbols-outlined text-2xl transition-transform duration-200 group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
      </main>
    </div>
  );
};
