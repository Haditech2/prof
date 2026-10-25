import React from 'react';
import { Palette, Sparkles, Share2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartCreating: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ onStartCreating }) => {
  const steps = [
    {
      number: '01',
      title: 'Curate Your Masterpiece',
      description: 'Select an exquisite design theme tailored for academic inaugural lectures, royal wedding Fatiha, Tuscan celebrations, or milestone galas.',
      icon: Palette,
      badge: 'Step 1'
    },
    {
      number: '02',
      title: 'Personalize Details & Portraits',
      description: 'Upload high-resolution photography, customize typography, configure schedules, and craft bespoke invitations with instant visual feedback.',
      icon: Sparkles,
      badge: 'Step 2'
    },
    {
      number: '03',
      title: 'Share, Collect RSVPs & Export',
      description: 'Deliver via WhatsApp or private links, receive instant attendance responses with guest photos, and export print-ready Ultra-HD PNG and PDF cards.',
      icon: Share2,
      badge: 'Step 3'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] border-y border-[rgba(197,168,105,0.2)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="editorial-tag mb-3">
            <span>Effortless Sophistication</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#1A1C1E]">
            How EVERAFTER Works
          </h2>
          <p className="text-sm md:text-base text-[#52575C] font-sans-modern mt-3 leading-relaxed">
            From initial concept to your guests' arrival, experience an intuitive creation process designed for unforgettable moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="surface-card surface-card-hover rounded-3xl p-8 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Number and Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-serif-luxury font-bold text-[#C5A869]/60 group-hover:text-[#C5A869] transition-colors">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[rgba(197,168,105,0.3)] flex items-center justify-center text-[#12382C] group-hover:bg-[#12382C] group-hover:text-white transition-all shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7E47] font-semibold block mb-2">
                    {step.badge}
                  </span>

                  <h3 className="text-xl font-serif-luxury font-bold text-[#1A1C1E] mb-3 group-hover:text-[#12382C] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#52575C] font-sans-modern leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-[#82878D] font-medium">Bespoke Concierge</span>
                  <span className="text-xs font-semibold text-[#12382C] group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Action Button */}
        <div className="mt-14 text-center">
          <button
            onClick={onStartCreating}
            className="px-8 py-4 rounded-full bg-[#12382C] text-white font-semibold text-xs tracking-widest uppercase shadow-md hover:bg-[#0A221A] hover:scale-102 transition-all border border-[#C5A869]/40 inline-flex items-center space-x-2"
          >
            <span>Start Designing Your Invitation</span>
            <ArrowRight className="w-4 h-4 text-[#C5A869]" />
          </button>
        </div>
      </div>
    </section>
  );
};
