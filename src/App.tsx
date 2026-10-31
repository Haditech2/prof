import React, { useState, useEffect } from 'react';
import { EventData, RSVPResponse, GuestWish } from './types';
import { INITIAL_EVENTS, INITIAL_RSVPS, INITIAL_WISHES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CountdownSection } from './components/CountdownSection';
import { EventPageView } from './components/EventPageView';
import { HostDashboard } from './components/HostDashboard';
import { DownloadModal } from './components/DownloadModal';
import { QrCheckInModal } from './components/QrCheckInModal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AboutProfessorSection } from './components/AboutProfessorSection';
import { IWillBeThereBanner } from './components/IWillBeThereBanner';
import { AttendeeCards } from './components/AttendeeCards';
import { TributeModal } from './components/TributeModal';
import { PhotoGallery } from './components/ui/PhotoGallery';
import { 
  ArrowRight, 
  Award, 
  Clock, 
  MapPin, 
  Cpu, 
  Lock, 
  Users, 
  Heart,
  CheckCircle2,
  Send,
  Download
} from 'lucide-react';
import type { RSVPResponse as RsvpType } from './types';

export function App() {
  const [events, setEvents] = useState<EventData[]>(() => {
    try {
      localStorage.removeItem('everafter_inaugural_events');
      localStorage.removeItem('everafter_inaugural_rsvps');
      localStorage.removeItem('everafter_inaugural_wishes');
    } catch {}

    const saved = localStorage.getItem('prof_rashidah_event');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id === 'event-prof-rashidah-inaugural') {
          parsed.gallery = INITIAL_EVENTS[0].gallery;
          return [parsed];
        }
      } catch {}
    }
    return INITIAL_EVENTS;
  });

  const [rsvps, setRsvps] = useState<RSVPResponse[]>(() => {
    const saved = localStorage.getItem('prof_rashidah_rsvps');
    if (saved) {
      try {
        const parsed: RSVPResponse[] = JSON.parse(saved);
        if (parsed && parsed.some(r => r.id === 'rsvp-inaug-2')) {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_RSVPS;
  });

  const [wishes, setWishes] = useState<GuestWish[]>(() => {
    const saved = localStorage.getItem('prof_rashidah_wishes');
    if (saved) {
      try {
        const parsed: GuestWish[] = JSON.parse(saved);
        if (parsed && parsed.some(w => w.id === 'wish-omotosho')) {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_WISHES;
  });

  // State for Tribute Modal (Full letter preview)
  const [selectedTributeForModal, setSelectedTributeForModal] = useState<GuestWish | null>(null);

  // State for homepage live "I Will Be There" DP generator
  const [homepageFlyerRsvp, setHomepageFlyerRsvp] = useState<RSVPResponse>(INITIAL_RSVPS[0]);

  // State for homepage biography photo switcher
  const [spotlightPhotoIdx, setSpotlightPhotoIdx] = useState(0);

  // Navigation View State
  const [activeView, setActiveView] = useState<'landing' | 'about-professor' | 'event' | 'dashboard'>('landing');

  // Modals
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isCheckInScannerOpen, setIsCheckInScannerOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inline Tribute Form State on Homepage
  const [inlineAuthor, setInlineAuthor] = useState('');
  const [inlineMessage, setInlineMessage] = useState('');
  const [inlineRole, setInlineRole] = useState('');

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('prof_rashidah_event', JSON.stringify(events[0]));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('prof_rashidah_rsvps', JSON.stringify(rsvps));
  }, [rsvps]);

  useEffect(() => {
    localStorage.setItem('prof_rashidah_wishes', JSON.stringify(wishes));
  }, [wishes]);

  // Current active event (exclusively Professor Rashidah)
  const currentEvent = events[0] || INITIAL_EVENTS[0];

  // Current event's RSVPs and Wishes
  const currentEventRsvps = rsvps.filter(r => r.eventId === currentEvent.id);
  const currentEventWishes = wishes.filter(w => w.eventId === currentEvent.id);

  // Event Update handler
  const handleUpdateEvent = (updated: EventData) => {
    setEvents([updated]);
  };

  // Add RSVP handler
  const handleAddRsvp = (newRsvp: RSVPResponse) => {
    setRsvps(prev => [newRsvp, ...prev]);
  };

  // Update an existing RSVP in place (used when flyer name/photo changes)
  const handleUpdateRsvp = (updated: RSVPResponse) => {
    setRsvps(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  // Confirm from the homepage flyer studio — update the same guest instead of duplicating
  const handleConfirmHomepageFlyer = ({
    fullName,
    photoUrl,
    phone,
    email
  }: {
    fullName: string;
    photoUrl: string;
    phone?: string;
    email?: string;
  }) => {
    const isExistingFlyerRsvp = homepageFlyerRsvp.id.startsWith('rsvp-flyer-');
    const updated: RsvpType = {
      ...homepageFlyerRsvp,
      id: isExistingFlyerRsvp ? homepageFlyerRsvp.id : `rsvp-flyer-${Date.now()}`,
      eventId: currentEvent.id,
      fullName,
      email: email?.trim() || `${fullName.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@guest.nsuk.edu.ng`,
      phone: phone?.trim() || '',
      attendance: 'attending',
      guestCount: 1,
      dietary: 'None',
      groupCategory: 'General',
      submittedAt: new Date().toISOString(),
      qrTicketCode: isExistingFlyerRsvp
        ? homepageFlyerRsvp.qrTicketCode
        : `EA-RFO-${Math.floor(10000 + Math.random() * 90000)}`,
      checkedIn: isExistingFlyerRsvp ? homepageFlyerRsvp.checkedIn : false,
      checkedInAt: isExistingFlyerRsvp ? homepageFlyerRsvp.checkedInAt : undefined,
      photoUrl: photoUrl || undefined
    };

    setRsvps(prev => (
      prev.some(r => r.id === updated.id)
        ? prev.map(r => (r.id === updated.id ? updated : r))
        : [updated, ...prev]
    ));
    setHomepageFlyerRsvp(updated);
  };

  // Smooth scroll to RSVP section from anywhere
  const scrollToRsvp = () => {
    if (activeView !== 'landing') {
      setActiveView('landing');
      setTimeout(() => {
        const el = document.getElementById('rsvp-section') || document.getElementById('dp-generator-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else {
      const el = document.getElementById('rsvp-section') || document.getElementById('dp-generator-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add Wish / Tribute handler
  const handleAddWish = (newWish: GuestWish) => {
    setWishes(prev => [newWish, ...prev]);
  };

  const handleLikeWish = (wishId: string) => {
    setWishes(prev => prev.map(w => w.id === wishId ? { ...w, likes: (w.likes || 0) + 1 } : w));
  };

  // Inline Tribute Submission
  const handleInlineTributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineAuthor.trim() || !inlineMessage.trim()) {
      setToastMessage('Please enter your name and message.');
      return;
    }

    const newWish: GuestWish = {
      id: `wish-${Date.now()}`,
      eventId: currentEvent.id,
      author: inlineRole.trim() ? `${inlineAuthor.trim()} (${inlineRole.trim()})` : inlineAuthor.trim(),
      message: inlineMessage.trim(),
      createdAt: new Date().toISOString(),
      likes: 1
    };

    handleAddWish(newWish);
    setInlineAuthor('');
    setInlineMessage('');
    setInlineRole('');
    setToastMessage('Tribute posted successfully!');
  };

  // Toggle Check In
  const handleToggleCheckIn = (rsvpId: string) => {
    setRsvps(prev => prev.map(r => {
      if (r.id === rsvpId) {
        const nextState = !r.checkedIn;
        return {
          ...r,
          checkedIn: nextState,
          checkedInAt: nextState ? new Date().toISOString() : undefined
        };
      }
      return r;
    }));
  };

  // Delete RSVP
  const handleDeleteRsvp = (rsvpId: string) => {
    setRsvps(prev => prev.filter(r => r.id !== rsvpId));
    setToastMessage('Guest removed from registry.');
  };

  return (
    <div className="min-h-screen bg-[#FFF4DC] text-[#252A2A] flex flex-col font-sans-modern paper-grain">
      
      {/* Accessible Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#008F87] focus:text-white focus:rounded-full focus:shadow-xl focus:text-xs focus:font-bold focus:outline-none focus:ring-2 focus:ring-[#D6A323]"
      >
        Skip to main content
      </a>

      {/* Standout Floating Frosted Navbar */}
      <Navbar
        currentEvent={currentEvent}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeView={activeView}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenRsvp={scrollToRsvp}
      />

      {/* Main Routed Content */}
      <main id="main-content" className="flex-1 focus:outline-none">
        {activeView === 'landing' && (
          <div>
            {/* 1. Hero */}
            <HeroSection
              event={currentEvent}
              onOpenRsvp={scrollToRsvp}
              onOpenDpGenerator={scrollToRsvp}
              onReadProfileClick={() => {
                setActiveView('about-professor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDownloadCardClick={() => setIsDownloadModalOpen(true)}
            />

            {/* 2. Countdown band */}
            <section className="px-3 sm:px-6 lg:px-8 py-10 sm:py-16">
              <div className="max-w-6xl mx-auto rounded-3xl sm:rounded-[32px] bg-[#004D49] text-white overflow-hidden shadow-lg">
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-5 sm:p-8 md:p-12">
                  <div className="lg:col-span-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 text-sm font-serif-luxury italic text-[#FFF4DC]">
                      <Clock className="w-4 h-4 text-[#D6A323]" /> Live Countdown
                    </div>
                    <h2 className="mt-1.5 font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                      The Senate Assembles Soon.
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/80">Wednesday, 25 November 2026 · 2:00 PM</p>
                  </div>
                  <div className="lg:col-span-8">
                    <CountdownSection
                      event={currentEvent}
                      activeStyle={currentEvent.countdownStyle}
                      onStyleChange={(st) => handleUpdateEvent({ ...currentEvent, countdownStyle: st })}
                      standalone={false}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Four pillars & NURA-X Flagship Feature */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 text-center md:text-left">
                  <div>
                    <span className="eyebrow">The Lecture</span>
                    <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#252A2A] leading-tight">
                      Pillars of the Lecture
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5B6B63] max-w-sm mx-auto md:mx-0">
                    Two decades of research and leadership distilled into one inaugural address.
                  </p>
                </div>

                {/* NURA-X Flagship Feature Box with Digital / AI Brand Combination */}
                <div className="rounded-3xl bg-[#004D49] p-5 sm:p-8 text-white shadow-lg overflow-hidden">
                  <div className="relative grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
                    <div className="md:col-span-3 flex justify-center">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-[#D6A323] shadow-lg">
                        <img
                          src="/images/nura-x-intentional-intelligence.jpg"
                          alt="NURA-X Intentional Intelligence Emblem"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-9 space-y-2 text-center md:text-left">
                      <div className="font-serif-luxury italic text-sm text-[#F8E7BE]">The flagship initiative · NURA-X</div>
                      <h3 className="font-serif-luxury text-xl sm:text-3xl font-bold leading-tight">
                        NURA-X: Intentional Intelligence
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
                        A sovereign paradigm anchoring artificial intelligence in digital trust, algorithmic integrity, and human flourishing across African institutions.
                      </p>
                      <div className="pt-1 flex flex-wrap gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-[#FFF4DC] font-medium justify-center md:justify-start">
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#D6A323]" /> Digital Trust &amp; Cryptology</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#D6A323]" /> Neural Vision &amp; Language</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#D6A323]" /> Human-Centric AI Policy</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Cpu, title: 'Applied AI & Neural Systems', desc: 'Computer vision and neural networks engineered for real-world impact.' },
                    { icon: Lock, title: 'Cyber Resiliency & Trust', desc: 'Cryptography and security frameworks protecting electronic transactions.' },
                    { icon: Award, title: 'Software Engineering', desc: 'High-integrity software frameworks and university-industry tech transfer.' },
                    { icon: Users, title: 'EDC & Women in STEM', desc: 'Incubating student technology ventures and mentoring next-gen scholars.' }
                  ].map((pillar, idx) => (
                    <div key={idx} className="bg-[#FFFBF2] border border-[#D6A323]/30 rounded-2xl p-5 sm:p-6 group hover:border-[#008F87]/50 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-[#008F87]/10 text-[#008F87] border border-[#008F87]/20 flex items-center justify-center group-hover:bg-[#008F87] group-hover:text-white transition-colors">
                          <pillar.icon className="w-5 h-5" />
                        </div>
                        <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#D6A323]/40 group-hover:text-[#D6A323] transition-colors">
                          0{idx + 1}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#252A2A] text-sm sm:text-base">{pillar.title}</h3>
                      <p className="mt-1.5 text-xs sm:text-sm text-[#5B6B63] leading-relaxed">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Biography spotlight with Interactive Portrait Gallery */}
            <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FFFBF2] border-y border-[#D6A323]/25 relative overflow-hidden">
              <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Column: Interactive Portrait Frame */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-full max-w-[300px] sm:max-w-[340px]">
                    <div className="absolute -inset-3 rounded-[32px] border-2 border-dashed border-[#008F87]/30" />
                    
                    {/* Active Portrait */}
                    <div className="relative rounded-[28px] overflow-hidden shadow-2xl aspect-[4/5] bg-[#006B66]">
                      <img
                        src={[
                          '/images/prof-rashidah-executive-desk.jpg',
                          '/images/prof-rashidah-candid-celebration.jpg',
                          '/images/prof-rashidah-courtyard-regalia.jpg',
                          '/images/prof-rashidah-garden-portrait.jpg',
                          '/images/prof-rashidah-olanrewaju.jpg',
                          '/images/inaugural-lecture-flyer-portrait.jpg'
                        ][spotlightPhotoIdx]}
                        alt="Professor Rashidah Funke Olanrewaju"
                        className="w-full h-full object-cover object-top transition-all duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-[#006B66]/95 to-transparent text-white">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#FFF4DC] font-bold">
                          {[
                            'Director at Executive Desk · EDC',
                            'Celebration with Scholars & Mentee',
                            'Senate Courtyard Regalia',
                            'Main Campus Garden',
                            'Official Academic Robes',
                            'Official Proclamation Poster'
                          ][spotlightPhotoIdx]}
                        </div>
                        <div className="font-serif-luxury text-base sm:text-lg font-bold">Prof. R. F. Olanrewaju</div>
                      </div>
                    </div>

                    {/* Thumbnail Switcher Pills (Smooth Touch Scroll) */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[#FFF4DC] border border-[#D6A323]/40 shadow-xs overflow-x-auto no-scrollbar max-w-full">
                      {[
                        { url: '/images/prof-rashidah-executive-desk.jpg', label: 'Office' },
                        { url: '/images/prof-rashidah-candid-celebration.jpg', label: 'Celebration' },
                        { url: '/images/prof-rashidah-courtyard-regalia.jpg', label: 'Courtyard' },
                        { url: '/images/prof-rashidah-garden-portrait.jpg', label: 'Garden' },
                        { url: '/images/prof-rashidah-olanrewaju.jpg', label: 'Robes' },
                        { url: '/images/inaugural-lecture-flyer-portrait.jpg', label: 'Flyer' }
                      ].map((item, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => setSpotlightPhotoIdx(pIdx)}
                          title={item.label}
                          className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                            spotlightPhotoIdx === pIdx
                              ? 'border-[#008F87] ring-2 ring-[#D6A323] scale-105'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.label}
                            className="w-full h-full object-cover object-top"
                          />
                        </button>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Right Column: Citation */}
                <div className="lg:col-span-7 text-center lg:text-left">
                  <span className="eyebrow">Academic Citation</span>
                  <h2 className="mt-2 font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#252A2A] leading-tight">
                    A Leading Voice in AI &amp; Software Intelligence
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-[#5B6B63] leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Professor of Computer Science &amp; AI at NSUK. Trained in Malaysia (UPM &amp; IIUM) with doctoral excellence in neural systems and cryptology. Pioneered transformative entrepreneurship ecosystems impacting over 10,000 university students.
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { k: 'Pedigree', v: 'Ph.D. Computer Eng.', s: 'IIUM, Malaysia' },
                      { k: 'Leadership', v: 'Director, EDC', s: '10,000+ students' },
                      { k: 'Distinction', v: 'FCRIDE · SMIEEE', s: 'Chartered Fellow' }
                    ].map((c) => (
                      <div key={c.k} className="bg-[#FFF4DC]/50 border border-[#D6A323]/30 rounded-2xl p-3.5 sm:p-4 text-center sm:text-left">
                        <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#A97912]">{c.k}</div>
                        <div className="mt-0.5 font-bold text-[#252A2A] text-sm">{c.v}</div>
                        <div className="text-xs text-[#5B6B63]">{c.s}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
                    <button
                      id="bio-full-profile"
                      onClick={() => {
                        setActiveView('about-professor');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-[#008F87] hover:bg-[#006B66] text-white shadow-md transition-all cursor-pointer"
                    >
                      <span>View Full Profile</span> <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id="bio-invitation"
                      onClick={() => setIsDownloadModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-[#FFFBF2] border border-[#D6A323]/40 text-[#252A2A] hover:border-[#008F87] transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#008F87]" /> <span>Official Poster</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Order of proceedings — timeline */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <span className="eyebrow">Ceremonial Protocol</span>
                  <h2 className="mt-2 font-serif-luxury text-3xl sm:text-4xl font-bold text-[#252A2A]">Order of Proceedings</h2>
                </div>

                <div className="relative">
                  {/* Vertical Track Rail */}
                  <div className="absolute left-[17px] md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#008F87] via-[#D6A323] to-[#008F87] md:-translate-x-1/2" />
                  <div className="space-y-4 sm:space-y-6">
                    {[
                      { time: '13:15', title: 'Academic Senate Robing & Procession', location: 'Senate Chamber to Assembly Hall' },
                      { time: '13:45', title: 'Arrival & Seating of Dignitaries', location: 'Assembly Hall Sanctuary' },
                      { time: '14:00', title: 'Anthems & Formal Constitution of Assembly', location: 'Assembly Hall Podium' },
                      { time: '14:20', title: 'Reading of Academic Citation', location: 'Podium of Honour' },
                      { time: '14:35', title: 'Delivery of 65th Inaugural Lecture', location: 'Assembly Hall Lectern' },
                      { time: '15:50', title: 'Formal Admission & Plaque Presentation', location: 'High Table Dais' },
                      { time: '16:30', title: 'Inaugural Banquet & Academic Reception', location: 'University Banquet Pavilion' }
                    ].map((item, index) => {
                      const left = index % 2 === 0;
                      return (
                        <div key={index} className="relative flex md:items-center">
                          {/* Compact time dot/badge on mobile, full circle on desktop */}
                          <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-9 h-9 md:w-14 md:h-14 rounded-full bg-white border-2 border-[#008F87] flex items-center justify-center text-[10px] md:text-[11px] font-bold text-[#008F87] shadow-md z-10">
                            <span className="hidden md:inline">{item.time}</span>
                            <Clock className="w-4 h-4 md:hidden text-[#008F87]" />
                          </div>
                          <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${left ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'}`}>
                            <div className={`tilt ${left ? 'tilt-tl' : 'tilt-tr'} bg-[#FFFBF2] rounded-xl border border-[#D6A323]/30 p-4 sm:p-5 shadow-xs hover:border-[#008F87]/40 ${index === 4 ? 'border-[#D6A323] bg-[#FFF4DC]/70' : ''}`}>
                              <div className="md:hidden inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#008F87]/15 text-[#006B66] mb-1">
                                {item.time} prompt
                              </div>
                              <h3 className="font-bold text-[#252A2A] text-sm sm:text-base leading-snug">{item.title}</h3>
                              <div className={`mt-1 text-xs text-[#5B6B63] flex items-center gap-1 ${left ? 'md:justify-end' : ''}`}>
                                <MapPin className="w-3 h-3 text-[#D6A323] shrink-0" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Simple RSVP + flyer generator */}
            <section id="rsvp-section" className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-[#FFF4DC]/60 border-y border-[#D6A323]/30 relative">
              <div id="dp-generator-section" className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="font-script text-2xl sm:text-3xl text-[#A97912] block">
                    Write your name below — the registry is open
                  </span>
                  <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#252A2A] leading-tight">
                    I Will Be Attending
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5B6B63] leading-relaxed max-w-xl mx-auto">
                    Reserve your seat in seconds for the 65th Inaugural Lecture of Professor Rashidah Funke Olanrewaju. Add your portrait photo to complete your official flyer and share on WhatsApp and LinkedIn.
                  </p>
                </div>

                {/* The Upgraded Interactive RSVP Banner */}
                <IWillBeThereBanner
                  event={currentEvent}
                  rsvp={homepageFlyerRsvp}
                  onUpdatePhoto={(newPhoto) => {
                    setHomepageFlyerRsvp((prev) => ({ ...prev, photoUrl: newPhoto }));
                  }}
                  onUpdateName={(name) => {
                    setHomepageFlyerRsvp((prev) => ({ ...prev, fullName: name }));
                  }}
                  onConfirmRsvp={handleConfirmHomepageFlyer}
                  onSuccessToast={(msg) => setToastMessage(msg)}
                />
              </div>
            </section>

            {/* 7. Attendees (carded + hover) + Tributes */}
            <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                
                <div className="lg:col-span-7">
                  <AttendeeCards
                    rsvps={currentEventRsvps}
                    limit={8}
                    onRegisterClick={() => {
                      const el = document.getElementById('dp-generator-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                </div>

                {/* Tributes & Felicitations Showcase */}
                <div className="lg:col-span-5">
                  <div className="rounded-3xl bg-[#FFFBF2] border border-[#D6A323]/30 p-5 sm:p-7 flex flex-col h-full shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="eyebrow">Goodwill Messages</span>
                        <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#252A2A] flex items-center gap-2">
                          <Heart className="w-5 h-5 text-[#D6A323] fill-[#D6A323]" /> Felicitations &amp; Tributes
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setActiveView('about-professor');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-semibold text-[#008F87] hover:text-[#006B66] hover:underline whitespace-nowrap cursor-pointer"
                      >
                        All Tributes →
                      </button>
                    </div>

                    {/* Quick Post Tribute Form */}
                    <form onSubmit={handleInlineTributeSubmit} className="space-y-2 mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          id="tribute-name"
                          type="text"
                          placeholder="Your name & title"
                          value={inlineAuthor}
                          onChange={(e) => setInlineAuthor(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-[#D6A323]/30 bg-white text-xs text-[#252A2A] focus:outline-none focus:border-[#008F87]"
                          required
                        />
                        <input
                          id="tribute-role"
                          type="text"
                          placeholder="Affiliation / Relationship"
                          value={inlineRole}
                          onChange={(e) => setInlineRole(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-[#D6A323]/30 bg-white text-xs text-[#252A2A] focus:outline-none focus:border-[#008F87]"
                        />
                      </div>
                      <div className="relative">
                        <textarea
                          id="tribute-message"
                          rows={2}
                          placeholder="A short message for Prof. Rashidah…"
                          value={inlineMessage}
                          onChange={(e) => setInlineMessage(e.target.value)}
                          className="w-full px-3 py-2 pr-12 rounded-xl border border-[#D6A323]/30 bg-white text-xs text-[#252A2A] focus:outline-none focus:border-[#008F87] resize-none"
                          required
                        />
                        <button
                          id="tribute-submit"
                          type="submit"
                          aria-label="Post tribute"
                          className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-[#008F87] hover:bg-[#006B66] text-white flex items-center justify-center cursor-pointer shadow-xs transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>

                    {/* Rich Tributes List with Avatars & Full-Letter Modal Links */}
                    <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                      {currentEventWishes.map((w, idx) => (
                        <div key={w.id} className={`tilt ${idx % 2 === 0 ? 'tilt-tl' : 'tilt-tr'} bg-white rounded-xl border border-[#D6A323]/25 p-4 space-y-2 hover:border-[#008F87]/40 shadow-xs`}>
                          <div className="flex items-center gap-2.5">
                            {w.photoUrl ? (
                              <img
                                src={w.photoUrl}
                                alt={w.author}
                                className="w-10 h-10 rounded-full object-cover object-top border-2 border-[#D6A323] shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#008F87]/15 text-[#006B66] border-2 border-[#D6A323] flex items-center justify-center font-bold text-xs shrink-0">
                                {w.author.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#252A2A] truncate">{w.author}</h4>
                              {w.role && (
                                <p className="text-[10px] text-[#A97912] font-semibold truncate">{w.role}</p>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-[#47554F] leading-relaxed line-clamp-3 italic font-serif-luxury">
                            “{w.message}”
                          </p>

                          <div className="pt-2 border-t border-[#D6A323]/15 flex items-center justify-between">
                            {w.fullText ? (
                              <button
                                onClick={() => setSelectedTributeForModal(w)}
                                className="text-[11px] font-bold text-[#008F87] hover:text-[#006B66] transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span>Read Full Tribute</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-[#9AA8A0]">Felicitations Note</span>
                            )}

                            <span className="inline-flex items-center gap-1 text-[10px] text-[#D6A323] font-semibold">
                              <Heart className="w-3 h-3 fill-[#D6A323]" />
                              <span>{w.likes}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 8. Gallery */}
            <section className="pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="eyebrow">Photographic Chronicle</span>
                    <h2 className="mt-2 font-serif-luxury text-2xl sm:text-4xl font-bold text-[#252A2A]">Moments of Distinction</h2>
                  </div>
                  <button
                    onClick={() => {
                      setActiveView('about-professor');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-[#008F87] hover:text-[#006B66] hover:underline cursor-pointer"
                  >
                    View Gallery →
                  </button>
                </div>
                <PhotoGallery
                  photos={currentEvent.gallery.map((img) => ({
                    url: img.url,
                    caption: img.caption,
                    category: img.category,
                    author: img.author
                  }))}
                />
              </div>
            </section>

            <Footer
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            />
          </div>
        )}

        {/* Dedicated About Professor View */}
        {activeView === 'about-professor' && (
          <AboutProfessorSection
            event={currentEvent}
            wishes={currentEventWishes}
            onAddWish={handleAddWish}
            onSelectTribute={(t) => setSelectedTributeForModal(t)}
            onRsvpToInaugural={() => {
              setActiveView('event');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDownloadInauguralCard={() => setIsDownloadModalOpen(true)}
            onViewEventPage={() => {
              setActiveView('event');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Dedicated RSVP and Digital Seat Pass View */}
        {activeView === 'event' && (
          <EventPageView
            event={currentEvent}
            rsvps={currentEventRsvps}
            wishes={currentEventWishes}
            onAddRsvp={handleAddRsvp}
            onUpdateRsvp={handleUpdateRsvp}
            onAddWish={handleAddWish}
            onBackToStudio={() => {
              setActiveView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSuccessToast={(msg) => setToastMessage(msg)}
          />
        )}

        {/* Dedicated Senate Secretariat Check-In Scanner & Roster */}
        {activeView === 'dashboard' && (
          <HostDashboard
            event={currentEvent}
            rsvps={currentEventRsvps}
            onToggleCheckIn={handleToggleCheckIn}
            onDeleteRsvp={handleDeleteRsvp}
            onAddGuestManual={(newG) => setRsvps(prev => [newG, ...prev])}
            onOpenCheckInScanner={() => setIsCheckInScannerOpen(true)}
            onViewEventPage={() => setActiveView('event')}
            onSuccessToast={(msg) => setToastMessage(msg)}
          />
        )}
      </main>

      {/* Download Invitation Card Modal */}
      <DownloadModal
        event={currentEvent}
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

      {/* Venue QR Code Reception Check-In Scanner */}
      <QrCheckInModal
        isOpen={isCheckInScannerOpen}
        onClose={() => setIsCheckInScannerOpen(false)}
        rsvps={currentEventRsvps}
        onCheckInGuest={(rsvpId) => handleToggleCheckIn(rsvpId)}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

      {/* Full Tribute & Goodwill Letter Modal */}
      <TributeModal
        tribute={selectedTributeForModal}
        isOpen={!!selectedTributeForModal}
        onClose={() => setSelectedTributeForModal(null)}
        onLike={handleLikeWish}
      />

      {/* Floating Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

    </div>
  );
}

export default App;
