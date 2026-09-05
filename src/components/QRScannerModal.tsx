import React, { useState, useRef, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { LanguageCode } from '../types';
import { playSuccessChime } from '../utils/audio';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onScanned: (abhaNumber: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  language,
  onScanned,
}) => {
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let isMounted = true;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCamera(true);
        } else {
          setHasCamera(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setHasCamera(false);
          setCameraError('Camera access not permitted or unavailable. You can use Simulated Scan.');
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = (abhaNum = '91-4589-2041-8832') => {
    setIsScanning(false);
    playSuccessChime();
    setTimeout(() => {
      onScanned(abhaNum);
      onClose();
    }, 600);
  };

  return (
    <div
      id="qr-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="qr-modal-content"
        className="w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-2xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center pb-3 border-b border-outline-variant mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">qr_code_scanner</span>
            <h3 className="text-lg font-bold text-on-surface">{t.scanQrCode}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant text-center mb-4">
          Hold your Ayushman Bharat Health Card QR code steadily inside the viewfinder.
        </p>

        {/* Viewfinder Area */}
        <div className="relative w-64 h-64 bg-black rounded-2xl border-2 border-primary overflow-hidden flex items-center justify-center shadow-lg">
          {hasCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <span className="material-symbols-outlined text-5xl text-outline mb-2">
                qr_code_2
              </span>
              <span className="text-xs text-on-surface-variant">
                {cameraError || 'Align ABHA QR Code here'}
              </span>
            </div>
          )}

          {/* Animated Laser line */}
          {isScanning && (
            <div className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_12px_#61f9b1] animate-bounce" />
          )}

          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br" />
        </div>

        {/* Quick Simulation Trigger */}
        <div className="w-full mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => handleSimulateScan('12-3456-7890-1234')}
            className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow"
          >
            <span className="material-symbols-outlined text-lg">barcode_scanner</span>
            <span>Simulate Scan ABHA Card</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-transparent border border-outline-variant text-on-surface-variant text-xs rounded-xl hover:text-on-surface hover:bg-surface-variant font-medium transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
