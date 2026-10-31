import React, { useState, useEffect } from 'react';
import { EventData, RSVPResponse, GuestWish } from '../types';
import { InvitationCard } from './InvitationCard';
import { CountdownSection } from './CountdownSection';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { 
  Calendar, 
  MapPin, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Heart, 
  Lock, 
  CheckCircle2, 
  Send,
  Compass,
  Download,
  Camera,
  Upload,
  User
} from 'lucide-react';
import { IWillBeThereBanner } from './IWillBeThereBanner';
import { AttendeeCards } from './AttendeeCards';
import { PhotoGallery } from './ui/PhotoGallery';

const HONORIFICS = new Set([
  'professor', 'prof', 'prof.', 'dr', 'dr.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.',
  'engr', 'engr.', 'arc', 'arc.', 'chief', 'hon', 'hon.', 'justice', 'senator',
  'alhaji', 'alhajiya', 'hajiya', 'sir', 'mal', 'mal.'
]);

const greetingName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts.find((part) => !HONORIFICS.has(part.toLowerCase().replace(/,/g, '')));
  return first || parts[0] || 'Guest';
};

interface EventPageViewProps {
  event: EventData;
  rsvps: RSVPResponse[];
  wishes: GuestWish[];
  onAddRsvp: (rsvp: RSVPResponse) => void;
  onUpdateRsvp?: (rsvp: RSVPResponse) => void;
  onAddWish: (wish: GuestWish) => void;
  onBackToStudio: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const EventPageView: React.FC<EventPageViewProps> = ({
  event,
  rsvps,
  wishes,
  onAddRsvp,
  onUpdateRsvp,
  onAddWish,
  onBackToStudio,
  onSuccessToast
}) => {
  // Password protection state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(!event.passwordRequired);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Simple RSVP Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guestPhotoUrl, setGuestPhotoUrl] = useState('');
  const [confirmationTab, setConfirmationTab] = useState<'dp-flyer' | 'qr-pass'>('dp-flyer');
  const [formSubmitted, setFormSubmitted] = useState<RSVPResponse | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const photoUploadRef = React.useRef<HTMLInputElement>(null);

  const handleGuestPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      if (onSuccessToast) onSuccessToast('Please upload a photo (PNG, JPG, or WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setGuestPhotoUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Wish Board State
  const [wishAuthor, setWishAuthor] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate QR code whenever submitted
  useEffect(() => {
    if (formSubmitted) {
      QRCode.toDataURL(formSubmitted.qrTicketCode, { width: 220, margin: 1 })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [formSubmitted]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword === (event.accessPassword || 'nsuk2026')) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      if (onSuccessToast) onSuccessToast('Please enter your full name.');
      return;
    }

    const ticketCode = `EA-${event.slug.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRsvp: RSVPResponse = {
      id: `rsvp-${Date.now()}`,
      eventId: event.id,
      fullName: fullName.trim(),
      email: email.trim() || `${fullName.trim().toLowerCase().replace(/\s+/g, '.')}@guest.nsuk.edu.ng`,
      phone: phone.trim(),
      attendance: 'attending',
      guestCount: 1,
      dietary: 'None',
      groupCategory: 'General',
      submittedAt: new Date().toISOString(),
      qrTicketCode: ticketCode,
      checkedIn: false,
      photoUrl: guestPhotoUrl || undefined
    };

    onAddRsvp(newRsvp);
    setFormSubmitted(newRsvp);
    setConfirmationTab('dp-flyer');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D6A323', '#008F87', '#B9A1D0', '#FFF4DC']
      });
    } catch { /* ignore */ }

    if (onSuccessToast) {
      onSuccessToast(
        guestPhotoUrl
          ? 'You’re confirmed! Download your “I Will Be Attending” flyer below.'
          : 'Seat reserved! Add a photo any time to finish your attending flyer.'
      );
    }
  };

  const syncConfirmedFlyer = (changes: Partial<RSVPResponse>) => {
    if (!formSubmitted) return;
    const next = { ...formSubmitted, ...changes };
    setFormSubmitted(next);
    onUpdateRsvp?.(next);
  };

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishAuthor.trim() || !wishMessage.trim()) return;

    const newWish: GuestWish = {
      id: `wish-${Date.now()}`,
      eventId: event.id,
      author: wishAuthor.trim(),
      message: wishMessage.trim(),
      createdAt: new Date().toISOString(),
      likes: 1
    };

    onAddWish(newWish);
    setWishAuthor('');
    setWishMessage('');
    if (onSuccessToast) {
      onSuccessToast('Your warm wish has been posted to the celebration board!');
    }
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/e/${event.slug}` : `https://nsuk.edu.ng/inaugural/${event.slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    if (onSuccessToast) onSuccessToast('Shareable link copied to clipboard!');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `You are cordially invited to celebrate ${event.title}.\n\nView details & RSVP online here: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // If password protected and not unlocked yet
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#FFF4DC] flex items-center justify-center p-4">
        <div className="bg-[#FFFBF2] p-8 rounded-3xl border border-[#D6A323]/40 shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#008F87]/10 border border-[#D6A323]/40 flex items-center justify-center text-[#008F87]">
            <Lock className="w-8 h-8 text-[#D6A323]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif-luxury font-bold text-[#252A2A]">
              Private Event Invitation
            </h2>
            <p className="text-xs text-[#252A2A]/70 font-sans-modern mt-1">
              This celebration is protected by the host. Please enter the invitation passcode to view the event.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter passcode (e.g. nsuk2026)"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#D6A323]/40 bg-[#FFFBF2] text-center text-sm font-mono tracking-widest focus:outline-hidden focus:border-[#008F87]"
            />
            {passwordError && (
              <p className="text-xs text-red-600">Incorrect passcode. Please try again.</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#008F87] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:bg-[#006B66] transition-all"
            >
              Enter Invitation
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF4DC] text-[#252A2A] pt-24 sm:pt-28 pb-24">
      
      {/* Top Vanity Share Bar (Clean Inline Banner) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8">
        <div className="bg-gradient-to-r from-[#003330] via-[#006B66] to-[#003330] text-white py-3 px-4 sm:px-5 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs border border-[#D6A323]/30">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[#FFF4DC] hidden sm:inline">nsuk.edu.ng/inaugural/{event.slug}</span>
            <span className="text-white/80 font-serif-luxury text-sm font-bold sm:hidden">{event.celebrants}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center space-x-1.5 transition-all text-xs cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D6A323]" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={shareToWhatsApp}
              className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 font-semibold flex items-center space-x-1.5 transition-all text-xs text-white cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </button>

            <button
              onClick={onBackToStudio}
              className="px-3 py-1.5 rounded-full bg-[#D6A323] hover:brightness-105 font-semibold text-[#003330] text-xs transition-all cursor-pointer"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>

      {/* Hero Presentation: The Rendered Invitation Card & Ceremony Details */}
      <section className="pt-12 pb-16 px-4 md:px-8 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle Ornamental Crest */}
        <div className="w-8 h-8 rounded-full border border-[#D6A323] flex items-center justify-center text-xs text-[#D6A323] font-serif-luxury font-bold mb-3">
          ❦
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#D6A323] font-semibold mb-2">
          Official Digital Invitation
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#252A2A] mb-6">
          {event.title}
        </h1>

        {/* The Card Hero Display with Ambient Glow */}
        <div className="w-full max-w-[440px] drop-shadow-2xl mb-8 relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#D6A323]/30 via-[#008F87]/20 to-[#D6A323]/30 rounded-3xl blur-xl pointer-events-none" />
          <div className="relative rounded-2xl overflow-hidden">
            <InvitationCard
              event={event}
              aspectRatio="portrait"
              showRsvpCta={false}
            />
          </div>
        </div>

        {/* Calendar Integration Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          <a
            href={generateGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#FFFBF2] border border-[#D6A323]/40 text-[#008F87] text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md hover:border-[#D6A323] transition-all flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4 text-[#D6A323]" />
            <span>Add to Google Calendar</span>
          </a>

          <button
            onClick={() => downloadIcsFile(event)}
            className="px-5 py-2.5 rounded-full bg-[#FFFBF2] border border-[#D6A323]/40 text-[#008F87] text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md hover:border-[#D6A323] transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D6A323]" />
            <span>Download Apple / iCal .ICS</span>
          </button>

          <a
            href="#rsvp-section"
            className="px-6 py-2.5 rounded-full bg-[#008F87] hover:bg-[#006B66] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#FFF4DC]" />
            <span>RSVP &amp; Reserve Seat ↓</span>
          </a>
        </div>

      </section>

      {/* Real-time Countdown Section */}
      {event.showCountdown && (
        <section className="bg-gradient-to-br from-[#006B66] via-[#004D49] to-[#003330] py-12 px-4 border-y border-[#D6A323]/30">
          <CountdownSection
            event={event}
            activeStyle={event.countdownStyle}
            standalone={true}
          />
        </section>
      )}

      {/* Ceremony Programme Timeline */}
      {event.schedule && event.schedule.length > 0 && (
        <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D6A323] font-semibold block mb-2">
              Order of Events
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-luxury font-bold text-[#252A2A]">
              Programme Schedule
            </h2>
            <p className="text-xs md:text-sm text-[#252A2A]/70 font-sans-modern mt-2">
              All timings are listed in {event.timezone}.
            </p>
          </div>

          <div className="relative border-l-2 border-[#D6A323]/40 ml-4 md:ml-32 space-y-8">
            {event.schedule.map((item, idx) => (
              <div key={item.id} className="relative pl-6 md:pl-8 group">
                {/* Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#FFFBF2] border-2 border-[#008F87] group-hover:bg-[#D6A323] transition-colors" />

                {/* Time Badge (left on desktop) */}
                <div className="md:absolute md:-left-32 md:top-1 text-xs font-mono font-bold text-[#008F87] uppercase tracking-wider">
                  {item.time}
                </div>

                <div className="bg-[#FFFBF2] p-6 rounded-2xl border border-[#D6A323]/30 shadow-xs hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-serif-luxury font-bold text-[#252A2A]">
                    {item.title}
                  </h4>
                  {item.location && (
                    <div className="flex items-center space-x-1.5 text-xs text-[#D6A323] font-semibold mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.description && (
                    <p className="text-xs text-[#252A2A]/70 font-sans-modern mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Venue & Directions */}
      <section className="py-16 px-4 md:px-8 bg-[#FFFBF2] border-y border-[#D6A323]/25">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D6A323] font-semibold block mb-2">
              Location & Reception
            </span>
            <h3 className="text-2xl md:text-3xl font-serif-luxury font-bold text-[#252A2A] mb-3">
              {event.venueName}
            </h3>
            <p className="text-sm text-[#252A2A]/80 leading-relaxed font-sans-modern mb-4">
              {event.address}
            </p>

            {event.instructions && (
              <div className="p-4 rounded-2xl bg-[#FFF4DC] border border-[#D6A323]/30 text-xs text-[#252A2A]/80 mb-6 space-y-1">
                <span className="font-semibold text-[#008F87] block uppercase tracking-wider text-[10px]">
                  Guest Instructions & Parking
                </span>
                <p>{event.instructions}</p>
              </div>
            )}

            <a
              href={event.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${event.venueName} ${event.address}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#008F87] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-[#006B66] transition-all"
            >
              <Compass className="w-4 h-4 text-[#D6A323]" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>

          {/* Interactive Map Visual Representation */}
          <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 border border-[#D6A323]/40 shadow-lg bg-gradient-to-br from-[#003330] to-[#002624] p-6 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs text-[#FFF4DC] backdrop-blur-md">
                Satellite Navigation
              </span>
              <MapPin className="w-6 h-6 text-[#D6A323] animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-white/70">
                Destination Coordinates
              </span>
              <h4 className="text-lg font-serif-luxury font-bold text-white">
                {event.venueName}
              </h4>
              <p className="text-xs text-white/75 line-clamp-2">
                {event.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code Showcase */}
      {event.dressCode && (
        <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D6A323] font-semibold block mb-2">
            Attire Guide
          </span>
          <h3 className="text-2xl md:text-3xl font-serif-luxury font-bold text-[#252A2A] mb-3">
            {event.dressCode}
          </h3>
          {event.dressCodeNote && (
            <p className="text-xs md:text-sm text-[#252A2A]/70 max-w-xl mx-auto font-sans-modern mb-6">
              {event.dressCodeNote}
            </p>
          )}

          {event.dressCodeColors && event.dressCodeColors.length > 0 && (
            <div className="flex items-center justify-center space-x-3">
              <span className="text-xs text-[#252A2A]/60 font-medium">Palette Inspiration:</span>
              {event.dressCodeColors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Simple RSVP — name + photo → flyer */}
      <section id="rsvp-section" className="py-14 sm:py-20 px-3 sm:px-6 md:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D6A323] font-semibold block">
            Official RSVP Pass
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#252A2A]">
            I Will Be Attending
          </h2>
          <p className="text-xs md:text-sm text-[#252A2A]/70 font-sans-modern max-w-md mx-auto">
            Reserve your seat in seconds for the 65th Inaugural Lecture of Professor Rashidah Funke Olanrewaju. Add your portrait photo to complete your official flyer and get your digital seat pass. RSVP deadline: <strong>{event.rsvpDeadline || '20 November 2026'}</strong>.
          </p>
        </div>

        <IWillBeThereBanner
          event={event}
          rsvp={
            formSubmitted || {
              id: 'rsvp-pending',
              eventId: event.id,
              fullName: fullName || '',
              photoUrl: guestPhotoUrl,
              phone: phone,
              email: email,
              attendance: 'attending',
              guestCount: 1,
              dietary: 'None',
              groupCategory: 'General',
              submittedAt: new Date().toISOString(),
              qrTicketCode: `EA-${event.slug.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
              checkedIn: false
            }
          }
          onUpdatePhoto={(newP) => {
            setGuestPhotoUrl(newP);
            if (formSubmitted) {
              setFormSubmitted(prev => prev ? { ...prev, photoUrl: newP } : null);
            }
          }}
          onUpdateName={(name) => {
            setFullName(name);
            if (formSubmitted) {
              setFormSubmitted(prev => prev ? { ...prev, fullName: name } : null);
            }
          }}
          onConfirmRsvp={({ fullName: fName, photoUrl: pUrl, phone: ph, email: em }) => {
            const ticketCode = `EA-${event.slug.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
            const newRsvp: RSVPResponse = {
              id: `rsvp-${Date.now()}`,
              eventId: event.id,
              fullName: fName.trim(),
              email: em?.trim() || `${fName.trim().toLowerCase().replace(/\s+/g, '.')}@guest.nsuk.edu.ng`,
              phone: ph?.trim() || '',
              attendance: 'attending',
              guestCount: 1,
              dietary: 'None',
              groupCategory: 'General',
              submittedAt: new Date().toISOString(),
              qrTicketCode: ticketCode,
              checkedIn: false,
              photoUrl: pUrl || undefined
            };
            onAddRsvp(newRsvp);
            setFormSubmitted(newRsvp);
            onSuccessToast?.('You’re confirmed! Download your flyer to share.');
          }}
          onSuccessToast={onSuccessToast}
        />
      </section>

      {/* Confirmed attendees — carded with hover */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto border-t border-[#D6A323]/25">
        <AttendeeCards
          rsvps={rsvps}
          title='"I Will Be Attending"'
          subtitle="Scholars and guests who have confirmed — hover a card to see more."
        />
      </section>

      {/* Guest Wishes & Memory Board */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D6A323] font-semibold block mb-2">
            Heartfelt Congratulations
          </span>
          <h2 className="text-3xl font-serif-luxury font-bold text-[#252A2A]">
            Guest Wishes & Memory Board
          </h2>
          <p className="text-xs md:text-sm text-[#252A2A]/70 font-sans-modern mt-1">
            Read the blessings and prayers shared by loved ones.
          </p>
        </div>

        {/* Wish Submission Form */}
        <div className="bg-[#FFFBF2] p-6 rounded-3xl border border-[#D6A323]/30 shadow-xs mb-8">
          <form onSubmit={handleWishSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#252A2A]/70 font-bold block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={wishAuthor}
                  onChange={(e) => setWishAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D6A323]/30 bg-[#FFF4DC]/50 text-xs focus:outline-none focus:border-[#008F87]"
                  placeholder="e.g. Auntie Aisha"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-[#252A2A]/70 font-bold block mb-1">
                  Your Message or Prayer
                </label>
                <input
                  type="text"
                  required
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D6A323]/30 bg-[#FFF4DC]/50 text-xs focus:outline-none focus:border-[#008F87]"
                  placeholder="Share your warm thoughts and prayers..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#008F87] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#006B66] transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#D6A323]" />
                <span>Post Wish</span>
              </button>
            </div>
          </form>
        </div>

        {/* Wishes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishes.map(wish => (
            <div
              key={wish.id}
              className="bg-[#FFFBF2] p-6 rounded-2xl border border-[#D6A323]/25 shadow-xs flex flex-col justify-between space-y-3"
            >
              <p className="font-serif-luxury text-sm italic text-[#252A2A] leading-relaxed">
                "{wish.message}"
              </p>
              <div className="flex items-center justify-between text-xs text-[#252A2A]/60 pt-2 border-t border-[#D6A323]/15">
                <span className="font-semibold text-[#008F87] font-sans-modern">
                  — {wish.author}
                </span>
                <div className="flex items-center space-x-1 text-[#D6A323]">
                  <Heart className="w-3.5 h-3.5 fill-[#D6A323]" />
                  <span>{wish.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Moments Gallery */}
      {event.gallery && event.gallery.length > 0 && (
        <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D6A323] font-semibold block mb-2">
              Captured Memories
            </span>
            <h2 className="text-3xl font-serif-luxury font-bold text-[#252A2A]">
              Photo Moments
            </h2>
          </div>

          <PhotoGallery
            photos={event.gallery.map((item) => ({
              url: item.url,
              caption: item.caption,
              category: item.category,
              author: item.author
            }))}
          />
        </section>
      )}

    </div>
  );
};
