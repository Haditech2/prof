import React, { useState } from 'react';
import { EventData } from '../types';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Download,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck
} from 'lucide-react';

interface HeroSectionProps {
  event: EventData;
  onOpenRsvp: () => void;
  onOpenDpGenerator: () => void;
  onReadProfileClick: () => void;
  onDownloadCardClick: () => void;
}

const heroPhotos = [
  {
    url: '/images/prof-rashidah-olanrewaju.jpg',
    badge: 'Official Robes',
    caption: 'Official Academic Robes · NSUK',
    alt: 'Professor Rashidah Funke Olanrewaju in Official Academic Robes'
  },
  {
    url: '/images/prof-rashidah-courtyard-regalia.jpg',
    badge: 'Senate Courtyard',
    caption: 'University Senate Courtyard · Full Regalia',
    alt: 'Professor Rashidah in Full Academic Regalia at University Senate Courtyard'
  },
  {
    url: '/images/prof-rashidah-executive-desk.jpg',
    badge: 'Director Desk',
    caption: 'Director, Entrepreneurship Development Centre (EDC)',
    alt: 'Professor Rashidah at Executive Desk EDC'
  },
  {
    url: '/images/prof-rashidah-garden-portrait.jpg',
    badge: 'Campus Garden',
    caption: 'NSUK Main Campus Garden Portrait',
    alt: 'Professor Rashidah Funke Olanrewaju at NSUK Garden'
  },
  {
    url: '/images/inaugural-lecture-flyer-portrait.jpg',
    badge: 'Proclamation Poster',
    caption: 'Official 65th Inaugural Proclamation Poster',
    alt: 'Official 65th Inaugural Lecture Proclamation Poster'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenRsvp,
  onOpenDpGenerator,
  onReadProfileClick,
  onDownloadCardClick
}) => {
  const [selectedHeroPhoto, setSelectedHeroPhoto] = useState(heroPhotos[0]);

  return (
    <section className="relative overflow-hidden bg-[#FAFBF9] pt-28 md:pt-36 pb-16 lg:pb-24 border-b border-[#E3ECE6]">
      {/* Subtle, refined institutional lattice background (No generic AI blur blobs) */}
      <div className="absolute inset-0 nsuk-pattern opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* TOP INSTITUTIONAL PROCLAMATION BANNER (Streamlined)                       */}
        {/* ========================================================================= */}
        <div className="max-w-3xl mx-auto text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C9A227]/40 shadow-xs mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B3A]" />
            <span className="font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#064E2B]">
              Nasarawa State University, Keffi · 65th Inaugural Lecture
            </span>
          </div>

          <p className="text-xs sm:text-[13px] text-[#47554F] max-w-xl mx-auto font-sans">
            Office of the Vice-Chancellor, <strong className="text-[#0F1F17] font-semibold">Prof. Sa'adatu Hassan Liman</strong>, cordially invites the academic community to the inaugural address of:
          </p>
        </div>

        {/* ========================================================================= */}
        {/* MAIN HERO GRID: EDITORIAL COPY & ARCHIVAL PORTRAIT                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Scholarly Milestone & Discourse Topic */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5">
            
            {/* Professorial Headline */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8A6A12] font-cinzel">
                Inaugural Lecturer
              </span>
              <h1 className="mt-1 font-serif-luxury font-bold text-[#0F1F17] text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                Professor Rashidah <br />
                <span className="text-[#0B6B3A] italic font-normal">Funke Olanrewaju</span>
              </h1>
            </div>

            {/* Academic Credentials & Honors */}
            <div className="space-y-1 pt-1 border-t border-[#E3ECE6] max-w-xl mx-auto lg:mx-0">
              <p className="text-xs sm:text-[13px] font-semibold tracking-wide text-[#043A20]">
                Citp, FCRIDE, SMIEEE, M. WIE, MIET (UK), ARISE, MCR (Malaysia), MNCS, IAENG
              </p>
              <p className="text-xs font-mono text-[#5B6B63] tracking-wide">
                ND (Kaduna) · BSc Hons (UPM) · DIS, MSc.IE, PhD Eng (IIUM)
              </p>
              <p className="text-xs sm:text-sm text-[#47554F] font-medium pt-0.5">
                Professor of Computer Science &amp; AI · <span className="text-[#0B6B3A] font-semibold">Director, EDC, NSUK</span>
              </p>
            </div>

            {/* Lecture Discourse Plaque with NURA-X Emblem */}
            <div className="relative rounded-2xl bg-white border border-[#C9A227]/50 p-4 sm:p-5 shadow-sm text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A6A12] mb-2.5">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Inaugural Lecture Topic</span>
                </span>
                <span className="font-mono text-[10px] text-[#6B7B73]">Convocation Address</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#C9A227] p-0.5 overflow-hidden shrink-0 shadow-md bg-white">
                  <img
                    src="/images/nura-x-intentional-intelligence.jpg"
                    alt="NURA-X Intentional Intelligence Emblem"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#0B6B3A] text-[9px] font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 text-[#C9A227]" />
                    <span>NURA-X · Intentional Intelligence</span>
                  </div>
                  <h2 className="font-serif-luxury text-base sm:text-xl text-[#0F1F17] italic font-bold leading-snug">
                    “INTENTIONAL INTELLIGENCE: <br className="hidden sm:inline" />
                    From Digital Trust to Human Flourishing”
                  </h2>
                </div>
              </div>
            </div>

            {/* Clear Primary Actions: 1-3 words, verbs first */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                id="hero-rsvp"
                onClick={onOpenRsvp}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0B6B3A] text-white hover:bg-[#064E2B] shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A]"
              >
                <span>Confirm RSVP</span>
                <ArrowRight className="w-4 h-4 text-[#F2E3B3]" />
              </button>

              <button
                id="hero-dp"
                onClick={onOpenDpGenerator}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#0B6B3A] border-2 border-[#0B6B3A]/30 hover:border-[#0B6B3A] hover:bg-[#F6FAF7] transition-all cursor-pointer active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Generate DP</span>
              </button>

              <button
                id="hero-invite"
                onClick={onDownloadCardClick}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full text-xs font-semibold text-[#5B6B63] hover:text-[#0B6B3A] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View Proclamation</span>
              </button>
            </div>

          </div>

          {/* Right Column: Prestigious Archival Portrait with Switcher */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[360px]">
              
              {/* Museum-Grade Beveled Portrait Frame */}
              <div className="relative rounded-2xl bg-white border-2 border-[#C9A227]/40 p-2.5 shadow-xl">
                <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-[#043A20]">
                  <img
                    src={selectedHeroPhoto.url}
                    alt={selectedHeroPhoto.alt}
                    className="w-full h-full object-cover object-top transition-all duration-500"
                  />
                  
                  {/* Subtle Corner Vignette */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />

                  {/* Photo Label Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-wider text-white">
                    {selectedHeroPhoto.badge}
                  </div>
                </div>

                {/* Engraved Academic Brass Nameplate */}
                <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-[#FBF4DC] via-white to-[#FBF4DC] border border-[#C9A227]/50 text-center shadow-xs">
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8A6A12] font-cinzel">
                    Inaugural Lecturer
                  </div>
                  <div className="text-xs sm:text-sm font-serif-luxury font-bold text-[#0F1F17] mt-0.5">
                    Prof. Rashidah Funke Olanrewaju
                  </div>
                  <div className="text-[10px] text-[#5B6B63] font-medium">
                    {selectedHeroPhoto.caption}
                  </div>
                </div>
              </div>

              {/* Photo Switcher Thumbnails */}
              <div className="mt-3 flex items-center justify-center gap-1.5 p-1.5 rounded-xl bg-white border border-[#E3ECE6] shadow-xs">
                {heroPhotos.map((photo, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setSelectedHeroPhoto(photo)}
                    title={photo.badge}
                    className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedHeroPhoto.url === photo.url
                        ? 'border-[#0B6B3A] ring-2 ring-[#C9A227]/50 scale-105'
                        : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.badge}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>

              {/* Biography Link Button */}
              <div className="text-center mt-2">
                <button
                  onClick={onReadProfileClick}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B6B3A] hover:text-[#043A20] transition-colors p-1.5 cursor-pointer"
                >
                  <span>Read Academic Biography &amp; Pedigree</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM INTEGRATED LOGISTICS DOCKET                                        */}
        {/* ========================================================================= */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-[#043A20] border border-[#C9A227]/30 text-white shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            
            {/* Date */}
            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#F2E3B3] shrink-0">
                <Calendar className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#F2E3B3]/70 font-bold">
                  Date
                </div>
                <div className="text-sm font-bold text-white truncate">
                  Wednesday, 25 Nov 2026
                </div>
                <div className="text-[11px] text-white/60">
                  Senate Robing at 1:15 PM
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#F2E3B3] shrink-0">
                <Clock className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#F2E3B3]/70 font-bold">
                  Time
                </div>
                <div className="text-sm font-bold text-white truncate">
                  2:00 PM Prompt
                </div>
                <div className="text-[11px] text-white/60">
                  Guests seated by 1:45 PM
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#F2E3B3] shrink-0">
                <MapPin className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#F2E3B3]/70 font-bold">
                  Venue
                </div>
                <div className="text-sm font-bold text-white truncate">
                  Assembly Hall, Main Campus
                </div>
                <div className="text-[11px] text-white/60">
                  Nasarawa State University, Keffi
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
