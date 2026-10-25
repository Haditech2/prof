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
import { 
  Sparkles, 
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
          return [parsed];
        }
      } catch {}
    }
    return INITIAL_EVENTS;
  });

  const [rsvps, setRsvps] = useState<RSVPResponse[]>(() => {
    const saved = localStorage.getItem('prof_rashidah_rsvps');
    return saved ? JSON.parse(saved) : INITIAL_RSVPS;
  });

  const [wishes, setWishes] = useState<GuestWish[]>(() => {
    const saved = localStorage.getItem('prof_rashidah_wishes');
    return saved ? JSON.parse(saved) : INITIAL_WISHES;
  });

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

  // Add Wish / Tribute handler
  const handleAddWish = (newWish: GuestWish) => {
    setWishes(prev => [newWish, ...prev]);
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
    <div className="min-h-screen bg-white text-[#0F1F17] flex flex-col font-sans-modern">
      
      {/* Top Navbar */}
      <Navbar
        currentEvent={currentEvent}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeView={activeView}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <div>
            {/* 1. Hero */}
            <HeroSection
              event={currentEvent}
              onOpenRsvp={() => {
                setActiveView('event');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDpGenerator={() => {
                const el = document.getElementById('dp-generator-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onReadProfileClick={() => {
                setActiveView('about-professor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDownloadCardClick={() => setIsDownloadModalOpen(true)}
            />

            {/* 2. Countdown band */}
            <section className="px-4 sm:px-6 lg:px-8 py-16">
              <div className="max-w-6xl mx-auto rounded-[32px] bg-gradient-to-br from-[#0B6B3A] via-[#085A31] to-[#043A20] text-white overflow-hidden relative">
                <div className="absolute inset-0 nsuk-pattern-light pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#C9A227]/20 blur-3xl pointer-events-none" />
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-12">
                  <div className="lg:col-span-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F2E3B3]">
                      <Clock className="w-4 h-4" /> Countdown
                    </div>
                    <h2 className="mt-2 font-serif-luxury text-3xl md:text-4xl font-bold leading-tight">
                      The Senate assembles soon.
                    </h2>
                    <p className="mt-2 text-sm text-white/70">Wednesday, 25 November 2026 · 2:00 PM</p>
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
            <section className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <span className="nsuk-kicker">The Discourse</span>
                    <h2 className="mt-3 font-serif-luxury text-4xl md:text-5xl font-bold text-[#0F1F17] leading-tight">
                      Four pillars of the lecture
                    </h2>
                  </div>
                  <p className="text-sm text-[#5B6B63] max-w-sm">
                    Two decades of research, distilled into one inaugural address.
                  </p>
                </div>

                {/* NURA-X Flagship Feature Box */}
                <div className="rounded-3xl bg-gradient-to-br from-[#064E2B] via-[#043A20] to-[#0B6B3A] p-6 sm:p-8 text-white relative overflow-hidden border border-[#C9A227]/40 shadow-xl">
                  <div className="absolute inset-0 nsuk-pattern-light opacity-30 pointer-events-none" />
                  <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-3 flex justify-center">
                      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#C9A227] via-white to-[#DFC79B] shadow-2xl">
                        <img
                          src="/images/nura-x-intentional-intelligence.jpg"
                          alt="NURA-X Intentional Intelligence Emblem"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-9 space-y-2 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/20 text-[#F2E3B3] text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-[#C9A227]/30">
                        <Sparkles className="w-3.5 h-3.5 text-[#E2BE4A]" /> Flagship AI Initiative · Inaugural Address
                      </div>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold leading-tight">
                        NURA-X: Intentional Intelligence
                      </h3>
                      <p className="text-sm text-white/85 max-w-2xl leading-relaxed">
                        A sovereign paradigm conceived by Professor Rashidah Funke Olanrewaju to anchor artificial intelligence in digital trust, algorithmic integrity, and human flourishing across Nigerian and African institutions.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#F2E3B3] font-medium justify-center md:justify-start">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#E2BE4A]" /> Digital Trust &amp; Cryptology</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#E2BE4A]" /> Neural Vision &amp; Language</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#E2BE4A]" /> Human-Centric AI Policy</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { icon: Cpu, title: 'Applied AI & Neural Systems', desc: 'Machine learning and vision built for African realities.' },
                    { icon: Lock, title: 'Cyber Resiliency', desc: 'Cryptography and FinTech security for national infrastructure.' },
                    { icon: Award, title: 'Software Engineering', desc: 'High-integrity systems and industry tech transfer.' },
                    { icon: Users, title: 'EDC & Women in STEM', desc: 'Incubating startups and mentoring the next generation.' }
                  ].map((pillar, idx) => (
                    <div key={idx} className="nsuk-card nsuk-card-hover p-6 group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#E7F3EC] text-[#0B6B3A] flex items-center justify-center group-hover:bg-[#0B6B3A] group-hover:text-white transition-colors">
                          <pillar.icon className="w-6 h-6" />
                        </div>
                        <span className="font-serif-luxury text-3xl font-bold text-[#E3ECE6] group-hover:text-[#C9A227] transition-colors">
                          0{idx + 1}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#0F1F17] text-base">{pillar.title}</h3>
                      <p className="mt-2 text-sm text-[#5B6B63] leading-relaxed">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Biography spotlight with Interactive Portrait Gallery */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F6FAF7] relative overflow-hidden">
              <div className="absolute inset-0 nsuk-pattern opacity-50 pointer-events-none" />
              <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Interactive Portrait Frame */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-full max-w-[340px]">
                    <div className="absolute -inset-3 rounded-[32px] border-2 border-dashed border-[#0B6B3A]/25" />
                    
                    {/* Active Portrait */}
                    <div className="relative rounded-[28px] overflow-hidden shadow-2xl aspect-[4/5] bg-white">
                      <img
                        src={[
                          '/images/prof-rashidah-executive-desk.jpg',
                          '/images/prof-rashidah-courtyard-regalia.jpg',
                          '/images/prof-rashidah-garden-portrait.jpg',
                          '/images/prof-rashidah-olanrewaju.jpg',
                          '/images/inaugural-lecture-flyer-portrait.jpg'
                        ][spotlightPhotoIdx]}
                        alt="Professor Rashidah Funke Olanrewaju"
                        className="w-full h-full object-cover object-top transition-all duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#043A20]/90 to-transparent text-white">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#F2E3B3] font-bold">
                          {[
                            'Director at Executive Desk · EDC',
                            'Senate Courtyard Regalia',
                            'Main Campus Garden',
                            'Official Academic Robes',
                            'Official Proclamation Poster'
                          ][spotlightPhotoIdx]}
                        </div>
                        <div className="font-serif-luxury text-lg font-bold">Prof. R. F. Olanrewaju</div>
                      </div>
                    </div>

                    {/* Thumbnail Switcher Pills */}
                    <div className="mt-4 flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E3ECE6] shadow-xs">
                      {[
                        { url: '/images/prof-rashidah-executive-desk.jpg', label: 'Executive Office' },
                        { url: '/images/prof-rashidah-courtyard-regalia.jpg', label: 'Courtyard' },
                        { url: '/images/prof-rashidah-garden-portrait.jpg', label: 'Garden' },
                        { url: '/images/prof-rashidah-olanrewaju.jpg', label: 'Robes' },
                        { url: '/images/inaugural-lecture-flyer-portrait.jpg', label: 'Flyer' }
                      ].map((item, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => setSpotlightPhotoIdx(pIdx)}
                          title={item.label}
                          className={`relative w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            spotlightPhotoIdx === pIdx
                              ? 'border-[#0B6B3A] ring-2 ring-[#C9A227]/50 scale-105'
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
                <div className="lg:col-span-7">
                  <span className="nsuk-kicker">Academic Citation</span>
                  <h2 className="mt-3 font-serif-luxury text-4xl md:text-5xl font-bold text-[#0F1F17] leading-tight">
                    A leading voice in AI, software &amp; cryptology.
                  </h2>
                  <p className="mt-4 text-[15px] text-[#5B6B63] leading-relaxed max-w-xl">
                    Professor of Computer Science &amp; AI at NSUK. Trained at Fed Poly Kaduna (Diploma), UPM Malaysia (B.Sc. Hons) and IIUM Malaysia (M.Sc., Ph.D.). Director of the Entrepreneurship Development Centre (EDC).
                  </p>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { k: 'Pedigree', v: 'Ph.D. Computer Eng.', s: 'IIUM, Malaysia' },
                      { k: 'Leadership', v: 'Director, EDC', s: '10,000+ students' },
                      { k: 'Distinction', v: 'FCRIDE · SMIEEE', s: 'Chartered Fellow' }
                    ].map((c) => (
                      <div key={c.k} className="nsuk-card p-4">
                        <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#C9A227]">{c.k}</div>
                        <div className="mt-1 font-bold text-[#0F1F17] text-sm">{c.v}</div>
                        <div className="text-xs text-[#5B6B63]">{c.s}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      id="bio-full-profile"
                      onClick={() => {
                        setActiveView('about-professor');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="btn-green inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
                    >
                      Full Profile &amp; Pedigree <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      id="bio-invitation"
                      onClick={() => setIsDownloadModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white border border-[#E3ECE6] text-[#0F1F17] hover:border-[#0B6B3A] transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#0B6B3A]" /> Official Proclamation Poster
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Order of proceedings — timeline */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <span className="nsuk-kicker justify-center">Ceremonial Protocol</span>
                  <h2 className="mt-3 font-serif-luxury text-4xl md:text-5xl font-bold text-[#0F1F17]">Order of proceedings</h2>
                </div>

                <div className="relative">
                  <div className="absolute left-[27px] md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#0B6B3A] via-[#C9A227] to-[#0B6B3A] md:-translate-x-1/2" />
                  <div className="space-y-6">
                    {[
                      { time: '13:15', title: 'Academic Senate Robing & Procession', location: 'Senate Chamber to Assembly Hall' },
                      { time: '13:45', title: 'Arrival & Seating of Dignitaries', location: 'Assembly Hall Sanctuary' },
                      { time: '14:00', title: 'Anthems & Constitution of Assembly', location: 'Assembly Hall Podium' },
                      { time: '14:20', title: 'Reading of Academic Citation', location: 'Podium of Honour' },
                      { time: '14:35', title: '65th Inaugural Lecture Delivery', location: 'Assembly Hall Lectern' },
                      { time: '15:50', title: 'Formal Admission & Plaque Presentation', location: 'High Table Dais' },
                      { time: '16:30', title: 'Inaugural Banquet & Academic Reception', location: 'University Banquet Pavilion' }
                    ].map((item, index) => {
                      const left = index % 2 === 0;
                      return (
                        <div key={index} className="relative flex md:items-center">
                          <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-full bg-white border-2 border-[#0B6B3A] flex items-center justify-center text-[11px] font-bold text-[#0B6B3A] shadow-md z-10">
                            {item.time}
                          </div>
                          <div className={`pl-20 md:pl-0 w-full md:w-1/2 ${left ? 'md:pr-14 md:text-right' : 'md:ml-auto md:pl-14'}`}>
                            <div className={`nsuk-card nsuk-card-hover px-5 py-4 ${index === 3 ? 'border-[#0B6B3A] bg-[#E7F3EC]' : ''}`}>
                              <h3 className="font-bold text-[#0F1F17]">{item.title}</h3>
                              <div className={`mt-1 text-xs text-[#5B6B63] flex items-center gap-1 ${left ? 'md:justify-end' : ''}`}>
                                <MapPin className="w-3 h-3 text-[#C9A227]" /> {item.location}
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

            {/* 6. DP flyer generator */}
            <section id="dp-generator-section" className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto rounded-[32px] bg-gradient-to-br from-[#064E2B] to-[#043A20] text-white p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute inset-0 nsuk-pattern-light pointer-events-none" />
                <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-[#0B6B3A] blur-3xl opacity-60 pointer-events-none" />
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 text-center lg:text-left space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/20 text-[#F2E3B3] text-[11px] font-bold uppercase tracking-[0.16em]">
                      <Sparkles className="w-3.5 h-3.5 text-[#E2BE4A]" /> Official DP Flyer Studio
                    </div>
                    <h2 className="font-serif-luxury text-4xl md:text-5xl font-bold leading-tight">
                      Tell everyone <br /><span className="text-[#E2BE4A] italic">“I’ll Be There!”</span>
                    </h2>
                    <p className="text-sm text-white/75 leading-relaxed max-w-md mx-auto lg:mx-0">
                      Generate your verified Inaugural Lecture attendee flyer. Personalize your portrait, select your university title, and download in Ultra-HD for WhatsApp Status, LinkedIn &amp; Instagram.
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-2.5 pt-2 text-left max-w-sm mx-auto lg:mx-0 text-xs text-white/90">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E2BE4A] shrink-0" />
                        <span><strong>Instant Retina Export:</strong> 1:1 DP &amp; 9:16 Status</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E2BE4A] shrink-0" />
                        <span><strong>3 Luxury Themes:</strong> Emerald, Ivory &amp; Obsidian</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E2BE4A] shrink-0" />
                        <span><strong>One-Tap Sharing:</strong> Direct to WhatsApp Status</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-3">
                      <button
                        id="dp-confirm-rsvp"
                        onClick={() => {
                          setActiveView('event');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
                      >
                        Confirm RSVP Pass <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex justify-center">
                    <IWillBeThereBanner
                      event={currentEvent}
                      rsvp={homepageFlyerRsvp}
                      defaultRatio="story"
                      onUpdatePhoto={(newPhoto) => {
                        setHomepageFlyerRsvp(prev => ({ ...prev, photoUrl: newPhoto }));
                      }}
                      onSuccessToast={(msg) => setToastMessage(msg)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Attendees + Tributes */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Attendees */}
                <div className="lg:col-span-7">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <span className="nsuk-kicker">Public Registry</span>
                      <h2 className="mt-3 font-serif-luxury text-3xl md:text-4xl font-bold text-[#0F1F17]">Who’s attending</h2>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F3EC] text-[#0B6B3A] text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {currentEventRsvps.length} confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentEventRsvps.slice(0, 6).map((rsvp) => (
                      <div key={rsvp.id} className="nsuk-card nsuk-card-hover p-3.5 flex items-center gap-3">
                        <img
                          src={rsvp.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                          alt={rsvp.fullName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E7F3EC] shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[#0F1F17] truncate">{rsvp.fullName}</h3>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8841A] bg-[#FBF4DC] px-2 py-0.5 rounded-full">
                              {rsvp.groupCategory || 'Guest'}
                            </span>
                            <span className="text-[11px] text-[#0B6B3A] font-semibold">Attending</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    id="attendees-confirm"
                    onClick={() => {
                      setActiveView('event');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-6 btn-green inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
                  >
                    Add your name <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Tributes */}
                <div className="lg:col-span-5">
                  <div className="rounded-[28px] bg-[#F6FAF7] border border-[#E3ECE6] p-6 md:p-7 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-serif-luxury text-2xl font-bold text-[#0F1F17] flex items-center gap-2">
                        <Heart className="w-5 h-5 text-[#C9A227] fill-[#C9A227]" /> Tributes
                      </h3>
                      <button
                        onClick={() => {
                          setActiveView('about-professor');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-semibold text-[#0B6B3A] hover:underline"
                      >
                        View all →
                      </button>
                    </div>

                    <form onSubmit={handleInlineTributeSubmit} className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          id="tribute-name"
                          type="text"
                          placeholder="Your name"
                          value={inlineAuthor}
                          onChange={(e) => setInlineAuthor(e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#E3ECE6] bg-white text-sm focus:outline-none focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10"
                          required
                        />
                        <input
                          id="tribute-role"
                          type="text"
                          placeholder="Role (optional)"
                          value={inlineRole}
                          onChange={(e) => setInlineRole(e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#E3ECE6] bg-white text-sm focus:outline-none focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10"
                        />
                      </div>
                      <div className="relative">
                        <textarea
                          id="tribute-message"
                          rows={2}
                          placeholder="A short message for Prof. Rashidah…"
                          value={inlineMessage}
                          onChange={(e) => setInlineMessage(e.target.value)}
                          className="w-full px-3.5 py-2.5 pr-14 rounded-xl border border-[#E3ECE6] bg-white text-sm focus:outline-none focus:border-[#0B6B3A] focus:ring-4 focus:ring-[#0B6B3A]/10 resize-none"
                          required
                        />
                        <button
                          id="tribute-submit"
                          type="submit"
                          aria-label="Post tribute"
                          className="absolute right-2 bottom-3 w-9 h-9 rounded-lg btn-green flex items-center justify-center"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>

                    <div className="mt-5 space-y-3 overflow-y-auto max-h-[340px] pr-1">
                      {currentEventWishes.map((w) => (
                        <div key={w.id} className="bg-white rounded-2xl border border-[#E3ECE6] p-4">
                          <p className="text-sm text-[#0F1F17] leading-relaxed">“{w.message}”</p>
                          <div className="mt-2 text-xs font-bold text-[#0B6B3A]">— {w.author}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Gallery */}
            <section className="pb-24 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="nsuk-kicker">Gallery</span>
                    <h2 className="mt-3 font-serif-luxury text-3xl md:text-4xl font-bold text-[#0F1F17]">Moments of distinction</h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentEvent.gallery.map((img, i) => (
                    <div
                      key={img.id}
                      className={`group relative rounded-3xl overflow-hidden bg-[#E7F3EC] ${i === 0 ? 'lg:row-span-2 lg:col-span-2 aspect-square lg:aspect-auto' : 'aspect-square'}`}
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#043A20]/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm font-semibold text-white">{img.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
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

      {/* Floating Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

    </div>
  );
}

export default App;
