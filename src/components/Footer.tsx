import React from 'react';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'about-professor' | 'event' | 'dashboard') => void;
  onOpenDownloadModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDownloadModal }) => {
  const go = (v: 'landing' | 'about-professor' | 'event' | 'dashboard') => {
    onNavigate(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#043A20] text-white relative overflow-hidden">
      <div className="absolute inset-0 nsuk-pattern-light pointer-events-none" />

      {/* CTA strip */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-white/10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#E2BE4A] font-bold">26 November 2026 · NSUK</div>
            <h2 className="mt-2 font-serif-luxury text-3xl md:text-4xl font-bold">Be part of this historic moment.</h2>
          </div>
          <button
            id="footer-rsvp"
            onClick={() => go('event')}
            className="btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold shrink-0"
          >
            Confirm Attendance <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white text-[#0B6B3A] flex items-center justify-center font-serif-luxury font-bold ring-2 ring-[#C9A227]/50">
              RFO
            </div>
            <div>
              <div className="font-serif-luxury text-lg font-bold">Prof. Rashidah Funke Olanrewaju</div>
              <div className="text-xs text-white/60">Ph.D., FNCS, MIET · Nasarawa State University, Keffi</div>
            </div>
          </div>
          <p className="mt-4 text-white/60 max-w-sm text-[13px]">
            Faculty of Computing · Entrepreneurship Development Centre · ISERG
          </p>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.16em] text-[#E2BE4A] font-bold mb-4">Explore</h4>
          <ul className="space-y-2.5 text-white/75">
            <li><button onClick={() => go('landing')} className="hover:text-white">The Lecture</button></li>
            <li><button onClick={() => go('about-professor')} className="hover:text-white">Profile</button></li>
            <li><button onClick={() => go('event')} className="hover:text-white">RSVP &amp; Seat Pass</button></li>
            {onOpenDownloadModal && (
              <li><button onClick={onOpenDownloadModal} className="hover:text-white">Invitation Card</button></li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.16em] text-[#E2BE4A] font-bold mb-4">Contact</h4>
          <ul className="space-y-3 text-white/75">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-[#E2BE4A] shrink-0" /> Main Auditorium, NSUK, Keffi</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#E2BE4A]" /> inaugural@nsuk.edu.ng</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#E2BE4A]" /> +234 803 700 8821</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>© 2026 Nasarawa State University, Keffi</span>
          <button onClick={() => go('dashboard')} className="hover:text-white">Secretariat login</button>
        </div>
      </div>
    </footer>
  );
};
