import React, { useEffect, useState } from 'react';
import { EventData } from '../types';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentEvent: EventData;
  onNavigate: (view: 'landing' | 'about-professor' | 'event' | 'dashboard') => void;
  activeView: string;
  onOpenDownloadModal?: () => void;
}

type ViewId = 'landing' | 'about-professor' | 'event' | 'dashboard';

const NAV_ITEMS: { id: ViewId; label: string }[] = [
  { id: 'landing', label: 'Lecture' },
  { id: 'about-professor', label: 'Profile' },
  { id: 'event', label: 'RSVP & Pass' },
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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: ViewId) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-[#E3ECE6] shadow-[0_6px_24px_-12px_rgba(6,78,43,0.25)]'
          : 'bg-white/70 backdrop-blur-md border-b border-transparent'
      }`}
    >
      {/* NSUK tricolour hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0B6B3A] via-[#C9A227] to-[#0B6B3A]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          id="nav-brand"
          onClick={() => go('landing')}
          className="flex items-center gap-3 group min-w-0 text-left"
        >
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#0B6B3A] to-[#043A20] flex items-center justify-center text-[#F2E3B3] font-serif-luxury font-bold text-sm tracking-wide shadow-md ring-2 ring-[#C9A227]/40 group-hover:scale-105 transition-transform">
            RFO
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-serif-luxury font-bold text-[17px] text-[#0F1F17] truncate">
              Prof. Rashidah F. Olanrewaju
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#0B6B3A] font-semibold truncate">
              Inaugural Lecture · NSUK
            </div>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => go(item.id)}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  active ? 'text-[#0B6B3A]' : 'text-[#5B6B63] hover:text-[#0F1F17] hover:bg-[#F6FAF7]'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute left-4 right-4 -bottom-[1px] h-[2px] rounded-full bg-[#0B6B3A]" />
                )}
              </button>
            );
          })}
          {onOpenDownloadModal && (
            <button
              id="nav-invitation"
              onClick={onOpenDownloadModal}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-[#5B6B63] hover:text-[#0F1F17] hover:bg-[#F6FAF7] transition-colors"
            >
              Invitation
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <button
            id="nav-cta-rsvp"
            onClick={() => go('event')}
            className="hidden sm:inline-flex btn-green items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
          >
            Confirm Attendance
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="nav-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl border border-[#E3ECE6] bg-white flex items-center justify-center text-[#0F1F17]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E3ECE6] px-4 py-4 space-y-1 animate-fade-up shadow-xl">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeView === item.id ? 'bg-[#E7F3EC] text-[#0B6B3A]' : 'text-[#0F1F17] hover:bg-[#F6FAF7]'
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
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-[#0F1F17] hover:bg-[#F6FAF7]"
            >
              Download Invitation
            </button>
          )}
          <button
            onClick={() => go('event')}
            className="w-full mt-2 btn-green py-3 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2"
          >
            Confirm Attendance <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </nav>
  );
};
