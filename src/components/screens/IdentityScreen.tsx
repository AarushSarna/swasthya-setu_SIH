import React, { useState } from 'react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { playSuccessChime, playTapTone } from '../../utils/audio';

interface IdentityScreenProps {
  language: LanguageCode;
  abhaNumber: string;
  onUpdateAbha: (val: string) => void;
  onVerify: () => void;
  onSkip: () => void;
  onOpenQrScanner: () => void;
}

export const IdentityScreen: React.FC<IdentityScreenProps> = ({
  language,
  abhaNumber,
  onUpdateAbha,
  onVerify,
  onSkip,
  onOpenQrScanner,
}) => {
  const t = TRANSLATIONS[language];
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanDigits = abhaNumber.replace(/\D/g, '').slice(0, 14);

  // Format 14 digits as 4 groups: 12-3456-7890-1234 or 1234 5678 9012 34
  const formatDisplay = (digits: string) => {
    if (!digits) return '';
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleKeyPress = (num: string) => {
    playTapTone(400 + parseInt(num, 10) * 20, 0.04);
    if (cleanDigits.length < 14) {
      const nextDigits = cleanDigits + num;
      onUpdateAbha(formatDisplay(nextDigits));
      setErrorMsg(null);
    }
  };

  const handleBackspace = () => {
    playTapTone(350, 0.04);
    if (cleanDigits.length > 0) {
      const nextDigits = cleanDigits.slice(0, -1);
      onUpdateAbha(formatDisplay(nextDigits));
    }
  };

  const handleClear = () => {
    playTapTone(300, 0.04);
    onUpdateAbha('');
    setErrorMsg(null);
  };

  const handleVerifyClick = () => {
    if (cleanDigits.length === 14) {
      playSuccessChime();
      onVerify();
    } else {
      setErrorMsg('Please enter a complete 14-digit ABHA number or scan your QR code.');
    }
  };

  return (
    <div
      id="identity-screen"
      className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-20"
    >
      {/* Title & Subtitle */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-2">
          {t.provideAbha}
        </h2>
        <p className="text-base md:text-lg text-on-surface-variant max-w-2xl">
          {t.provideAbhaSub}
        </p>
      </div>

      {/* Main Grid: Input + Keypad & QR Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Number Display + Onscreen Keypad */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* ABHA Display Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t.abhaLabel}
            </label>
            <div className="relative flex items-center bg-surface-container border-2 border-outline-variant focus-within:border-primary rounded-2xl px-5 py-4 min-h-[64px] transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl mr-3">
                badge
              </span>
              <input
                type="text"
                readOnly
                value={formatDisplay(cleanDigits)}
                placeholder="1234 5678 9012 34"
                className="bg-transparent text-xl md:text-2xl font-mono font-bold tracking-widest text-on-surface focus:outline-none w-full placeholder:text-outline/60"
              />
              {cleanDigits.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
            {errorMsg && (
              <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          {/* Touch Number Keypad */}
          <div className="bg-surface-container rounded-3xl p-4 sm:p-5 border border-outline-variant shadow-lg">
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  id={`keypad-btn-${digit}`}
                  onClick={() => handleKeyPress(digit)}
                  className="h-14 sm:h-16 rounded-2xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-bold text-2xl border border-outline-variant/50 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                id="keypad-btn-clear"
                onClick={handleClear}
                className="h-14 sm:h-16 rounded-2xl bg-surface-container-low hover:bg-surface-variant text-on-surface-variant font-medium text-sm border border-outline-variant/40 active:scale-95 transition-all flex items-center justify-center"
              >
                Clear
              </button>
              <button
                id="keypad-btn-0"
                onClick={() => handleKeyPress('0')}
                className="h-14 sm:h-16 rounded-2xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-bold text-2xl border border-outline-variant/50 active:scale-95 transition-all flex items-center justify-center shadow-sm"
              >
                0
              </button>
              <button
                id="keypad-btn-backspace"
                onClick={handleBackspace}
                className="h-14 sm:h-16 rounded-2xl bg-surface-container-low hover:bg-surface-variant text-primary font-bold text-xl border border-outline-variant/40 active:scale-95 transition-all flex items-center justify-center"
              >
                <span className="material-symbols-outlined">backspace</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: QR Code Option & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Scan QR Bento Box */}
          <div
            id="scan-qr-box"
            onClick={() => {
              playTapTone(440, 0.04);
              onOpenQrScanner();
            }}
            className="flex flex-col items-center justify-center p-8 rounded-3xl bg-surface-container border-2 border-dashed border-outline hover:border-primary hover:bg-surface-container-high transition-all cursor-pointer group text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-primary text-4xl">
                qr_code_scanner
              </span>
            </div>
            <h3 className="font-bold text-lg text-on-surface mb-1">{t.scanQrCode}</h3>
            <p className="text-xs text-on-surface-variant max-w-[200px]">
              Tap here to scan the QR printed on your Ayushman card.
            </p>
          </div>

          {/* Primary Verify Action */}
          <button
            id="btn-verify-abha"
            onClick={handleVerifyClick}
            className="w-full py-4 rounded-full bg-primary text-on-primary font-extrabold text-base sm:text-lg hover:bg-primary-container shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{t.verifyAbha}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>

          {/* Secondary Skip Action */}
          <button
            id="btn-skip-abha"
            onClick={() => {
              playTapTone(380, 0.04);
              onSkip();
            }}
            className="w-full py-3 text-center text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            {t.continueWithoutAbha}
          </button>
        </div>
      </div>
    </div>
  );
};
