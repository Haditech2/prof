import React, { useState } from 'react';
import { EventCategory, InvitationThemePreset } from '../types';
import { PRESET_THEMES } from '../data/mockData';
import { Search, Heart, Eye, Sparkles, ArrowRight, Check } from 'lucide-react';

interface ExploreGalleryProps {
  onSelectTheme: (theme: InvitationThemePreset) => void;
  onPreviewTheme: (theme: InvitationThemePreset) => void;
}

export const ExploreGallery: React.FC<ExploreGalleryProps> = ({
  onSelectTheme,
  onPreviewTheme
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['inaugural-prestige', 'arabesque-fatiha', 'royal-gold']);
  const [activeColorFilter, setActiveColorFilter] = useState<string>('all');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Collections' },
    { id: 'inaugural', label: 'Academic Inaugural' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'fatiha', label: 'Wedding Fatiha & Nikah' },
    { id: 'birthday', label: 'Birthdays' },
    { id: 'corporate', label: 'Galas & Convocations' },
    { id: 'anniversary', label: 'Anniversaries' }
  ];

  const colorFilters = [
    { id: 'all', label: 'All Palettes', hex: '' },
    { id: 'gold', label: 'Champagne Gold', hex: '#C5A869' },
    { id: 'emerald', label: 'Imperial Emerald', hex: '#12382C' },
    { id: 'noir', label: 'Midnight Obsidian', hex: '#121418' },
    { id: 'ivory', label: 'Warm Ivory', hex: '#FAF8F5' }
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const filteredThemes = PRESET_THEMES.filter(theme => {
    // Category match
    const categoryMatch = selectedCategory === 'all' || theme.category === selectedCategory;
    
    // Search match
    const query = searchQuery.toLowerCase().trim();
    const searchMatch = !query || 
      theme.name.toLowerCase().includes(query) || 
      theme.description.toLowerCase().includes(query) ||
      theme.tag.toLowerCase().includes(query);

    // Color match
    let colorMatch = true;
    if (activeColorFilter === 'gold') colorMatch = theme.accentColor === '#C5A869' || theme.accentColor === '#DAA520';
    if (activeColorFilter === 'emerald') colorMatch = theme.backgroundColor === '#0A221A' || theme.textColor === '#12382C';
    if (activeColorFilter === 'noir') colorMatch = theme.backgroundColor === '#121418' || theme.backgroundColor === '#0E1726';
    if (activeColorFilter === 'ivory') colorMatch = theme.backgroundColor === '#FAF8F5' || theme.backgroundColor === '#FFFFFF';

    return categoryMatch && searchMatch && colorMatch;
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="editorial-tag mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A869]" />
          <span>Curated Haute Collection</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#1A1C1E] tracking-tight">
          Explore Invitation Masterpieces
        </h2>
        <p className="text-sm md:text-base text-[#52575C] font-sans-modern mt-3 leading-relaxed">
          Art-directed with editorial balance, authentic typography, and tactile foil aesthetics. Choose a theme to customize in the Studio.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#82878D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by theme or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[rgba(197,168,105,0.3)] text-xs text-[#1A1C1E] focus:outline-hidden focus:border-[#C5A869] shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Color Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1">
            <span className="text-[11px] font-semibold text-[#82878D] uppercase tracking-wider hidden sm:inline">
              Palette:
            </span>
            {colorFilters.map(cf => (
              <button
                key={cf.id}
                onClick={() => setActiveColorFilter(cf.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  activeColorFilter === cf.id
                    ? 'bg-[#12382C] text-white shadow-2xs'
                    : 'bg-white text-[#52575C] border border-gray-200 hover:border-[#C5A869]'
                }`}
              >
                {cf.hex && (
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                    style={{ backgroundColor: cf.hex }}
                  />
                )}
                <span>{cf.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Category Pill Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#12382C] text-white shadow-xs font-bold'
                  : 'bg-white text-[#52575C] border border-gray-200 hover:border-[#C5A869]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Invitation Themes */}
      {filteredThemes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 p-8 space-y-3">
          <p className="text-base font-serif-luxury font-bold text-gray-700">No invitation designs matched your search.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setActiveColorFilter('all'); }}
            className="text-xs text-[#12382C] font-semibold underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredThemes.map(theme => {
            const isFav = favorites.includes(theme.id);
            return (
              <div
                key={theme.id}
                onClick={() => onPreviewTheme(theme)}
                className="group surface-card surface-card-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                {/* Visual Card Mockup Header */}
                <div
                  className="p-8 h-72 flex flex-col justify-between relative overflow-hidden transition-colors"
                  style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor
                  }}
                >
                  {/* Subtle Inner Border */}
                  <div 
                    className="absolute inset-4 rounded-2xl pointer-events-none opacity-40 border"
                    style={{ borderColor: theme.accentColor }}
                  />

                  {/* Top Bar: Tag & Favorite */}
                  <div className="flex items-center justify-between relative z-10">
                    <span 
                      className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider"
                      style={{ 
                        backgroundColor: `${theme.accentColor}25`,
                        color: theme.textColor,
                        border: `1px solid ${theme.accentColor}60`
                      }}
                    >
                      {theme.tag}
                    </span>

                    <button
                      onClick={(e) => toggleFavorite(theme.id, e)}
                      className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-xs flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                    </button>
                  </div>

                  {/* Center Editorial Monogram & Preview Typography */}
                  <div className="text-center relative z-10 space-y-1 my-auto">
                    <div 
                      className="w-12 h-12 mx-auto rounded-full border flex items-center justify-center font-serif-luxury text-xl font-bold shadow-xs"
                      style={{ 
                        borderColor: theme.accentColor,
                        color: theme.accentColor,
                        backgroundColor: 'rgba(0,0,0,0.1)'
                      }}
                    >
                      ✦
                    </div>
                    <div className="text-lg font-serif-luxury font-bold tracking-wide">
                      {theme.name}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest font-mono opacity-70">
                      {theme.fontPreset} • {theme.borderStyle}
                    </div>
                  </div>

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-opacity flex items-center justify-center gap-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewTheme(theme);
                      }}
                      className="px-4 py-2 rounded-full bg-white text-[#1A1C1E] text-xs font-semibold uppercase tracking-wider shadow-md hover:scale-105 transition-transform flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C5A869]" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTheme(theme);
                      }}
                      className="px-4 py-2 rounded-full bg-[#12382C] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:scale-105 transition-transform flex items-center space-x-1"
                    >
                      <span>Use Theme</span>
                      <ArrowRight className="w-3 h-3 text-[#C5A869]" />
                    </button>
                  </div>
                </div>

                {/* Card Meta & Details */}
                <div className="p-6 bg-white space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-luxury font-bold text-xl text-[#1A1C1E]">
                      {theme.name}
                    </h3>
                    <p className="text-xs text-[#52575C] mt-1 line-clamp-2 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#9A7E47] uppercase tracking-wider">
                      {theme.category}
                    </span>
                    <button
                      onClick={() => onSelectTheme(theme)}
                      className="text-xs font-bold text-[#12382C] hover:text-[#9A7E47] flex items-center space-x-1 transition-colors"
                    >
                      <span>Customize</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
