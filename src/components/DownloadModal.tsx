import React, { useState, useRef } from 'react';
import { EventData, AspectRatioType } from '../types';
import { InvitationCard } from './InvitationCard';
import { exportInvitation, ExportFormat } from '../utils/exportImage';
import { X, Download, FileImage, FileText, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

interface DownloadModalProps {
  event: EventData;
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccessToast
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('portrait');
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<number>(2); // 2x Retina default
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastExportedUrl, setLastExportedUrl] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await exportInvitation({
        element: cardRef.current,
        format: format,
        aspectRatio: aspectRatio,
        scale: scale,
        filename: `${event.slug || 'invitation'}-${aspectRatio}-${format}`
      });

      setLastExportedUrl(dataUrl);
      if (onSuccessToast) {
        onSuccessToast(`Invitation card successfully exported as ${format.toUpperCase()}!`);
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const getDimensionsText = () => {
    const mult = scale;
    switch (aspectRatio) {
      case 'story':
        return `${1080 * mult / 2} × ${1920 * mult / 2} px (9:16 Story / WhatsApp)`;
      case 'square':
        return `${1200 * mult / 2} × ${1200 * mult / 2} px (1:1 Feed Post)`;
      case 'landscape':
        return `${1920 * mult / 2} × ${1080 * mult / 2} px (16:9 Banner)`;
      case 'portrait':
      default:
        return `${1200 * mult / 2} × ${1650 * mult / 2} px (4:5.5 Classic Invitation)`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF4DC] rounded-3xl border border-[#D6A323]/40 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#D6A323]/25 flex items-center justify-between bg-[#FFFBF2]/90 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#008F87]/15 border border-[#D6A323]/30 flex items-center justify-center text-[#008F87]">
              <Download className="w-5 h-5 text-[#D6A323]" />
            </div>
            <div>
              <h3 className="text-xl font-serif-luxury font-bold text-[#252A2A]">
                Download Invitation Card
              </h3>
              <p className="text-xs text-[#252A2A]/70 font-sans-modern">
                Generate sharp, watermark-free cards for WhatsApp, social media, or high-res printing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFFBF2] hover:bg-[#FFECC2] text-[#252A2A] border border-[#D6A323]/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Direct Download of Official Print Assets */}
        <div className="mx-6 mt-6 p-4 rounded-2xl bg-[#FFFBF2] border border-[#D6A323]/40 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008F87]">
              <Sparkles className="w-4 h-4 text-[#D6A323]" />
              <span>Official University Proclamation Assets</span>
            </div>
            <span className="text-[10px] text-[#252A2A]/60 font-mono">Original Press Files</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href="/images/i-will-be-attending-rsvp.jpg"
              download="nsuk-65th-inaugural-i-will-be-attending.jpg"
              className="p-3 rounded-xl border border-[#D6A323]/40 hover:border-[#008F87] bg-[#FFFBF2] transition-all flex items-center gap-3 group shadow-xs"
            >
              <img
                src="/images/i-will-be-attending-rsvp.jpg"
                alt="I Will Be Attending RSVP Flyer"
                className="w-10 h-12 object-cover rounded-md border shrink-0"
              />
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-[#252A2A] group-hover:text-[#008F87] truncate">"I Will Be Attending"</div>
                <div className="text-[10px] text-[#252A2A]/60">Official RSVP Flyer</div>
                <div className="text-[10px] text-[#D6A323] font-semibold mt-0.5 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download High-Res
                </div>
              </div>
            </a>

            <a
              href="/images/inaugural-lecture-flyer-portrait.jpg"
              download="nsuk-65th-inaugural-lecture-official-flyer.jpg"
              className="p-3 rounded-xl border border-[#D6A323]/40 hover:border-[#008F87] bg-[#FFFBF2] transition-all flex items-center gap-3 group shadow-xs"
            >
              <img
                src="/images/inaugural-lecture-flyer-portrait.jpg"
                alt="Flyer thumbnail"
                className="w-10 h-14 object-cover rounded-md border shrink-0"
              />
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-[#252A2A] group-hover:text-[#008F87] truncate">Official Portrait Flyer</div>
                <div className="text-[10px] text-[#252A2A]/60">Vertical Proclamation</div>
                <div className="text-[10px] text-[#D6A323] font-semibold mt-0.5 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download High-Res
                </div>
              </div>
            </a>

            <a
              href="/images/inaugural-poster-65th.jpg"
              download="nsuk-65th-inaugural-banner-landscape.jpg"
              className="p-3 rounded-xl border border-[#D6A323]/40 hover:border-[#008F87] bg-[#FFFBF2] transition-all flex items-center gap-3 group shadow-xs"
            >
              <img
                src="/images/inaugural-poster-65th.jpg"
                alt="Landscape banner thumbnail"
                className="w-14 h-10 object-cover rounded-md border shrink-0"
              />
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-[#252A2A] group-hover:text-[#008F87] truncate">Convocation Banner</div>
                <div className="text-[10px] text-[#252A2A]/60">Landscape Commemorative</div>
                <div className="text-[10px] text-[#D6A323] font-semibold mt-0.5 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download High-Res
                </div>
              </div>
            </a>

            <a
              href="/images/nura-x-intentional-intelligence.jpg"
              download="nsuk-nura-x-intentional-intelligence.jpg"
              className="p-3 rounded-xl border border-[#D6A323]/40 hover:border-[#008F87] bg-[#FFFBF2] transition-all flex items-center gap-3 group shadow-xs"
            >
              <img
                src="/images/nura-x-intentional-intelligence.jpg"
                alt="NURA-X thumbnail"
                className="w-10 h-10 object-cover rounded-full border shrink-0"
              />
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-[#252A2A] group-hover:text-[#008F87] truncate">NURA-X AI Emblem</div>
                <div className="text-[10px] text-[#252A2A]/60">Intentional Intelligence</div>
                <div className="text-[10px] text-[#D6A323] font-semibold mt-0.5 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download High-Res
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Modal Body: Split Controls & Live Preview */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Format & Resolution Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Aspect Ratio Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#008F87] block mb-2">
                1. Customizable Digital Card Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'portrait', label: 'Portrait Card', desc: 'Classic 4:5.5' },
                  { id: 'story', label: 'Story / Status', desc: 'WhatsApp 9:16' },
                  { id: 'square', label: 'Square Post', desc: 'Social 1:1' },
                  { id: 'landscape', label: 'Landscape', desc: 'Banner 16:9' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id as AspectRatioType)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      aspectRatio === r.id
                        ? 'border-[#008F87] bg-[#FFFBF2] ring-2 ring-[#D6A323]/40 shadow-xs'
                        : 'border-[#D6A323]/30 bg-[#FFFBF2]/70 hover:bg-[#FFFBF2] text-[#252A2A]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#252A2A]">{r.label}</div>
                    <div className="text-[10px] text-[#252A2A]/60 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* File Format Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#008F87] block mb-2">
                2. Select File Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'png', label: 'PNG Image', icon: FileImage, note: 'Lossless HD' },
                  { id: 'jpeg', label: 'JPEG Image', icon: FileImage, note: 'Small File' },
                  { id: 'pdf', label: 'PDF Document', icon: FileText, note: 'Print Ready' }
                ].map(fmt => {
                  const Icon = fmt.icon;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => setFormat(fmt.id as ExportFormat)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center ${
                        format === fmt.id
                          ? 'border-[#008F87] bg-[#008F87] text-white shadow-md'
                          : 'border-[#D6A323]/30 bg-[#FFFBF2] text-[#252A2A]/80 hover:border-[#D6A323]'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1 text-[#D6A323]" />
                      <div className="text-xs font-bold">{fmt.label}</div>
                      <div className="text-[9px] opacity-80 mt-0.5">{fmt.note}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resolution Multiplier / Quality */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#008F87] block mb-2">
                3. Export Resolution
              </label>
              <div className="flex items-center space-x-2">
                {[
                  { scale: 1, label: '1x Web' },
                  { scale: 2, label: '2x Retina HD (Recommended)' },
                  { scale: 3, label: '3x Ultra Print' }
                ].map(sc => (
                  <button
                    key={sc.scale}
                    onClick={() => setScale(sc.scale)}
                    className={`flex-1 py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all ${
                      scale === sc.scale
                        ? 'border-[#008F87] bg-[#FFFBF2] font-bold text-[#008F87] shadow-xs'
                        : 'border-[#D6A323]/30 bg-[#FFFBF2]/70 text-[#252A2A]/70 hover:bg-[#FFFBF2]'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#252A2A]/60 mt-2 font-mono">
                Canvas resolution: {getDimensionsText()}
              </p>
            </div>

            {/* Quality & Watermark Notice */}
            <div className="p-3.5 rounded-2xl bg-[#FFFBF2] border border-[#D6A323]/40 text-xs text-[#008F87] space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold">
                <Sparkles className="w-4 h-4 text-[#D6A323]" />
                <span>Zero Watermarks • Full Commercial License</span>
              </div>
              <p className="text-[11px] text-[#252A2A]/70">
                Your exported image retains vector-sharp typography and exact uploaded portrait color fidelity.
              </p>
            </div>

            {/* Download CTA Action Button */}
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#008F87] to-[#006B66] text-white font-semibold text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center space-x-2 border border-[#D6A323]/50 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#D6A323]" />
                  <span>Rendering Ultra-HD {format.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-[#D6A323]" />
                  <span>Download Invitation ({format.toUpperCase()})</span>
                </>
              )}
            </button>

            {lastExportedUrl && (
              <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Download completed! Saved to your downloads folder.</span>
              </div>
            )}
          </div>

          {/* Right Column: Live Export Preview Canvas Container */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#FFFBF2]/60 p-6 rounded-3xl border border-[#D6A323]/30 min-h-[460px] relative overflow-hidden">
            <span className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold font-mono">
              Live Capture Viewport ({aspectRatio})
            </span>

            {/* The element targeted for capture */}
            <div 
              ref={cardRef} 
              className="w-full max-w-[360px] transform transition-transform duration-300 origin-center"
            >
              <InvitationCard
                event={event}
                aspectRatio={aspectRatio}
                showRsvpCta={false}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
