import React, { useEffect, useState, useRef } from 'react';
import { EventData } from '../types';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Search, 
  Command, 
  Download,
  GraduationCap
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';

interface NavbarProps {
  currentEvent: EventData;
  onNavigate: (view: 'landing' | 'about-professor' | 'event' | 'dashboard') => void;
  activeView: string;
  onOpenDownloadModal?: () => void;
}

type ViewId = 'landing' | 'about-professor' | 'event' | 'dashboard';

const NAV_ITEMS: { id: ViewId; label: string; badge?: string }[] = [
  { id: 'landing', label: 'The Lecture' },
  { id: 'about-professor', label: 'Profile' },
  { id: 'event', label: 'RSVP Pass', badge: 'Required' },
  { id: 'dashboard', label: 'Secretariat' }
];

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeView,
  onOpenDownloadModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection: Shrink & Hide on scroll-down, show on scroll-up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past initial threshold
      setScrolled(currentScrollY > 20);

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Keyboard shortcut for Command Palette: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const go = (id: ViewId) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Pill Header Container */}
      <header
        className={`fixed top-0 inset-x-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4 transition-transform duration-300 pointer-events-none ${
          visible ? 'translate-y-0' : '-translate-y-24'
        }`}
      >
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <nav
            aria-label="Main Navigation"
            className={`mx-auto rounded-full transition-all duration-300 border shadow-lg backdrop-blur-xl ${
              scrolled
                ? 'bg-white/90 border-[#C9A227]/30 shadow-xl py-2 px-3 sm:px-4'
                : 'bg-white/85 border-[#E3ECE6] shadow-md py-2.5 px-3 sm:px-5'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              
              {/* Brand Identity / University Crest */}
              <button
                id="nav-brand"
                onClick={() => go('landing')}
                className="flex items-center gap-2.5 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A] rounded-full pr-2"
                aria-label="NSUK 65th Inaugural Lecture Home"
              >
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#C9A227]/40 bg-white p-0.5 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src="/images/nsuk-crest.png"
                    alt="NSUK Crest"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#064E2B] font-cinzel leading-none">
                    NSUK Keffi
                  </div>
                  <div className="font-serif-luxury font-bold text-xs sm:text-sm text-[#0F1F17] leading-tight truncate">
                    65th Inaugural Lecture
                  </div>
                </div>
              </button>

              {/* Desktop Nav Items (Pill-style with animated active state) */}
              <div className="hidden md:flex items-center gap-1 bg-[#F6FAF7] p-1 rounded-full border border-[#E3ECE6]" role="menubar">
                {NAV_ITEMS.map((item) => {
                  const active = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      role="menuitem"
                      onClick={() => go(item.id)}
                      className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A] ${
                        active
                          ? 'bg-[#0B6B3A] text-white shadow-xs font-bold'
                          : 'text-[#47554F] hover:text-[#0F1F17] hover:bg-white/70'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {onOpenDownloadModal && (
                  <button
                    id="nav-proclamation"
                    role="menuitem"
                    onClick={onOpenDownloadModal}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-[#47554F] hover:text-[#0B6B3A] hover:bg-white/70 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3 h-3 text-[#C9A227]" />
                    <span className="hidden lg:inline">Poster</span>
                  </button>
                )}
              </div>

              {/* Right Side: Command Palette Search & Primary CTA */}
              <div className="flex items-center gap-2">
                
                {/* Search / Command Palette Trigger */}
                <button
                  id="nav-search-trigger"
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F6FAF7] border border-[#E3ECE6] hover:border-[#0B6B3A]/40 text-[#47554F] hover:text-[#0F1F17] text-xs font-medium transition-colors cursor-pointer"
                  title="Search & Quick Actions (Ctrl+K)"
                  aria-label="Open Command Palette"
                >
                  <Search className="w-3.5 h-3.5 text-[#0B6B3A]" />
                  <span className="text-[11px] text-[#6B7B73]">Search</span>
                  <kbd className="px-1.5 py-0.2 rounded bg-white border border-gray-200 font-mono text-[9px] text-gray-500">
                    ⌘K
                  </kbd>
                </button>

                {/* Primary CTA Button (1-2 words, verb-first) */}
                <button
                  id="nav-cta-rsvp"
                  onClick={() => go('event')}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0B6B3A] text-white hover:bg-[#064E2B] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A]"
                >
                  <span>RSVP Now</span>
                  <ArrowRight className="w-3 h-3 text-[#F2E3B3]" />
                </button>

                {/* Mobile Hamburger Toggle */}
                <button
                  id="nav-mobile-toggle"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden w-9 h-9 rounded-full bg-[#F6FAF7] border border-[#E3ECE6] text-[#0F1F17] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B3A] cursor-pointer"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>

            </div>
          </nav>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Overlay with Staggered Links */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 bg-[#043A20]/95 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-8 animate-fade-in md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Mobile Overlay Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5">
                <img src="/images/nsuk-crest.png" alt="NSUK Crest" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#E2BE4A] font-cinzel">
                  Nasarawa State University
                </div>
                <div className="font-serif-luxury font-bold text-sm">
                  65th Inaugural Lecture
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Staggered Navigation Links */}
          <div className="space-y-4 py-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#E2BE4A] font-bold">
              Navigation
            </div>
            {NAV_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={`w-full text-left py-3 px-4 rounded-2xl text-lg font-serif-luxury font-bold transition-all flex items-center justify-between cursor-pointer animate-fade-up ${
                  activeView === item.id
                    ? 'bg-[#C9A227] text-[#043A20] shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            ))}

            {onOpenDownloadModal && (
              <button
                onClick={() => {
                  onOpenDownloadModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-2xl text-lg font-serif-luxury font-bold text-white/90 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Official Proclamation Poster</span>
                <Download className="w-4 h-4 text-[#E2BE4A]" />
              </button>
            )}
          </div>

          {/* Mobile Overlay Footer & Direct RSVP */}
          <div className="space-y-4 border-t border-white/10 pt-4">
            <button
              onClick={() => go('event')}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#E2BE4A] to-[#C9A227] text-[#043A20] font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm Attendance (RSVP)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-white/60">
              Wednesday, 25 November 2026 · 2:00 PM · Assembly Hall
            </div>
          </div>
        </div>
      )}

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={go}
        onOpenDownloadModal={onOpenDownloadModal}
      />
    </>
  );
};
