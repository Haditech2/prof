import React, { useState } from 'react';
import { 
  ArrowRight, 
  Mail, 
  MapPin, 
  ArrowUp, 
  CheckCircle2, 
  ChevronDown, 
  ExternalLink 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'about-professor' | 'event' | 'dashboard') => void;
  onOpenDownloadModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDownloadModal }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  
  // Mobile accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  const go = (v: 'landing' | 'about-professor' | 'event' | 'dashboard') => {
    onNavigate(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterError('Please provide a valid institutional email address.');
      return;
    }
    setNewsletterError('');
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubmitted(false);
    }, 5000);
  };

  return (
    <footer className="bg-[#003330] text-white relative overflow-hidden">

      {/* ========================================================================= */}
      {/* 1. PRE-FOOTER CTA BAND                                                    */}
      {/* ========================================================================= */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-transparent to-black/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <div className="font-serif-luxury italic text-base text-[#F8E7BE]">Convocation Assembly</div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                Witness academic history in the making.
              </h2>
              <p className="text-sm text-white/80 font-sans">
                Wednesday, 25 November 2026 at 2:00 PM prompt · Assembly Hall, Main Campus, Keffi.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                id="footer-cta-rsvp"
                onClick={() => go('event')}
                className="px-8 py-4 rounded-full bg-[#D6A323] text-[#003330] font-medium text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Reserve Seat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN STRUCTURED DIRECTORY GRID                                         */}
      {/* ========================================================================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 text-sm">
          
          {/* Column 1: Institutional Crest & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-[#D6A323]/50 shadow-md shrink-0">
                <img
                  src="/images/nsuk-crest.png"
                  alt="NSUK Crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#D6A323] font-cinzel tracking-wide">
                  Nasarawa State University, Keffi
                </div>
                <div className="font-serif-luxury text-base font-bold text-white">
                  65th Inaugural Lecture
                </div>
              </div>
            </div>

            <p className="text-xs text-white/75 leading-relaxed max-w-sm">
              Constituted by the University Senate under the stewardship of the Vice-Chancellor, <strong className="text-white">Professor Sa'adatu Hassan Liman, Ph.D.</strong> <span className="text-[#FFF4DC]">(Fellow UNESCO, ACLS, FIIFP, Hon. Fellow CBER (Oxford), fnipr)</span>. Marking the elevation of Professor Rashidah Funke Olanrewaju.
            </p>

            {/* Live Ceremony Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-[#FFF4DC]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Assembly Hall Sanctuary Ready · Senate Confirmed</span>
            </div>
          </div>

          {/* Column 2: The Lecture & Protocol (2 Cols) */}
          <div className="lg:col-span-2">
            <button
              onClick={() => toggleAccordion('lecture')}
              className="w-full flex items-center justify-between md:cursor-default text-left font-serif-luxury font-semibold text-sm text-[#D6A323] mb-4"
            >
              <span>The Lecture</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${openAccordion === 'lecture' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2.5 text-xs text-white/80 ${openAccordion === 'lecture' ? 'block' : 'hidden md:block'}`}>
              <li>
                <button onClick={() => go('landing')} className="hover:text-white transition-colors cursor-pointer">
                  Lecture Topic &amp; Theme
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    go('landing');
                    setTimeout(() => {
                      document.getElementById('dp-generator-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Attendee DP Flyer
                </button>
              </li>
              <li>
                <button onClick={() => go('event')} className="hover:text-white transition-colors cursor-pointer">
                  Order of Proceedings
                </button>
              </li>
              {onOpenDownloadModal && (
                <li>
                  <button onClick={onOpenDownloadModal} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                    <span>Press Proclamation</span>
                    <ExternalLink className="w-3 h-3 text-[#D6A323]" />
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: The Lecturer (2 Cols) */}
          <div className="lg:col-span-2">
            <button
              onClick={() => toggleAccordion('lecturer')}
              className="w-full flex items-center justify-between md:cursor-default text-left font-serif-luxury font-semibold text-sm text-[#D6A323] mb-4"
            >
              <span>The Lecturer</span>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${openAccordion === 'lecturer' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2.5 text-xs text-white/80 ${openAccordion === 'lecturer' ? 'block' : 'hidden md:block'}`}>
              <li>
                <button onClick={() => go('about-professor')} className="hover:text-white transition-colors cursor-pointer">
                  Academic Pedigree (Ph.D.)
                </button>
              </li>
              <li>
                <button onClick={() => go('about-professor')} className="hover:text-white transition-colors cursor-pointer">
                  Director EDC Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => go('about-professor')} className="hover:text-white transition-colors cursor-pointer">
                  NURA-X AI Framework
                </button>
              </li>
              <li>
                <button onClick={() => go('about-professor')} className="hover:text-white transition-colors cursor-pointer">
                  Scholarly Felicitations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter / Bulletin Signup (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif-luxury font-semibold text-sm text-[#D6A323]">
              Ceremonial Dispatch
            </h4>
            <p className="text-xs text-white/75 leading-relaxed">
              Receive the official inaugural lecture monograph, keynote transcripts, and photo digest delivered to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex items-center rounded-full bg-white/10 border border-white/20 p-1 focus-within:border-[#D6A323] transition-colors">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    setNewsletterError('');
                  }}
                  placeholder="scholar@university.edu"
                  className="w-full pl-3.5 pr-2 py-1.5 bg-transparent text-xs text-white placeholder-white/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#008F87] hover:bg-[#006B66] text-white text-xs font-medium shrink-0 transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </div>

              {newsletterError && (
                <div className="text-[11px] text-red-300 pl-2">
                  {newsletterError}
                </div>
              )}

              {newsletterSubmitted && (
                <div className="flex items-center gap-1.5 text-xs text-[#FFF4DC] pl-2 animate-fade-in font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Subscribed! Ceremonial monograph will be sent on 25 Nov.</span>
                </div>
              )}
            </form>

            <div className="pt-2 text-[11px] text-white/70 space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#D6A323]" />
                <span>Assembly Hall, Main Campus, Keffi, Nasarawa State</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-[#D6A323]" />
                <span>inaugural@nsuk.edu.ng</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OVERSIZED ARCHITECTURAL WORDMARK WITH SUBTLE GRADIENT FADE             */}
      {/* ========================================================================= */}
      <div className="relative border-t border-white/10 select-none overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center">
          <div className="font-cinzel font-black text-2xl sm:text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-white/5 uppercase whitespace-nowrap">
            NASARAWA STATE UNIVERSITY
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BASE LEGAL ROW & BACK-TO-TOP BUTTON                                    */}
      {/* ========================================================================= */}
      <div className="relative border-t border-white/10 bg-[#002624]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div>
            © 2026 Nasarawa State University, Keffi. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button 
              onClick={() => go('dashboard')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Secretariat Portal
            </button>
            <span className="text-white/20">|</span>
            <button 
              onClick={scrollToTop} 
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors cursor-pointer"
              title="Return to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
