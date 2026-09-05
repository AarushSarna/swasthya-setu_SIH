import React from 'react';
import { LanguageCode, StepId } from '../types';
import { STEPS_CONFIG } from '../data/constants';
import { TRANSLATIONS } from '../data/translations';
import { playTapTone } from '../utils/audio';

interface NavigationSidebarProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  language: LanguageCode;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentStep,
  onSelectStep,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <aside
      id="side-nav-bar"
      className="hidden md:flex flex-col py-margin-page gap-stack-gap z-40 bg-surface-container border-r border-outline-variant fixed left-0 top-0 h-full w-80 select-none overflow-y-auto"
    >
      {/* Brand Header */}
      <div className="px-container-padding cursor-pointer" onClick={() => onSelectStep('welcome')}>
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-primary text-3xl fill">healing</span>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Swasthya Setu</h1>
        </div>
        <div className="mt-3">
          <p className="text-xl font-semibold text-on-surface leading-tight">{t.stepProgress}</p>
          <p className="text-sm text-on-surface-variant mt-1">{t.intakeProcess}</p>
        </div>
      </div>

      {/* Navigation List */}
      <ul className="flex flex-col gap-2 px-4 mt-2">
        {STEPS_CONFIG.map((step) => {
          const isActive = currentStep === step.id;
          
          return (
            <li key={step.id}>
              <button
                id={`nav-btn-${step.id}`}
                onClick={() => {
                  playTapTone(440, 0.04);
                  onSelectStep(step.id);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl ${
                    isActive ? 'fill' : ''
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {step.icon}
                </span>
                <span className="text-base font-medium flex-1">{step.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-on-primary-container animate-pulse" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bottom Hint in Sidebar */}
      <div className="mt-auto px-container-padding pt-4 border-t border-outline-variant/50">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-sm fill">verified_user</span>
          <span>ABHA Digital Health Kiosk</span>
        </div>
      </div>
    </aside>
  );
};
