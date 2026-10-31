import React, { useState, useEffect } from 'react';
import { EventData } from '../types';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  BookOpen
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
    url: '/images/prof-rashidah-edc-summit-portrait.jpg',
    badge: 'EDC Summit',
    caption: 'Host & Director · North Central EDC Leadership Summit',
    alt: 'Professor Rashidah Funke Olanrewaju at EDC Leadership Summit'
  },
  {
    url: '/images/prof-rashidah-executive-desk.jpg',
    badge: 'Director Desk',
    caption: 'Director, Entrepreneurship Development Centre (EDC)',
    alt: 'Professor Rashidah Funke Olanrewaju at Executive Desk EDC'
  },
  {
    url: '/images/prof-rashidah-smiling-sunlight.jpg',
    badge: 'Candid Grace',
    caption: 'Warm Smiles & Campus Distinction',
    alt: 'Professor Rashidah Funke Olanrewaju Smiling in Campus Sunlight'
  },
  {
    url: '/images/prof-rashidah-courtyard-regalia.jpg',
    badge: 'Senate Courtyard',
    caption: 'University Senate Courtyard · Full Regalia',
    alt: 'Professor Rashidah in Full Academic Regalia at University Senate Courtyard'
  },
  {
    url: '/images/prof-rashidah-edc-summit-full.jpg',
    badge: 'Summit Dais',
    caption: 'Keynote & Leadership Address · EDC Summit',
    alt: 'Professor Rashidah Funke Olanrewaju at EDC Summit'
  },
  {
    url: '/images/prof-rashidah-garden-portrait.jpg',
    badge: 'Campus Garden',
    caption: 'NSUK Main Campus Garden Portrait',
    alt: 'Professor Rashidah Funke Olanrewaju at NSUK Garden'
  },
  {
    url: '/images/prof-rashidah-candid-sunlight.jpg',
    badge: 'Campus Moments',
    caption: 'Candid Academic Reflections · NSUK',
    alt: 'Professor Rashidah Funke Olanrewaju Candid Campus Reflections'
  },
  {
    url: '/images/prof-rashidah-edc-summit-profile.jpg',
    badge: 'Visionary Leader',
    caption: 'Entrepreneurship & Innovation Leadership',
    alt: 'Professor Rashidah Funke Olanrewaju Visionary Leadership'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenRsvp,
  onOpenDpGenerator,
  onReadProfileClick,
  onDownloadCardClick
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showFullCredentials, setShowFullCredentials] = useState(false);

  const selectedHeroPhoto = heroPhotos[activePhotoIndex];

  // Auto-advance slideshow smoothly every 4.5 seconds when active
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const interval = setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  const handlePrevSlide = () => {
    setActivePhotoIndex((prev) => (prev - 1 + heroPhotos.length) % heroPhotos.length);
  };

  const handleNextSlide = () => {
    setActivePhotoIndex((prev) => (prev + 1) % heroPhotos.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#FFF4DC] pt-20 sm:pt-28 md:pt-36 pb-12 lg:pb-20 border-b border-[#D6A323]/30">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* TOP PROCLAMATION KICKER                                                  */}
        {/* ========================================================================= */}
        <div className="max-w-2xl mx-auto text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="mb-3 flex items-center justify-center gap-3 text-[#A97912]">
            <span className="h-px w-8 bg-[#D6A323]/60" />
            <span className="font-serif-luxury italic text-sm sm:text-base tracking-wide">
              Nasarawa State University · 65th Inaugural Lecture
            </span>
            <span className="h-px w-8 bg-[#D6A323]/60" />
          </div>

          <p className="text-xs sm:text-sm text-[#47554F] max-w-2xl mx-auto font-sans leading-relaxed">
            The Vice-Chancellor, <strong className="text-[#252A2A] font-semibold">Professor Sa'adatu Hassan Liman, Ph.D.</strong>{' '}
            <span className="text-[#008F87] font-semibold text-[11px] sm:text-xs">
              (Fellow UNESCO, ACLS, FIIFP, Hon. Fellow CBER (Oxford), fnipr)
            </span>
            , cordially invites you to the 65th Inaugural Lecture of:
          </p>
        </div>

        {/* ========================================================================= */}
        {/* MAIN HERO GRID                                                           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Scholarly Milestone & Lecture Topic */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-5">
            
            {/* Professorial Headline */}
            <div>
              <span className="eyebrow">Inaugural Lecturer</span>
              <h1 className="font-serif-luxury font-bold text-[#252A2A] text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight">
                Professor Rashidah <br />
                <span className="text-[#008F87] italic font-normal">Funke Olanrewaju</span>
              </h1>
            </div>

            {/* Academic Summary (Crisp & Scannable - No Wall of Text) */}
            <div className="pt-2 border-t border-[#D6A323]/25 max-w-xl mx-auto lg:mx-0 space-y-1.5">
              <p className="text-xs sm:text-sm text-[#252A2A] font-semibold">
                Professor of Computer Science &amp; Artificial Intelligence
              </p>
              <p className="text-xs text-[#006B66] font-semibold flex items-center justify-center lg:justify-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6A323]" />
                <span>Director, Entrepreneurship Development Centre (EDC), NSUK</span>
              </p>

              {/* Collapsible Credentials & Fellowships Drawer */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowFullCredentials(!showFullCredentials)}
                  className="text-[11px] font-semibold text-[#A97912] hover:text-[#008F87] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{showFullCredentials ? '▲ Hide Full Pedigree & Fellowships' : '▼ Show Full Pedigree & Fellowships'}</span>
                </button>

                {showFullCredentials && (
                  <div className="mt-2 p-3 rounded-xl bg-[#FFFBF2] border border-[#D6A323]/40 text-left space-y-1 text-xs animate-fade-in shadow-xs">
                    <p className="font-mono text-[#006B66] font-semibold">
                      Citp, FCRIDE, SMIEEE, M. WIE, MIET (UK), ARISE, MCR (Malaysia), MNCS, IAENG, Fellow Erasmus+
                    </p>
                    <p className="text-[#5B6B63] font-mono text-[11px]">
                      Ph.D. Computer &amp; Info. Eng. (IIUM) · MSc.IE (IIUM) · DIS (IIUM) · BSc. Hons (UPM) · ND (Kaduna)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Lecture Plaque */}
            <div className="relative rounded-2xl bg-[#FFFBF2] border-2 border-[#D6A323]/50 p-3.5 sm:p-5 shadow-xs text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-[#A97912] mb-2">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#D6A323]" />
                  <span>Inaugural Lecture</span>
                </span>
                <span className="font-mono text-[9px] text-[#6B7B73]">Convocation Address</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#D6A323] p-0.5 overflow-hidden shrink-0 shadow-sm bg-white">
                  <img
                    src="/images/nura-x-intentional-intelligence.jpg"
                    alt="NURA-X Intentional Intelligence Emblem"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="font-serif-luxury italic text-xs text-[#006B66] mb-0.5">
                    with the NURA-X Initiative
                  </div>
                  <h2 className="font-serif-luxury text-sm sm:text-lg text-[#252A2A] italic font-bold leading-snug">
                    “INTENTIONAL INTELLIGENCE: <br className="hidden sm:inline" />
                    From Digital Trust to Human Flourishing”
                  </h2>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons: Touch-Optimized for Mobile */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 max-w-md mx-auto lg:mx-0">
              <button
                id="hero-rsvp"
                onClick={onOpenRsvp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-[#008F87] text-white hover:bg-[#006B66] shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98 min-h-[44px]"
              >
                <span>Reserve Seat (RSVP)</span>
                <ArrowRight className="w-4 h-4 text-[#FFF4DC]" />
              </button>

              <button
                id="hero-dp"
                onClick={onOpenDpGenerator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium bg-[#FFFBF2] text-[#008F87] border-2 border-[#008F87]/40 hover:border-[#008F87] hover:bg-[#DDF7F5] transition-all cursor-pointer active:scale-98 min-h-[44px]"
              >
                <span>Create Attendee Flyer</span>
              </button>

              <button
                id="hero-invite"
                onClick={onDownloadCardClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-[#252A2A]/75 hover:text-[#008F87] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Poster</span>
              </button>
            </div>

          </div>

          {/* Right Column: Portrait Frame with Modern Interactive Slideshow */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className="relative w-full max-w-[320px] sm:max-w-[360px]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              
              {/* Museum-Grade Beveled Portrait Frame with Floating Slideshow Nav */}
              <div className="relative rounded-2xl bg-[#FFFBF2] border-2 border-[#D6A323]/50 p-2 sm:p-2.5 shadow-xl group rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300">
                <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-[#006B66]">
                  {/* Active Slide Image with Smooth Crossfade */}
                  <img
                    key={selectedHeroPhoto.url}
                    src={selectedHeroPhoto.url}
                    alt={selectedHeroPhoto.alt}
                    className="w-full h-full object-cover object-top transition-all duration-700 animate-fade-in"
                  />
                  
                  {/* Subtle Corner Vignette */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />

                  {/* Top Slide Progress Bar for Auto-play */}
                  {isPlaying && !isHovered && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-black/30 overflow-hidden z-20">
                      <div
                        key={`prog-${activePhotoIndex}`}
                        className="h-full bg-gradient-to-r from-[#D6A323] via-[#FFF4DC] to-[#D6A323] animate-progress-fill"
                      />
                    </div>
                  )}

                  {/* Top Status Bar: Slide Counter & Badge */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-[9px] font-mono font-bold text-[#FFF4DC] flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6A323] animate-pulse" />
                      <span>{String(activePhotoIndex + 1).padStart(2, '0')} / {String(heroPhotos.length).padStart(2, '0')}</span>
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                      {selectedHeroPhoto.badge}
                    </span>
                  </div>

                  {/* Floating Chevron Navigation Arrows on Image Frame */}
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-[#008F87] text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all opacity-85 sm:opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer shadow-lg z-20"
                    title="Previous Slide"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-[#008F87] text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all opacity-85 sm:opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer shadow-lg z-20"
                    title="Next Slide"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Engraved Academic Brass Nameplate */}
                <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-[#FFF4DC] via-[#FFFBF2] to-[#FFF4DC] border border-[#D6A323]/50 text-center shadow-xs">
                  <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#A97912] font-cinzel">
                    Inaugural Lecturer
                  </div>
                  <div className="text-xs sm:text-sm font-serif-luxury font-bold text-[#252A2A] mt-0.5">
                    Prof. Rashidah Funke Olanrewaju
                  </div>
                  <div className="text-[10px] text-[#5B6B63] font-medium truncate">
                    {selectedHeroPhoto.caption}
                  </div>
                </div>
              </div>

              {/* Modern Slideshow Carousel Bar underneath */}
              <div className="mt-3 p-2 rounded-2xl bg-[#FFFBF2]/95 backdrop-blur-md border border-[#D6A323]/40 shadow-md">
                <div className="flex items-center justify-between gap-1">
                  {/* Prev Button */}
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="w-7 h-7 rounded-lg bg-[#FFF4DC] hover:bg-[#008F87] text-[#006B66] hover:text-white border border-[#D6A323]/30 hover:border-[#008F87] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Arranged Thumbnail Slides */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5 justify-center flex-1">
                    {heroPhotos.map((photo, pIdx) => {
                      const isActive = activePhotoIndex === pIdx;
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            setActivePhotoIndex(pIdx);
                            setIsPlaying(true);
                          }}
                          title={`${photo.badge} (${pIdx + 1}/${heroPhotos.length})`}
                          className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer shrink-0 ${
                            isActive
                              ? 'ring-2 ring-[#D6A323] border-2 border-[#008F87] shadow-md scale-110 z-10'
                              : 'opacity-65 hover:opacity-100 hover:scale-105 border border-transparent'
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.badge}
                            className="w-full h-full object-cover object-top"
                          />
                          {isActive && (
                            <span className="absolute bottom-0 inset-x-0 h-1 bg-[#D6A323]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="w-7 h-7 rounded-lg bg-[#FFF4DC] hover:bg-[#008F87] text-[#006B66] hover:text-white border border-[#D6A323]/30 hover:border-[#008F87] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Play / Pause Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-7 h-7 rounded-lg bg-[#FFF4DC] hover:bg-[#D6A323] text-[#006B66] hover:text-[#003330] border border-[#D6A323]/30 hover:border-[#D6A323] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
                    title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 translate-x-0.5" />}
                  </button>
                </div>
              </div>

              {/* Quick View Full Profile Link */}
              <div className="text-center mt-2">
                <button
                  onClick={onReadProfileClick}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#008F87] hover:text-[#006B66] transition-colors p-1 cursor-pointer"
                >
                  <span>Full Profile &amp; Pedigree</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM INTEGRATED LOGISTICS DOCKET                                        */}
        {/* ========================================================================= */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-gradient-to-r from-[#006B66] via-[#004D49] to-[#006B66] border border-[#D6A323]/40 text-white shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            
            {/* Date */}
            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#FFF4DC] shrink-0">
                <Calendar className="w-5 h-5 text-[#D6A323]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#FFF4DC]/80 font-bold">
                  Date
                </div>
                <div className="text-sm font-bold text-white truncate">
                  Wednesday, 25 Nov 2026
                </div>
                <div className="text-[11px] text-white/70">
                  Senate Robing at 1:15 PM
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#FFF4DC] shrink-0">
                <Clock className="w-5 h-5 text-[#D6A323]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#FFF4DC]/80 font-bold">
                  Time
                </div>
                <div className="text-sm font-bold text-white truncate">
                  2:00 PM Prompt
                </div>
                <div className="text-[11px] text-white/70">
                  Guests seated by 1:45 PM
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#FFF4DC] shrink-0">
                <MapPin className="w-5 h-5 text-[#D6A323]" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#FFF4DC]/80 font-bold">
                  Venue
                </div>
                <div className="text-sm font-bold text-white truncate">
                  Assembly Hall, Main Campus
                </div>
                <div className="text-[11px] text-white/70">
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
