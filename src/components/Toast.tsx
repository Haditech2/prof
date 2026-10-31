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
      <div className="bg-gradient-to-r from-[#003330] via-[#006B66] to-[#003330] text-white px-5 py-3.5 rounded-2xl border border-[#D6A323]/50 shadow-2xl flex items-center gap-3 text-xs font-sans-modern">
        <CheckCircle2 className="w-4 h-4 text-[#D6A323] shrink-0" aria-hidden="true" />
        <span className="flex-1 font-semibold text-white/95 leading-snug">{message}</span>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A323]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
