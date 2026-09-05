import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { LanguageCode } from '../types';
import { playSuccessChime, playTapTone } from '../utils/audio';

interface WhatsAppSMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  tokenNumber: string;
  patientName: string;
}

export const WhatsAppSMSModal: React.FC<WhatsAppSMSModalProps> = ({
  isOpen,
  onClose,
  language,
  tokenNumber,
  patientName,
}) => {
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    playSuccessChime();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setPhone('');
      onClose();
    }, 2200);
  };

  return (
    <div
      id="whatsapp-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="whatsapp-modal-content"
        className="w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">chat</span>
            <h3 className="text-xl font-bold text-on-surface">{t.getWhatsappSummary}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {sent ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl fill">check_circle</span>
            </div>
            <h4 className="text-lg font-bold text-on-surface">Summary Dispatched!</h4>
            <p className="text-sm text-on-surface-variant max-w-xs">
              A copy of token <strong className="text-primary">{tokenNumber}</strong> and your clinical intake summary has been sent to{' '}
              <span className="text-on-surface font-mono">+91 {phone}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="py-6 flex flex-col gap-4">
            <p className="text-sm text-on-surface-variant">
              Receive your token status updates and electronic receipt directly on your mobile device.
            </p>

            {/* Channel Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-surface p-1 rounded-xl border border-outline-variant">
              <button
                type="button"
                onClick={() => {
                  playTapTone(440, 0.04);
                  setChannel('whatsapp');
                }}
                className={`py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  channel === 'whatsapp'
                    ? 'bg-[#25D366] text-black font-bold shadow'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTapTone(440, 0.04);
                  setChannel('sms');
                }}
                className={`py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  channel === 'sms'
                    ? 'bg-primary text-on-primary font-bold shadow'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>SMS Message</span>
              </button>
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">
                10-Digit Mobile Number (India)
              </label>
              <div className="flex items-center bg-surface border border-outline-variant rounded-xl px-3 py-2.5 focus-within:border-primary">
                <span className="text-sm font-mono text-on-surface-variant mr-2">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="bg-transparent text-on-surface font-mono text-base tracking-wider focus:outline-none w-full"
                  required
                />
              </div>
            </div>

            <div className="bg-surface-container-high p-3 rounded-lg border border-outline-variant text-xs text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">info</span>
              <span>Patient Name: <strong>{patientName || (language === 'hi' ? 'मरीज' : 'Patient')}</strong></span>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-variant font-medium"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={phone.length < 10}
                className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
