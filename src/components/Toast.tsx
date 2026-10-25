import React, { useEffect } from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

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
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-[#0B6B3A] text-white px-5 py-3.5 rounded-2xl border border-[#C9A227]/50 shadow-2xl flex items-center space-x-3 text-xs font-sans-modern max-w-md">
        <Sparkles className="w-4 h-4 text-[#C9A227] flex-shrink-0 animate-pulse" />
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
