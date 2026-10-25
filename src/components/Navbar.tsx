import React, { useEffect, useState } from 'react';
import { EventData } from '../types';
import { Menu, X, ArrowRight, Sparkles, Calendar, MapPin } from 'lucide-react';

interface NavbarProps {
  currentEvent: EventData;
  onNavigate: (view: 'landing' | 'about-professor' | 'event' | 'dashboard') => void;
  activeView: string;
  onOpenDownloadModal?: () => void;
}

type ViewId = 'landing' | 'about-professor' | 'event' | 'dashboard';

const NAV_ITEMS: { id: ViewId; label: string }[] = [
  { id: 'landing', label: 'The Lecture' },
  { id: 'about-professor', label: 'Professorial Profile' },
  { id: 'event', label: 'RSVP & Digital Pass' },
  { id: 'dashboard', label: 'Secretariat' }
];

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeView,
  onOpenDownloadModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: ViewId) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* 1. Official Institutional Utility Bar (Desktop & Tablet) */}
      <div className="hidden md:block bg-[#022415] text-[#F2E3B3] text-[11px] font-sans border-b border-[#C9A227]/25 tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white tracking-wider uppercase text-[10px]">
              Nasarawa State University, Keffi
            </span>
            <span className="text-[#C9A227]">|</span>
            <span className="text-white/70">Office of the Vice-Chancellor</span>
          </div>

          <div className="flex items-center space-x-4 text-[10px] text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#C9A227]" />
              Wednesday, 25 November 2026 · 2:00 PM
            </span>
            <span className="text-[#C9A227]/40">·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#C9A227]" />
              Assembly Hall, Main Campus
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-[#E3ECE6]'
            : 'bg-white/90 backdrop-blur-sm border-b border-[#E3ECE6]/80'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Official NSUK Crest & Identity */}
          <button
            id="nav-brand"
            onClick={() => go('landing')}
            className="flex items-center gap-3.5 group min-w-0 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A] rounded-lg p-1"
          >
            {/* Real NSUK Crest */}
            <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-[#C9A227]/40 bg-white p-0.5 shadow-xs group-hover:scale-105 transition-transform">
              <img
                src="/images/nsuk-crest.png"
                alt="Nasarawa State University Crest"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#064E2B] font-cinzel leading-none">
                Nasarawa State University, Keffi
              </div>
              <div className="font-serif-luxury font-bold text-base sm:text-lg text-[#0F1F17] leading-tight truncate mt-0.5">
                65th Inaugural Lecture
              </div>
              <div className="text-[10px] text-[#5B6B63] font-medium tracking-wide truncate hidden sm:block">
                Professor Rashidah Funke Olanrewaju
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links (Refined Editorial Style) */}
          <div className="hidden lg:flex items-center gap-1" role="menubar">
            {NAV_ITEMS.map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  role="menuitem"
                  onClick={() => go(item.id)}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider min-h-[44px] inline-flex items-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A] ${
                    active
                      ? 'text-[#064E2B]'
                      : 'text-[#5B6B63] hover:text-[#0F1F17]'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-[#0B6B3A]" />
                  )}
                </button>
              );
            })}

            {onOpenDownloadModal && (
              <button
                id="nav-invitation"
                role="menuitem"
                onClick={onOpenDownloadModal}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider min-h-[44px] inline-flex items-center text-[#5B6B63] hover:text-[#0F1F17] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A]"
              >
                Invitation Card
              </button>
            )}
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              id="nav-cta-rsvp"
              onClick={() => go('event')}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0B6B3A] text-white hover:bg-[#064E2B] border border-[#0B6B3A] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A]"
            >
              <span>Confirm Attendance</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F2E3B3]" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-xl border border-[#E3ECE6] bg-white text-[#0F1F17] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A] cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#E3ECE6] px-4 py-4 space-y-1.5 animate-fade-up shadow-2xl">
            {/* Quick Context in Drawer */}
            <div className="p-3 mb-2 rounded-xl bg-[#F6FAF7] border border-[#E3ECE6] text-xs">
              <div className="font-bold text-[#064E2B] font-cinzel text-[11px] uppercase tracking-wider">
                Nasarawa State University, Keffi
              </div>
              <div className="text-[#5B6B63] mt-0.5 text-[11px]">
                Wed, 25 Nov 2026 · 2:00 PM · Assembly Hall
              </div>
            </div>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider min-h-[44px] flex items-center transition-colors cursor-pointer ${
                  activeView === item.id
                    ? 'bg-[#E7F3EC] text-[#064E2B] border-l-4 border-[#0B6B3A]'
                    : 'text-[#0F1F17] hover:bg-[#F6FAF7]'
                }`}
              >
                {item.label}
              </button>
            ))}

            {onOpenDownloadModal && (
              <button
                onClick={() => {
                  onOpenDownloadModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider min-h-[44px] flex items-center text-[#0F1F17] hover:bg-[#F6FAF7] cursor-pointer"
              >
                Download Official Card
              </button>
            )}

            <div className="pt-2">
              <button
                onClick={() => go('event')}
                className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0B6B3A] text-white flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Confirm Attendance (RSVP)</span>
                <ArrowRight className="w-4 h-4 text-[#F2E3B3]" />
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
