import React from 'react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playTapTone } from '../utils/audio';

interface SharedFooterProps {
  language: LanguageCode;
  onOpenLanguage: () => void;
  onOpenHelp: () => void;
  onOpenPrivacy: () => void;
  hideOnMobileIntake?: boolean;
}

export const SharedFooter: React.FC<SharedFooterProps> = ({
  language,
  onOpenLanguage,
  onOpenHelp,
  onOpenPrivacy,
  hideOnMobileIntake = false,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <footer
      id="shared-footer"
      className={`${
        hideOnMobileIntake ? 'hidden md:flex' : 'flex'
      } fixed bottom-0 left-0 w-full justify-between items-center px-4 md:px-12 h-14 z-40 bg-surface-container-low border-t border-outline-variant text-sm md:pl-[350px] transition-all`}
    >
      <div className="font-semibold text-on-surface text-xs md:text-sm truncate">
        {t.copyright}
      </div>
      <nav className="flex items-center gap-4 md:gap-8 flex-shrink-0">
        <button
          id="footer-lang-btn"
          onClick={() => {
            playTapTone(440, 0.04);
            onOpenLanguage();
          }}
          className="text-on-surface-variant hover:text-primary transition-colors text-xs md:text-sm font-medium"
        >
          {t.footerLanguage}
        </button>
        <button
          id="footer-help-btn"
          onClick={() => {
            playTapTone(440, 0.04);
            onOpenHelp();
          }}
          className="text-on-surface-variant hover:text-primary transition-colors text-xs md:text-sm font-medium"
        >
          {t.footerHelp}
        </button>
        <button
          id="footer-privacy-btn"
          onClick={() => {
            playTapTone(440, 0.04);
            onOpenPrivacy();
          }}
          className="text-on-surface-variant hover:text-primary transition-colors text-xs md:text-sm font-medium"
        >
          {t.footerPrivacy}
        </button>
      </nav>
    </footer>
  );
};
