import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface GalleryPhotoItem {
  url: string;
  caption: string;
  category?: string;
  author?: string;
}

interface PhotoGalleryProps {
  photos: GalleryPhotoItem[];
  className?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, className = '' }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  const step = (direction: 1 | -1) => {
    setActiveIndex((current) => {
      if (current === null || photos.length === 0) return current;
      return (current + direction + photos.length) % photos.length;
    });
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % photos.length
        );
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + photos.length) % photos.length
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, photos.length]);

  if (photos.length === 0) return null;

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
        {photos.map((photo, index) => (
          <button
            key={`${photo.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View photo: ${photo.caption}`}
            className="group relative flex flex-col h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FFFBF2] text-left border border-[#D6A323]/30 hover:border-[#008F87]/60 shadow-xs hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008F87] focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer"
          >
            {/* Image Frame */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-[#FFF4DC] to-[#006B66]/20">
              <img
                src={photo.url}
                alt={photo.caption}
                loading="lazy"
                className="h-full w-full object-cover object-[center_18%] transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Refined gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />

              {/* Frosted category chip */}
              {photo.category && (
                <div className="absolute left-3 top-3 z-10 max-w-[85%]">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#006B66]/90 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#FFF4DC] shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D6A323] shrink-0" />
                    <span className="truncate">{photo.category}</span>
                  </span>
                </div>
              )}

              {/* Floating action button */}
              <span className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#D6A323] text-[#003330] shadow-md transition-all duration-300 opacity-90 group-hover:opacity-100 group-hover:scale-110">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </div>

            {/* Consistent text body */}
            <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 bg-[#FFFBF2]">
              <div className="min-h-[2.85rem] flex items-start">
                <p className="font-serif-luxury text-xs sm:text-sm font-bold leading-snug text-[#252A2A] line-clamp-2 transition-colors group-hover:text-[#008F87]">
                  {photo.caption}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#D6A323]/20 flex items-center justify-between text-[9px] gap-2">
                <span className="truncate font-mono font-bold uppercase tracking-[0.14em] text-[#A97912]">
                  {photo.author || photo.category || 'NSUK Academic Archive'}
                </span>
                <span className="shrink-0 font-semibold text-[#5B6B63] group-hover:text-[#008F87] transition-colors flex items-center gap-0.5">
                  <span>Enlarge</span>
                </span>
              </div>
            </div>

            {/* Bottom animated gold border */}
            <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#008F87] via-[#D6A323] to-[#008F87] transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.caption}
            className="fixed inset-0 z-[130] flex items-center justify-center bg-[#002624]/95 p-4 backdrop-blur-md animate-fade-in sm:p-8"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close photo viewer"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-5 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-5 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <figure
              className="relative flex w-full max-w-4xl flex-col items-center animate-scale-up"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="max-h-[68vh] w-auto max-w-full rounded-2xl border border-white/15 bg-black/20 object-contain shadow-2xl sm:max-h-[72vh]"
              />

              <figcaption className="mt-3 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 text-center text-white">
                {activePhoto.category && (
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D6A323] block mb-1">
                    {activePhoto.category}
                  </span>
                )}
                <p className="font-serif-luxury text-sm font-semibold leading-snug sm:text-lg">
                  {activePhoto.caption}
                </p>
                {activePhoto.author && (
                  <p className="mt-1 text-[10px] text-white/70 font-mono tracking-wider">{activePhoto.author}</p>
                )}
                <p className="mt-1.5 text-[10px] text-white/45">
                  {String((activeIndex ?? 0) + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                  <span className="hidden sm:inline"> · Use arrow keys to browse</span>
                </p>
              </figcaption>
            </figure>
          </div>,
          document.body
        )}
    </>
  );
};

export default PhotoGallery;
