import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDown, CalendarDays, Clock3, Images, MapPin } from 'lucide-react';
import { IWillBeThereBanner } from './components/IWillBeThereBanner';
import { PosterWall } from './components/PosterWall';
import { Toast } from './components/Toast';
import { INITIAL_EVENTS } from './data/eventData';
import { GeneratedPoster, RSVPResponse } from './types';
import { flyerPhotoToWallThumbnail } from './lib/imageResize';
import { postersApi } from './lib/postersApi';
import {
  createRsvpDraft,
  createRsvpTicketCode,
  guestFallbackEmail,
  MY_RSVP_STORAGE_KEY
} from './lib/rsvp';

const EVENT = INITIAL_EVENTS[0];
const POSTER_STORAGE_KEY = 'prof_rashidah_generated_posters';

const loadSavedRsvps = (): RSVPResponse[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem('prof_rashidah_rsvps') || '[]') as RSVPResponse[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const loadSavedPosters = (): GeneratedPoster[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(POSTER_STORAGE_KEY) || '[]') as GeneratedPoster[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const mergePosters = (...groups: GeneratedPoster[][]): GeneratedPoster[] => {
  const byId = new Map<string, GeneratedPoster>();
  groups.flat().forEach((poster) => byId.set(poster.id, poster));
  return Array.from(byId.values()).sort((first, second) => {
    const firstDate = first.updatedAt || first.createdAt;
    const secondDate = second.updatedAt || second.createdAt;
    return secondDate.localeCompare(firstDate);
  });
};

export function RsvpApp() {
  const [rsvps, setRsvps] = useState<RSVPResponse[]>(loadSavedRsvps);
  const [posters, setPosters] = useState<GeneratedPoster[]>(loadSavedPosters);
  const [isPosterWallOpen, setIsPosterWallOpen] = useState(false);
  const [isPosterWallLoading, setIsPosterWallLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeRsvp, setActiveRsvp] = useState<RSVPResponse>(() => {
    const saved = loadSavedRsvps();
    try {
      const myRsvpId = localStorage.getItem(MY_RSVP_STORAGE_KEY);
      return saved.find((rsvp) => rsvp.id === myRsvpId) || createRsvpDraft(EVENT.id);
    } catch {
      return createRsvpDraft(EVENT.id);
    }
  });

  const refreshPosterWall = useCallback(async () => {
    setIsPosterWallLoading(true);
    try {
      const sharedPosters = await postersApi.list(EVENT.id);
      setPosters((current) => mergePosters(sharedPosters, current));
    } catch {
      /* Local posters remain available when the shared API is offline. */
    } finally {
      setIsPosterWallLoading(false);
    }
  }, []);

  const publishSavedLocalPosters = useCallback(async () => {
    const savedRsvps = loadSavedRsvps();
    const localPosters = loadSavedPosters().filter((poster) => poster.id.startsWith('local-poster-'));

    for (const localPoster of localPosters) {
      const rsvpId = localPoster.id.slice('local-poster-'.length);
      const savedRsvp = savedRsvps.find((rsvp) => rsvp.id === rsvpId);
      if (!savedRsvp?.qrTicketCode || !localPoster.fullName.trim()) continue;

      try {
        const sharedPoster = await postersApi.save({
          eventId: EVENT.id,
          clientKey: savedRsvp.qrTicketCode,
          fullName: localPoster.fullName,
          photoUrl: localPoster.photoUrl,
          photoScale: localPoster.photoScale,
          photoOffsetX: localPoster.photoOffsetX,
          photoOffsetY: localPoster.photoOffsetY
        });
        setPosters((current) => mergePosters(
          [sharedPoster],
          current.filter((poster) => poster.id !== localPoster.id && poster.id !== sharedPoster.id)
        ));
      } catch {
        /* Retry on the next visit if shared storage is still unavailable. */
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('prof_rashidah_rsvps', JSON.stringify(rsvps));
    } catch {
      /* RSVP remains available for the current session. */
    }
  }, [rsvps]);

  useEffect(() => {
    try {
      localStorage.setItem(POSTER_STORAGE_KEY, JSON.stringify(posters));
    } catch {
      /* Keep the current wall in memory when browser storage is full. */
    }
  }, [posters]);

  useEffect(() => {
    void refreshPosterWall();
    void publishSavedLocalPosters();
  }, [publishSavedLocalPosters, refreshPosterWall]);

  const updateDraft = (changes: Partial<RSVPResponse>) => {
    setActiveRsvp((current) => ({ ...current, ...changes }));
  };

  const handleConfirm = ({
    fullName,
    photoUrl,
    photoScale,
    photoOffsetX,
    photoOffsetY
  }: {
    fullName: string;
    photoUrl: string;
    photoScale: number;
    photoOffsetX: number;
    photoOffsetY: number;
  }) => {
    const normalizedName = fullName.trim();
    const isExisting = activeRsvp.id !== 'rsvp-draft' && Boolean(activeRsvp.qrTicketCode);
    const confirmed: RSVPResponse = {
      ...activeRsvp,
      id: isExisting ? activeRsvp.id : `rsvp-${Date.now()}`,
      eventId: EVENT.id,
      fullName: normalizedName,
      email: activeRsvp.email || guestFallbackEmail(normalizedName),
      phone: '',
      attendance: 'attending',
      guestCount: 1,
      dietary: activeRsvp.dietary || 'None',
      groupCategory: activeRsvp.groupCategory || 'General',
      submittedAt: isExisting ? activeRsvp.submittedAt : new Date().toISOString(),
      qrTicketCode: isExisting ? activeRsvp.qrTicketCode : createRsvpTicketCode(EVENT.slug),
      checkedIn: activeRsvp.checkedIn || false,
      photoUrl: photoUrl || undefined
    };

    setRsvps((current) => (
      current.some((rsvp) => rsvp.id === confirmed.id)
        ? current.map((rsvp) => (rsvp.id === confirmed.id ? confirmed : rsvp))
        : [confirmed, ...current]
    ));
    setActiveRsvp(confirmed);
    try {
      localStorage.setItem(MY_RSVP_STORAGE_KEY, confirmed.id);
    } catch {
      /* RSVP remains available for the current session. */
    }

    void (async () => {
      let wallPhotoUrl = photoUrl || undefined;
      if (wallPhotoUrl) {
        try {
          wallPhotoUrl = await flyerPhotoToWallThumbnail(wallPhotoUrl);
        } catch {
          /* Use the existing resized portrait if thumbnail creation fails. */
        }
      }

      const localPosterId = `local-poster-${confirmed.id}`;
      const generatedAt = new Date().toISOString();
      const localPoster: GeneratedPoster = {
        id: localPosterId,
        eventId: EVENT.id,
        fullName: normalizedName,
        photoUrl: wallPhotoUrl,
        photoScale,
        photoOffsetX,
        photoOffsetY,
        createdAt: generatedAt,
        updatedAt: generatedAt
      };

      setPosters((current) => mergePosters([localPoster], current.filter((poster) => poster.id !== localPosterId)));

      try {
        const sharedPoster = await postersApi.save({
          eventId: EVENT.id,
          clientKey: confirmed.qrTicketCode,
          fullName: normalizedName,
          photoUrl: wallPhotoUrl,
          photoScale,
          photoOffsetX,
          photoOffsetY
        });
        setPosters((current) => mergePosters(
          [sharedPoster],
          current.filter((poster) => poster.id !== localPosterId && poster.id !== sharedPoster.id)
        ));
        setToastMessage('RSVP confirmed — your poster is now on the public wall.');
      } catch {
        setToastMessage('RSVP confirmed — your poster is saved on this device and will remain in your local wall.');
      }
    })();
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#252A2A]">
      <header className="sticky top-0 z-50 border-b border-[#D6A323]/20 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <img
              src="/images/nsuk-crest.png"
              alt="Nasarawa State University crest"
              className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
            />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold text-[#003F3C] sm:text-base">65th Inaugural Lecture</p>
              <p className="truncate text-[10px] text-[#5B6B63] sm:text-xs">Nasarawa State University, Keffi</p>
            </div>
          </div>
          <a
            href="#rsvp-section"
            className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-[#006B66] px-4 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#004D49] sm:px-5 sm:text-xs"
          >
            RSVP
          </a>
        </div>
      </header>

      <main>
        <section className="overflow-hidden border-b border-[#D6A323]/25 bg-[#003F3C] text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(280px,.82fr)_minmax(0,1.18fr)] lg:gap-14 lg:px-8 lg:py-14">
            <figure className="mx-auto w-full max-w-[280px] sm:max-w-[330px] lg:mx-0 lg:max-w-[390px]">
              <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#D6A323]/70 bg-white shadow-2xl">
                <img
                  src="/images/prof-rashidah-hero.jpg"
                  alt="Professor Rashidah Funke Olanrewaju"
                  className="aspect-[4/5] h-auto w-full object-cover object-top"
                  loading="eager"
                  fetchPriority="high"
                />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/25 bg-[#003F3C]/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#F8E7BE] backdrop-blur-sm sm:text-[10px]">
                  Inaugural Lecturer
                </span>
              </div>
            </figure>

            <div className="text-center lg:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D6A323] sm:text-xs">
                65th Inaugural Lecture · NSUK
              </p>
              <h1 className="mt-3 font-serif-luxury text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Professor Rashidah
                <span className="mt-1 block font-normal italic text-[#F8E7BE]">Funke Olanrewaju</span>
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-xs font-medium leading-relaxed text-white/75 sm:text-sm lg:mx-0">
                Professor of Computer Science &amp; AI · Director, EDC, NSUK
              </p>

              <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-[#D6A323]/35 bg-white/8 px-4 py-3 lg:mx-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#D6A323]">Lecture topic</p>
                <p className="mt-1 font-serif-luxury text-sm font-semibold leading-snug text-white sm:text-base">
                  “Intentional Intelligence: From Digital Trust to Human Flourishing”
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-left text-[11px] text-white/85 sm:grid-cols-3 sm:text-xs">
                <div className="col-span-2 flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-3 py-2.5 sm:col-span-1">
                  <CalendarDays className="h-4 w-4 shrink-0 text-[#D6A323]" />
                  <span>25 Nov 2026</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-3 py-2.5">
                  <Clock3 className="h-4 w-4 shrink-0 text-[#D6A323]" />
                  <span>2:00 PM</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-3 py-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#D6A323]" />
                  <span>Assembly Hall, NSUK</span>
                </div>
              </div>

              <a
                href="#rsvp-section"
                className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D6A323] px-6 text-xs font-bold uppercase tracking-wider text-[#003330] shadow-lg transition-all hover:bg-[#E5BD55]"
              >
                RSVP now
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="rsvp-section" className="scroll-mt-16 bg-white px-3 py-9 sm:scroll-mt-[72px] sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto mb-7 max-w-6xl text-center sm:mb-9">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A97912] sm:text-xs">Official RSVP</p>
            <h2 className="mt-1.5 text-2xl font-bold text-[#252A2A] sm:text-4xl">Complete Your RSVP</h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#5B6B63] sm:text-sm">
              Enter your name to confirm. Adding a photo is optional. Generated posters appear on the public wall.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsPosterWallOpen(true);
                void refreshPosterWall();
              }}
              className="mx-auto mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#D6A323]/45 bg-[#FFF4DC] px-5 text-xs font-bold text-[#006B66] shadow-sm transition-all hover:border-[#008F87] hover:bg-[#DDF7F5]"
            >
              <Images className="h-4 w-4 text-[#A97912]" />
              <span>View Everyone’s Posters</span>
              <span className="rounded-full bg-[#006B66] px-2 py-0.5 text-[10px] text-white">{posters.length}</span>
            </button>
          </div>

          <IWillBeThereBanner
            event={EVENT}
            rsvp={activeRsvp}
            onUpdatePhoto={(photoUrl) => updateDraft({ photoUrl: photoUrl || undefined })}
            onUpdateName={(fullName) => updateDraft({ fullName })}
            onConfirmRsvp={handleConfirm}
            onSuccessToast={setToastMessage}
          />
        </section>
      </main>

      <footer className="border-t border-[#D6A323]/20 bg-[#F7F8F5] px-4 py-5 text-center text-[11px] text-[#5B6B63]">
        Official RSVP portal · Nasarawa State University, Keffi
      </footer>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      <PosterWall
        isOpen={isPosterWallOpen}
        posters={posters}
        isLoading={isPosterWallLoading}
        onClose={() => setIsPosterWallOpen(false)}
      />
    </div>
  );
}

export default RsvpApp;
