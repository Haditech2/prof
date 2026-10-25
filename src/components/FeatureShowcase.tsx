import React from 'react';
import { 
  Download, 
  QrCode, 
  Calendar, 
  Wand2, 
  Users, 
  Sparkles,
  Camera,
  ArrowRight
} from 'lucide-react';

interface FeatureShowcaseProps {
  onOpenStudio: () => void;
  onOpenDashboard: () => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  onOpenStudio,
  onOpenDashboard
}) => {
  const features = [
    {
      title: 'Ultra-HD Multi-Format Exports',
      subtitle: 'Print-ready & social formats',
      description: 'Export in 1080p, 4K Retina PNG, or print-ready PDF in Story (9:16), Portrait (4:5), or Square (1:1) dimensions.',
      icon: Download,
      action: 'Open Studio',
      onClick: onOpenStudio
    },
    {
      title: 'Digital Passes & Venue QR Scanner',
      subtitle: 'Effortless arrival verification',
      description: 'Each confirmed attendee receives an encrypted QR code ticket for seamless arrival verification and door check-in.',
      icon: QrCode,
      action: 'View Dashboard',
      onClick: onOpenDashboard
    },
    {
      title: 'Smart AI Invitation Copywriter',
      subtitle: 'Bespoke tone & etiquette generator',
      description: 'Instantly generate eloquent wording tailored for traditional Islamic Fatiha, university inaugural convocations, or galas.',
      icon: Wand2,
      action: 'Try in Studio',
      onClick: onOpenStudio
    },
    {
      title: 'Live Real-Time RSVP Concierge',
      subtitle: 'Direct guest management',
      description: 'Track accepted, declined, and tentative guests in real time with photo avatars, dietary preferences, and +1 party limits.',
      icon: Users,
      action: 'Manage Guests',
      onClick: onOpenDashboard
    },
    {
      title: 'Calendar & Timezone Integration',
      subtitle: 'Global event synchronization',
      description: 'One-click addition to Google Calendar, Apple Calendar, and Outlook with accurate timezone handling worldwide.',
      icon: Calendar,
      action: 'Preview Event',
      onClick: onOpenStudio
    },
    {
      title: "'I Will Be There' Photo DP Generator",
      subtitle: 'Viral social media attendee banners',
      description: 'Guests personalize an official gold-framed social banner with their own photo to share on WhatsApp Status, Instagram, and LinkedIn.',
      icon: Camera,
      action: 'Generate DP',
      onClick: onOpenStudio
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="editorial-tag mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A869]" />
          <span>Haute Technology & Craft</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#1A1C1E]">
          Everything Required for a Flawless Celebration
        </h2>
        <p className="text-sm md:text-base text-[#52575C] font-sans-modern mt-3 leading-relaxed">
          Engineered for distinguished hosts who value uncompromising aesthetic refinement and effortless technical reliability.
        </p>
      </div>

      {/* 6-Grid Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="surface-card surface-card-hover rounded-3xl p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[rgba(197,168,105,0.3)] flex items-center justify-center text-[#12382C] group-hover:bg-[#12382C] group-hover:text-white transition-all shadow-2xs mb-6">
                  <Icon className="w-5 h-5 text-[#C5A869] group-hover:text-white transition-colors" />
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7E47] font-semibold block mb-1">
                  {feat.subtitle}
                </span>

                <h3 className="text-xl font-serif-luxury font-bold text-[#1A1C1E] mb-2 group-hover:text-[#12382C] transition-colors">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#52575C] font-sans-modern leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={feat.onClick}
                  className="text-xs font-bold text-[#12382C] hover:text-[#9A7E47] flex items-center space-x-1 transition-colors"
                >
                  <span>{feat.action}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A869]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
