import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 animate-fade-up max-w-md w-full sm:w-auto"
    >
      <div className="bg-[#043A20] text-white px-5 py-3.5 rounded-2xl border border-[#C9A227]/40 shadow-2xl flex items-center gap-3 text-xs font-sans-modern">
        <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" aria-hidden="true" />
        <span className="flex-1 font-semibold text-white/95 leading-snug">{message}</span>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
