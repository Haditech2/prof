import React, { useState } from 'react';
import { GuestWish } from '../types';
import { X, Heart, Quote, Share2, Check, Sparkles, User } from 'lucide-react';

interface TributeModalProps {
  tribute: GuestWish | null;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (id: string) => void;
}

export const TributeModal: React.FC<TributeModalProps> = ({
  tribute,
  isOpen,
  onClose,
  onLike
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!isOpen || !tribute) return null;

  const handleShare = async () => {
    const textToShare = `“${tribute.title || 'Tribute to Professor Rashidah Funke Olanrewaju'}”\n\n${tribute.fullText || tribute.message}\n\n— ${tribute.author} (${tribute.role || ''})`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToShare);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {}
    }
  };

  const paragraphs = (tribute.fullText || tribute.message)
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#FFFBF2] rounded-3xl border border-[#D6A323]/40 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-scale-up">
        {/* Ornate Gold Top Header Strip */}
        <div className="relative bg-gradient-to-r from-[#003330] via-[#006B66] to-[#003330] text-white p-5 sm:p-6 shrink-0 border-b border-[#D6A323]/30">
          <div className="absolute inset-0 nsuk-pattern-light opacity-30 pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {tribute.photoUrl ? (
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#D6A323] via-white to-[#A97912] shadow-md shrink-0">
                  <img
                    src={tribute.photoUrl}
                    alt={tribute.author}
                    className="w-full h-full rounded-full object-cover object-top"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFF4DC] text-[#006B66] border-2 border-[#D6A323] flex items-center justify-center font-serif-luxury font-bold text-xl shrink-0 shadow-md">
                  <User className="w-7 h-7 text-[#006B66]" />
                </div>
              )}
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D6A323]/25 text-[#FFF4DC] text-[10px] font-bold uppercase tracking-wider border border-[#D6A323]/40">
                  <Sparkles className="w-3 h-3 text-[#D6A323]" /> Scholarly Felicitations
                </span>
                <h3 className="font-serif-luxury font-bold text-lg sm:text-xl text-white mt-1 leading-tight">
                  {tribute.author}
                </h3>
                {tribute.role && (
                  <p className="text-xs text-[#FFF4DC] font-medium leading-snug mt-0.5">
                    {tribute.role}
                  </p>
                )}
                {tribute.affiliation && (
                  <p className="text-[11px] text-white/75 truncate mt-0.5">
                    {tribute.affiliation}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close tribute"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Letter Body with Editorial Typography */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 bg-[#FFFBF2] text-[#252A2A] flex-1">
          {tribute.title && (
            <div className="border-b border-[#D6A323]/20 pb-3 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A97912]">
                Official Tribute
              </span>
              <h4 className="font-serif-luxury font-bold text-base sm:text-lg text-[#252A2A] mt-0.5">
                {tribute.title}
              </h4>
            </div>
          )}

          <div className="relative pl-3 sm:pl-4 border-l-2 border-[#D6A323]">
            <Quote className="w-5 h-5 text-[#D6A323] opacity-60 mb-1" />
            <div className="space-y-3.5 font-serif-luxury text-sm sm:text-[15px] leading-relaxed text-[#252A2A]">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="first-letter:text-lg first-letter:font-bold">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 px-6 bg-[#FFF4DC] border-t border-[#D6A323]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLiked(!liked);
                if (onLike) onLike(tribute.id);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                liked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-[#FFFBF2] border-[#D6A323]/30 text-[#252A2A] hover:text-[#008F87]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{tribute.likes + (liked ? 1 : 0)} Likes</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FFFBF2] border border-[#D6A323]/30 text-[#252A2A] hover:text-[#008F87] hover:border-[#008F87] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Share Tribute'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="bg-[#008F87] hover:bg-[#006B66] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider ml-auto transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
