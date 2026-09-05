import React, { useEffect } from 'react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { playSuccessChime, playTapTone } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface TokenScreenProps {
  language: LanguageCode;
  tokenNumber: string;
  estimatedWaitMinutes: number;
  doctorName: string;
  onReturnHome: () => void;
}

export const TokenScreen: React.FC<TokenScreenProps> = ({
  language,
  tokenNumber,
  estimatedWaitMinutes,
  doctorName,
  onReturnHome,
}) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    playSuccessChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#61f9b1', '#3ddc97', '#ffd8b6', '#ffffff'],
    });
  }, []);

  return (
    <div
      id="token-screen"
      className="flex flex-col flex-1 items-center justify-center w-full max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center pb-28 md:pb-20"
    >
      {/* Large Green Check Circle */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-xl relative animate-scale-in">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        <span className="material-symbols-outlined text-5xl sm:text-6xl fill">
          check_circle
        </span>
      </div>

      {/* Main Complete Headline */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">
        {t.intakeCompleteTitle}
      </h2>
      <p className="text-base sm:text-lg text-on-surface-variant max-w-md mb-8">
        Your clinical summary has been sent directly to{' '}
        <strong className="text-on-surface">{doctorName || "Dr. Sharma's"}</strong> desk.
      </p>

      {/* Styled Ticket / Token Card */}
      <div className="w-full bg-surface-container border border-outline-variant rounded-3xl overflow-hidden shadow-2xl mb-8 relative group">
        {/* Top Accent Stripe */}
        <div className="h-2.5 w-full bg-primary" />

        <div className="p-6 sm:p-8 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest font-extrabold text-on-surface-variant mb-2">
            {t.yourTokenNumber}
          </span>

          <div className="text-5xl sm:text-6xl md:text-7xl font-black text-primary font-mono tracking-wider my-3 drop-shadow-sm">
            {tokenNumber || 'A-104'}
          </div>

          <div className="w-full border-t border-dashed border-outline-variant my-4" />

          <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-primary text-xl">
              schedule
            </span>
            <span>
              {t.estimatedWait}: <strong className="text-on-surface">{estimatedWaitMinutes} mins</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Return to Home CTA */}
      <button
        id="btn-return-home"
        onClick={() => {
          playTapTone(440, 0.04);
          onReturnHome();
        }}
        className="w-full sm:w-auto px-12 py-4 rounded-full bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-on-surface font-extrabold text-base transition-all flex items-center justify-center gap-2 shadow hover:border-primary active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-xl">refresh</span>
        <span>{t.returnToHome}</span>
      </button>
    </div>
  );
};
