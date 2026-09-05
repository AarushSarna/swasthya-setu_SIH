import React from 'react';
import { AyushDetails, LanguageCode, PrakritiType } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { playTapTone } from '../../utils/audio';

interface AyushScreenProps {
  language: LanguageCode;
  ayush: AyushDetails;
  onUpdateAyush: (data: Partial<AyushDetails>) => void;
  onNext: () => void;
}

export const AyushScreen: React.FC<AyushScreenProps> = ({
  language,
  ayush,
  onUpdateAyush,
  onNext,
}) => {
  const t = TRANSLATIONS[language];

  const cards: Array<{
    id: PrakritiType;
    title: string;
    desc: string;
    icon: string;
    colorClass: string;
    sublabel: string;
  }> = [
    {
      id: 'vata',
      title: t.vataTitle,
      desc: t.vataDesc,
      icon: 'air',
      colorClass: 'text-sky-300',
      sublabel: 'Vata Dominant',
    },
    {
      id: 'pitta',
      title: t.pittaTitle,
      desc: t.pittaDesc,
      icon: 'local_fire_department',
      colorClass: 'text-amber-400',
      sublabel: 'Pitta Dominant',
    },
    {
      id: 'kapha',
      title: t.kaphaTitle,
      desc: t.kaphaDesc,
      icon: 'water_drop',
      colorClass: 'text-teal-300',
      sublabel: 'Kapha Dominant',
    },
    {
      id: 'mixed',
      title: t.mixedTitle,
      desc: t.mixedDesc,
      icon: 'join_inner',
      colorClass: 'text-purple-300',
      sublabel: 'Tridoshic / Mixed',
    },
  ];

  return (
    <div
      id="ayush-screen"
      className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-20"
    >
      {/* Top Consultation Type Segmented Toggle */}
      <div className="flex justify-center sm:justify-start mb-6">
        <div className="inline-flex p-1 rounded-2xl bg-surface-container border border-outline-variant">
          <button
            id="tab-modern-consult"
            onClick={() => {
              playTapTone(420, 0.04);
              onUpdateAyush({ consultationType: 'modern' });
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              ayush.consultationType === 'modern'
                ? 'bg-surface-container-high text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.modernConsultation}
          </button>
          <button
            id="tab-ayush-consult"
            onClick={() => {
              playTapTone(500, 0.04);
              onUpdateAyush({ consultationType: 'ayush' });
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              ayush.consultationType === 'ayush'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">spa</span>
            <span>{t.ayushConsultation}</span>
          </button>
        </div>
      </div>

      {/* Header & Subtitle */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">
          {t.dashavidhaPariksha}
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
          {t.ayushHeadline}
        </h2>
        <p className="text-sm md:text-base text-on-surface-variant max-w-2xl">
          {t.ayushSub}
        </p>
      </div>

      {/* 4 Bento Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {cards.map((card) => {
          const isSelected = ayush.dietLifestyle === card.id;
          return (
            <div
              key={card.id}
              id={`ayush-card-${card.id}`}
              onClick={() => {
                playTapTone(460, 0.04);
                onUpdateAyush({ dietLifestyle: card.id });
              }}
              className={`flex flex-col justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group active:scale-[0.99] ${
                isSelected
                  ? 'border-primary bg-surface-container-high shadow-lg ring-1 ring-primary/40'
                  : 'border-outline-variant/60 bg-surface-container hover:border-outline hover:bg-surface-container-high'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center ${card.colorClass}`}
                >
                  <span className="material-symbols-outlined text-2xl fill">
                    {card.icon}
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant bg-surface'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-sm font-bold">
                      check
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-on-surface">{card.title}</h3>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded">
                    {card.sublabel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integrative Care Notice */}
      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant flex items-start gap-3 mb-8">
        <span className="material-symbols-outlined text-primary text-xl mt-0.5">
          healing
        </span>
        <div className="text-xs text-on-surface-variant">
          <strong className="text-on-surface font-semibold">Integrative AYUSH Clinical Record:</strong>{' '}
          This lifestyle information helps your physician evaluate metabolic Agni, Dhatu nutrition, and customize holistic prescriptions safely alongside modern medication.
        </div>
      </div>

      {/* Next Action Button */}
      <div className="flex justify-end mt-auto">
        <button
          id="btn-ayush-next"
          onClick={() => {
            playTapTone(520, 0.05);
            onNext();
          }}
          className="w-full sm:w-auto py-4 px-10 rounded-full bg-primary text-on-primary font-extrabold text-base sm:text-lg hover:bg-primary-container shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>{t.next}</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
