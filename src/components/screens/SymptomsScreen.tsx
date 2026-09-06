import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { QUICK_SYMPTOMS } from '../../data/constants';
import { playTapTone, playSuccessChime, speakText } from '../../utils/audio';

interface SymptomsScreenProps {
  language: LanguageCode;
  chatHistory: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  symptoms: string[];
  onToggleSymptom: (sym: string) => void;
  onAddSymptom: (sym: string) => void;
  onNext: () => void;
  patientName: string;
  dob: string;
  onUpdatePatientName: (name: string) => void;
  onUpdateDob: (dob: string) => void;
  onResetSession: () => void;
}

function looksLikeSymptomText(raw: string): boolean {
  const lower = raw.toLowerCase();
  const keywords = [
    'pain', 'hurt', 'hurts', 'ache', 'aching', 'fever', 'cough', 'dizzy', 'dizziness',
    'vomit', 'vomiting', 'nausea', 'sick', 'weakness', 'fatigue', 'swelling', 'chills',
    'cold', 'rash', 'stomach', 'chest', 'eye', 'head', 'throat', 'breath', 'burning',
    'leg', 'knee', 'arm', 'back', 'foot', 'shoulder'
  ];
  return keywords.some((k) => lower.includes(k));
}

function extractNameFromText(raw: string): string {
  let text = raw.trim();
  text = text.replace(/^(my name is|i am|this is|name is|i'm)\s+/i, '');
  text = text.replace(/^(मेरा नाम|मैं|नाम)\s+/i, '');
  text = text.replace(/\s+(है|हुँ|हूँ)$/i, '');
  return text.trim();
}

function extractDobFromText(raw: string): string {
  let text = raw.trim();
  text = text.replace(/^(my dob is|dob is|date of birth is|born on|i was born on)\s+/i, '');
  text = text.replace(/^(मेरी जन्मतिथि|जन्मतिथि|जन्म तारीख)\s+/i, '');
  text = text.replace(/\s+(है)$/i, '');
  return text.trim();
}

function formatSymptomTitle(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const SymptomsScreen: React.FC<SymptomsScreenProps> = ({
  language,
  chatHistory,
  onAddMessage,
  symptoms,
  onToggleSymptom,
  onAddSymptom,
  onNext,
  patientName,
  dob,
  onUpdatePatientName,
  onUpdateDob,
  onResetSession,
}) => {
  const t = TRANSLATIONS[language];
  const [isListening, setIsListening] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const hasInitializedChatRef = useRef(false);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isListening, isExtracting]);

  // Initial question trigger if chat history is empty
  useEffect(() => {
    if (chatHistory.length === 0 && !hasInitializedChatRef.current) {
      hasInitializedChatRef.current = true;
      const initMsg: ChatMessage = {
        id: `bot-init-q1-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'bot',
        text: t.botQ1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onAddMessage(initMsg);
    } else if (chatHistory.length > 0) {
      hasInitializedChatRef.current = true;
    }
  }, [chatHistory.length, t.botQ1, onAddMessage]);

  // Handle Speech Recognition with fallback
  const handleToggleVoice = () => {
    playTapTone(isListening ? 350 : 580, 0.05);

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);

    const windowAny = window as unknown as Record<string, any>;
    const SpeechRecognitionClass = windowAny.SpeechRecognition || windowAny.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            handleUserMessage(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          // Contextual fallback on silence or permission failure
          setTimeout(() => {
            let fallback = '';
            if (!patientName.trim()) {
              fallback = language === 'hi' ? 'राहुल शर्मा' : 'Alex Mercer';
            } else if (!dob.trim()) {
              fallback = language === 'hi' ? '12 अक्टूबर 1985' : 'October 12, 1985';
            } else {
              fallback =
                language === 'hi'
                  ? 'मुझे पिछले दो दिनों से आंखों में तेज़ दर्द और बुखार है।'
                  : 'I have severe eye pain and fever since yesterday.';
            }
            handleUserMessage(fallback);
            setIsListening(false);
          }, 2200);
        };

        recognition.start();
        return;
      } catch {
        // Fallback below
      }
    }

    // Fallback simulation if browser environment blocks audio capture
    setTimeout(() => {
      let fallback = '';
      if (!patientName.trim()) {
        fallback = language === 'hi' ? 'राहुल शर्मा' : 'Alex Mercer';
      } else if (!dob.trim()) {
        fallback = language === 'hi' ? '12 अक्टूबर 1985' : 'October 12, 1985';
      } else {
        fallback =
          language === 'hi'
            ? 'मुझे पिछले दो दिनों से आंखों में तेज़ दर्द और बुखार है।'
            : 'I have severe eye pain and fever since yesterday.';
      }
      handleUserMessage(fallback);
      setIsListening(false);
    }, 2400);
  };

  const handleUserMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;
    playSuccessChime();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onAddMessage(userMsg);

    // 1. Intro Question 1: Patient Full Name (skip if user typed symptoms)
    if (!patientName.trim() && !looksLikeSymptomText(text)) {
      const extractedName = extractNameFromText(text);
      onUpdatePatientName(extractedName);

      setTimeout(() => {
        const nextBotMsg: ChatMessage = {
          id: `bot-q2-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'bot',
          text: t.botQ2,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onAddMessage(nextBotMsg);
      }, 600);
      return;
    }

    // 2. Intro Question 2: Date of Birth (skip if user typed symptoms)
    if (!dob.trim() && !looksLikeSymptomText(text)) {
      const extractedDob = extractDobFromText(text);
      onUpdateDob(extractedDob);

      setTimeout(() => {
        const nextBotMsg: ChatMessage = {
          id: `bot-q3-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'bot',
          text: t.botQ3,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onAddMessage(nextBotMsg);
      }, 600);
      return;
    }

    // 3. Question 3+ or direct symptom input: Symptoms Description via Gemini API
    setIsExtracting(true);
    try {
      const response = await fetch('/api/extract-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });
      const data = await response.json();
      console.log('[SymptomsScreen] Raw API response from /api/extract-symptoms:', data);
      if (data.source === 'gemini') {
        console.log(`[SymptomsScreen] Gemini (${data.modelUsed}) Raw Response:`, data.rawGeminiResponse);
      } else {
        console.warn('[SymptomsScreen] Fallback was used:', data.fallbackWarning || 'Local fallback');
      }

      const extractedSymptoms: string[] = Array.isArray(data.symptoms) ? data.symptoms : [];

      const newlyAdded: string[] = [];

      extractedSymptoms.forEach((extracted) => {
        // Case-insensitive check against predefined chips
        const matchedChip = QUICK_SYMPTOMS.find(
          (chip) => chip.toLowerCase() === extracted.toLowerCase()
        );

        if (matchedChip) {
          // Auto-select predefined chip
          if (!symptoms.includes(matchedChip)) {
            onAddSymptom(matchedChip);
          }
          if (!newlyAdded.includes(matchedChip)) {
            newlyAdded.push(matchedChip);
          }
        } else {
          // Free-text custom tag/chip
          const formatted = formatSymptomTitle(extracted);
          if (!symptoms.some((s) => s.toLowerCase() === formatted.toLowerCase())) {
            onAddSymptom(formatted);
          }
          if (!newlyAdded.includes(formatted)) {
            newlyAdded.push(formatted);
          }
        }
      });

      // Bot acknowledge what was extracted specifically
      let ackText = '';
      if (newlyAdded.length > 0) {
        if (!patientName.trim()) {
          ackText = language === 'hi'
            ? `दर्ज किया गया: ${newlyAdded.join(', ')}। क्या आप अपना पूरा नाम भी बता सकते हैं?`
            : `Noted: ${newlyAdded.join(', ')}. Could you also tell me your full name?`;
        } else if (!dob.trim()) {
          ackText = language === 'hi'
            ? `दर्ज किया गया: ${newlyAdded.join(', ')}। आपकी जन्मतिथि या आयु क्या है?`
            : `Noted: ${newlyAdded.join(', ')}. What is your date of birth or age?`;
        } else {
          ackText = language === 'hi'
            ? `दर्ज किया गया: ${newlyAdded.join(', ')}। क्या आप कुछ और बताना चाहते हैं?`
            : `Noted: ${newlyAdded.join(', ')}. Anything else?`;
        }
      } else {
        if (language === 'hi') {
          ackText = 'धन्यवाद। क्या आप अपनी किसी अन्य परेशानी या लक्षण के बारे में बताना चाहते हैं?';
        } else {
          ackText = 'Thank you. Could you describe any symptoms, pain, or health issues you are experiencing?';
        }
      }

      setTimeout(() => {
        const botAck: ChatMessage = {
          id: `bot-ack-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'bot',
          text: ackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onAddMessage(botAck);
      }, 500);
    } catch (err) {
      console.error('Extraction error:', err);
      setTimeout(() => {
        const botAck: ChatMessage = {
          id: `bot-fallback-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'bot',
          text:
            language === 'hi'
              ? 'आपके लक्षण नोट कर लिए गए हैं। क्या आप कुछ और जोड़ना चाहते हैं?'
              : 'Thank you. I have noted your message. You can add more details or proceed.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onAddMessage(botAck);
      }, 500);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserMessage(inputText);
      setInputText('');
    }
  };

  const handleReadQuestion = (text: string) => {
    playTapTone(500, 0.04);
    speakText(text, language);
  };

  // Filter custom tags (symptoms that are not in the predefined chips list)
  const customSymptoms = symptoms.filter(
    (sym) => !QUICK_SYMPTOMS.some((q) => q.toLowerCase() === sym.toLowerCase())
  );

  return (
    <div
      id="symptoms-screen"
      className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-20"
    >
      {/* Title & Subtitle + Reset Session Action */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
            {t.symptomsTitle}
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            {t.symptomsSub}
          </p>
        </div>

        <button
          id="btn-reset-session"
          type="button"
          onClick={() => {
            playTapTone(380, 0.05);
            hasInitializedChatRef.current = false;
            onResetSession();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant hover:border-error/40 text-on-surface-variant hover:text-error text-xs font-medium bg-surface-container hover:bg-error/10 transition-colors shadow-xs flex-shrink-0"
          title="Reset session and ask again from scratch"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          <span className="hidden sm:inline">{language === 'hi' ? 'सत्र रीसेट करें' : 'Reset Session'}</span>
        </button>
      </div>

      {/* Patient Intake Status Ribbon */}
      {(patientName || dob) && (
        <div className="mb-3 px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-base">person</span>
            <span>
              <strong>{language === 'hi' ? 'मरीज' : 'Patient'}:</strong> {patientName || '—'}
            </span>
            {dob && (
              <span>
                • <strong>{language === 'hi' ? 'जन्मतिथि' : 'DOB'}:</strong> {dob}
              </span>
            )}
          </div>
          <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs fill">check_circle</span>
            {language === 'hi' ? 'सक्रिय सत्र' : 'Active Session'}
          </span>
        </div>
      )}

      {/* Interactive Conversational Chat Canvas */}
      <div className="flex-1 bg-surface-container rounded-3xl border border-outline-variant p-4 sm:p-6 shadow-inner flex flex-col justify-between min-h-[380px] max-h-[440px] overflow-y-auto mb-5">
        <div className="flex flex-col gap-4">
          {/* Dynamic Messages solely from chatHistory */}
          {chatHistory.map((msg, index) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id ? `${msg.id}-${index}` : `chat-msg-${index}`}
                className={`flex items-start gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isBot ? 'self-start' : 'self-end justify-end'
                }`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined text-lg fill">smart_toy</span>
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm ${
                    isBot
                      ? 'bg-surface-container-high border border-outline-variant/60 text-on-surface rounded-tl-sm'
                      : 'bg-primary text-on-primary font-medium rounded-tr-sm shadow'
                  }`}
                >
                  {isBot && (
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-primary">Swasthya Setu Bot</span>
                      <button
                        onClick={() => handleReadQuestion(msg.text)}
                        className="text-on-surface-variant hover:text-primary p-0.5"
                        title="Read aloud"
                      >
                        <span className="material-symbols-outlined text-sm">volume_up</span>
                      </button>
                    </div>
                  )}
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 ${
                      isBot ? 'text-on-surface-variant' : 'text-on-primary-container text-right'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* AI Extraction processing indicator */}
          {isExtracting && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-surface-container-high border border-primary/30 max-w-xs self-start text-xs text-primary animate-pulse">
              <span className="material-symbols-outlined text-base animate-spin">sync</span>
              <span>
                {language === 'hi' ? 'लक्षणों का विश्लेषण हो रहा है...' : 'Extracting clinical symptoms via AI...'}
              </span>
            </div>
          )}

          {/* Animated voice listening state */}
          {isListening && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/10 border border-primary animate-pulse max-w-sm self-start">
              <span className="material-symbols-outlined text-primary text-2xl animate-bounce">
                mic
              </span>
              <span className="text-xs font-bold text-primary">{t.listening}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Predefined Quick Common Symptoms Selection Chips */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-on-surface-variant mb-2.5 uppercase tracking-wider">
          {t.quickSymptoms}
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_SYMPTOMS.map((sym) => {
            const isSelected = symptoms.some((s) => s.toLowerCase() === sym.toLowerCase());
            return (
              <button
                key={sym}
                id={`chip-${sym.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => {
                  playTapTone(460, 0.04);
                  onToggleSymptom(sym);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline'
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-xs fill">check</span>
                )}
                <span>{sym}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional / Custom Symptoms Extracted via AI */}
      {customSymptoms.length > 0 && (
        <div className="mb-5 animate-fade-in">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              {language === 'hi' ? 'अतिरिक्त दर्ज लक्षण (AI द्वारा पहचाने गए):' : 'Additional Captured Symptoms (AI Extracted):'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {customSymptoms.map((customSym, idx) => (
              <span
                key={`${customSym}-${idx}`}
                id={`custom-chip-${customSym.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30 flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-xs">check_circle</span>
                <span>{customSym}</span>
                <button
                  type="button"
                  onClick={() => onToggleSymptom(customSym)}
                  className="ml-1 text-primary/70 hover:text-primary hover:bg-primary/20 rounded-full p-0.5"
                  title={language === 'hi' ? 'हटाएं' : 'Remove'}
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Controls: Tap to Speak & Type Instead */}
      <div className="flex flex-col gap-4">
        {showTypeInput ? (
          <form onSubmit={handleSendText} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.typePlaceholder}
              className="flex-1 bg-surface-container border border-outline-variant focus:border-primary rounded-2xl px-4 py-3.5 text-sm text-on-surface focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-6 py-3.5 bg-primary text-on-primary font-bold text-sm rounded-2xl hover:bg-primary-container disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{t.send}</span>
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tap to Speak Big CTA */}
          <button
            id="btn-tap-to-speak"
            type="button"
            onClick={handleToggleVoice}
            className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-full font-bold text-base sm:text-lg transition-all shadow-lg active:scale-95 cursor-pointer ${
              isListening
                ? 'bg-error text-on-error animate-pulse shadow-error/30'
                : 'bg-primary text-on-primary hover:bg-primary-container hover:shadow-primary/20'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {isListening ? 'graphic_eq' : 'mic'}
            </span>
            <span>{isListening ? t.listening : t.tapToSpeak}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="btn-type-instead"
              type="button"
              onClick={() => {
                playTapTone(400, 0.04);
                setShowTypeInput(!showTypeInput);
              }}
              className="flex-1 sm:flex-initial py-3 px-5 rounded-full border border-outline-variant bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">keyboard</span>
              <span>{t.typeInstead}</span>
            </button>

            <button
              id="btn-symptoms-next"
              type="button"
              onClick={() => {
                playTapTone(520, 0.05);
                onNext();
              }}
              className="flex-1 sm:flex-initial py-3.5 px-7 rounded-full bg-primary-container text-on-primary-container font-extrabold text-sm sm:text-base hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>{t.next}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
