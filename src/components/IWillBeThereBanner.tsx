import React, { useRef, useState, useEffect } from 'react';
import { EventData, RSVPResponse } from '../types';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  Download,
  Share2,
  Sparkles,
  Camera,
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

/** Official RSVP flyer — oval photo window (percentage coordinates of 819×1024 artboard) */
const OVAL = {
  left: 0.5709,
  top: 0.2536,
  width: 0.3819,
  height: 0.4645,
};

const FLYER_SRC = '/images/i-will-be-attending-rsvp.jpg';
const FLYER_W = 819;
const FLYER_H = 1024;

export type StudioBackgroundTheme = 'emerald' | 'champagne' | 'midnight' | 'ivory';

interface StudioBackgroundOption {
  id: StudioBackgroundTheme;
  name: string;
  badge: string;
  previewClass: string;
  gradientColors: [string, string, string];
}

const STUDIO_BACKGROUNDS: StudioBackgroundOption[] = [
  {
    id: 'emerald',
    name: 'Signature Turquoise Studio',
    badge: 'Official',
    previewClass: 'from-[#008F87] via-[#006B66] to-[#003330]',
    gradientColors: ['#008F87', '#006B66', '#003330']
  },
  {
    id: 'champagne',
    name: 'Mustard Gold & Warm Cream',
    badge: 'Luxe',
    previewClass: 'from-[#FFF4DC] via-[#D6A323] to-[#A97912]',
    gradientColors: ['#FFF4DC', '#D6A323', '#A97912']
  },
  {
    id: 'midnight',
    name: 'Senate Midnight Charcoal',
    badge: 'Regal',
    previewClass: 'from-[#252A2A] via-[#1A1F1F] to-[#0D1212]',
    gradientColors: ['#252A2A', '#1A1F1F', '#0D1212']
  },
  {
    id: 'ivory',
    name: 'Soft Ivory & Elegant Lilac',
    badge: 'AI Special',
    previewClass: 'from-[#FFFBF2] via-[#FFF4DC] to-[#B9A1D0]',
    gradientColors: ['#FFFBF2', '#FFF4DC', '#B9A1D0']
  }
];

const QUICK_TITLES = ['Prof.', 'Dr.', 'Engr.', 'Barr.', 'Alhaji', 'Hajiya', 'Chief', 'Mr.', 'Mrs.', 'Ms.'];

interface IWillBeThereBannerProps {
  event: EventData;
  rsvp: RSVPResponse;
  onUpdatePhoto?: (newPhotoUrl: string) => void;
  onUpdateName?: (name: string) => void;
  onConfirmRsvp?: (payload: { fullName: string; photoUrl: string; phone?: string; email?: string }) => void;
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

  // Form State — defaults to the Vice-Chancellor
  const [attendeeName, setAttendeeName] = useState(
    rsvp.fullName || "Professor Sa'adatu Hassan Liman (Vice-Chancellor)"
  );
  const [localPhoto, setLocalPhoto] = useState<string | undefined>(
    rsvp.photoUrl || '/images/vc-saadatu-hassan-liman.jpg'
  );
  const [phone, setPhone] = useState(rsvp.phone || '');
  const [email, setEmail] = useState(rsvp.email?.includes('@guest.nsuk') ? '' : (rsvp.email || ''));
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Default background for uploaded photo (official NSUK Emerald Studio)
  const studioBg: StudioBackgroundTheme = 'emerald';

  // Natural photo centering defaults
  const photoScale = 1.05;
  const photoOffsetY = 0;

  // Status state
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(Boolean(rsvp.fullName && rsvp.fullName.trim().length > 0));

  const guestPhoto = localPhoto || rsvp.photoUrl;
  const displayName = attendeeName.trim();
  const parenMatch = displayName.match(/\(([^)]+)\)/);
  const rawParenthetical = parenMatch ? parenMatch[1].trim() : '';
  const nameplateName = displayName.replace(/\s*\([^)]*\)\s*$/, '').trim();

  // Kicker arc text (e.g. Vice-Chancellor or Confirmed Attendee)
  const kickerTitle = rawParenthetical || 'Confirmed Attendee';

  // Extract initials for monogram fallback
  const initials = displayName
    ? displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('')
    : 'VC';

  // Generate QR Code for digital pass
  const ticketCode = rsvp.qrTicketCode || `EA-RFO-${Math.floor(10000 + Math.random() * 90000)}`;

  useEffect(() => {
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
    if (rsvp.phone && rsvp.phone !== phone) {
      setPhone(rsvp.phone);
    }
  }, [rsvp]);

  const applyPhoto = (url: string) => {
    setLocalPhoto(url);
    onUpdatePhoto?.(url);
  };

  const removePhoto = () => {
    setLocalPhoto('');
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onSuccessToast?.('Please choose an image file (JPG, PNG, or WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      if (result) {
        applyPhoto(result);
        onSuccessToast?.('Photo uploaded! Studio background applied.');
      }
    };
    reader.readAsDataURL(file);
  };

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  /** Helper to render character-by-character curved text along an ellipse arc */
  const drawCurvedText = (
    context: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    fontSize: number,
    color = '#FFFDF5',
    fontFamily = "Georgia, 'Times New Roman', serif",
    fontWeight = 'bold'
  ) => {
    if (!text) return;
    context.save();
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = 'rgba(0, 0, 0, 0.95)';
    context.shadowBlur = 6;
    context.shadowOffsetY = 2;

    const charWidths: number[] = [];
    let totalW = 0;
    for (let i = 0; i < text.length; i++) {
      const w = context.measureText(text[i]).width;
      charWidths.push(w);
      totalW += w;
    }

    const rAvg = (radiusX + radiusY) / 2;
    const totalAngle = totalW / rAvg;
    let currentAngle = Math.PI / 2 + totalAngle / 2;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const halfAngle = charWidths[i] / 2 / rAvg;
      currentAngle -= halfAngle;

      const x = centerX + radiusX * Math.cos(currentAngle);
      const y = centerY + radiusY * Math.sin(currentAngle);

      const vx = radiusX * Math.sin(currentAngle);
      const vy = -radiusY * Math.cos(currentAngle);
      const tangent = Math.atan2(vy, vx);

      context.save();
      context.translate(x, y);
      context.rotate(tangent);
      context.fillText(char, 0, 0);
      context.restore();

      currentAngle -= halfAngle;
    }

    context.restore();
  };

  // Generates 2x Retina high-resolution canvas with default studio background and gilded nameplate
  const generateOfficialCanvas = async (): Promise<HTMLCanvasElement> => {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = FLYER_W * scale;
    canvas.height = FLYER_H * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D context');

    ctx.scale(scale, scale);

    // 1. Draw base flyer background
    const flyer = await loadImage(FLYER_SRC);
    ctx.drawImage(flyer, 0, 0, FLYER_W, FLYER_H);

    // Oval geometry
    const ox = OVAL.left * FLYER_W;
    const oy = OVAL.top * FLYER_H;
    const ow = OVAL.width * FLYER_W;
    const oh = OVAL.height * FLYER_H;
    const cx = ox + ow / 2;
    const cy = oy + oh / 2;

    // 2. Default Studio Background (Drawn inside the oval first!)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, ow / 2, oh / 2, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const selectedBgObj = STUDIO_BACKGROUNDS.find((b) => b.id === studioBg) || STUDIO_BACKGROUNDS[0];
    const bgGrad = ctx.createRadialGradient(cx, cy - 25, 10, cx, cy, oh / 1.8);
    bgGrad.addColorStop(0, selectedBgObj.gradientColors[0]);
    bgGrad.addColorStop(0.55, selectedBgObj.gradientColors[1]);
    bgGrad.addColorStop(1, selectedBgObj.gradientColors[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(ox, oy, ow, oh);

    // Subtle studio vignette / rim lighting inside background
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, ow * 0.45, oh * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Render guest photo (or bespoke monogram if no photo)
    if (guestPhoto) {
      try {
        const guestImg = await loadImage(guestPhoto);
        const baseScale = Math.max(ow / guestImg.width, oh / guestImg.height) * photoScale;
        const drawW = guestImg.width * baseScale;
        const drawH = guestImg.height * baseScale;
        const drawX = cx - drawW / 2;
        const drawY = cy - drawH / 2 + photoOffsetY * 3;
        ctx.drawImage(guestImg, drawX, drawY, drawW, drawH);
      } catch (err) {
        console.warn('Could not draw guest photo, fallback to monogram:', err);
      }
    } else {
      // Bespoke dignified monogram
      ctx.fillStyle = selectedBgObj.id === 'champagne' || selectedBgObj.id === 'ivory' ? '#006B66' : '#FFF4DC';
      ctx.font = 'bold 54px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 8;
      ctx.fillText(initials || 'VIP', cx, cy - 10);
      ctx.shadowBlur = 0;

      ctx.fillStyle = selectedBgObj.id === 'champagne' || selectedBgObj.id === 'ivory' ? '#008F87' : '#D6A323';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('DISTINGUISHED GUEST', cx, cy + 32);
    }

    // 4. Attendee Name Curved along the Frame
    // Strictly curves along the frame contour so it NEVER covers "INTENTIONAL INTELLIGENCE" or any flyer content!
    if (nameplateName) {
      // Arched ribbon vignette inside the lower frame for contrast
      const ribbonH = oh * 0.28;
      const ribbonY = oy + oh - ribbonH;
      const ribbonGrad = ctx.createLinearGradient(0, ribbonY, 0, oy + oh);
      ribbonGrad.addColorStop(0, 'rgba(0, 51, 48, 0)');
      ribbonGrad.addColorStop(0.35, 'rgba(0, 107, 102, 0.88)');
      ribbonGrad.addColorStop(1, 'rgba(0, 51, 48, 0.98)');
      ctx.fillStyle = ribbonGrad;
      ctx.fillRect(ox, ribbonY, ow, ribbonH);

      // Delicate gold hairline arc
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, 148, 226, 0, 40 * (Math.PI / 180), 140 * (Math.PI / 180), false);
      ctx.strokeStyle = 'rgba(214, 163, 35, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Sub-label / Fellowship curved along the inner arc
      const kickerText = `✦ ${kickerTitle.toUpperCase()} ✦`;
      const kickerFontSize = kickerText.length > 38 ? 6.8 : kickerText.length > 26 ? 7.5 : 8.5;
      drawCurvedText(
        ctx,
        kickerText,
        cx,
        cy,
        126,
        194,
        kickerFontSize,
        '#FFF4DC',
        'system-ui, -apple-system, sans-serif'
      );

      // Attendee Full Name & Title curved around the frame
      const fontSize = nameplateName.length > 32 ? 12 : nameplateName.length > 24 ? 13.5 : 16;
      drawCurvedText(ctx, nameplateName, cx, cy, 142, 218, fontSize, '#FFFDF5');
    }

    ctx.restore();

    // 5. Crisp Gold Border Ring around the oval frame
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, ow / 2, oh / 2, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(169, 121, 18, 0.95)';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, cy, ow / 2 + 2.5, oh / 2 + 2.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(214, 163, 35, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    return canvas;
  };

  const handleDownloadBanner = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateOfficialCanvas();
      const imgData = canvas.toDataURL('image/png', 1.0);
      const safeName = (nameplateName || 'attendee')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${safeName || 'attendee'}-i-will-be-attending-nsuk.png`;
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
      `✦ I WILL BE ATTENDING! ✦\n\nThe 65th Inaugural Lecture of Professor Rashidah Funke Olanrewaju\nTopic: "INTENTIONAL INTELLIGENCE: From Digital Trust to Human Flourishing"\n\n📅 Date: Wednesday, 25 November 2026 at 2:00 PM prompt\n🏛 Venue: Assembly Hall, Main Campus, Nasarawa State University, Keffi (NSUK)\n\nReserve your seat & get your personalized attendee flyer:\n${window.location.origin}`
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

    onConfirmRsvp?.({
      fullName: name,
      photoUrl: guestPhoto || '',
      phone: phone.trim(),
      email: email.trim(),
    });

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

    onSuccessToast?.('Seat reserved! Your personalized flyer with official plaque is ready.');
  };

  return (
    <div className={`w-full mx-auto ${compact ? 'max-w-xl' : 'max-w-5xl'}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Main Grid: Responsive 2-column on desktop, optimized 1-column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* ============================================================== */}
        {/* COLUMN 1: INTERACTIVE FORM & CONTROLS                          */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 w-full space-y-4">
          
          {/* Confirmed Status Pill */}
          {isConfirmed && (
            <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/40 p-3.5 sm:p-4 text-white flex items-center justify-between gap-3 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-emerald-100">
                    Seat Reserved &amp; Registered
                  </div>
                  <div className="text-xs sm:text-sm font-serif-luxury font-bold text-white truncate">
                    {nameplateName || 'Attendee'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-[#D6A323]" />
                <span className="hidden sm:inline">Pass</span>
              </button>
            </div>
          )}

          {/* Form Card */}
          <form
            onSubmit={handleConfirm}
            className="rounded-3xl bg-[#004D49] p-4 sm:p-6 shadow-lg text-white space-y-4 relative overflow-hidden"
          >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div className="font-serif-luxury italic text-xs text-[#F8E7BE]">
                  Official Attendance Studio
                </div>
                <h3 className="mt-1 font-serif-luxury font-bold text-base sm:text-lg text-white">
                  Reserve Seat &amp; Get Flyer
                </h3>
              </div>
              <span className="text-[10px] text-[#F2E3B3] font-mono font-semibold bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                Nov 25 · 2:00 PM
              </span>
            </div>

            {/* ============================================================== */}
            {/* STEP 1: BETTER & OK NAME INPUT SECTION                        */}
            {/* ============================================================== */}
            {/* STEP 1: BETTER & OK NAME INPUT SECTION                        */}
            {/* ============================================================== */}
            <div className="rounded-2xl bg-[#FFFBF2] p-3.5 sm:p-4 text-[#252A2A] shadow-md border-2 border-[#D6A323]/50 space-y-2.5 relative z-10">
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
                  Engraved on Plaque
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
                    className="px-2 py-0.5 rounded-md bg-[#FFF4DC] hover:bg-[#008F87] hover:text-white border border-[#D6A323]/40 text-[10px] font-bold text-[#006B66] transition-colors shrink-0 cursor-pointer"
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
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border-2 border-[#D6A323]/30 bg-white text-sm sm:text-base font-serif-luxury font-bold text-[#252A2A] placeholder-gray-400 focus:outline-hidden focus:border-[#008F87] focus:bg-white focus:ring-2 focus:ring-[#008F87]/20 transition-all shadow-inner"
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
                  <span className="text-[#6B7B73]">Plaque Inscription:</span>
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
                <label className="text-xs font-semibold text-[#FFF4DC] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#D6A323] text-[#003330] text-[10px] font-extrabold flex items-center justify-center">
                    2
                  </span>
                  <span>Your Photo</span>
                  <span className="text-[10px] text-white/60 font-normal lowercase">(optional)</span>
                </label>
                {guestPhoto && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="text-[10px] text-red-300 hover:text-red-200 underline font-medium cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>

              {/* Upload button & current thumbnail */}
              <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-black/35 border border-white/15">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D6A323] via-[#FFF4DC] to-[#D6A323] text-[#003330] font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                  <span>{guestPhoto ? 'Change Photo' : 'Upload Photo / Selfie'}</span>
                </button>

                {guestPhoto ? (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#D6A323] shrink-0 bg-black/40">
                      <img src={guestPhoto} alt="Guest" className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="text-[11px] text-white/80 font-medium">Photo attached ✓</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-white/60">
                    PNG, JPG, or WEBP portrait
                  </span>
                )}
              </div>
            </div>

            {/* Primary Submit Button */}
            <div className="pt-2 relative z-10">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D6A323] via-[#FFF4DC] to-[#D6A323] text-[#003330] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
              >
                <CheckCircle2 className="w-5 h-5 text-[#003330]" />
                <span>{isConfirmed ? 'Update My RSVP Plaque' : 'Confirm RSVP & Get Attending Flyer'}</span>
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
                disabled={isDownloading}
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
                disabled={isCopying}
                className="inline-flex items-center gap-1 text-[#008F87] hover:text-[#006B66] font-semibold py-1 px-2 rounded-lg hover:bg-[#FFF4DC] transition-colors cursor-pointer"
              >
                {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedImage ? 'Copied to Clipboard' : 'Copy Image'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={generateGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#008F87] hover:text-[#006B66] font-semibold py-1 px-2 rounded-lg hover:bg-[#FFF4DC] transition-colors"
                  title="Add to Google Calendar"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D6A323]" />
                  <span>Google Cal</span>
                </a>
                <button
                  type="button"
                  onClick={() => downloadIcsFile(event)}
                  className="inline-flex items-center gap-1 text-[#008F87] hover:text-[#006B66] font-semibold py-1 px-2 rounded-lg hover:bg-[#FFF4DC] transition-colors cursor-pointer"
                  title="Download iCal file"
                >
                  <span>iCal (.ics)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: LIVE FLYER PREVIEW WITH GILDED PLAQUE                */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 w-full flex flex-col items-center">
          
          <div className="w-full max-w-[360px] sm:max-w-[420px] space-y-3">
            
            {/* Live Indicator */}
            <div className="flex items-center justify-between px-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-serif-luxury italic text-[#A97912]">
                <span className="w-2 h-2 rounded-full bg-[#D6A323] animate-pulse" />
                Live Official Flyer Preview
              </span>
              <span className="text-[10px] text-[#252A2A]/70">
                {STUDIO_BACKGROUNDS.find((b) => b.id === studioBg)?.name}
              </span>
            </div>

            {/* Interactive Flyer Canvas Frame */}
            <div className="relative group mx-auto w-full">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#008F87]/20 via-[#D6A323]/25 to-[#008F87]/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 pointer-events-none" />

              <div
                ref={bannerRef}
                data-i-will-be-there-card
                className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#FFFBF2] select-none border-2 border-[#D6A323]/50"
                style={{ aspectRatio: `${FLYER_W} / ${FLYER_H}` }}
              >
                {/* Base flyer artwork */}
                <img
                  src={FLYER_SRC}
                  alt="I Will Be Attending — Official RSVP Flyer"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                  crossOrigin="anonymous"
                  draggable={false}
                />

                {/* Default Studio Background + Guest Photo clipped into gold oval */}
                <div
                  className="absolute overflow-hidden cursor-pointer group/photo z-10"
                  style={{
                    left: `${OVAL.left * 100}%`,
                    top: `${OVAL.top * 100}%`,
                    width: `${OVAL.width * 100}%`,
                    height: `${OVAL.height * 100}%`,
                    borderRadius: '50%',
                    boxShadow: 'inset 0 0 0 2px rgba(184, 134, 11, 0.75)',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  title="Tap to upload/change photo"
                >
                  {/* Default Studio Background Layer */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      STUDIO_BACKGROUNDS.find((b) => b.id === studioBg)?.previewClass || 'from-[#006B66] via-[#004D49] to-[#003330]'
                    }`}
                  />

                  {guestPhoto ? (
                    <img
                      src={guestPhoto}
                      alt={attendeeName || 'Attendee'}
                      className="relative w-full h-full object-cover"
                      style={{ transform: `scale(${photoScale}) translateY(${photoOffsetY}px)` }}
                      crossOrigin="anonymous"
                      draggable={false}
                    />
                  ) : (
                    /* Bespoke Monogram Preview */
                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-1 text-[#F2E3B3] p-2 select-none">
                      <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider drop-shadow-md text-[#F9F2DC]">
                        {initials || 'VIP'}
                      </span>
                      <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#D6A323] px-2 py-0.5 rounded-full bg-black/35 border border-[#D6A323]/40">
                        <Camera className="w-2.5 h-2.5 text-[#D6A323]" />
                        <span>Tap to add photo</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-30 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] sm:text-xs font-bold tracking-wide">
                    {guestPhoto ? 'Change Photo' : 'Upload Photo'}
                  </div>

                  {/* Bottom gradient vignette for portrait contrast */}
                  {nameplateName && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[34%] bg-gradient-to-t from-[#002624]/95 via-[#003330]/75 to-transparent" />
                  )}
                </div>

                {/* Curved Attendee Name around the frame */}
                {nameplateName && (
                  <svg
                    viewBox="0 0 819 1024"
                    className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none"
                    aria-hidden="true"
                  >
                    <defs>
                      <path
                        id="rsvp-curved-name-path"
                        d="M 515.2 637.6 A 142 218 0 0 0 732.8 637.6"
                        fill="none"
                      />
                      <path
                        id="rsvp-curved-kicker-path"
                        d="M 527.5 622.2 A 126 194 0 0 0 720.5 622.2"
                        fill="none"
                      />
                      <filter id="rsvp-curved-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.95" />
                      </filter>
                    </defs>

                    {/* Gold Hairline Arc framing the curve */}
                    <path
                      d="M 522 648 A 148 226 0 0 0 726 648"
                      fill="none"
                      stroke="rgba(201, 162, 39, 0.85)"
                      strokeWidth="1.5"
                    />

                    {/* Subtitle / Fellowship Kicker */}
                    <text
                      fill="#DFC79B"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fontWeight="bold"
                      fontSize={kickerTitle.length > 38 ? 6.8 : kickerTitle.length > 26 ? 7.5 : 8.5}
                      letterSpacing="0.12em"
                      filter="url(#rsvp-curved-shadow)"
                    >
                      <textPath
                        href="#rsvp-curved-kicker-path"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        ✦ {kickerTitle.toUpperCase()} ✦
                      </textPath>
                    </text>

                    {/* Attendee Name curved around the frame */}
                    <text
                      fill="#FFFDF5"
                      fontFamily="Georgia, 'Times New Roman', serif"
                      fontWeight="bold"
                      fontSize={nameplateName.length > 32 ? 12 : nameplateName.length > 24 ? 13.5 : 16}
                      letterSpacing="0.03em"
                      filter="url(#rsvp-curved-shadow)"
                    >
                      <textPath
                        href="#rsvp-curved-name-path"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        {nameplateName}
                      </textPath>
                    </text>
                  </svg>
                )}
              </div>
            </div>

            {/* Quick Caption under preview */}
            <div className="flex items-center justify-between text-[11px] text-[#252A2A]/70 px-1">
              <span>HD 819 × 1024 (Retina Ready)</span>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="text-[#008F87] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-[#D6A323]" />
                <span>View Digital Pass</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL: DIGITAL QR SEAT PASS                                     */}
      {/* ============================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFF4DC] rounded-3xl border border-[#D6A323]/50 shadow-2xl max-w-sm w-full overflow-hidden text-[#252A2A] relative">
            
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
                  Professor Rashidah Funke Olanrewaju
                </h4>
                <p className="text-xs text-[#252A2A]/70">
                  Assembly Hall, Main Campus, NSUK Keffi
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
                  <span className="font-semibold text-[#252A2A]">Wed, 25 Nov 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#252A2A]/70">Seating Time:</span>
                  <span className="font-semibold text-[#008F87]">01:45 PM prompt</span>
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
