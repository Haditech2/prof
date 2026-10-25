import React, { useRef, useState } from 'react';
import { EventData, RSVPResponse } from '../types';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Share2, 
  Sparkles, 
  Check, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  Calendar,
  MapPin,
  GraduationCap,
  Copy,
  Sliders,
  Eye,
  X,
  Palette,
  Maximize2
} from 'lucide-react';

interface IWillBeThereBannerProps {
  event: EventData;
  rsvp: RSVPResponse;
  onUpdatePhoto?: (newPhotoUrl: string) => void;
  onSuccessToast?: (msg: string) => void;
  defaultRatio?: BannerRatio;
}

export type BannerTheme = 'emerald' | 'ivory' | 'obsidian';
export type BannerRatio = 'square' | 'story';

export const IWillBeThereBanner: React.FC<IWillBeThereBannerProps> = ({
  event,
  rsvp,
  onUpdatePhoto,
  onSuccessToast,
  defaultRatio = 'story'
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Customization state - default to story 9:16 for WhatsApp Status and Instagram Stories
  const [formatRatio, setFormatRatio] = useState<BannerRatio>(defaultRatio);
  const [theme, setTheme] = useState<BannerTheme>('emerald');
  const [photoScale, setPhotoScale] = useState<number>(1.0);
  const [photoOffsetY, setPhotoOffsetY] = useState<number>(0);
  
  // Inline attendee identity customization
  const [attendeeName, setAttendeeName] = useState<string>(rsvp.fullName || "Professor Sa'adatu Hassan Liman");
  const [attendeeRole, setAttendeeRole] = useState<string>(rsvp.groupCategory || "Vice-Chancellor, NSUK");
  
  // Export states
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewImageData, setPreviewImageData] = useState<string | null>(null);

  // Active attendee photo (fall back to real VC portrait)
  const guestPhoto = rsvp.photoUrl || '/images/vc-saadatu-hassan-liman.jpg';

  // Preset sample delegates
  const presetAvatars = [
    { label: "Prof. Sa'adatu Liman (VC)", url: '/images/vc-saadatu-hassan-liman.jpg', name: "Prof. Sa'adatu Hassan Liman", role: "Vice-Chancellor, NSUK" },
    { label: "Prof. Rashidah (Courtyard)", url: '/images/prof-rashidah-courtyard-regalia.jpg', name: "Prof. Rashidah Funke Olanrewaju", role: "Inaugural Lecturer" },
    { label: "Prof. Rashidah (Executive)", url: '/images/prof-rashidah-executive-desk.jpg', name: "Prof. Rashidah Funke Olanrewaju", role: "Director, EDC NSUK" },
    { label: "Prof. Rashidah (Garden)", url: '/images/prof-rashidah-garden-portrait.jpg', name: "Prof. Rashidah Funke Olanrewaju", role: "Inaugural Lecturer" },
    { label: "Prof. Rashidah (Official)", url: '/images/prof-rashidah-olanrewaju.jpg', name: "Prof. Rashidah Funke Olanrewaju", role: "Inaugural Lecturer" },
    { label: "NURA-X AI Research Group", url: '/images/nura-x-intentional-intelligence.jpg', name: "NURA-X AI Research Group", role: "Intelligent Software Engineering (ISERG)" }
  ];

  // Capture canvas logic
  const generateCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!bannerRef.current) return null;
    if (document.fonts) await document.fonts.ready;

    return await html2canvas(bannerRef.current, {
      scale: 2.5, // High-res retina capture
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 15000,
    });
  };

  // 1. Download Ultra-HD Image (PNG)
  const handleDownloadBanner = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;

      const imgData = canvas.toDataURL('image/png', 1.0);
      const safeName = attendeeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const filename = `${safeName || 'attendee'}-i-will-be-there-dp-${formatRatio}.png`;

      const link = document.createElement('a');
      link.href = imgData;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } catch {}

      if (onSuccessToast) {
        onSuccessToast('Ultra-HD DP Flyer downloaded successfully! Ready to share.');
      }
    } catch (err) {
      console.error('Failed to export DP flyer:', err);
      if (onSuccessToast) {
        onSuccessToast('Could not export DP flyer. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // 2. Copy Image directly to Clipboard
  const handleCopyImage = async () => {
    setIsCopying(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          if (navigator.clipboard && (window as any).ClipboardItem) {
            await navigator.clipboard.write([
              new (window as any).ClipboardItem({ 'image/png': blob })
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 3000);
            if (onSuccessToast) {
              onSuccessToast('Image copied to clipboard! You can paste it directly into WhatsApp or chats.');
            }
          } else {
            // Fallback: open image in preview modal
            const url = canvas.toDataURL('image/png');
            setPreviewImageData(url);
            setPreviewModalOpen(true);
          }
        } catch {
          const url = canvas.toDataURL('image/png');
          setPreviewImageData(url);
          setPreviewModalOpen(true);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy failed:', err);
    } finally {
      setIsCopying(false);
    }
  };

  // 3. Open High-Res Preview Lightbox
  const handleOpenPreview = async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;
      const url = canvas.toDataURL('image/png');
      setPreviewImageData(url);
      setPreviewModalOpen(true);
    } catch (err) {
      console.error('Preview error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // 4. File Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      if (onUpdatePhoto) {
        onUpdatePhoto(base64);
      }
      setPhotoScale(1.0);
      setPhotoOffsetY(0);
      if (onSuccessToast) {
        onSuccessToast('Your portrait has been placed on the DP flyer!');
      }
    };
    reader.readAsDataURL(file);
  };

  // 5. Direct WhatsApp Status Share
  const shareToWhatsApp = () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/#event` : 'https://nsuk.edu.ng/inaugural';
    const text = encodeURIComponent(
      `🎓 *I WILL BE THERE!* 🎓\n\nI am honoured to confirm my attendance at the *65th Inaugural Lecture* of *Professor Rashidah Funke Olanrewaju* at Nasarawa State University, Keffi (NSUK).\n\n📖 *Lecture Theme:* "INTENTIONAL INTELLIGENCE: From Digital Trust to Human Flourishing"\n📅 *Date:* Wednesday, 25 November 2026\n⏰ *Time:* 2:00 PM Prompt\n📍 *Venue:* Assembly Hall, Main Campus, Nasarawa State University, Keffi\n\nJoin the assembly and generate your personalized "I Will Be There" DP Flyer here:\n👉 ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Theme-specific styling classes
  const themeStyles = {
    emerald: {
      cardBg: 'bg-gradient-to-b from-[#043A20] via-[#064E2B] to-[#022415]',
      outerBorder: 'border-4 border-[#C9A227]',
      innerBorder: 'border border-[#F2E3B3]/35',
      flourishColor: 'text-[#F2E3B3]',
      instHeaderColor: 'text-[#F2E3B3]',
      instSubColor: 'text-[#C9A227]',
      ribbonBg: 'bg-gradient-to-r from-[#C9A227] via-[#FFF4D0] to-[#C9A227]',
      ribbonText: 'text-[#043A20]',
      ribbonBorder: 'border-2 border-[#FFF4D0]',
      attendeeNameColor: 'text-white',
      badgeBg: 'bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#F2E3B3]',
      lecturerCardBg: 'bg-black/30 border border-[#C9A227]/30',
      lecturerNameColor: 'text-[#F2E3B3]',
      themePlaqueBg: 'bg-[#032615]/80 border border-[#C9A227]/30 text-white/95',
      themePlaqueText: 'text-white',
      footerTextColor: 'text-[#F2E3B3]',
      footerSubText: 'text-white/70'
    },
    ivory: {
      cardBg: 'bg-gradient-to-b from-[#FAF8F3] via-[#FFFFFF] to-[#F3EFE6]',
      outerBorder: 'border-4 border-[#0B6B3A]',
      innerBorder: 'border border-[#C9A227]/40',
      flourishColor: 'text-[#0B6B3A]',
      instHeaderColor: 'text-[#0B6B3A]',
      instSubColor: 'text-[#C9A227]',
      ribbonBg: 'bg-gradient-to-r from-[#0B6B3A] via-[#064E2B] to-[#0B6B3A]',
      ribbonText: 'text-white',
      ribbonBorder: 'border-2 border-[#C9A227]',
      attendeeNameColor: 'text-[#043A20]',
      badgeBg: 'bg-[#E7F3EC] border border-[#0B6B3A]/30 text-[#0B6B3A]',
      lecturerCardBg: 'bg-[#F6FAF7] border border-[#0B6B3A]/20',
      lecturerNameColor: 'text-[#0B6B3A]',
      themePlaqueBg: 'bg-[#E7F3EC]/70 border border-[#0B6B3A]/20 text-[#043A20]',
      themePlaqueText: 'text-[#043A20]',
      footerTextColor: 'text-[#0B6B3A]',
      footerSubText: 'text-[#5B6B63]'
    },
    obsidian: {
      cardBg: 'bg-gradient-to-b from-[#0E1512] via-[#07130E] to-[#030806]',
      outerBorder: 'border-4 border-[#C9A227]',
      innerBorder: 'border border-[#C9A227]/30',
      flourishColor: 'text-[#F2E3B3]',
      instHeaderColor: 'text-[#F2E3B3]',
      instSubColor: 'text-[#C9A227]',
      ribbonBg: 'bg-gradient-to-r from-[#E2BE4A] via-[#FFF4D0] to-[#C9A227]',
      ribbonText: 'text-[#07130E]',
      ribbonBorder: 'border-2 border-[#FFF4D0]',
      attendeeNameColor: 'text-white',
      badgeBg: 'bg-white/10 border border-[#C9A227]/40 text-[#F2E3B3]',
      lecturerCardBg: 'bg-white/5 border border-white/10',
      lecturerNameColor: 'text-[#F2E3B3]',
      themePlaqueBg: 'bg-black/50 border border-white/10 text-white/95',
      themePlaqueText: 'text-white',
      footerTextColor: 'text-[#F2E3B3]',
      footerSubText: 'text-white/60'
    }
  }[theme];

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      
      {/* ========================================================================= */}
      {/* 1. STUDIO CONTROL SUITE (Tabs, Controls & Personalization)                 */}
      {/* ========================================================================= */}
      <div className="nsuk-card p-4 sm:p-5 shadow-lg border border-[#E3ECE6] bg-white space-y-4">
        
        {/* Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3ECE6] pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-[#E7F3EC] text-[#0B6B3A] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1F17]">
                “I Will Be There” DP Studio
              </h4>
              <p className="text-[11px] text-[#5B6B63]">
                Create your verified convocation flyer for social media
              </p>
            </div>
          </div>

          {/* Quick upload trigger */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-green px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center space-x-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload My Photo</span>
          </button>
        </div>

        {/* Live Attendee Name & Role Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B63] block mb-1">
              Your Name &amp; Title
            </label>
            <input
              type="text"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E3ECE6] text-xs font-bold text-[#0F1F17] bg-[#F6FAF7] focus:bg-white focus:outline-hidden focus:border-[#0B6B3A] transition-colors"
              placeholder="e.g. Prof. Sa'adatu Hassan Liman"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B63] block mb-1">
              Designation / Category
            </label>
            <input
              type="text"
              value={attendeeRole}
              onChange={(e) => setAttendeeRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E3ECE6] text-xs font-semibold text-[#0F1F17] bg-[#F6FAF7] focus:bg-white focus:outline-hidden focus:border-[#0B6B3A] transition-colors"
              placeholder="e.g. Vice-Chancellor / Senate Member"
            />
          </div>
        </div>

        {/* Studio Selectors: Format Ratio & Color Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#E3ECE6]">
          {/* Format Ratio Selector */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5B6B63] block mb-1.5">
              Flyer Ratio:
            </span>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#F6FAF7] border border-[#E3ECE6]">
              <button
                onClick={() => setFormatRatio('square')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  formatRatio === 'square'
                    ? 'bg-[#0B6B3A] text-white shadow-xs'
                    : 'text-[#5B6B63] hover:text-[#0F1F17]'
                }`}
              >
                Square (1:1 DP)
              </button>
              <button
                onClick={() => setFormatRatio('story')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  formatRatio === 'story'
                    ? 'bg-[#0B6B3A] text-white shadow-xs'
                    : 'text-[#5B6B63] hover:text-[#0F1F17]'
                }`}
              >
                Story (9:16 Status)
              </button>
            </div>
          </div>

          {/* Color Theme Selector */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5B6B63] block mb-1.5 flex items-center space-x-1">
              <Palette className="w-3 h-3 text-[#C9A227]" />
              <span>Gilded Theme:</span>
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#F6FAF7] border border-[#E3ECE6]">
              <button
                onClick={() => setTheme('emerald')}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
                  theme === 'emerald'
                    ? 'bg-[#0B6B3A] text-white shadow-xs'
                    : 'text-[#5B6B63] hover:text-[#0F1F17]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                <span>Emerald</span>
              </button>

              <button
                onClick={() => setTheme('ivory')}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
                  theme === 'ivory'
                    ? 'bg-[#0B6B3A] text-white shadow-xs'
                    : 'text-[#5B6B63] hover:text-[#0F1F17]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#F3EFE6] border border-gray-400" />
                <span>Ivory</span>
              </button>

              <button
                onClick={() => setTheme('obsidian')}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 ${
                  theme === 'obsidian'
                    ? 'bg-[#0B6B3A] text-white shadow-xs'
                    : 'text-[#5B6B63] hover:text-[#0F1F17]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#07130E]" />
                <span>Obsidian</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photo Tuning Sliders (Zoom & Vertical Panning) */}
        <div className="pt-2 border-t border-[#E3ECE6] space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Zoom */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold text-[#5B6B63]">Zoom:</span>
              <input
                type="range"
                min="0.8"
                max="2.2"
                step="0.05"
                value={photoScale}
                onChange={(e) => setPhotoScale(parseFloat(e.target.value))}
                className="w-24 sm:w-28 accent-[#0B6B3A] h-1.5 bg-[#E3ECE6] rounded-lg cursor-pointer"
              />
              <span className="font-mono text-[10px] text-[#5B6B63]">{Math.round(photoScale * 100)}%</span>
            </div>

            {/* Vertical Position */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold text-[#5B6B63]">Pan Y:</span>
              <input
                type="range"
                min="-50"
                max="50"
                step="2"
                value={photoOffsetY}
                onChange={(e) => setPhotoOffsetY(parseInt(e.target.value, 10))}
                className="w-20 sm:w-24 accent-[#0B6B3A] h-1.5 bg-[#E3ECE6] rounded-lg cursor-pointer"
              />
              <button
                onClick={() => { setPhotoScale(1.0); setPhotoOffsetY(0); }}
                className="text-[10px] underline text-[#0B6B3A] font-semibold hover:text-[#064E2B]"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Sample Preset Delegates */}
          <div className="flex items-center space-x-2 pt-1 overflow-x-auto">
            <span className="text-[10px] uppercase font-bold text-[#5B6B63] whitespace-nowrap">Try Profile:</span>
            {presetAvatars.map((pre, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (onUpdatePhoto) onUpdatePhoto(pre.url);
                  setAttendeeName(pre.name);
                  setAttendeeRole(pre.role);
                  setPhotoScale(1.0);
                  setPhotoOffsetY(0);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#F6FAF7] border border-[#E3ECE6] hover:border-[#0B6B3A] transition-all whitespace-nowrap text-[10px] font-semibold text-[#0F1F17]"
              >
                <img src={pre.url} alt={pre.label} className="w-4 h-4 rounded-full object-cover" />
                <span>{pre.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. THE CAPTURED HIGH-RES "I WILL BE THERE" DP FLYER CONTAINER              */}
      {/* ========================================================================= */}
      <div className="relative group mx-auto flex justify-center">
        
        {/* Ambient Luminous Halo */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#0B6B3A]/30 via-[#C9A227]/30 to-[#0B6B3A]/30 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition duration-700 pointer-events-none" />

        {/* The Exact Printable Captured Element */}
        <div
          ref={bannerRef}
          data-i-will-be-there-card
          className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center select-none ${
            themeStyles.cardBg
          } ${themeStyles.outerBorder} ${
            formatRatio === 'story'
              ? 'w-full max-w-[420px] aspect-[9/16] p-6 sm:p-7'
              : 'w-full max-w-[500px] aspect-square p-5 sm:p-6'
          }`}
          style={{ boxSizing: 'border-box' }}
        >
          {/* Subtle Guilloché Background Grid */}
          <div className="absolute inset-0 nsuk-pattern-light opacity-30 pointer-events-none" />
          
          {/* Radial Gold Flare */}
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#C9A227]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#0B6B3A]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Ornate Gold Inner Filigree Borders */}
          <div className={`absolute inset-2 rounded-2xl pointer-events-none ${themeStyles.innerBorder}`} />
          <div className={`absolute inset-3 rounded-xl pointer-events-none opacity-40 ${themeStyles.innerBorder}`} />

          {/* Corner Flourishes */}
          <div className={`absolute top-2.5 left-3 text-xs ${themeStyles.flourishColor}`}>◈</div>
          <div className={`absolute top-2.5 right-3 text-xs ${themeStyles.flourishColor}`}>◈</div>
          <div className={`absolute bottom-2.5 left-3 text-xs ${themeStyles.flourishColor}`}>◈</div>
          <div className={`absolute bottom-2.5 right-3 text-xs ${themeStyles.flourishColor}`}>◈</div>

          {/* --------------------------------------------------------------------- */}
          {/* FLYER TOP: NSUK OFFICIAL SEAL & 3D METALLIC RIBBON                    */}
          {/* --------------------------------------------------------------------- */}
          <div className="relative z-10 w-full pt-0.5 space-y-1">
            
            {/* University Crest Header */}
            <div className="flex items-center justify-center space-x-2">
              {/* NSUK Mini Seal Monogram */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#043A20] to-[#0B6B3A] border border-[#C9A227] flex items-center justify-center text-[8px] font-serif-luxury font-bold text-[#F2E3B3] shadow-sm">
                ✦
              </div>
              <div className={`text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-extrabold font-serif-luxury ${themeStyles.instHeaderColor}`}>
                Nasarawa State University, Keffi
              </div>
            </div>

            <div className={`text-[8px] sm:text-[9px] uppercase tracking-[0.25em] font-mono font-semibold ${themeStyles.instSubColor}`}>
              65th Inaugural Lecture Ceremony
            </div>

            {/* 3D Gilded Metallic Proclamation Ribbon */}
            <div className="pt-1">
              <div className={`inline-block px-6 py-1.5 rounded-full ${themeStyles.ribbonBg} ${themeStyles.ribbonText} ${themeStyles.ribbonBorder} font-serif-luxury font-extrabold text-xs sm:text-sm uppercase tracking-[0.22em] shadow-xl drop-shadow-md`}>
                ✦ I WILL BE THERE! ✦
              </div>
            </div>

            <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-mono opacity-80 font-bold pt-0.5 text-[#C9A227]">
              Official Convocation Attendee Pass
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* FLYER CENTER: ATTENDEE PORTRAIT & DEDICATED LECTURER SPOTLIGHT        */}
          {/* --------------------------------------------------------------------- */}
          <div className={`relative z-10 w-full my-auto flex flex-col items-center ${formatRatio === 'story' ? 'space-y-4' : 'space-y-2'}`}>
            
            {/* Attendee Portrait Medallion */}
            <div className="relative flex flex-col items-center">
              <div className="relative group/pic cursor-pointer" onClick={() => fileInputRef.current?.click()} title="Tap to change portrait">
                {/* Gold Medallion Ring */}
                <div className={`${
                  formatRatio === 'story'
                    ? 'w-32 h-32 sm:w-36 sm:h-36'
                    : 'w-28 h-28 sm:w-32 sm:h-32'
                } rounded-full p-1 bg-gradient-to-tr from-[#C9A227] via-[#FFF4D0] to-[#0B6B3A] shadow-xl`}>
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#043A20] bg-[#043A20] relative">
                    <img
                      src={guestPhoto}
                      alt={attendeeName}
                      className="w-full h-full object-cover transition-transform"
                      style={{
                        transform: `scale(${photoScale}) translateY(${photoOffsetY}px)`
                      }}
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                {/* Verified Attendee Shield Badge */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#0B6B3A] to-[#043A20] border-2 border-[#C9A227] flex items-center justify-center text-[#F2E3B3] shadow-lg">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Attendee Name & Designation */}
              <div className="mt-2 text-center max-w-sm px-2">
                <h3 className={`font-serif-luxury font-bold text-base sm:text-lg tracking-wide leading-tight ${themeStyles.attendeeNameColor}`}>
                  {attendeeName}
                </h3>
                <div className="pt-0.5">
                  <span className={`inline-block px-3 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-mono font-bold ${themeStyles.badgeBg}`}>
                    {attendeeRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Celebrating The Inaugural Lecturer: Prof. Rashidah Badge */}
            <div className={`w-full max-w-sm rounded-2xl p-2 sm:p-2.5 flex items-center space-x-2.5 text-left shadow-sm ${themeStyles.lecturerCardBg}`}>
              {/* Professor Portrait Framed Circle */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A227] shrink-0 shadow-md bg-[#043A20]">
                <img
                  src="/images/prof-rashidah-olanrewaju.jpg"
                  alt="Professor Rashidah Funke Olanrewaju"
                  className="w-full h-full object-cover object-top"
                  crossOrigin="anonymous"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[8px] uppercase tracking-[0.16em] font-mono text-[#C9A227] font-bold block">
                  Honouring Inaugural Lecturer:
                </span>
                <h4 className={`font-serif-luxury font-bold text-xs sm:text-sm truncate leading-tight ${themeStyles.lecturerNameColor}`}>
                  Prof. Rashidah Funke Olanrewaju
                </h4>
                <p className="text-[9px] font-mono opacity-80 truncate text-gray-300">
                  Citp, FCRIDE, SMIEEE, MIET • Prof. of Computer Science &amp; AI
                </p>
              </div>
            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* FLYER BOTTOM: DISCOURSE THEME, DATE, TIME & VENUE STRIP               */}
          {/* --------------------------------------------------------------------- */}
          <div className="relative z-10 w-full pt-1.5 space-y-1.5">
            
            {/* Milestone Lecture Discourse Theme Box */}
            <div className={`rounded-xl px-3 py-1.5 text-center shadow-xs ${themeStyles.themePlaqueBg}`}>
              <span className="text-[8px] uppercase tracking-[0.18em] font-mono text-[#C9A227] font-bold block">
                Discourse Theme:
              </span>
              <p className={`font-serif-luxury italic text-[10px] sm:text-[11px] leading-snug line-clamp-2 ${themeStyles.themePlaqueText}`}>
                "INTENTIONAL INTELLIGENCE: From Digital Trust to Human Flourishing"
              </p>
            </div>

            {/* Event Logistics Strip */}
            <div className="flex flex-wrap items-center justify-between text-[8px] sm:text-[9px] font-mono pt-1 border-t border-[#C9A227]/30 px-1">
              <div className={`flex items-center space-x-1 ${themeStyles.footerTextColor}`}>
                <Calendar className="w-3 h-3 text-[#C9A227] shrink-0" />
                <span>Wed, 25 Nov 2026 • 2:00 PM</span>
              </div>

              <div className={`flex items-center space-x-1 ${themeStyles.footerTextColor}`}>
                <MapPin className="w-3 h-3 text-[#C9A227] shrink-0" />
                <span>Assembly Hall, Main Campus, NSUK</span>
              </div>

              <div className="font-bold text-[#C9A227]">
                PASS: #{rsvp.qrTicketCode || 'NSUK-RFO-2026'}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OUTPUT ACTIONS & EXPORT SUITE                                          */}
      {/* ========================================================================= */}
      <div className="space-y-2.5">
        
        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. Download Ultra-HD PNG */}
          <button
            onClick={handleDownloadBanner}
            disabled={isDownloading}
            className="btn-gold py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Ultra-HD PNG</span>
              </>
            )}
          </button>

          {/* 2. Direct WhatsApp Status Share */}
          <button
            onClick={shareToWhatsApp}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Post WhatsApp Status</span>
          </button>

          {/* 3. Copy to Clipboard / Preview */}
          <button
            onClick={handleCopyImage}
            disabled={isCopying}
            className="bg-[#0B6B3A] hover:bg-[#064E2B] text-white py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isCopying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Copying...</span>
              </>
            ) : copiedImage ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Image</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Action: Fullscreen Lightbox Preview */}
        <div className="flex items-center justify-between text-xs text-[#5B6B63] px-1">
          <span>Format: {formatRatio === 'square' ? '1:1 Square DP (1080×1080)' : '9:16 Story (1080×1920)'}</span>
          <button
            onClick={handleOpenPreview}
            className="inline-flex items-center space-x-1 text-[#0B6B3A] font-semibold hover:underline"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full Preview Lightbox</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. FULLSCREEN PREVIEW LIGHTBOX MODAL                                      */}
      {/* ========================================================================= */}
      {previewModalOpen && previewImageData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
          <div className="relative max-w-xl w-full bg-[#06110D] border border-white/20 rounded-3xl p-4 text-white shadow-2xl flex flex-col items-center">
            
            {/* Modal Top Bar */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="font-serif-luxury font-bold text-base text-[#F2E3B3]">
                Ultra-HD Flyer Preview
              </span>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Generated Image Preview */}
            <div className="py-4 w-full flex justify-center max-h-[70vh] overflow-auto">
              <img
                src={previewImageData}
                alt="High Resolution Preview"
                className="max-h-[60vh] rounded-2xl shadow-2xl border-2 border-[#C9A227] object-contain"
              />
            </div>

            {/* Modal Bottom Actions */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <span className="text-xs text-white/60">
                Ready for WhatsApp, LinkedIn, Instagram &amp; Facebook.
              </span>
              <button
                onClick={handleDownloadBanner}
                className="btn-gold px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Save High-Res PNG</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
