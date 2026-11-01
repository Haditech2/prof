import React, { useMemo } from 'react';
import { GuestGroup, RSVPResponse } from '../types';
import { CheckCircle2, Users } from 'lucide-react';

const HONORIFIC = /^(prof|professor|dr|mr|mrs|ms|engr|arc|chief|hon|justice|senator|alhaji|alhajiya|hajiya|sir|mal)\.?$/i;

const GROUP_PRIORITY: Record<GuestGroup, number> = {
  VIP: 0,
  Family: 1,
  'Bridal Party': 2,
  Colleagues: 3,
  Friends: 4,
  General: 5
};

const initialsOf = (name: string) => {
  const parts = name.trim().split(/\s+/).filter((part) => part && !HONORIFIC.test(part));
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('');
  return initials || name.trim()[0]?.toUpperCase() || 'G';
};

interface AttendeeCardsProps {
  rsvps: RSVPResponse[];
  limit?: number;
  onRegisterClick?: () => void;
  title?: string;
  subtitle?: string;
}

export const AttendeeCards: React.FC<AttendeeCardsProps> = ({
  rsvps,
  limit,
  onRegisterClick,
  title = 'Who’s Attending',
  subtitle = 'Confirmed guests for the 65th Inaugural Lecture',
}) => {
  const attending = useMemo(
    () => rsvps
      .filter((response) => response.attendance === 'attending')
      .sort((first, second) => {
        const groupOrder = GROUP_PRIORITY[first.groupCategory] - GROUP_PRIORITY[second.groupCategory];
        if (groupOrder !== 0) return groupOrder;

        const checkInOrder = Number(second.checkedIn) - Number(first.checkedIn);
        if (checkInOrder !== 0) return checkInOrder;

        const responseOrder = first.submittedAt.localeCompare(second.submittedAt);
        return responseOrder || first.fullName.localeCompare(second.fullName);
      }),
    [rsvps]
  );
  const shown = typeof limit === 'number' ? attending.slice(0, limit) : attending;
  const confirmedSeats = attending.reduce(
    (total, guest) => total + Math.max(guest.guestCount || 1, 1),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <span className="eyebrow">Public Registry</span>
          <h2 className="mt-1 font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-[#252A2A]">
            {title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5B6B63] max-w-md">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#008F87]/15 text-[#006B66] border border-[#008F87]/25 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {attending.length} confirmed
          </span>
          {confirmedSeats !== attending.length && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#5B6B63]">
              <Users className="w-3.5 h-3.5 text-[#A97912]" /> {confirmedSeats} seats
            </span>
          )}
        </div>
      </div>

      {shown.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {shown.map((guest) => (
          <article
            key={guest.id}
            aria-label={`${guest.fullName}, confirmed attendee`}
            className="attendee-card group relative flex w-[calc(50%_-_0.375rem)] max-w-[220px] sm:w-[calc(33.333%_-_0.667rem)] overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFFBF2] to-[#FFF4DC] border border-[#D6A323]/35 shadow-sm cursor-default hover:border-[#008F87]/40 transition-all"
          >
            {/* Soft silk wash */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(0,143,135,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(214,163,35,0.14),transparent_50%)]" />

            <div className="relative w-full h-full p-3 sm:p-4 flex flex-col items-center text-center">
              {/* Oval portrait with gold ring */}
              <div className="relative w-[72%] max-w-[140px] aspect-[3/4] mx-auto">
                <div className="absolute -inset-[3px] rounded-[50%] bg-gradient-to-br from-[#D6A323] via-[#A97912] to-[#D6A323] opacity-90 group-hover:opacity-100 group-hover:shadow-[0_0_24px_rgba(214,163,35,0.45)] transition-all duration-500" />
                <div className="relative w-full h-full rounded-[50%] overflow-hidden bg-[#FFFBF2] ring-2 ring-white">
                  {guest.photoUrl ? (
                    <img
                      src={guest.photoUrl}
                      alt={guest.fullName}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#008F87] to-[#006B66] text-[#FFF4DC]">
                      <span className="font-serif-luxury font-bold text-xl sm:text-2xl tracking-wider">
                        {initialsOf(guest.fullName)}
                      </span>
                      <span className="mt-1 text-[7px] font-bold uppercase tracking-[0.2em] text-white/70">
                        Guest
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#008F87] border-2 border-white flex items-center justify-center text-white shadow-md z-10">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-3.5 w-full min-w-0">
                <div className="h-[3.75rem] flex items-center justify-center overflow-hidden">
                  <h3
                    title={guest.fullName}
                    className="font-serif-luxury font-bold text-[13px] sm:text-[15px] text-[#252A2A] leading-snug line-clamp-3 group-hover:text-[#008F87] transition-colors"
                  >
                    {guest.fullName}
                  </h3>
                </div>
                <div className="mt-1 min-h-5 flex flex-wrap items-center justify-center gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#A97912] bg-[#FFF4DC] border border-[#D6A323]/30 px-2 py-0.5 rounded-full">
                    {guest.groupCategory || 'Guest'}
                  </span>
                  {guest.guestCount > 1 && (
                    <span className="text-[9px] font-medium text-[#006B66] bg-[#DDF7F5] border border-[#008F87]/20 px-2 py-0.5 rounded-full">
                      {guest.guestCount} seats
                    </span>
                  )}
                </div>
              </div>

              {/* Fixed-height note area keeps every card and row aligned. */}
              <div className="relative mt-auto pt-3 w-full h-[64px] overflow-hidden border-t border-[#D6A323]/25">
                <span className={`absolute inset-x-0 top-4 inline-flex items-center justify-center gap-1.5 text-[11px] font-serif-luxury italic text-[#008F87] transition-all duration-300 ${guest.message ? 'group-hover:-translate-y-2 group-hover:opacity-0' : ''}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6A323]" />
                  I will be attending
                </span>
                {guest.message && (
                  <p className="absolute inset-x-0 top-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-[10px] text-[#5B6B63] line-clamp-3 italic leading-relaxed px-1">
                    “{guest.message}”
                  </p>
                )}
              </div>
            </div>

            {/* Bottom gold accent line on hover */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#D6A323] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
          </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#D6A323]/50 bg-[#FFFBF2]/60 px-6 py-10 text-center">
          <Users className="w-6 h-6 mx-auto text-[#A97912]" />
          <p className="mt-2 font-serif-luxury text-lg text-[#252A2A]">The guest registry is ready.</p>
          <p className="mt-1 text-xs text-[#5B6B63]">Be the first to confirm your attendance.</p>
        </div>
      )}

      {onRegisterClick && (
        <div className="flex justify-center sm:justify-start pt-1">
          <button
            type="button"
            onClick={onRegisterClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-[#008F87] hover:bg-[#006B66] text-white shadow-md transition-all cursor-pointer"
          >
            <span>Join the List — RSVP</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendeeCards;
