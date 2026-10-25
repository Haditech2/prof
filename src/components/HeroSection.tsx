import React from 'react';
import { EventData } from '../types';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Download,
  Sparkles,
  GraduationCap,
  BookOpen,
  Award
} from 'lucide-react';

interface HeroSectionProps {
  event: EventData;
  onOpenRsvp: () => void;
  onOpenDpGenerator: () => void;
  onReadProfileClick: () => void;
  onDownloadCardClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenRsvp,
  onOpenDpGenerator,
  onReadProfileClick,
  onDownloadCardClick
}) => {
  return (
    <section className="relative overflow-hidden bg-white pt-[68px]">
      {/* Background: soft green wash + dot pattern */}
      <div className="absolute inset-0 nsuk-pattern opacity-70 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[620px] h-[620px] rounded-full bg-[#E7F3EC] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-[420px] h-[420px] rounded-full bg-[#F2E3B3]/40 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-center lg:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-[#E7F3EC] border border-[#0B6B3A]/15 mb-6">
              <span className="px-2 py-0.5 rounded-full bg-[#0B6B3A] text-white text-[10px] font-bold uppercase tracking-wider">
                65th
              </span>
              <span className="text-xs font-semibold text-[#064E2B]">NSUK Inaugural Lecture Series</span>
            </div>

            <h1 className="font-serif-luxury font-bold text-[#0F1F17] leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl">
              Professor Rashidah
              <span className="block text-[#0B6B3A] italic font-semibold">Funke Olanrewaju</span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm font-semibold tracking-wide text-[#5B6B63]">
              Citp, FCRIDE, SMIEEE, MIET, MNCS, MAITP, MIAENG, MWIE, Fellow Erasmus+
            </p>
            <p className="mt-1 text-xs text-[#0B6B3A] font-mono font-bold tracking-wide">
              PhD, MSc.IE, DIS (IIUM), BSc. (Hons.) (UPM) <span className="text-[#C9A227] mx-1">◆</span> Professor of Computer Science &amp; AI
            </p>

            {/* Lecture theme */}
            <div className="mt-8 relative max-w-xl mx-auto lg:mx-0 text-left">
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-[#0B6B3A] to-[#C9A227]" />
              <div className="pl-5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0B6B3A]">
                  <BookOpen className="w-3.5 h-3.5" /> Lecture Theme
                </div>
                <p className="mt-1.5 font-serif-luxury text-xl sm:text-2xl leading-snug text-[#0F1F17] italic font-bold">
                  “INTENTIONAL INTELLIGENCE: From Digital Trust to Human Flourishing”
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                id="hero-rsvp"
                onClick={onOpenRsvp}
                className="btn-green inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
              >
                Reserve Your Seat <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-dp"
                onClick={onOpenDpGenerator}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-white text-[#0B6B3A] border-2 border-[#0B6B3A]/20 hover:border-[#0B6B3A] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#C9A227]" /> Create “I’ll Be There” DP
              </button>
              <button
                id="hero-invite"
                onClick={onDownloadCardClick}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full text-sm font-semibold text-[#5B6B63] hover:text-[#0B6B3A] transition-colors"
              >
                <Download className="w-4 h-4" /> Invitation
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 max-w-lg mx-auto lg:mx-0 divide-x divide-[#E3ECE6]">
              {[
                { v: '20+', l: 'Years in academia' },
                { v: '100+', l: 'Publications' },
                { v: '10k+', l: 'Students mentored' }
              ].map((s) => (
                <div key={s.l} className="px-3 first:pl-0 text-center lg:text-left">
                  <div className="font-serif-luxury text-3xl font-bold text-[#0B6B3A]">{s.v}</div>
                  <div className="text-[11px] text-[#5B6B63] font-medium mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: portrait */}
          <div className="lg:col-span-5 flex justify-center animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative w-full max-w-[380px]">
              {/* Green arch backdrop */}
              <div className="absolute inset-x-6 -top-4 bottom-10 rounded-t-[200px] rounded-b-[36px] bg-gradient-to-br from-[#0B6B3A] to-[#043A20]" />
              <div className="absolute inset-x-6 -top-4 bottom-10 rounded-t-[200px] rounded-b-[36px] nsuk-pattern-light" />

              <div className="relative mx-10 mt-4 rounded-t-[180px] rounded-b-[28px] overflow-hidden border-4 border-white shadow-2xl aspect-[3/4]">
                <img
                  src="/images/prof-rashidah-olanrewaju.jpg"
                  alt="Professor Rashidah Funke Olanrewaju"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Floating chips */}
              <div className="absolute -left-2 top-16 nsuk-card px-4 py-3 flex items-center gap-3 animate-float-soft">
                <div className="w-10 h-10 rounded-xl bg-[#E7F3EC] text-[#0B6B3A] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#5B6B63] font-bold">Director</div>
                  <div className="text-sm font-bold text-[#0F1F17]">EDC, NSUK</div>
                </div>
              </div>

              <div
                className="absolute -right-2 bottom-24 nsuk-card px-4 py-3 flex items-center gap-3 animate-float-soft"
                style={{ animationDelay: '1.5s' }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#FBF4DC] text-[#A8841A] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#5B6B63] font-bold">Fellow</div>
                  <div className="text-sm font-bold text-[#0F1F17]">SMIEEE · FCRIDE</div>
                </div>
              </div>

              <button
                onClick={onReadProfileClick}
                className="relative mt-5 mx-auto flex items-center gap-1.5 text-sm font-semibold text-[#0B6B3A] hover:gap-2.5 transition-all"
              >
                Read full biography <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event details bar */}
      <div className="relative -mt-14 px-4 sm:px-6 lg:px-8 pb-4 z-10">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#0B6B3A] to-[#064E2B] text-white shadow-[0_24px_60px_-20px_rgba(6,78,43,0.6)] p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
            {[
              { icon: Calendar, label: 'Date', value: 'Wed, 25 Nov 2026' },
              { icon: Clock, label: 'Time', value: '2:00 PM prompt' },
              { icon: MapPin, label: 'Venue', value: 'Assembly Hall, Main Campus, NSUK' }
            ].map((d) => (
              <div key={d.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F2E3B3] shrink-0">
                  <d.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-white/60 font-bold">{d.label}</div>
                  <div className="text-sm font-semibold truncate">{d.value}</div>
                </div>
              </div>
            ))}
            <button
              id="hero-bar-rsvp"
              onClick={onOpenRsvp}
              className="btn-gold m-1 rounded-2xl px-5 py-3 text-sm font-bold inline-flex items-center justify-center gap-2"
            >
              RSVP Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
