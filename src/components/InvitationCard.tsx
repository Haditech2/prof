import React from 'react';
import { EventData, AspectRatioType } from '../types';

interface InvitationCardProps {
  event: EventData;
  aspectRatio?: AspectRatioType;
  interactive?: boolean;
  className?: string;
  showRsvpCta?: boolean;
  onRsvpClick?: () => void;
  guestPreviewName?: string;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  event,
  aspectRatio = 'portrait',
  className = '',
  showRsvpCta = false,
  onRsvpClick,
  guestPreviewName
}) => {
  // Determine aspect ratio class
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case 'story':
        return 'aspect-[9/16] max-w-[420px]';
      case 'square':
        return 'aspect-square max-w-[540px]';
      case 'landscape':
        return 'aspect-[16/9] max-w-[780px]';
      case 'portrait':
      default:
        return 'aspect-[4/5.5] max-w-[520px]';
    }
  };

  // Font family mapping
  const getFontFamilyClass = () => {
    switch (event.fontPreset) {
      case 'playfair':
        return 'font-playfair';
      case 'cinzel':
        return 'font-cinzel';
      case 'script':
        return 'font-script';
      case 'arabic':
        return 'font-serif-luxury'; // with Amiri accents
      case 'serif-luxury':
      default:
        return 'font-serif-luxury';
    }
  };

  // Frame shape mapping
  const getPhotoFrameClass = () => {
    switch (event.photoFrame) {
      case 'arch':
        return 'rounded-t-[140px] rounded-b-2xl border-2 border-[#C6A76A]/60 p-1.5 shadow-lg';
      case 'oval':
        return 'rounded-full border-2 border-[#C6A76A]/60 p-1.5 shadow-lg aspect-[3/4]';
      case 'medallion':
        return 'rounded-full border-4 border-double border-[#C6A76A] p-2 shadow-xl aspect-square';
      case 'rounded':
        return 'rounded-3xl border border-[#C6A76A]/40 p-1 shadow-md';
      case 'square-gold':
        return 'rounded-none border-2 border-[#C6A76A] p-1 shadow-md';
      case 'full':
        return 'rounded-xl overflow-hidden shadow-sm';
      default:
        return 'rounded-2xl border border-[#C6A76A]/40 p-1';
    }
  };

  // Photo filter mapping
  const getFilterClass = () => {
    switch (event.photoFilter) {
      case 'editorial-bw':
        return 'grayscale contrast-125';
      case 'vintage':
        return 'sepia-[0.35] contrast-105 brightness-95';
      case 'champagne':
        return 'sepia-[0.15] brightness-105 saturate-110';
      case 'emerald':
        return 'hue-rotate-15 contrast-110 saturate-90';
      case 'natural':
      default:
        return 'contrast-105';
    }
  };

  // Format date nicely
  const formatDatePretty = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const isDark = event.backgroundColor.toLowerCase() === '#111318' || 
                 event.backgroundColor.toLowerCase() === '#0d2e24' || 
                 event.backgroundColor.toLowerCase() === '#0e1726';

  return (
    <div
      data-invitation-card
      className={`relative w-full mx-auto overflow-hidden transition-all duration-300 shadow-2xl ${getAspectRatioClasses()} ${className}`}
      style={{
        backgroundColor: event.backgroundColor,
        color: event.textColor,
      }}
    >
      {/* Background Texture & Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, ${event.accentColor}25 0%, transparent 65%)`
        }}
      />

      {/* Decorative Ornate Borders */}
      {event.borderStyle === 'ornate-gold' && (
        <div className="absolute inset-3 border border-[#C6A76A]/40 pointer-events-none rounded-lg">
          <div className="absolute inset-1.5 border border-[#C6A76A]/20 rounded-md" />
          {/* Corner Flourishes */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#C6A76A]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#C6A76A]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#C6A76A]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#C6A76A]" />
        </div>
      )}

      {event.borderStyle === 'arabesque' && (
        <div className="absolute inset-3 border-2 border-[#C6A76A]/60 pointer-events-none rounded-2xl">
          <div className="absolute inset-2 border border-[#C6A76A]/30 rounded-xl" />
          {/* Islamic Arabesque Corners */}
          <div className="absolute top-2 left-2 text-[#C6A76A] text-xs">◈</div>
          <div className="absolute top-2 right-2 text-[#C6A76A] text-xs">◈</div>
          <div className="absolute bottom-2 left-2 text-[#C6A76A] text-xs">◈</div>
          <div className="absolute bottom-2 right-2 text-[#C6A76A] text-xs">◈</div>
        </div>
      )}

      {event.borderStyle === 'minimal-double' && (
        <div className="absolute inset-4 border border-current opacity-30 pointer-events-none">
          <div className="absolute inset-2 border border-current opacity-20" />
        </div>
      )}

      {event.borderStyle === 'botanical-leaf' && (
        <div className="absolute inset-3 border border-[#C6A76A]/50 pointer-events-none rounded-xl">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0D2E24] px-3 text-[#C6A76A] text-xs tracking-widest uppercase">
            ❦
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0D2E24] px-3 text-[#C6A76A] text-xs tracking-widest uppercase">
            ❦
          </div>
        </div>
      )}

      {/* Main Card Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between items-center text-center p-6 md:p-8">
        
        {/* Top Header & Monogram / Blessings */}
        <div className="w-full pt-1 flex flex-col items-center">
          {event.category === 'fatiha' && (
            <div className="mb-2">
              <span className="font-arabic text-lg md:text-xl text-[#C6A76A] tracking-wider block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A76A]/80 font-sans-modern block mt-0.5">
                In the Name of Allah, Most Gracious, Most Merciful
              </span>
            </div>
          )}

          {event.category !== 'fatiha' && (
            <div className="mb-2 flex items-center justify-center space-x-2">
              <div className="h-[1px] w-6 bg-[#C6A76A]/50" />
              <div className="w-6 h-6 rounded-full border border-[#C6A76A] flex items-center justify-center text-[10px] text-[#C6A76A] font-serif-luxury font-bold">
                ❦
              </div>
              <div className="h-[1px] w-6 bg-[#C6A76A]/50" />
            </div>
          )}

          {/* Hosts / Welcoming line */}
          <p className="text-[11px] md:text-xs uppercase tracking-[0.22em] opacity-80 max-w-[85%] leading-relaxed font-sans-modern">
            {event.hosts}
          </p>

          <p className="text-[10px] md:text-[11px] italic font-serif-luxury opacity-75 mt-0.5">
            cordially invite you to celebrate the joyous occasion of
          </p>

          {/* Celebrant / Couple Names (Hero Typography) */}
          <h1 className={`text-2xl md:text-3xl lg:text-4xl mt-2 mb-1 tracking-wide leading-tight font-semibold ${getFontFamilyClass()} ${
            isDark ? 'text-white' : 'text-[#20211F]'
          }`}
          style={{
            textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
          }}
          >
            {event.celebrants}
          </h1>

          {/* Event Sub-headline */}
          <div className="flex items-center justify-center space-x-3 my-1">
            <span className="h-[1px] w-8 bg-[#C6A76A]/60" />
            <span className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#C6A76A] font-medium font-sans-modern">
              {event.category === 'fatiha' ? 'Wedding Fatiha & Solemnization' : 
               event.category === 'wedding' ? 'Holy Matrimony & Reception' :
               event.category === 'birthday' ? 'Milestone Celebration' :
               event.category === 'corporate' ? 'Annual Gala & Honors' : event.title}
            </span>
            <span className="h-[1px] w-8 bg-[#C6A76A]/60" />
          </div>
        </div>

        {/* Central Portrait Photo (if present) */}
        {event.photoUrl && (
          <div className="my-2 flex-shrink-0 flex items-center justify-center w-full max-w-[200px] md:max-w-[220px]">
            <div className={`overflow-hidden bg-[#20211F]/10 ${getPhotoFrameClass()}`}>
              <div 
                className="w-28 h-36 md:w-36 md:h-44 overflow-hidden relative"
                style={{
                  transform: `scale(${event.photoScale || 1.0}) translate(${event.photoPosition?.x || 0}px, ${event.photoPosition?.y || 0}px)`
                }}
              >
                <img
                  src={event.photoUrl}
                  alt={event.celebrants}
                  className={`w-full h-full object-cover transition-all ${getFilterClass()}`}
                  crossOrigin="anonymous"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}

        {/* Guest Personalized Line (if simulator active) */}
        {guestPreviewName && (
          <div className="px-4 py-1.5 rounded-full bg-[#C6A76A]/15 border border-[#C6A76A]/30 text-[11px] text-[#C6A76A] font-sans-modern my-1">
            Personal Invitation for: <span className="font-semibold text-current">{guestPreviewName}</span>
          </div>
        )}

        {/* Date, Time & Venue Block */}
        <div className="w-full flex flex-col items-center space-y-1.5 pb-1">
          {/* Formatted Date */}
          <div className="text-sm md:text-base font-serif-luxury tracking-widest uppercase font-semibold text-[#C6A76A]">
            {formatDatePretty(event.date)}
          </div>

          <div className="text-[11px] md:text-xs font-sans-modern tracking-wider opacity-85">
            AT {event.startTime} {event.endTime ? `— ${event.endTime}` : ''} • {event.timezone.split(' ')[0]}
          </div>

          <div className="w-12 h-[1px] bg-[#C6A76A]/40 my-1" />

          {/* Venue & Location */}
          <div className="max-w-[90%]">
            <h4 className="text-xs md:text-sm font-semibold tracking-wide uppercase font-sans-modern">
              {event.venueName}
            </h4>
            <p className="text-[10px] md:text-[11px] opacity-75 font-sans-modern mt-0.5">
              {event.address}
            </p>
          </div>

          {/* Dress code & RSVP notice */}
          <div className="pt-1 text-[10px] uppercase tracking-wider text-[#C6A76A]/90 font-sans-modern">
            DRESS CODE: {event.dressCode}
          </div>

          {event.rsvpDeadline && (
            <p className="text-[9px] md:text-[10px] italic opacity-60">
              Kindly RSVP by {formatDatePretty(event.rsvpDeadline)}
            </p>
          )}

          {/* Optional Direct RSVP Button inside card */}
          {showRsvpCta && (
            <button
              onClick={onRsvpClick}
              className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#C6A76A] to-[#DFC79B] text-[#174C3C] text-xs font-semibold tracking-widest uppercase shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              Respond to Invitation
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
