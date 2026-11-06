import React, { useRef, useState, useEffect } from 'react';
import { EventData, RSVPResponse } from '../types';
import { fileToFlyerPhotoDataUrl } from '../lib/imageResize';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  Download,
  Share2,
  Sparkles,
  Upload,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  User,
  Calendar,
  QrCode,
  X
} from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import {
  RSVP_PHOTO_FOCUS_Y,
  RSVP_PHOTO_OVAL,
  RSVP_POSTER_EXPORT_SCALE,
  RSVP_POSTER_HEIGHT,
  RSVP_POSTER_SRC,
  RSVP_POSTER_WIDTH,
  safePosterPhotoScale
} from '../lib/posterLayout';

const QUICK_TITLES = ['Prof.', 'Dr.', 'Engr.', 'Barr.', 'Alhaji', 'Hajiya', 'Chief', 'Mr.', 'Mrs.', 'Ms.'];

const formatClockTime = (time: string) => {
  const [rawHour, minute = '00'] = time.split(':');
  const hour = Number(rawHour);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
};

const subtractMinutes = (time: string, amount: number) => {
  const [hour, minute] = time.split(':').map(Number);
  const total = (hour * 60 + minute - amount + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const formatEventDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

interface IWillBeThereBannerProps {
  event: EventData;
  rsvp: RSVPResponse;
  onUpdatePhoto?: (newPhotoUrl: string) => void;
  onUpdateName?: (name: string) => void;
  onConfirmRsvp?: (payload: {
    fullName: string;
    photoUrl: string;
    guestCount: number;
    photoScale: number;
    photoOffsetX: number;
    photoOffsetY: number;
  }) => void;
  onSuccessToast?: (msg: string) => void;
  defaultRatio?: 'square' | 'story';
  compact?: boolean;
}

export const IWillBeThereBanner: React.FC<IWillBeThereBannerProps> = ({
  event,
  rsvp,
  onUpdatePhoto,
  onUpdateName,
  onConfirmRsvp,
  onSuccessToast,
  compact = false,
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Form state must belong to the visitor. Never prefill another guest's
  // identity or portrait when the RSVP draft is blank.
  const [attendeeName, setAttendeeName] = useState(rsvp.fullName || '');
  const [localPhoto, setLocalPhoto] = useState<string | undefined>(rsvp.photoUrl || '');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);

  // Visitor-adjustable crop controls keep different portrait proportions usable.
  const [photoScale, setPhotoScale] = useState(1);
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);

  // Status state
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(
    Boolean(rsvp.fullName?.trim() && rsvp.qrTicketCode?.trim())
  );

  const guestPhoto = localPhoto || rsvp.photoUrl;
  const displayName = attendeeName.trim();
  const nameplateName = displayName.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const safePhotoScale = safePosterPhotoScale(photoScale, photoOffsetX, photoOffsetY);

  // Generate QR Code for digital pass
  const ticketCode = rsvp.qrTicketCode || '';
  const eventDateLabel = formatEventDate(event.date);
  const eventTimeLabel = formatClockTime(event.startTime);
  const arrivalTimeLabel = formatClockTime(subtractMinutes(event.startTime, 15));

  useEffect(() => {
    if (!ticketCode) {
      setQrCodeDataUrl('');
      return;
    }
    QRCode.toDataURL(ticketCode, { width: 240, margin: 1, color: { dark: '#003330', light: '#FFFFFF' } })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation failed:', err));
  }, [ticketCode]);

  // Keep internal state synchronized if parent rsvp prop changes
  useEffect(() => {
    if (rsvp.fullName && rsvp.fullName !== attendeeName) {
      setAttendeeName(rsvp.fullName);
    }
    if (rsvp.photoUrl && rsvp.photoUrl !== localPhoto) {
      setLocalPhoto(rsvp.photoUrl);
    }
    if (rsvp.fullName?.trim() && rsvp.qrTicketCode?.trim()) {
      setIsConfirmed(true);
    }
  }, [rsvp]);

  const applyPhoto = (url: string) => {
    setLocalPhoto(url);
    setPhotoScale(1);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
    onUpdatePhoto?.(url);
  };

  const removePhoto = () => {
    setLocalPhoto('');
    setPhotoScale(1);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
    onUpdatePhoto?.('');
  };

  const handleNameChange = (value: string) => {
    setAttendeeName(value);
    onUpdateName?.(value);
  };

  // Quick title toggle/prefix
  const handleApplyTitle = (title: string) => {
    let current = attendeeName.trim();
    // Remove existing known titles
    for (const t of QUICK_TITLES) {
      if (current.startsWith(t)) {
        current = current.slice(t.length).trim();
        break;
      }
    }
    const updated = current ? `${title} ${current}` : `${title} `;
    handleNameChange(updated);
    nameInputRef.current?.focus();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsPhotoProcessing(true);
    try {
      const result = await fileToFlyerPhotoDataUrl(file);
      applyPhoto(result);
      onSuccessToast?.('Photo added — your flyer preview is ready.');
    } catch (error) {
      onSuccessToast?.(error instanceof Error ? error.message : 'That photo could not be added.');
    } finally {
      setIsPhotoProcessing(false);
    }
  };

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const saveCurrentPosterToWall = () => {
    const name = attendeeName.trim();
    if (!name) return;
    onConfirmRsvp?.({
      fullName: name,
      photoUrl: guestPhoto || '',
      guestCount: 1,
      photoScale,
      photoOffsetX,
      photoOffsetY,
    });
  };

  // Generates the high-resolution poster: the supplied artwork with the guest
  // portrait placed inside its gold oval. Nothing else is drawn on the image —
  // guest names appear only on the shared poster wall.
  const generateOfficialCanvas = async (): Promise<HTMLCanvasElement> => {
    const scale = RSVP_POSTER_EXPORT_SCALE;
    const canvas = document.createElement('canvas');
    canvas.width = RSVP_POSTER_WIDTH * scale;
    canvas.height = RSVP_POSTER_HEIGHT * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D context');

    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Draw base flyer background
    const flyer = await loadImage(RSVP_POSTER_SRC);
    ctx.drawImage(flyer, 0, 0, RSVP_POSTER_WIDTH, RSVP_POSTER_HEIGHT);

    // Gold oval geometry
    const ox = RSVP_PHOTO_OVAL.left * RSVP_POSTER_WIDTH;
    const oy = RSVP_PHOTO_OVAL.top * RSVP_POSTER_HEIGHT;
    const ow = RSVP_PHOTO_OVAL.width * RSVP_POSTER_WIDTH;
    const oh = RSVP_PHOTO_OVAL.height * RSVP_POSTER_HEIGHT;
    const cx = ox + ow / 2;
    const cy = oy + oh / 2;

    // 2. Place the guest portrait inside the gold oval. The supplied artwork is
    // left completely untouched — no overlays, no text, no re-drawn ring.
    if (guestPhoto) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, ow / 2, oh / 2, 0, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      try {
        const guestImg = await loadImage(guestPhoto);
        const baseScale = Math.max(ow / guestImg.width, oh / guestImg.height) * safePhotoScale;
        const drawW = guestImg.width * baseScale;
        const drawH = guestImg.height * baseScale;
        const drawX = ox + (ow - drawW) * 0.5 + (photoOffsetX / 100) * ow;
        const drawY = oy + (oh - drawH) * RSVP_PHOTO_FOCUS_Y + (photoOffsetY / 100) * oh;
        ctx.drawImage(guestImg, drawX, drawY, drawW, drawH);
      } catch (err) {
        console.warn('Could not draw guest photo:', err);
      }

      ctx.restore();
    }

    return canvas;
  };

  const handleDownloadBanner = async () => {
    setIsDownloading(true);
    try {
      saveCurrentPosterToWall();
      const canvas = await generateOfficialCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.94);
      const safeName = (nameplateName || 'attendee')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${safeName || 'attendee'}-i-will-be-attending-nsuk.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      try {
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#008F87', '#D6A323', '#B9A1D0', '#FFF4DC'],
        });
      } catch {
        /* ignore */
      }

      onSuccessToast?.('Your official “I Will Be Attending” flyer downloaded in Ultra HD!');
    } catch (err) {
      console.error('Failed to export flyer:', err);
      onSuccessToast?.('Could not export flyer. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    setIsCopying(true);
    try {
      saveCurrentPosterToWall();
      const canvas = await generateOfficialCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          if (navigator.clipboard && (window as unknown as { ClipboardItem: typeof ClipboardItem }).ClipboardItem) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 3000);
            onSuccessToast?.('Flyer copied! Paste directly into WhatsApp or LinkedIn.');
          } else {
            handleDownloadBanner();
          }
        } catch {
          handleDownloadBanner();
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy failed:', err);
    } finally {
      setIsCopying(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `✦ I WILL BE ATTENDING! ✦\n\n${event.title}\n\n📅 ${eventDateLabel} at ${eventTimeLabel}\n🏛 ${event.venueName}\n\nConfirm your attendance and create your personalized attendee flyer:\n${window.location.origin}/e/${event.slug}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = attendeeName.trim();
    if (!name) {
      onSuccessToast?.('Please enter your name to complete RSVP.');
      nameInputRef.current?.focus();
      return;
    }
    const wasConfirmed = isConfirmed;

    saveCurrentPosterToWall();

    setIsConfirmed(true);

    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#008F87', '#D6A323', '#B9A1D0', '#FFF4DC'],
      });
    } catch {
      /* ignore */
    }

    onSuccessToast?.(
      wasConfirmed
        ? 'Your RSVP and digital pass have been updated.'
        : 'RSVP confirmed! Your personalized flyer and digital pass are ready.'
    );
  };

  return (
    <div className={`w-full mx-auto ${compact ? 'max-w-xl' : 'max-w-6xl'}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="sr-only"
        aria-label="Upload RSVP portrait"
      />

      {/* Main Grid: Responsive 2-column on desktop, optimized 1-column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* ============================================================== */}
        {/* COLUMN 1: INTERACTIVE FORM & CONTROLS                          */}
        {/* ============================================================== */}
        <div className="order-1 lg:col-span-6 w-full space-y-4">
          
          {/* Confirmed Status Pill */}
          {isConfirmed && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-emerald-700">
                    Attendance Confirmed
                  </div>
                  <div className="text-xs sm:text-sm font-serif-luxury font-bold text-[#252A2A] truncate">
                    {nameplateName || 'Attendee'}
                  </div>
                </div>
              </div>
              {ticketCode && <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-[#006B66] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-[#D6A323]" />
                <span className="hidden sm:inline">Pass</span>
              </button>}
            </div>
          )}

          {/* Form Card */}
          <form
            onSubmit={handleConfirm}
            className="rounded-3xl bg-white p-4 sm:p-6 shadow-sm text-[#252A2A] space-y-5 relative overflow-hidden border border-[#D6A323]/25"
          >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between gap-2 border-b border-[#D6A323]/20 pb-4">
              <div>
                <div className="font-serif-luxury italic text-xs text-[#A97912]">
                  Official Attendance Studio
                </div>
                <h3 className="mt-1 font-serif-luxury font-bold text-lg sm:text-xl text-[#252A2A]">
                  Confirm Attendance &amp; Get Flyer
                </h3>
              </div>
              <span className="hidden min-[420px]:inline text-[10px] text-[#006B66] font-mono font-semibold bg-[#FFF4DC] px-2.5 py-1 rounded-full border border-[#D6A323]/30">
                {eventDateLabel} · {eventTimeLabel}
              </span>
            </div>

            {/* ============================================================== */}
            {/* STEP 1: BETTER & OK NAME INPUT SECTION                        */}
            {/* ============================================================== */}
            {/* STEP 1: BETTER & OK NAME INPUT SECTION                        */}
            {/* ============================================================== */}
            <div className="rounded-2xl bg-[#F8FAF9] p-3.5 sm:p-4 text-[#252A2A] border border-[#D6A323]/30 space-y-2.5 relative z-10">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="rsvp-attendee-name"
                  className="text-xs font-semibold text-[#006B66] flex items-center gap-1.5"
                >
                  <span className="w-5 h-5 rounded-full bg-[#008F87] text-white text-[10px] font-extrabold flex items-center justify-center">
                    1
                  </span>
                  <span>Attendee Full Name &amp; Title</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-[#6B7B73] font-medium hidden sm:inline">
                  Shown on RSVP Wall
                </span>
              </div>

              {/* Quick Academic Title Prefix Chips */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[9px] font-bold uppercase text-[#A97912] shrink-0 mr-1">
                  Prefix:
                </span>
                {QUICK_TITLES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleApplyTitle(t)}
                    className="px-3 py-1.5 min-h-11 rounded-lg bg-[#FFF4DC] hover:bg-[#008F87] hover:text-white border border-[#D6A323]/40 text-[10px] font-bold text-[#006B66] transition-colors shrink-0 cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* High-Contrast Luminous Input Box */}
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-[#008F87]" />
                <input
                  ref={nameInputRef}
                  id="rsvp-attendee-name"
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full min-h-11 pl-9 pr-8 py-2.5 rounded-xl border-2 border-[#D6A323]/30 bg-white text-sm sm:text-base font-serif-luxury font-bold text-[#252A2A] placeholder-gray-400 focus:outline-hidden focus:border-[#008F87] focus:bg-white focus:ring-2 focus:ring-[#008F87]/20 transition-all shadow-inner"
                  placeholder="e.g. Prof. Sa'adatu Hassan Liman"
                  autoComplete="name"
                />
                {attendeeName && (
                  <button
                    type="button"
                    onClick={() => handleNameChange('')}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    title="Clear name"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Live Inscription Preview Pill */}
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <div className="flex items-center gap-1 text-[#008F87] font-semibold truncate">
                  <span className="text-[#D6A323] font-bold">✦</span>
                  <span className="text-[#6B7B73]">RSVP Wall Name:</span>
                  <span className="font-serif-luxury font-bold text-[#252A2A] truncate">
                    {nameplateName || 'Your Name'}
                  </span>
                </div>
                <span className="text-[10px] text-[#008F87] font-bold shrink-0">
                  Live ✓
                </span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* STEP 2: PHOTO & DEFAULT BACKGROUND STUDIO                     */}
            {/* ============================================================== */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#006B66] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#D6A323] text-[#003330] text-[10px] font-extrabold flex items-center justify-center">
                    2
                  </span>
                  <span>Your Photo</span>
                  <span className="text-[10px] text-[#6B7B73] font-normal lowercase">(optional)</span>
                </label>
                {guestPhoto && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="min-h-10 px-2 text-[10px] text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>

              {/* Upload button & current thumbnail */}
              <div className="min-h-[180px] flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-[#F8FAF9] border-2 border-dashed border-[#008F87]/30 text-center hover:border-[#008F87]/60 transition-colors">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPhotoProcessing}
                  className="px-5 py-3 rounded-xl bg-[#006B66] hover:bg-[#004D49] text-white font-bold text-xs tracking-wide shadow-sm active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer min-h-[48px]"
                >
                  {isPhotoProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 stroke-[2.5]" />}
                  <span>{isPhotoProcessing ? 'Preparing Photo…' : guestPhoto ? 'Change Photo' : 'Upload Photo / Selfie'}</span>
                </button>

                {guestPhoto ? (
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-[#D6A323] shrink-0 bg-[#FFF4DC]">
                      <img src={guestPhoto} alt="Guest" className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="text-[11px] text-[#006B66] font-medium">Photo attached ✓</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#6B7B73]">
                    JPG, PNG, or WEBP · up to 15 MB
                  </span>
                )}
              </div>

              {guestPhoto && (
                <div className="grid grid-cols-1 gap-2.5 rounded-xl bg-[#F8FAF9] border border-[#D6A323]/20 px-3 py-2.5 sm:grid-cols-2">
                  <label className="text-[10px] text-[#5B6B63]">
                    <span className="flex justify-between"><span>Zoom</span><span>{Math.round(photoScale * 100)}%</span></span>
                    <input
                      type="range"
                      min="1"
                      max="1.5"
                      step="0.01"
                      value={photoScale}
                      onChange={(e) => setPhotoScale(Number(e.target.value))}
                      className="w-full accent-[#D6A323]"
                    />
                  </label>
                  <label className="text-[10px] text-[#5B6B63]">
                    <span className="flex justify-between"><span>Left / right</span><span>{photoOffsetX > 0 ? '+' : ''}{photoOffsetX}%</span></span>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={photoOffsetX}
                      onChange={(e) => setPhotoOffsetX(Number(e.target.value))}
                      className="w-full accent-[#D6A323]"
                    />
                  </label>
                  <label className="text-[10px] text-[#5B6B63]">
                    <span className="flex justify-between"><span>Up / down</span><span>{photoOffsetY > 0 ? '+' : ''}{photoOffsetY}%</span></span>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={photoOffsetY}
                      onChange={(e) => setPhotoOffsetY(Number(e.target.value))}
                      className="w-full accent-[#D6A323]"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoScale(1);
                      setPhotoOffsetX(0);
                      setPhotoOffsetY(0);
                    }}
                    className="self-end min-h-10 px-3 py-1.5 rounded-lg border border-[#D6A323]/30 text-[10px] font-semibold text-[#006B66] hover:bg-[#FFF4DC]"
                  >
                    Reset crop
                  </button>
                </div>
              )}
            </div>

            {/* Primary Submit Button */}
            <div className="pt-2 relative z-10">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#006B66] hover:bg-[#004D49] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
              >
                <CheckCircle2 className="w-5 h-5 text-[#D6A323]" />
                <span>{isConfirmed ? 'Update My RSVP' : 'Confirm RSVP & Get Attending Flyer'}</span>
              </button>
            </div>
          </form>

          {/* Quick Confirmation Action Bar */}
          <div className="rounded-2xl bg-[#FFFBF2] border border-[#D6A323]/30 p-3 sm:p-4 shadow-sm space-y-2.5">
            <div className="text-xs font-semibold text-[#006B66] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D6A323]" /> Flyer Actions
              </span>
              <span className="text-[10px] text-[#6B7B73] font-normal">Ultra-HD Export</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadBanner}
                disabled={isDownloading || !isConfirmed}
                title={isConfirmed ? 'Download your personalized flyer' : 'Confirm your RSVP first'}
                className="w-full py-2.5 px-4 rounded-xl bg-[#008F87] hover:bg-[#006B66] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D6A323]" />
                    <span>Rendering HD…</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#FFF4DC]" />
                    <span>Download HD Flyer</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Share2 className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100 text-xs">
              <button
                type="button"
                onClick={handleCopyImage}
                disabled={isCopying || !isConfirmed}
                title={isConfirmed ? 'Copy flyer image' : 'Confirm your RSVP first'}
                className="inline-flex items-center gap-1 text-[#008F87] hover:text-[#006B66] font-semibold min-h-10 py-2 px-2.5 rounded-lg hover:bg-[#FFF4DC] transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
              >
                {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedImage ? 'Copied to Clipboard' : 'Copy Image'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={generateGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#008F87] hover:text-[#006B66] font-semibold min-h-10 py-2 px-2.5 rounded-lg hover:bg-[#FFF4DC] transition-colors"
                  title="Add to Google Calendar"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D6A323]" />
                  <span>Google Cal</span>
                </a>
                <button
                  type="button"
                  onClick={() => downloadIcsFile(event)}
                  className="inline-flex items-center gap-1 text-[#008F87] hover:text-[#006B66] font-semibold min-h-10 py-2 px-2.5 rounded-lg hover:bg-[#FFF4DC] transition-colors cursor-pointer"
                  title="Download iCal file"
                >
                  <span>iCal (.ics)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: LIVE FLYER PREVIEW                                   */}
        {/* ============================================================== */}
        <div className="order-2 lg:col-span-6 w-full flex flex-col items-center lg:sticky lg:top-24">
          
          <div className="w-full max-w-[360px] sm:max-w-[420px] space-y-3">
            
            {/* Live Indicator */}
            <div className="flex items-center px-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-serif-luxury italic text-[#A97912]">
                <span className="w-2 h-2 rounded-full bg-[#D6A323] animate-pulse" />
                Live Official Flyer Preview
              </span>
            </div>

            {/* Interactive Flyer Canvas Frame */}
            <div className="relative group mx-auto w-full">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#008F87]/20 via-[#D6A323]/25 to-[#008F87]/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 pointer-events-none" />

              <div
                ref={bannerRef}
                data-i-will-be-there-card
                className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#FFFBF2] select-none border-2 border-[#D6A323]/50"
                style={{ aspectRatio: `${RSVP_POSTER_WIDTH} / ${RSVP_POSTER_HEIGHT}` }}
              >
                {/* Base flyer artwork */}
                <img
                  src={RSVP_POSTER_SRC}
                  alt="I Will Be Attending — Official RSVP Flyer"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                  crossOrigin="anonymous"
                  draggable={false}
                />

                {/* Guest photo placed into the supplied artwork's gold oval */}
                {guestPhoto && (
                  <div
                    className="absolute z-10 overflow-hidden rounded-[50%]"
                    style={{
                      left: `${RSVP_PHOTO_OVAL.left * 100}%`,
                      top: `${RSVP_PHOTO_OVAL.top * 100}%`,
                      width: `${RSVP_PHOTO_OVAL.width * 100}%`,
                      height: `${RSVP_PHOTO_OVAL.height * 100}%`,
                    }}
                  >
                    <img
                      src={guestPhoto}
                      alt="Guest portrait"
                      className="relative w-full h-full object-cover"
                      style={{
                        objectPosition: `50% ${RSVP_PHOTO_FOCUS_Y * 100}%`,
                        transformOrigin: `50% ${RSVP_PHOTO_FOCUS_Y * 100}%`,
                        transform: `translate(${photoOffsetX}%, ${photoOffsetY}%) scale(${safePhotoScale})`
                      }}
                      crossOrigin="anonymous"
                      draggable={false}
                    />
                  </div>
                )}

              </div>
            </div>

            {/* Quick Caption under preview */}
            <div className="flex items-center justify-between text-[11px] text-[#252A2A]/70 px-1">
              <span>Portrait HD export · {RSVP_POSTER_WIDTH} × {RSVP_POSTER_HEIGHT}</span>
              {isConfirmed && ticketCode ? (
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="text-[#008F87] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#D6A323]" />
                  <span>View Digital Pass</span>
                </button>
              ) : (
                <span className="text-[#9AA8A0]">Digital pass appears after confirmation</span>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL: DIGITAL QR GUEST PASS                                    */}
      {/* ============================================================== */}
      {showQrModal && isConfirmed && ticketCode && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="my-auto bg-[#FFF4DC] rounded-2xl sm:rounded-3xl border border-[#D6A323]/50 shadow-2xl max-w-sm w-full max-h-[calc(100dvh-1.5rem)] overflow-y-auto text-[#252A2A] relative">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#003330] via-[#006B66] to-[#003330] text-white flex items-center justify-between border-b border-[#D6A323]/30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFF4DC]">
                  Digital Guest Pass
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pass Body */}
            <div className="p-6 space-y-4 text-center">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#D6A323] font-bold">
                  65th Inaugural Lecture
                </div>
                <h4 className="font-serif-luxury text-lg font-bold text-[#252A2A] leading-tight">
                  {event.title}
                </h4>
                <p className="text-xs text-[#252A2A]/70">
                  {event.venueName}
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-[#FFFBF2] rounded-2xl border-2 border-[#D6A323]/40 shadow-inner flex flex-col items-center">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Guest QR Ticket" className="w-44 h-44" />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-gray-400 text-xs">
                    Generating QR…
                  </div>
                )}
                <div className="mt-2 font-mono font-bold text-xs text-[#008F87] tracking-wider">
                  {ticketCode}
                </div>
                <span className="text-[9px] uppercase tracking-wider text-[#252A2A]/60 mt-0.5">
                  Present at VIP / Guest Entrance
                </span>
              </div>

              {/* Guest Details */}
              <div className="bg-[#FFFBF2] border border-[#D6A323]/30 p-3 rounded-xl text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#252A2A]/70">Guest:</span>
                  <span className="font-bold text-[#252A2A]">{nameplateName || 'Attendee'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#252A2A]/70">Date:</span>
                  <span className="font-semibold text-[#252A2A]">{eventDateLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#252A2A]/70">Arrival Time:</span>
                  <span className="font-semibold text-[#008F87]">{arrivalTimeLabel}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-full bg-[#008F87] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#006B66] transition-colors cursor-pointer"
              >
                Close Pass
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default IWillBeThereBanner;
