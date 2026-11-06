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
  variant?: 'default' | 'event-pass';
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  event,
  aspectRatio = 'portrait',
  className = '',
  showRsvpCta = false,
  onRsvpClick,
  guestPreviewName,
  variant = 'default'
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
        return 'rounded-t-[140px] rounded-b-2xl border-2 border-[#D6A323]/60 p-1.5 shadow-lg';
      case 'oval':
        return 'rounded-full border-2 border-[#D6A323]/60 p-1.5 shadow-lg aspect-[3/4]';
      case 'medallion':
        return 'rounded-full border-4 border-double border-[#D6A323] p-2 shadow-xl aspect-square';
      case 'rounded':
        return 'rounded-3xl border border-[#D6A323]/40 p-1 shadow-md';
      case 'square-gold':
        return 'rounded-none border-2 border-[#D6A323] p-1 shadow-md';
      case 'full':
        return 'rounded-xl overflow-hidden shadow-sm';
      default:
        return 'rounded-2xl border border-[#D6A323]/40 p-1';
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
                 event.backgroundColor.toLowerCase() === '#006b66' || 
                 event.backgroundColor.toLowerCase() === '#003330' || 
                 event.backgroundColor.toLowerCase() === '#0d2e24' || 
                 event.backgroundColor.toLowerCase() === '#0e1726';

  const nameMatch = event.celebrants.match(/^([^()]+?)(?:\s*\((.*)\))?$/);
  const celebrantName = nameMatch?.[1]?.trim() || event.celebrants;
  const credentialSummary = (nameMatch?.[2] || '')
    .split('|')[0]
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(' · ');
  const lectureTopic = event.description.match(/["“]([^"”]+)["”]/)?.[1] || 'Intentional Intelligence: From Digital Trust to Human Flourishing';
  const formatTimePretty = (time: string) => {
    const [hourText, minute = '00'] = time.split(':');
    const hour = Number(hourText);
    return `${hour % 12 || 12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  if (variant === 'event-pass' && event.category === 'inaugural') {
    return (
      <div
        data-invitation-card
        className={`relative w-full mx-auto overflow-hidden shadow-2xl ${getAspectRatioClasses()} ${className}`}
        style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_12%,rgba(255,244,220,0.14),transparent_38%),radial-gradient(circle_at_50%_85%,rgba(214,163,35,0.12),transparent_42%)]" />
        <div className="absolute inset-3 rounded-xl border border-[#D6A323]/55 pointer-events-none">
          <div className="absolute inset-1.5 rounded-lg border border-[#D6A323]/20" />
          <span className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-[#D6A323]" />
          <span className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-[#D6A323]" />
          <span className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-[#D6A323]" />
          <span className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-[#D6A323]" />
        </div>

        <div className="relative z-10 h-full px-6 py-5 sm:px-8 sm:py-6 flex flex-col items-center text-center">
          <img
            src="/images/nsuk-crest.png"
            alt="Nasarawa State University crest"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0"
          />
          <p className="mt-1 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#F8E7BE] font-semibold">
            Nasarawa State University, Keffi
          </p>
          <p className="mt-1 text-[8px] sm:text-[9px] text-white/70 font-serif-luxury italic">
            The Vice-Chancellor &amp; University Senate cordially invite you to
          </p>

          <div className="mt-2 flex items-center gap-2 text-[#D6A323]">
            <span className="h-px w-8 bg-[#D6A323]/55" />
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.24em] font-bold">The 65th Inaugural Lecture</span>
            <span className="h-px w-8 bg-[#D6A323]/55" />
          </div>

          <h2 className="mt-2 max-w-[92%] font-serif-luxury text-xl sm:text-2xl font-semibold leading-[1.05] text-white">
            {celebrantName}
          </h2>
          {credentialSummary && (
            <p className="mt-1 text-[7px] sm:text-[8px] uppercase tracking-[0.12em] text-[#F8E7BE]/85">
              {credentialSummary}
            </p>
          )}
          <p className="mt-1 text-[8px] sm:text-[9px] text-white/72">
            Professor of Computer Science &amp; Artificial Intelligence
          </p>

          <div className="mt-2.5 relative shrink-0">
            <div className="absolute -inset-1.5 rounded-t-[70px] rounded-b-2xl border border-[#D6A323]/35" />
            <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-t-[70px] rounded-b-2xl overflow-hidden border-2 border-[#D6A323] bg-[#003330] shadow-lg">
              <img
                src={event.photoUrl}
                alt={celebrantName}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div className="mt-2.5 max-w-[95%]">
            <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-[#D6A323] font-bold">Lecture Topic</p>
            <p className="mt-0.5 font-serif-luxury text-[11px] sm:text-xs leading-tight text-white">
              “{lectureTopic}”
            </p>
          </div>

          <div className="mt-auto w-full pt-2 border-t border-[#D6A323]/30 text-[#FFF4DC]">
            <p className="font-serif-luxury text-[10px] sm:text-xs font-semibold text-[#F8E7BE]">
              {formatDatePretty(event.date)} · {formatTimePretty(event.startTime)}
            </p>
            <p className="mt-0.5 text-[8px] sm:text-[9px] leading-tight text-white/78 line-clamp-2">
              {event.venueName}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="absolute inset-3 border border-[#D6A323]/40 pointer-events-none rounded-lg">
          <div className="absolute inset-1.5 border border-[#D6A323]/20 rounded-md" />
          {/* Corner Flourishes */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D6A323]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#D6A323]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#D6A323]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D6A323]" />
        </div>
      )}

      {event.borderStyle === 'arabesque' && (
        <div className="absolute inset-3 border-2 border-[#D6A323]/60 pointer-events-none rounded-2xl">
          <div className="absolute inset-2 border border-[#D6A323]/30 rounded-xl" />
          {/* Islamic Arabesque Corners */}
          <div className="absolute top-2 left-2 text-[#D6A323] text-xs">◈</div>
          <div className="absolute top-2 right-2 text-[#D6A323] text-xs">◈</div>
          <div className="absolute bottom-2 left-2 text-[#D6A323] text-xs">◈</div>
          <div className="absolute bottom-2 right-2 text-[#D6A323] text-xs">◈</div>
        </div>
      )}

      {event.borderStyle === 'minimal-double' && (
        <div className="absolute inset-4 border border-current opacity-30 pointer-events-none">
          <div className="absolute inset-2 border border-current opacity-20" />
        </div>
      )}

      {event.borderStyle === 'botanical-leaf' && (
        <div className="absolute inset-3 border border-[#D6A323]/50 pointer-events-none rounded-xl">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006B66] px-3 text-[#D6A323] text-xs tracking-widest uppercase">
            ❦
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#006B66] px-3 text-[#D6A323] text-xs tracking-widest uppercase">
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
              <span className="font-arabic text-lg md:text-xl text-[#D6A323] tracking-wider block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D6A323]/80 font-sans-modern block mt-0.5">
                In the Name of Allah, Most Gracious, Most Merciful
              </span>
            </div>
          )}

          {event.category !== 'fatiha' && (
            <div className="mb-2 flex items-center justify-center space-x-2">
              <div className="h-[1px] w-6 bg-[#D6A323]/50" />
              <div className="w-6 h-6 rounded-full border border-[#D6A323] flex items-center justify-center text-[10px] text-[#D6A323] font-serif-luxury font-bold">
                ❦
              </div>
              <div className="h-[1px] w-6 bg-[#D6A323]/50" />
            </div>
          )}

          {/* Hosts / Welcoming line */}
          <p className="text-[11px] md:text-xs uppercase tracking-[0.22em] opacity-80 max-w-[85%] leading-relaxed font-sans-modern">
            {event.category === 'inaugural' ? 'The Vice-Chancellor & University Senate, NSUK' : event.hosts}
          </p>

          <p className="text-[10px] md:text-[11px] italic font-serif-luxury opacity-75 mt-0.5">
            cordially invite you to celebrate the joyous occasion of
          </p>

          {/* Celebrant / Couple Names (Hero Typography) */}
          <h1 className={`text-2xl md:text-3xl lg:text-4xl mt-2 mb-1 tracking-wide leading-tight font-semibold ${getFontFamilyClass()} ${
            isDark ? 'text-white' : 'text-[#252A2A]'
          }`}
          style={{
            textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
          }}
          >
            {celebrantName}
          </h1>

          {event.category === 'inaugural' && credentialSummary && (
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.12em] text-[#F8E7BE]/80">
              {credentialSummary}
            </p>
          )}

          {/* Event Sub-headline */}
          <div className="flex items-center justify-center space-x-3 my-1">
            <span className="h-[1px] w-8 bg-[#D6A323]/60" />
            <span className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#D6A323] font-medium font-sans-modern">
              {event.category === 'fatiha' ? 'Wedding Fatiha & Solemnization' : 
               event.category === 'wedding' ? 'Holy Matrimony & Reception' :
               event.category === 'birthday' ? 'Milestone Celebration' :
               event.category === 'corporate' ? 'Annual Gala & Honors' :
               event.category === 'inaugural' ? 'The 65th Inaugural Lecture' : event.title}
            </span>
            <span className="h-[1px] w-8 bg-[#D6A323]/60" />
          </div>
        </div>

        {/* Central Portrait Photo (if present) */}
        {event.photoUrl && (
          <div className="my-2 flex-shrink-0 flex items-center justify-center w-full max-w-[200px] md:max-w-[220px]">
            <div className={`overflow-hidden bg-[#252A2A]/10 ${getPhotoFrameClass()}`}>
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
          <div className="px-4 py-1.5 rounded-full bg-[#D6A323]/15 border border-[#D6A323]/30 text-[11px] text-[#D6A323] font-sans-modern my-1">
            Personal Invitation for: <span className="font-semibold text-current">{guestPreviewName}</span>
          </div>
        )}

        {/* Date, Time & Venue Block */}
        <div className="w-full flex flex-col items-center space-y-1.5 pb-1">
          {/* Formatted Date */}
          <div className="text-sm md:text-base font-serif-luxury tracking-widest uppercase font-semibold text-[#D6A323]">
            {formatDatePretty(event.date)}
          </div>

          <div className="text-[11px] md:text-xs font-sans-modern tracking-wider opacity-85">
            AT {event.startTime} {event.endTime ? `— ${event.endTime}` : ''} • {event.timezone.split(' ')[0]}
          </div>

          <div className="w-12 h-[1px] bg-[#D6A323]/40 my-1" />

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
          <div className="pt-1 text-[10px] uppercase tracking-wider text-[#D6A323]/90 font-sans-modern">
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
              className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#D6A323] to-[#FFF4DC] text-[#003330] text-xs font-semibold tracking-widest uppercase shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              Respond to Invitation
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
