import React, { useState, useRef, useEffect } from 'react';
import { EventData, EventCategory, FontPreset, PhotoFrameShape, PhotoFilter, BorderStyle, CountdownStyle, ScheduleItem } from '../types';
import { PRESET_THEMES, AI_TEXT_PRESETS } from '../data/mockData';
import { InvitationCard } from './InvitationCard';
import { 
  Sparkles, 
  Upload, 
  Undo2, 
  Redo2, 
  RotateCcw, 
  Download, 
  ExternalLink, 
  Image as ImageIcon, 
  Palette, 
  Type, 
  Clock, 
  ListPlus, 
  Wand2, 
  Eye, 
  Check, 
  Trash2,
  Sliders,
  ZoomIn
} from 'lucide-react';

interface InvitationStudioProps {
  currentEvent: EventData;
  onUpdateEvent: (updated: EventData) => void;
  onOpenDownloadModal: () => void;
  onViewLiveEvent: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const InvitationStudio: React.FC<InvitationStudioProps> = ({
  currentEvent,
  onUpdateEvent,
  onOpenDownloadModal,
  onViewLiveEvent,
  onSuccessToast
}) => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<'details' | 'design' | 'photo' | 'ai' | 'schedule'>('details');
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');
  const [previewRatio, setPreviewRatio] = useState<'portrait' | 'story' | 'square'>('portrait');
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Undo / Redo history
  const [history, setHistory] = useState<EventData[]>([currentEvent]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample curated portrait photos
  const samplePhotos = [
    { label: 'Prof. Rashidah Official Academic Portrait', url: '/images/prof-rashidah-olanrewaju.jpg' },
    { label: 'Senate Assembly & Symposia', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80' },
    { label: 'Women in AI & Robotics Lab', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80' },
    { label: 'Auditorium Podium of Honor', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' }
  ];

  // Helper to commit state with history tracking
  const updateEventState = (updater: (prev: EventData) => EventData) => {
    const next = updater(currentEvent);
    onUpdateEvent(next);
    
    // Add to history
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(next);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);

    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 600);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onUpdateEvent(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onUpdateEvent(next);
    }
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPEG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('Image file size exceeds 15MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updateEventState(prev => ({
        ...prev,
        photoUrl: base64
      }));
      if (onSuccessToast) onSuccessToast('Photograph uploaded and applied!');
    };
    reader.readAsDataURL(file);
  };

  // Preset Theme selection
  const applyPresetTheme = (themeId: string) => {
    const theme = PRESET_THEMES.find(t => t.id === themeId);
    if (!theme) return;

    updateEventState(prev => ({
      ...prev,
      themeId: theme.id,
      fontPreset: theme.fontPreset,
      accentColor: theme.accentColor,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      borderStyle: theme.borderStyle,
      photoFrame: theme.photoFrame,
      photoFilter: theme.photoFilter
    }));

    if (onSuccessToast) onSuccessToast(`Theme "${theme.name}" applied!`);
  };

  // Add Schedule Item
  const addScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: `sch-${Date.now()}`,
      time: '18:00',
      title: 'New Programme Session',
      location: 'Reception Hall',
      description: 'Session description and highlights'
    };
    updateEventState(prev => ({
      ...prev,
      schedule: [...prev.schedule, newItem]
    }));
  };

  // Remove Schedule Item
  const removeScheduleItem = (id: string) => {
    updateEventState(prev => ({
      ...prev,
      schedule: prev.schedule.filter(item => item.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-[#F6FAF7] pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Studio Top Control Bar */}
        <div className="mb-6 p-4 rounded-3xl bg-white border border-[#C9A227]/30 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B6B3A] text-white flex items-center justify-center font-serif-luxury font-bold text-lg">
              ❦
            </div>
            <div>
              <h2 className="text-lg font-serif-luxury font-bold text-[#0F1F17]">
                Invitation Creation Studio
              </h2>
              <div className="flex items-center space-x-2 text-xs text-[#0F1F17]/60">
                <span>Editing: <strong>{currentEvent.celebrants}</strong></span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-emerald-700">
                  <Check className="w-3 h-3" />
                  <span>{isSaved ? 'Autosaved' : 'Saving...'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* History Controls & Action CTAs */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo change"
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-all"
            >
              <Undo2 className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo change"
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-all"
            >
              <Redo2 className="w-4 h-4 text-gray-700" />
            </button>

            {/* Mobile View Toggle */}
            <div className="lg:hidden flex items-center border border-[#C9A227]/40 rounded-xl overflow-hidden p-0.5 bg-gray-50">
              <button
                onClick={() => setMobileMode('edit')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  mobileMode === 'edit' ? 'bg-[#0B6B3A] text-white' : 'text-gray-700'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setMobileMode('preview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  mobileMode === 'preview' ? 'bg-[#0B6B3A] text-white' : 'text-gray-700'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Download Invitation Card Button */}
            <button
              onClick={onOpenDownloadModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#DFC79B] text-[#0B6B3A] font-semibold text-xs uppercase tracking-wider shadow-sm hover:brightness-105 transition-all flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Card</span>
            </button>

            {/* Preview Published Page */}
            <button
              onClick={onViewLiveEvent}
              className="px-4 py-2 rounded-xl bg-[#0B6B3A] text-white font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-[#064E2B] transition-all flex items-center space-x-1.5"
            >
              <span>View Event Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
            </button>
          </div>
        </div>

        {/* Split Screen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Editing Controls Tabs */}
          <div className={`lg:col-span-7 space-y-6 ${mobileMode === 'preview' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#C9A227]/20">
              {[
                { id: 'details', label: '1. Event Details', icon: Type },
                { id: 'design', label: '2. Themes & Typography', icon: Palette },
                { id: 'photo', label: '3. Photo & Framing', icon: ImageIcon },
                { id: 'ai', label: '4. AI Copywriter', icon: Wand2 },
                { id: 'schedule', label: '5. Programme Schedule', icon: ListPlus }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[#0B6B3A] text-white shadow-sm'
                        : 'bg-white text-[#0F1F17]/70 border border-[#C9A227]/20 hover:border-[#C9A227]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: EVENT DETAILS */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#C9A227]/30 shadow-xs space-y-6 animate-fade-in">
                <div className="border-b pb-4">
                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F17]">
                    Occasion Details & Welcoming
                  </h3>
                  <p className="text-xs text-[#0F1F17]/60">
                    Define the hosts, celebrants, dates, venue, and dress code for your guests.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Event Category
                    </label>
                    <select
                      value={currentEvent.category}
                      onChange={(e) => updateEventState(prev => ({ ...prev, category: e.target.value as EventCategory }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    >
                      <option value="inaugural">Inaugural Professorial Lecture</option>
                      <option value="corporate">Academic & Senate Convocations</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={currentEvent.slug}
                      onChange={(e) => updateEventState(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-hidden focus:border-[#C9A227]"
                      placeholder="e.g. amina-and-yusuf"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Celebrant or Couple Names (Hero Title)
                    </label>
                    <input
                      type="text"
                      value={currentEvent.celebrants}
                      onChange={(e) => updateEventState(prev => ({ ...prev, celebrants: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-serif-luxury font-bold text-lg focus:outline-hidden focus:border-[#C9A227]"
                      placeholder="e.g. Amina Bello & Yusuf Ibrahim"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Hosts / Inviting Families
                    </label>
                    <input
                      type="text"
                      value={currentEvent.hosts}
                      onChange={(e) => updateEventState(prev => ({ ...prev, hosts: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                      placeholder="e.g. Alhaji & Hajia Bello / Dr. & Mrs. Ibrahim"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={currentEvent.date}
                      onChange={(e) => updateEventState(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Start & End Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={currentEvent.startTime}
                        onChange={(e) => updateEventState(prev => ({ ...prev, startTime: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                      />
                      <input
                        type="time"
                        value={currentEvent.endTime}
                        onChange={(e) => updateEventState(prev => ({ ...prev, endTime: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Timezone
                    </label>
                    <select
                      value={currentEvent.timezone}
                      onChange={(e) => updateEventState(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    >
                      <option value="Africa/Lagos (GMT+1)">Africa/Lagos (GMT+1)</option>
                      <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                      <option value="America/New_York (EST)">America/New_York (EST)</option>
                      <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                      <option value="Asia/Dubai (GST)">Asia/Dubai (GST)</option>
                      <option value="Asia/Riyadh (AST)">Asia/Riyadh (AST)</option>
                      <option value="Europe/Paris (CET)">Europe/Paris (CET)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      RSVP Deadline
                    </label>
                    <input
                      type="date"
                      value={currentEvent.rsvpDeadline}
                      onChange={(e) => updateEventState(prev => ({ ...prev, rsvpDeadline: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={currentEvent.venueName}
                      onChange={(e) => updateEventState(prev => ({ ...prev, venueName: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                      placeholder="e.g. The Grand St. Regis Palace, Grand Ballroom"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Full Venue Address
                    </label>
                    <input
                      type="text"
                      value={currentEvent.address}
                      onChange={(e) => updateEventState(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                      placeholder="e.g. Victoria Island, Lagos, Nigeria"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Dress Code
                    </label>
                    <input
                      type="text"
                      value={currentEvent.dressCode}
                      onChange={(e) => updateEventState(prev => ({ ...prev, dressCode: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                      placeholder="e.g. Strictly Black Tie with Champagne Gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Contact Phone / Concierge
                    </label>
                    <input
                      type="text"
                      value={currentEvent.contactPhone}
                      onChange={(e) => updateEventState(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227]"
                      placeholder="e.g. +234 803 123 4567"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Event Description / Invitation Wording
                    </label>
                    <textarea
                      rows={3}
                      value={currentEvent.description}
                      onChange={(e) => updateEventState(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#C9A227] leading-relaxed"
                      placeholder="Write your personal message to guests..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: THEMES & TYPOGRAPHY */}
            {activeTab === 'design' && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#C9A227]/30 shadow-xs space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F17]">
                    Curated Themes & Editorial Styling
                  </h3>
                  <p className="text-xs text-[#0F1F17]/60">
                    Switch entire palettes or customize fonts, borders, and colors individually.
                  </p>
                </div>

                {/* Preset Themes Grid */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-2">
                    Apply Signature Theme Preset
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESET_THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => applyPresetTheme(theme.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          currentEvent.themeId === theme.id
                            ? 'border-[#0B6B3A] ring-2 ring-[#C9A227] shadow-md bg-[#F6FAF7]'
                            : 'border-gray-200 hover:border-[#C9A227]/50 bg-white'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-2 border border-black/10 flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
                        >
                          Aa
                        </div>
                        <div className="text-xs font-bold text-[#0F1F17] truncate">{theme.name}</div>
                        <div className="text-[10px] text-[#C9A227] uppercase tracking-wider mt-0.5">{theme.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography Font Picker */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-2">
                    Primary Serif & Calligraphy Font
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'serif-luxury', name: 'Cormorant Luxury', fontClass: 'font-serif-luxury' },
                      { id: 'playfair', name: 'Playfair Display', fontClass: 'font-playfair' },
                      { id: 'cinzel', name: 'Cinzel Regal', fontClass: 'font-cinzel' },
                      { id: 'script', name: 'Great Vibes Script', fontClass: 'font-script' },
                      { id: 'arabic', name: 'Amiri Arabic Calligraphy', fontClass: 'font-serif-luxury' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => updateEventState(prev => ({ ...prev, fontPreset: f.id as FontPreset }))}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          currentEvent.fontPreset === f.id
                            ? 'border-[#0B6B3A] bg-[#0B6B3A] text-white shadow-xs'
                            : 'border-gray-200 bg-white text-gray-800 hover:border-[#C9A227]'
                        }`}
                      >
                        <span className={`text-base block ${f.fontClass}`}>Elegance</span>
                        <span className="text-[10px] opacity-80 uppercase tracking-wider block mt-1">
                          {f.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Decorative Border Ornament */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-2">
                    Decorative Border Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'ornate-gold', name: 'Ornate Gold Leaf' },
                      { id: 'arabesque', name: 'Islamic Arabesque' },
                      { id: 'botanical-leaf', name: 'Botanical Leaf' },
                      { id: 'minimal-double', name: 'Minimal Double' }
                    ].map(b => (
                      <button
                        key={b.id}
                        onClick={() => updateEventState(prev => ({ ...prev, borderStyle: b.id as BorderStyle }))}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                          currentEvent.borderStyle === b.id
                            ? 'border-[#0B6B3A] bg-[#F6FAF7] text-[#0B6B3A] ring-1 ring-[#0B6B3A]'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Customizer */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={currentEvent.backgroundColor}
                        onChange={(e) => updateEventState(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={currentEvent.backgroundColor}
                        onChange={(e) => updateEventState(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Text Primary Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={currentEvent.textColor}
                        onChange={(e) => updateEventState(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={currentEvent.textColor}
                        onChange={(e) => updateEventState(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-1">
                      Gold Accent Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={currentEvent.accentColor}
                        onChange={(e) => updateEventState(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={currentEvent.accentColor}
                        onChange={(e) => updateEventState(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Countdown Style Selector */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-2">
                    Embedded Countdown Timer Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'editorial', name: 'Editorial Serif' },
                      { id: 'gold-luxe', name: 'Gold Luxe Digital' },
                      { id: 'circular', name: 'Circular Minimal' },
                      { id: 'flip', name: 'Flip Clock' },
                      { id: 'glass', name: 'Frosted Glass' },
                      { id: 'banner', name: 'Velvet Banner' }
                    ].map(cs => (
                      <button
                        key={cs.id}
                        onClick={() => updateEventState(prev => ({ ...prev, countdownStyle: cs.id as CountdownStyle }))}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          currentEvent.countdownStyle === cs.id
                            ? 'border-[#0B6B3A] bg-[#0B6B3A] text-white shadow-xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#C9A227]'
                        }`}
                      >
                        {cs.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PHOTO & FRAMING */}
            {activeTab === 'photo' && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#C9A227]/30 shadow-xs space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F17]">
                    Portrait Photography & Framing
                  </h3>
                  <p className="text-xs text-[#0F1F17]/60">
                    Upload your high-resolution portrait or select a sample image to test shapes and filters.
                  </p>
                </div>

                {/* Upload Zone */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-2">
                    Upload Your Own Photograph
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#C9A227]/50 hover:border-[#C9A227] rounded-2xl p-6 text-center bg-[#F6FAF7]/50 hover:bg-[#F6FAF7] transition-colors cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-[#C9A227]" />
                    <span className="text-sm font-semibold text-[#0B6B3A]">
                      Click to upload photo or drag & drop
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Supports JPG, PNG, WEBP up to 15MB • Mobile camera direct upload supported
                    </span>
                  </div>
                </div>

                {/* Quick Sample Gallery */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-2">
                    Or Choose from Editorial Sample Portraits
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {samplePhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateEventState(prev => ({ ...prev, photoUrl: photo.url }))}
                        className={`relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all ${
                          currentEvent.photoUrl === photo.url
                            ? 'border-[#0B6B3A] ring-2 ring-[#C9A227]'
                            : 'border-transparent hover:opacity-90'
                        }`}
                      >
                        <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Shapes */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-2">
                    Artistic Frame Geometry
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { id: 'arch', name: 'Royal Arch' },
                      { id: 'oval', name: 'Cameo Oval' },
                      { id: 'medallion', name: 'Medallion' },
                      { id: 'rounded', name: 'Curved Soft' },
                      { id: 'square-gold', name: 'Gold Border' },
                      { id: 'full', name: 'Full Bleed' }
                    ].map(frame => (
                      <button
                        key={frame.id}
                        onClick={() => updateEventState(prev => ({ ...prev, photoFrame: frame.id as PhotoFrameShape }))}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          currentEvent.photoFrame === frame.id
                            ? 'border-[#0B6B3A] bg-[#0B6B3A] text-white shadow-xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#C9A227]'
                        }`}
                      >
                        <span className="text-[11px] font-semibold">{frame.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Filters */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0B6B3A] block mb-2">
                    Editorial Film Filter
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: 'natural', name: 'Natural Crisp' },
                      { id: 'champagne', name: 'Champagne Warm' },
                      { id: 'vintage', name: 'Sepia Vintage' },
                      { id: 'editorial-bw', name: 'Noir & Blanc' },
                      { id: 'emerald', name: 'Emerald Velvet' }
                    ].map(flt => (
                      <button
                        key={flt.id}
                        onClick={() => updateEventState(prev => ({ ...prev, photoFilter: flt.id as PhotoFilter }))}
                        className={`py-2 px-2 rounded-xl border text-center transition-all ${
                          currentEvent.photoFilter === flt.id
                            ? 'border-[#0B6B3A] bg-[#F6FAF7] text-[#0B6B3A] font-bold ring-1 ring-[#0B6B3A]'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-[10px] block">{flt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom & Positioning Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#0B6B3A] mb-1">
                      <span>Zoom / Scale: {currentEvent.photoScale.toFixed(1)}x</span>
                      <ZoomIn className="w-3.5 h-3.5 text-[#C9A227]" />
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="2.0"
                      step="0.05"
                      value={currentEvent.photoScale}
                      onChange={(e) => updateEventState(prev => ({ ...prev, photoScale: parseFloat(e.target.value) }))}
                      className="w-full accent-[#0B6B3A]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#0B6B3A] mb-1">
                      <span>Vertical Shift: {currentEvent.photoPosition?.y || 0}px</span>
                      <Sliders className="w-3.5 h-3.5 text-[#C9A227]" />
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="2"
                      value={currentEvent.photoPosition?.y || 0}
                      onChange={(e) => updateEventState(prev => ({
                        ...prev,
                        photoPosition: { ...(prev.photoPosition || { x: 0 }), y: parseInt(e.target.value) }
                      }))}
                      className="w-full accent-[#0B6B3A]"
                    />
                  </div>
                </div>

                {/* Remove Photo */}
                {currentEvent.photoUrl && (
                  <button
                    onClick={() => updateEventState(prev => ({ ...prev, photoUrl: '' }))}
                    className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove photo from invitation</span>
                  </button>
                )}
              </div>
            )}

            {/* TAB 4: AI COPYWRITER */}
            {activeTab === 'ai' && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#C9A227]/30 shadow-xs space-y-6 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#C9A227]/20 flex items-center justify-center text-[#0B6B3A]">
                    <Wand2 className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F17]">
                      Smart Invitation Copy Assistant
                    </h3>
                    <p className="text-xs text-[#0F1F17]/60">
                      Craft poetic, formal, or religious invitations with 1-click tailored suggestions.
                    </p>
                  </div>
                </div>

                {/* Suggested Wording Cards */}
                <div className="space-y-4">
                  {Object.entries(AI_TEXT_PRESETS).map(([category, texts]) => (
                    <div key={category} className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0B6B3A]">
                        {category === 'fatiha' ? 'Islamic Wedding Fatiha & Nikah' :
                         category === 'wedding' ? 'Romantic Wedding Nuptials' :
                         category === 'birthday' ? 'Black Tie Milestone Celebration' : 'Executive Leadership Gala'}
                      </span>

                      <div className="grid grid-cols-1 gap-2">
                        {texts.map((text, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-gray-200 hover:border-[#C9A227] bg-[#F6FAF7]/40 hover:bg-white transition-all text-xs leading-relaxed text-[#0F1F17] flex flex-col justify-between space-y-3"
                          >
                            <p className="font-serif-luxury text-sm italic">"{text}"</p>
                            <button
                              onClick={() => {
                                updateEventState(prev => ({ ...prev, description: text }));
                                if (onSuccessToast) onSuccessToast('AI text applied to invitation description!');
                              }}
                              className="self-end px-3 py-1.5 rounded-full bg-[#0B6B3A] text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-[#064E2B] transition-colors flex items-center space-x-1"
                            >
                              <Check className="w-3 h-3 text-[#C9A227]" />
                              <span>Apply to Invitation</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PROGRAMME SCHEDULE */}
            {activeTab === 'schedule' && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#C9A227]/30 shadow-xs space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F17]">
                      Event Programme Timeline
                    </h3>
                    <p className="text-xs text-[#0F1F17]/60">
                      Outline the ceremony order of events for guests on the live event page.
                    </p>
                  </div>
                  <button
                    onClick={addScheduleItem}
                    className="px-4 py-2 rounded-xl bg-[#0B6B3A] text-white text-xs font-semibold hover:bg-[#064E2B] transition-colors flex items-center space-x-1"
                  >
                    <ListPlus className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Add Session</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {currentEvent.schedule.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-gray-200 bg-[#F6FAF7]/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0B6B3A] uppercase tracking-wider">
                          Session #{idx + 1}
                        </span>
                        <button
                          onClick={() => removeScheduleItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Time</label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateEventState(prev => ({
                                ...prev,
                                schedule: prev.schedule.map(s => s.id === item.id ? { ...s, time: val } : s)
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl border text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Session Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateEventState(prev => ({
                                ...prev,
                                schedule: prev.schedule.map(s => s.id === item.id ? { ...s, title: val } : s)
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl border text-xs font-medium"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Location / Description</label>
                          <input
                            type="text"
                            value={item.description || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateEventState(prev => ({
                                ...prev,
                                schedule: prev.schedule.map(s => s.id === item.id ? { ...s, description: val } : s)
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl border text-xs"
                            placeholder="e.g. Palm Courtyard — Welcome drinks and appetizers"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sticky Real-time Invitation Preview */}
          <div className={`lg:col-span-5 sticky top-24 ${mobileMode === 'edit' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-3xl p-6 border border-[#C9A227]/30 shadow-lg flex flex-col items-center">
              
              {/* Preview Bar Ratio Switcher */}
              <div className="w-full flex items-center justify-between mb-4 border-b pb-3">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#0B6B3A]">
                  <Eye className="w-4 h-4 text-[#C9A227]" />
                  <span>Interactive Live Canvas</span>
                </div>

                <div className="flex items-center space-x-1 text-xs bg-[#F6FAF7] p-1 rounded-xl border border-gray-200">
                  <button
                    onClick={() => setPreviewRatio('portrait')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      previewRatio === 'portrait' ? 'bg-[#0B6B3A] text-white' : 'text-gray-600'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setPreviewRatio('story')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      previewRatio === 'story' ? 'bg-[#0B6B3A] text-white' : 'text-gray-600'
                    }`}
                  >
                    Story
                  </button>
                  <button
                    onClick={() => setPreviewRatio('square')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      previewRatio === 'square' ? 'bg-[#0B6B3A] text-white' : 'text-gray-600'
                    }`}
                  >
                    Square
                  </button>
                </div>
              </div>

              {/* The Live Rendered Card */}
              <div className="w-full max-w-[380px] drop-shadow-2xl">
                <InvitationCard
                  event={currentEvent}
                  aspectRatio={previewRatio}
                  showRsvpCta={true}
                  onRsvpClick={onViewLiveEvent}
                />
              </div>

              {/* Quick Actions Under Preview */}
              <div className="w-full mt-6 pt-4 border-t flex items-center justify-between">
                <button
                  onClick={onOpenDownloadModal}
                  className="text-xs font-semibold text-[#0B6B3A] hover:text-[#C9A227] flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-[#C9A227]" />
                  <span>Download High-Res Card</span>
                </button>

                <button
                  onClick={onViewLiveEvent}
                  className="text-xs font-semibold text-[#0B6B3A] hover:text-[#C9A227] flex items-center space-x-1.5 transition-colors"
                >
                  <span>Open Full Event Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
