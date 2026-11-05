import React, { useEffect } from 'react';
import { ImageIcon, Loader2, Users, X } from 'lucide-react';
import { GeneratedPoster } from '../types';
import {
  RSVP_PHOTO_FOCUS_Y,
  RSVP_PHOTO_OVAL,
  RSVP_POSTER_HEIGHT,
  RSVP_POSTER_SRC,
  RSVP_POSTER_WIDTH,
  safePosterPhotoScale
} from '../lib/posterLayout';

interface PosterWallProps {
  isOpen: boolean;
  posters: GeneratedPoster[];
  isLoading?: boolean;
  onClose: () => void;
}

const initialsOf = (name: string) => name
  .replace(/^(prof\.?|dr\.?|engr\.?|mr\.?|mrs\.?|ms\.?|chief|alhaji|hajiya)\s+/i, '')
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() || '')
  .join('') || 'G';

const formatGeneratedDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(value));
  } catch {
    return '';
  }
};

export const PosterWall: React.FC<PosterWallProps> = ({
  isOpen,
  posters,
  isLoading = false,
  onClose
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#002E2B]/92 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="poster-wall-title"
    >
      <div className="mx-auto my-2 min-h-[calc(100dvh-1rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-[#D6A323]/35 bg-[#F7F8F5] shadow-2xl sm:my-4 sm:min-h-0">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-[#D6A323]/25 bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-7">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A97912]">Public RSVP Gallery</p>
            <h2 id="poster-wall-title" className="truncate text-xl font-bold text-[#003F3C] sm:text-3xl">
              Everyone Who Generated a Poster
            </h2>
            <p className="mt-0.5 text-[11px] text-[#5B6B63] sm:text-xs">
              {posters.length} {posters.length === 1 ? 'poster' : 'posters'} shared
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D6A323]/30 bg-[#FFF4DC] text-[#003F3C] transition-colors hover:bg-[#D6A323]"
            aria-label="Close poster wall"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="px-4 py-7 sm:px-7 sm:py-9">
          {isLoading && posters.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center text-[#5B6B63]">
              <Loader2 className="h-8 w-8 animate-spin text-[#008F87]" />
              <p className="mt-3 text-sm font-semibold">Loading the poster wall…</p>
            </div>
          ) : posters.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-[#D6A323]/50 bg-white px-6 text-center">
              <ImageIcon className="h-9 w-9 text-[#A97912]" />
              <h3 className="mt-3 font-serif-luxury text-xl font-bold text-[#252A2A]">The poster wall is ready.</h3>
              <p className="mt-1 max-w-sm text-xs text-[#5B6B63]">Be the first guest to complete an RSVP and generate a poster.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posters.map((poster) => {
                const safeScale = safePosterPhotoScale(
                  poster.photoScale,
                  poster.photoOffsetX,
                  poster.photoOffsetY
                );
                return (
                  <article key={poster.id} className="overflow-hidden rounded-2xl border border-[#D6A323]/30 bg-white p-2.5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div
                      className="relative w-full overflow-hidden rounded-xl bg-[#FFF4DC]"
                      style={{ aspectRatio: `${RSVP_POSTER_WIDTH} / ${RSVP_POSTER_HEIGHT}` }}
                    >
                      <img
                        src={RSVP_POSTER_SRC}
                        alt="I Will Be Attending RSVP poster"
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />

                      <div
                        className="absolute z-10 overflow-hidden rounded-[50%] bg-gradient-to-br from-[#008F87] via-[#006B66] to-[#003330] shadow-[inset_0_0_0_2px_rgba(181,126,4,0.9)]"
                        style={{
                          left: `${RSVP_PHOTO_OVAL.left * 100}%`,
                          top: `${RSVP_PHOTO_OVAL.top * 100}%`,
                          width: `${RSVP_PHOTO_OVAL.width * 100}%`,
                          height: `${RSVP_PHOTO_OVAL.height * 100}%`
                        }}
                      >
                        {poster.photoUrl ? (
                          <img
                            src={poster.photoUrl}
                            alt={poster.fullName}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                            style={{
                              objectPosition: `50% ${RSVP_PHOTO_FOCUS_Y * 100}%`,
                              transformOrigin: `50% ${RSVP_PHOTO_FOCUS_Y * 100}%`,
                              transform: `translate(${poster.photoOffsetX}%, ${poster.photoOffsetY}%) scale(${safeScale})`
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-serif-luxury text-2xl font-bold tracking-wider text-[#FFF4DC] sm:text-3xl">
                            {initialsOf(poster.fullName)}
                          </div>
                        )}

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[30%] flex-col items-center justify-center bg-gradient-to-t from-[#003330] via-[#004D49]/90 to-transparent px-[8%] pt-[6%] text-center">
                          <span className="text-[4px] font-bold uppercase tracking-[0.12em] text-[#D6A323] sm:text-[5px]">Confirmed Attendee</span>
                          <span className={`mt-[2%] w-full truncate font-serif-luxury font-bold leading-none text-white ${
                            poster.fullName.length > 30
                              ? 'text-[6px] sm:text-[7px]'
                              : poster.fullName.length > 22
                                ? 'text-[7px] sm:text-[8px]'
                                : 'text-[8px] sm:text-[10px]'
                          }`}>
                            {poster.fullName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3">
                      <h3 className="min-w-0 truncate font-serif-luxury text-sm font-bold text-[#252A2A]" title={poster.fullName}>
                        {poster.fullName}
                      </h3>
                      <span className="shrink-0 text-[9px] text-[#6B7B73]">{formatGeneratedDate(poster.updatedAt || poster.createdAt)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-center gap-2 border-t border-[#D6A323]/20 bg-[#FFF4DC]/55 px-4 py-4 text-center text-[11px] text-[#5B6B63]">
          <Users className="h-4 w-4 text-[#008F87]" />
          Posters are added when guests confirm their RSVP.
        </footer>
      </div>
    </div>
  );
};

export default PosterWall;
