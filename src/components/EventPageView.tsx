import React, { useState, useEffect } from 'react';
import { EventData, RSVPResponse, GuestWish, AttendanceStatus, DietaryOption } from '../types';
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
  Music, 
  Utensils, 
  Phone, 
  Mail, 
  QrCode, 
  Heart, 
  Lock, 
  CheckCircle2, 
  Clock, 
  MessageSquarePlus,
  Send,
  Compass,
  Download,
  Camera,
  Upload
} from 'lucide-react';
import { IWillBeThereBanner } from './IWillBeThereBanner';

interface EventPageViewProps {
  event: EventData;
  rsvps: RSVPResponse[];
  wishes: GuestWish[];
  onAddRsvp: (rsvp: RSVPResponse) => void;
  onAddWish: (wish: GuestWish) => void;
  onBackToStudio: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const EventPageView: React.FC<EventPageViewProps> = ({
  event,
  rsvps,
  wishes,
  onAddRsvp,
  onAddWish,
  onBackToStudio,
  onSuccessToast
}) => {
  // Password protection state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(!event.passwordRequired);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // RSVP Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('attending');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [plusOneName, setPlusOneName] = useState('');
  const [dietary, setDietary] = useState<DietaryOption>('None');
  const [dietaryDetails, setDietaryDetails] = useState('');
  const [message, setMessage] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [guestPhotoUrl, setGuestPhotoUrl] = useState('');
  const [confirmationTab, setConfirmationTab] = useState<'dp-flyer' | 'qr-pass'>('dp-flyer');
  const [formSubmitted, setFormSubmitted] = useState<RSVPResponse | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const photoUploadRef = React.useRef<HTMLInputElement>(null);

  const handleGuestPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
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
    if (!fullName.trim() || !email.trim()) {
      alert('Please fill in your name and email address.');
      return;
    }

    const ticketCode = `EA-${event.slug.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRsvp: RSVPResponse = {
      id: `rsvp-${Date.now()}`,
      eventId: event.id,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      attendance: attendance,
      guestCount: attendance === 'attending' ? guestCount : 0,
      plusOneNames: plusOneName.trim() ? [plusOneName.trim()] : [],
      dietary: dietary,
      dietaryDetails: dietaryDetails.trim(),
      message: message.trim(),
      songRequest: songRequest.trim(),
      groupCategory: 'General',
      submittedAt: new Date().toISOString(),
      qrTicketCode: ticketCode,
      checkedIn: false,
      photoUrl: guestPhotoUrl.trim() || undefined
    };

    onAddRsvp(newRsvp);
    setFormSubmitted(newRsvp);

    // Confetti shower
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A227', '#0B6B3A', '#DFC79B']
      });
    } catch {
      // safe fallback
    }

    if (onSuccessToast) {
      onSuccessToast('Your RSVP has been confirmed! Your Digital Pass is ready below.');
    }
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
      <div className="min-h-screen bg-[#F6FAF7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-[#C9A227]/40 shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#0B6B3A]/10 border border-[#C9A227]/40 flex items-center justify-center text-[#0B6B3A]">
            <Lock className="w-8 h-8 text-[#C9A227]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif-luxury font-bold text-[#0F1F17]">
              Private Event Invitation
            </h2>
            <p className="text-xs text-[#0F1F17]/70 font-sans-modern mt-1">
              This celebration is protected by the host. Please enter the invitation passcode to view the event.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter passcode (e.g. nsuk2026)"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-center text-sm font-mono tracking-widest focus:outline-hidden focus:border-[#C9A227]"
            />
            {passwordError && (
              <p className="text-xs text-red-600">Incorrect passcode. Please try again.</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0B6B3A] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:bg-[#064E2B] transition-all"
            >
              Enter Invitation
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#0F1F17] pt-20 md:pt-28 pb-24">
      
      {/* Top Vanity Share Bar */}
      <div className="bg-[#0B6B3A] text-white py-3 px-4 sticky top-18 sm:top-20 md:top-28 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[#F2E3B3] hidden sm:inline">nsuk.edu.ng/inaugural/{event.slug}</span>
            <span className="text-white/80 font-serif-luxury text-sm font-bold sm:hidden">{event.celebrants}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center space-x-1.5 transition-all text-xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C9A227]" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={shareToWhatsApp}
              className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 font-semibold flex items-center space-x-1.5 transition-all text-xs text-white"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </button>

            <button
              onClick={onBackToStudio}
              className="px-3 py-1.5 rounded-full bg-[#C9A227] hover:brightness-105 font-semibold text-[#0B6B3A] text-xs transition-all"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>

      {/* Hero Presentation: The Rendered Invitation Card & Ceremony Details */}
      <section className="pt-12 pb-16 px-4 md:px-8 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle Ornamental Crest */}
        <div className="w-8 h-8 rounded-full border border-[#C9A227] flex items-center justify-center text-xs text-[#C9A227] font-serif-luxury font-bold mb-3">
          ❦
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold mb-2">
          Official Digital Invitation
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#0F1F17] mb-6">
          {event.title}
        </h1>

        {/* The Card Hero Display with Ambient Glow */}
        <div className="w-full max-w-[440px] drop-shadow-2xl mb-8 relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#C9A227]/30 via-[#0B6B3A]/20 to-[#C9A227]/30 rounded-3xl blur-xl pointer-events-none" />
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
            className="px-5 py-2.5 rounded-full bg-white border border-[#C9A227]/40 text-[#0B6B3A] text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md hover:border-[#C9A227] transition-all flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4 text-[#C9A227]" />
            <span>Add to Google Calendar</span>
          </a>

          <button
            onClick={() => downloadIcsFile(event)}
            className="px-5 py-2.5 rounded-full bg-white border border-[#C9A227]/40 text-[#0B6B3A] text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md hover:border-[#C9A227] transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-[#C9A227]" />
            <span>Download Apple / iCal .ICS</span>
          </button>
        </div>

      </section>

      {/* Real-time Countdown Section */}
      {event.showCountdown && (
        <section className="bg-gradient-to-br from-[#0B6B3A] to-[#043A20] py-12 px-4">
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
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">
              Order of Events
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-luxury font-bold text-[#0F1F17]">
              Programme Schedule
            </h2>
            <p className="text-xs md:text-sm text-[#0F1F17]/70 font-sans-modern mt-2">
              All timings are listed in {event.timezone}.
            </p>
          </div>

          <div className="relative border-l-2 border-[#C9A227]/40 ml-4 md:ml-32 space-y-8">
            {event.schedule.map((item, idx) => (
              <div key={item.id} className="relative pl-6 md:pl-8 group">
                {/* Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#0B6B3A] group-hover:bg-[#C9A227] transition-colors" />

                {/* Time Badge (left on desktop) */}
                <div className="md:absolute md:-left-32 md:top-1 text-xs font-mono font-bold text-[#0B6B3A] uppercase tracking-wider">
                  {item.time}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#C9A227]/30 shadow-xs hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-serif-luxury font-bold text-[#0F1F17]">
                    {item.title}
                  </h4>
                  {item.location && (
                    <div className="flex items-center space-x-1.5 text-xs text-[#C9A227] font-semibold mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.description && (
                    <p className="text-xs text-[#0F1F17]/70 font-sans-modern mt-2 leading-relaxed">
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
      <section className="py-16 px-4 md:px-8 bg-white border-y border-[#C9A227]/20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">
              Location & Reception
            </span>
            <h3 className="text-2xl md:text-3xl font-serif-luxury font-bold text-[#0F1F17] mb-3">
              {event.venueName}
            </h3>
            <p className="text-sm text-[#0F1F17]/80 leading-relaxed font-sans-modern mb-4">
              {event.address}
            </p>

            {event.instructions && (
              <div className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#C9A227]/30 text-xs text-[#0F1F17]/80 mb-6 space-y-1">
                <span className="font-semibold text-[#0B6B3A] block uppercase tracking-wider text-[10px]">
                  Guest Instructions & Parking
                </span>
                <p>{event.instructions}</p>
              </div>
            )}

            <a
              href={event.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${event.venueName} ${event.address}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#0B6B3A] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-[#064E2B] transition-all"
            >
              <Compass className="w-4 h-4 text-[#C9A227]" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>

          {/* Interactive Map Visual Representation */}
          <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 border border-[#C9A227]/40 shadow-lg bg-gradient-to-br from-emerald-950 to-slate-900 p-6 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs text-[#DFC79B] backdrop-blur-md">
                Satellite Navigation
              </span>
              <MapPin className="w-6 h-6 text-[#C9A227] animate-bounce" />
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
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">
            Attire Guide
          </span>
          <h3 className="text-2xl md:text-3xl font-serif-luxury font-bold text-[#0F1F17] mb-3">
            {event.dressCode}
          </h3>
          {event.dressCodeNote && (
            <p className="text-xs md:text-sm text-[#0F1F17]/70 max-w-xl mx-auto font-sans-modern mb-6">
              {event.dressCodeNote}
            </p>
          )}

          {event.dressCodeColors && event.dressCodeColors.length > 0 && (
            <div className="flex items-center justify-center space-x-3">
              <span className="text-xs text-gray-500 font-medium">Palette Inspiration:</span>
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

      {/* Interactive RSVP Registration Section */}
      <section id="rsvp-section" className="py-20 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C9A227]/40 shadow-xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">
              Kindly Respond
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-luxury font-bold text-[#0F1F17]">
              RSVP Confirmation
            </h2>
            <p className="text-xs md:text-sm text-[#0F1F17]/70 font-sans-modern mt-2">
              Kindly submit your response by <strong>{event.rsvpDeadline || 'the deadline'}</strong> to help our hosts prepare seating and hospitality.
            </p>
          </div>

          {/* If already submitted: Display Digital Pass with QR Ticket */}
          {formSubmitted ? (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-serif-luxury font-bold text-[#0B6B3A]">
                  {formSubmitted.attendance === 'attending' 
                    ? 'Your Attendance is Joyfully Confirmed!' 
                    : formSubmitted.attendance === 'tentative' 
                    ? 'Response Noted as Tentative' 
                    : 'Response Received with Regret'}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Thank you, {formSubmitted.fullName}. A confirmation has been registered with the host concierge.
                </p>
              </div>

              {/* Attendance Options: "I Will Be There" DP Flyer vs Digital Pass */}
              {formSubmitted.attendance === 'attending' && (
                <div className="space-y-6">
                  
                  {/* Tab Switcher */}
                  <div className="flex items-center justify-center space-x-2 bg-gray-100 p-1.5 rounded-2xl max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={() => setConfirmationTab('dp-flyer')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        confirmationTab === 'dp-flyer'
                          ? 'bg-[#0B6B3A] text-white shadow-md'
                          : 'text-gray-700 hover:text-black'
                      }`}
                    >
                      ✦ "I Will Be There" DP Flyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmationTab('qr-pass')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        confirmationTab === 'qr-pass'
                          ? 'bg-[#0B6B3A] text-white shadow-md'
                          : 'text-gray-700 hover:text-black'
                      }`}
                    >
                      Official QR Pass
                    </button>
                  </div>

                  {confirmationTab === 'dp-flyer' ? (
                    <IWillBeThereBanner
                      event={event}
                      rsvp={formSubmitted}
                      defaultRatio="story"
                      onUpdatePhoto={(newP) => {
                        setFormSubmitted(prev => prev ? { ...prev, photoUrl: newP } : null);
                        setGuestPhotoUrl(newP);
                      }}
                      onSuccessToast={onSuccessToast}
                    />
                  ) : (
                    /* Digital Guest Pass Card with QR */
                    <div className="bg-gradient-to-br from-[#1C1F26] to-[#111318] text-white p-6 rounded-2xl border-2 border-[#C9A227] shadow-xl text-left relative overflow-hidden max-w-md mx-auto">
                      <div className="flex items-center justify-between border-b border-[#C9A227]/30 pb-3 mb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-bold block">
                            Official Digital Guest Pass
                          </span>
                          <h4 className="font-serif-luxury text-lg font-bold text-white">
                            {event.celebrants}
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B6B3A] text-emerald-200 border border-emerald-500/30">
                          Confirmed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 items-center mb-4">
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase">Guest Name</div>
                          <div className="text-sm font-semibold text-white">{formSubmitted.fullName}</div>
                          
                          <div className="text-[10px] text-gray-400 uppercase mt-2">Party Size</div>
                          <div className="text-xs font-semibold text-[#F2E3B3]">
                            {formSubmitted.guestCount} {formSubmitted.guestCount > 1 ? 'Guests' : 'Guest'}
                          </div>

                          <div className="text-[10px] text-gray-400 uppercase mt-2">Ticket Code</div>
                          <div className="text-xs font-mono font-bold text-emerald-400">
                            {formSubmitted.qrTicketCode}
                          </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center justify-center bg-white p-2 rounded-xl">
                          {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="Guest QR Code" className="w-28 h-28" />
                          ) : (
                            <div className="w-28 h-28 flex items-center justify-center text-gray-400 text-xs">
                              Loading QR...
                            </div>
                          )}
                          <span className="text-[8px] font-mono text-gray-700 mt-1 uppercase">Scan at Entrance</span>
                        </div>
                      </div>

                      <p className="text-[9px] text-gray-400 text-center italic border-t border-gray-800 pt-2">
                        Please present this Digital Pass upon arrival at {event.venueName}.
                      </p>
                    </div>
                  )}

                </div>
              )}

              <button
                onClick={() => setFormSubmitted(null)}
                className="text-xs text-[#0B6B3A] underline font-semibold mt-4 block mx-auto"
              >
                Modify or submit another response
              </button>
            </div>
          ) : (
            /* RSVP Form Input */
            <form onSubmit={handleRsvpSubmit} className="space-y-6">
              
              {/* Attendance Toggle */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-2 text-center">
                  Will You Be Attending? *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'attending', label: 'Joyfully Accept', color: 'from-[#0B6B3A] to-[#064E2B]' },
                    { id: 'declined', label: 'Regretfully Decline', color: 'bg-gray-800' },
                    { id: 'tentative', label: 'Tentative / Maybe', color: 'bg-amber-800' }
                  ].map(status => (
                    <button
                      key={status.id}
                      type="button"
                      onClick={() => setAttendance(status.id as AttendanceStatus)}
                      className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all border ${
                        attendance === status.id
                          ? `bg-gradient-to-r ${status.color} text-white border-[#C9A227] shadow-md`
                          : 'bg-[#F6FAF7] text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    placeholder="e.g. Dr. Sarah Jenkins"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    placeholder="sarah@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    placeholder="+234 803 123 4567"
                  />
                </div>

                {/* PHOTO UPLOAD FOR "I WILL BE THERE" FLYER */}
                {attendance === 'attending' && (
                  <div className="sm:col-span-2 p-5 rounded-3xl bg-gradient-to-br from-[#0B6B3A]/10 via-[#F6FAF7] to-[#C9A227]/15 border-2 border-[#C9A227] shadow-md space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-8 h-8 rounded-full bg-[#0B6B3A] text-[#DFC79B] flex items-center justify-center shadow-xs">
                          <Camera className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0B6B3A] block">
                            Add Your Photo for the "I Will Be There" DP Flyer
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Personalize your official social media banner to share on WhatsApp, LinkedIn & X
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#0B6B3A] bg-[#C9A227]/30 px-3 py-1 rounded-full border border-[#C9A227]/60 shadow-xs">
                        ✦ Highly Recommended
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/90 p-4 rounded-2xl border border-[#C9A227]/40">
                      {/* Live Thumbnail Preview with Gold Ring */}
                      <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#C9A227] via-white to-[#DFC79B] shadow-md flex-shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {guestPhotoUrl ? (
                            <img src={guestPhotoUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <Camera className="w-6 h-6 text-[#C9A227]" />
                              <span className="text-[8px] font-bold text-gray-500 uppercase mt-0.5">No Photo</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <input
                          ref={photoUploadRef}
                          type="file"
                          accept="image/*"
                          onChange={handleGuestPhotoUpload}
                          className="hidden"
                        />
                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                          <button
                            type="button"
                            onClick={() => photoUploadRef.current?.click()}
                            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0B6B3A] to-[#064E2B] text-white text-xs font-bold uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center space-x-1.5"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#C9A227]" />
                            <span>{guestPhotoUrl ? 'Change Your Picture' : 'Click to Upload Your Picture'}</span>
                          </button>

                          {guestPhotoUrl && (
                            <button
                              type="button"
                              onClick={() => setGuestPhotoUrl('')}
                              className="px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-semibold transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 justify-center sm:justify-start">
                          <span>Or try sample:</span>
                          <button
                            type="button"
                            onClick={() => setGuestPhotoUrl('/images/vc-saadatu-hassan-liman.jpg')}
                            className="underline text-[#0B6B3A] font-semibold hover:text-[#C9A227]"
                          >
                            VC Prof. Sa'adatu Liman
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setGuestPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80')}
                            className="underline text-[#0B6B3A] font-semibold hover:text-[#C9A227]"
                          >
                            Dean / Fellow
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {attendance === 'attending' && event.allowPlusOne && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Total Party Size (including you)
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    >
                      <option value={1}>1 Guest (Myself)</option>
                      <option value={2}>2 Guests (+1 Accompanying)</option>
                      {event.maxGuestsPerRsvp > 2 && <option value={3}>3 Guests</option>}
                    </select>
                  </div>
                )}

                {attendance === 'attending' && guestCount > 1 && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Name of Accompanying Guest
                    </label>
                    <input
                      type="text"
                      value={plusOneName}
                      onChange={(e) => setPlusOneName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                      placeholder="e.g. Mr. David Jenkins"
                    />
                  </div>
                )}

                {attendance === 'attending' && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Dietary Preferences / Restrictions
                    </label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value as DietaryOption)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    >
                      <option value="None">No Dietary Restrictions</option>
                      <option value="Halal">Halal</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Pescatarian">Pescatarian</option>
                      <option value="Kosher">Kosher</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                      <option value="Other">Other Specific Allergies</option>
                    </select>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                    Warm Message or Prayer for the Celebrants
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    placeholder="Leave your heartfelt congratulations or blessings..."
                  />
                </div>

                {attendance === 'attending' && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Song Request for the DJ
                    </label>
                    <input
                      type="text"
                      value={songRequest}
                      onChange={(e) => setSongRequest(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                      placeholder="e.g. Stevie Wonder — Signed, Sealed, Delivered"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0B6B3A] to-[#064E2B] text-white font-semibold text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 border border-[#C9A227]/40"
              >
                <span>Confirm RSVP & Receive Digital Pass</span>
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
              </button>
            </form>
          )}

        </div>
      </section>

      {/* "I Will Be There!" Confirmed Attendees Community Wall */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto border-t border-[#C9A227]/20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-xs text-[#0B6B3A] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Community of Confirmed Attendees</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F17]">
            "I Will Be There!" Confirmed Guests
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-sans-modern mt-1 max-w-lg mx-auto">
            Celebrants, scholars, and dignitaries who have confirmed their attendance and generated their official display flyers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {rsvps.filter(r => r.attendance === 'attending').map(guest => (
            <div
              key={guest.id}
              className="bg-white p-4 rounded-2xl border border-[#C9A227]/30 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center justify-between space-y-2 group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-[#C9A227] p-0.5 overflow-hidden bg-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                  <img
                    src={guest.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={guest.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 border border-white flex items-center justify-center text-white text-[10px]">
                  ✓
                </div>
              </div>

              <div>
                <h4 className="font-serif-luxury font-bold text-xs text-[#0F1F17] line-clamp-1">
                  {guest.fullName}
                </h4>
                <span className="text-[9px] uppercase tracking-wider text-[#C9A227] font-semibold block mt-0.5">
                  I Will Be There!
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guest Wishes & Memory Board */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">
            Heartfelt Congratulations
          </span>
          <h2 className="text-3xl font-serif-luxury font-bold text-[#0F1F17]">
            Guest Wishes & Memory Board
          </h2>
          <p className="text-xs md:text-sm text-[#0F1F17]/70 font-sans-modern mt-1">
            Read the blessings and prayers shared by loved ones.
          </p>
        </div>

        {/* Wish Submission Form */}
        <div className="bg-white p-6 rounded-3xl border border-[#C9A227]/30 shadow-xs mb-8">
          <form onSubmit={handleWishSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={wishAuthor}
                  onChange={(e) => setWishAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="e.g. Auntie Aisha"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">
                  Your Message or Prayer
                </label>
                <input
                  type="text"
                  required
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                  placeholder="Share your warm thoughts and prayers..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#0B6B3A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#064E2B] transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#C9A227]" />
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
              className="bg-white p-6 rounded-2xl border border-[#C9A227]/25 shadow-xs flex flex-col justify-between space-y-3"
            >
              <p className="font-serif-luxury text-sm italic text-[#0F1F17] leading-relaxed">
                "{wish.message}"
              </p>
              <div className="flex items-center justify-between text-xs text-[#0F1F17]/60 pt-2 border-t border-gray-100">
                <span className="font-semibold text-[#0B6B3A] font-sans-modern">
                  — {wish.author}
                </span>
                <div className="flex items-center space-x-1 text-[#C9A227]">
                  <Heart className="w-3.5 h-3.5 fill-[#C9A227]" />
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
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">
              Captured Memories
            </span>
            <h2 className="text-3xl font-serif-luxury font-bold text-[#0F1F17]">
              Photo Moments
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {event.gallery.map(item => (
              <div
                key={item.id}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg border border-[#C9A227]/30"
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <p className="font-serif-luxury text-sm font-semibold">{item.caption}</p>
                  {item.author && <span className="text-[10px] text-white/70 mt-1">{item.author}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
