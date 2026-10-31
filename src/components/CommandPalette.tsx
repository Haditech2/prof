import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  FileText, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Download,
  X 
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'landing' | 'about-professor' | 'event' | 'dashboard') => void;
  onOpenDownloadModal?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Actions' | 'Ceremony';
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenDownloadModal
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'cmd-lecture',
      title: 'The Lecture Overview',
      subtitle: 'Inaugural address topic, proclamation & milestones',
      category: 'Navigation',
      icon: Sparkles,
      action: () => onNavigate('landing')
    },
    {
      id: 'cmd-profile',
      title: 'Professorial Profile & Pedigree',
      subtitle: 'Academic degrees, EDC directorship, and research impact',
      category: 'Navigation',
      icon: User,
      action: () => onNavigate('about-professor')
    },
    {
      id: 'cmd-rsvp',
      title: 'Confirm Attendance (RSVP)',
      subtitle: 'Reserve your formal convocation seat and guest pass',
      category: 'Actions',
      icon: CheckCircle2,
      action: () => onNavigate('event'),
      badge: 'Primary'
    },
    {
      id: 'cmd-dp',
      title: 'Generate Attendee DP Flyer',
      subtitle: 'Create your 9:16 Status & 1:1 square attendee badge',
      category: 'Actions',
      icon: Sparkles,
      action: () => {
        onNavigate('landing');
        setTimeout(() => {
          document.getElementById('dp-generator-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    },
    {
      id: 'cmd-proclamation',
      title: 'Official Proclamation Poster',
      subtitle: 'View and download the high-resolution press flyer',
      category: 'Actions',
      icon: Download,
      action: () => {
        if (onOpenDownloadModal) onOpenDownloadModal();
      }
    },
    {
      id: 'cmd-proceedings',
      title: 'Order of Proceedings',
      subtitle: 'Senate robing, mace entrance, and banquet schedule',
      category: 'Ceremony',
      icon: Clock,
      action: () => {
        onNavigate('landing');
        setTimeout(() => {
          window.scrollTo({ top: 1200, behavior: 'smooth' });
        }, 150);
      }
    },
    {
      id: 'cmd-secretariat',
      title: 'Senate Secretariat Roster',
      subtitle: 'Access guest registry and venue check-in scanner',
      category: 'Navigation',
      icon: ShieldCheck,
      action: () => onNavigate('dashboard')
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div 
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-[#FFFBF2] border border-[#D6A323]/40 shadow-2xl overflow-hidden animate-scale-up text-[#252A2A]"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[#D6A323]/20 bg-[#FFF4DC]/50">
          <Search className="w-4 h-4 text-[#008F87] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a destination or action... (e.g. RSVP, Profile, Flyer)"
            className="w-full pl-3 pr-8 bg-transparent text-sm text-[#252A2A] placeholder-[#252A2A]/50 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs hover:bg-gray-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#252A2A]/60">
              No actions match "<span className="font-semibold text-[#252A2A]">{query}</span>"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#FFF4DC] text-[#006B66]' : 'hover:bg-[#FFF4DC]/40 text-[#252A2A]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#008F87] text-white' : 'bg-[#FFF4DC] text-[#008F87]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate flex items-center gap-2">
                        <span>{cmd.title}</span>
                        {cmd.badge && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-[#D6A323] text-[#003330] px-1.5 py-0.2 rounded">
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#252A2A]/70 truncate">
                        {cmd.subtitle}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-mono tracking-wider shrink-0 ${
                    isSelected ? 'text-[#008F87]' : 'text-gray-400'
                  }`}>
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-[#FFF4DC] border-t border-[#D6A323]/20 flex items-center justify-between text-[11px] text-[#252A2A]/70">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D6A323]/30 font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D6A323]/30 font-mono text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D6A323]/30 font-mono text-[10px]">↵</kbd> to select</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D6A323]/30 font-mono text-[10px]">ESC</kbd> to dismiss</span>
        </div>
      </div>
    </div>
  );
};
