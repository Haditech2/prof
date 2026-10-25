import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Download, 
  ExternalLink, 
  Quote, 
  ChevronRight, 
  CheckCircle2, 
  Heart, 
  Send,
  Cpu,
  ShieldCheck,
  Globe2
} from 'lucide-react';
import { EventData } from '../types';

interface AboutProfessorSectionProps {
  onRsvpToInaugural: () => void;
  onDownloadInauguralCard: () => void;
  onViewEventPage: () => void;
  event: EventData;
}

export const AboutProfessorSection: React.FC<AboutProfessorSectionProps> = ({
  onRsvpToInaugural,
  onDownloadInauguralCard,
  onViewEventPage,
  event: _event
}) => {
  const [activeTab, setActiveTab] = useState<'lecture' | 'biography' | 'career' | 'contributions' | 'gallery'>('lecture');
  const [selectedAboutPhoto, setSelectedAboutPhoto] = useState('/images/prof-rashidah-olanrewaju.jpg');
  
  // Tributes / felicitations guestbook state
  const [tributes, setTributes] = useState([
    {
      id: 'trib-1',
      author: 'Prof. Sa\'adatu Hassan Liman',
      role: 'Vice-Chancellor, NSUK',
      message: 'Professor Rashidah Funke Olanrewaju epitomizes scholarly rigor, visionary innovation, and integrity. A historic inaugural lecture for NSUK and African computing.',
      date: 'October 2026',
      likes: 42
    },
    {
      id: 'trib-2',
      author: 'Prof. Teddy Mantoro, Ph.D., SMIEEE',
      role: 'International Research Collaborator (IIUM / IEEE)',
      message: 'Having co-authored seminal papers with Rashidah in Kuala Lumpur, I have witnessed her brilliance in software intelligence. The zenith of decades of scholarship.',
      date: 'October 2026',
      likes: 35
    },
    {
      id: 'trib-3',
      author: 'Dr. Amina Garba',
      role: 'Senior Lecturer, Computing Department',
      message: 'An extraordinary mentor to women in STEM. Professor Olanrewaju continues to shatter glass ceilings and nurture world-class researchers.',
      date: 'October 2026',
      likes: 29
    }
  ]);

  const [tributeAuthor, setTributeAuthor] = useState('');
  const [tributeRole, setTributeRole] = useState('');
  const [tributeMessage, setTributeMessage] = useState('');
  const [tributeSubmitted, setTributeSubmitted] = useState(false);

  const handleAddTribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tributeAuthor.trim() || !tributeMessage.trim()) return;

    setTributes(prev => [
      {
        id: `trib-${Date.now()}`,
        author: tributeAuthor.trim(),
        role: tributeRole.trim() || 'Academic Colleague & Well-Wisher',
        message: tributeMessage.trim(),
        date: 'Just now',
        likes: 1
      },
      ...prev
    ]);

    setTributeAuthor('');
    setTributeRole('');
    setTributeMessage('');
    setTributeSubmitted(true);
    setTimeout(() => setTributeSubmitted(false), 4000);
  };

  const academicMilestones = [
    {
      degree: 'Doctor of Philosophy (Ph.D.)',
      field: 'Computer and Information Engineering',
      institution: 'International Islamic University Malaysia (IIUM)',
      location: 'Kuala Lumpur, Malaysia',
      highlight: 'Dissertation on intelligent algorithmic systems and digital cryptology.'
    },
    {
      degree: 'Master of Science (MSc.IE)',
      field: 'Information Engineering',
      institution: 'International Islamic University Malaysia (IIUM)',
      location: 'Kuala Lumpur, Malaysia',
      highlight: 'Advanced machine learning architectures and software fault-tolerance.'
    },
    {
      degree: 'Diploma in Islamic Studies (DIS)',
      field: 'Islamic Thought & Ethical Foundations',
      institution: 'International Islamic University Malaysia (IIUM)',
      location: 'Kuala Lumpur, Malaysia',
      highlight: 'Ethical governance, scholarship, and values-driven technological application.'
    },
    {
      degree: 'Bachelor of Science with Honours (B.Sc. Hons.)',
      field: 'Computer & Information Technology',
      institution: 'Universiti Putra Malaysia (UPM)',
      location: 'Selangor, Malaysia',
      highlight: 'Graduated with honours; foundational software specifications and intelligent systems.'
    },
    {
      degree: 'National Diploma (ND)',
      field: 'Science & Engineering Foundations',
      institution: 'Federal Polytechnics, Kaduna',
      location: 'Kaduna State, Nigeria',
      highlight: 'Foundational polytechnic diploma marking the beginning of her distinguished engineering journey.'
    }
  ];

  const careerHighlights = [
    {
      role: 'Director, Entrepreneurship Development Centre (EDC)',
      institution: 'Nasarawa State University, Keffi (NSUK)',
      period: 'Present',
      description: 'Institutionalized modern tech incubation hubs, digital transformation, and university-industry linkages.'
    },
    {
      role: 'Head of Research Group (ISERG)',
      institution: 'Intelligent Software Engineering Research Group',
      period: 'Present',
      description: 'Leads AI clusters investigating FinTech security, intelligent algorithms, and IoT for developing economies.'
    },
    {
      role: 'Professor of Computer Science & Artificial Intelligence',
      institution: 'Faculty of Computing, Nasarawa State University, Keffi',
      period: 'Present',
      description: 'Chairs postgraduate computing curricula and guides doctoral dissertations in machine intelligence.'
    },
    {
      role: 'Senior Academic & Researcher',
      institution: 'Kulliyyah of Engineering, IIUM',
      period: 'Former Faculty',
      description: 'Directed laboratory research and authored seminal IEEE/Springer international proceedings.'
    },
    {
      role: 'Deputy Director, Online & Distance Learning',
      institution: 'Nasarawa State University, Keffi (NSUK)',
      period: 'Former',
      description: 'Spearheaded campus-wide virtual academic delivery and digital e-learning architectures.'
    }
  ];

  const scientificContributions = [
    {
      title: 'NURA-X: Intentional Intelligence Paradigm',
      description: 'Pioneered the NURA-X model anchoring artificial intelligence in digital trust, algorithmic fairness, and human flourishing for developing societies.',
      icon: Sparkles,
      stat: 'Flagship Initiative'
    },
    {
      title: 'Applied AI & Machine Learning',
      description: 'Adaptive neural network optimization and computer vision algorithms tailored for automated decision systems.',
      icon: Cpu,
      stat: '100+ Publications'
    },
    {
      title: 'Cybersecurity & FinTech Defense',
      description: 'Cryptographic security models and intrusion defenses safeguarding electronic financial transaction pipelines.',
      icon: ShieldCheck,
      stat: 'Patents & Frameworks'
    },
    {
      title: 'Digital Enterprise & Incubation',
      description: 'Equipped over 10,000 university students with practical tech entrepreneurship skills at NSUK EDC.',
      icon: Briefcase,
      stat: '10,000+ Students Impacted'
    },
    {
      title: 'Advocacy for Women in STEM',
      description: 'Pioneered mentorship initiatives across IEEE Women in Engineering and Nigeria Computer Society.',
      icon: Award,
      stat: 'Global Fellowships'
    }
  ];

  const photoGallery = [
    {
      url: '/images/prof-rashidah-olanrewaju.jpg',
      caption: 'Official Academic Portrait — Professor Rashidah Funke Olanrewaju',
      category: 'Official Portrait'
    },
    {
      url: '/images/nura-x-intentional-intelligence.jpg',
      caption: 'NURA-X: Intentional Intelligence Official AI Initiative Emblem',
      category: 'AI Initiative'
    },
    {
      url: '/images/prof-rashidah-executive-desk.jpg',
      caption: 'Director at Executive Desk — Entrepreneurship Development Centre (EDC)',
      category: 'Leadership & EDC'
    },
    {
      url: '/images/prof-rashidah-courtyard-regalia.jpg',
      caption: 'Full Academic Regalia at University Senate Courtyard',
      category: 'Ceremonial Regalia'
    },
    {
      url: '/images/prof-rashidah-garden-portrait.jpg',
      caption: 'Professor Rashidah Funke Olanrewaju at NSUK Main Campus',
      category: 'Campus Chronicle'
    },
    {
      url: '/images/inaugural-lecture-flyer-portrait.jpg',
      caption: 'Official 65th Inaugural Lecture Proclamation Poster',
      category: 'Proclamation Poster'
    },
    {
      url: '/images/inaugural-poster-65th.jpg',
      caption: 'Official 65th Inaugural Lecture Invitation Banner',
      category: 'Official Banner'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#0F1F17] pt-28 md:pt-36 pb-24 px-4 md:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-[#E7F3EC] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-[#F2E3B3]/30 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* ========================================================================= */}
        {/* HERO CARD: PROFESSORIAL SPOTLIGHT & INAUGURAL CITATION                    */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0B6B3A] to-[#043A20] border border-[#0B6B3A] p-8 md:p-12 shadow-2xl overflow-hidden">
          {/* Subtle gold accent accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A227]/20 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute top-4 left-4 text-[#F2E3B3]/40 text-xs">◈</div>
          <div className="absolute top-4 right-4 text-[#F2E3B3]/40 text-xs">◈</div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left: Academic Title & Discourse Card */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                <GraduationCap className="w-3.5 h-3.5 text-[#F2E3B3]" />
                <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#F2E3B3]">
                  65th NSUK Inaugural Lecture
                </span>
              </div>

              {/* Name */}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-white tracking-tight leading-[1.1]">
                  Professor Rashidah <br />
                  <span className="italic font-normal text-[#F2E3B3]">Funke Olanrewaju</span>
                </h1>
                <p className="text-xs text-[#F2E3B3]/90 font-mono tracking-wider mt-2">
                  Citp, FCRIDE, SMIEEE, MIET, MNCS, MAITP, MIAENG, MWIE, Fellow Erasmus+
                </p>
                <p className="text-xs text-white/70 font-mono tracking-widest uppercase mt-1">
                  PhD, MSc.IE, DIS (IIUM), BSc. (Hons.) (UPM)
                </p>
              </div>

              {/* Roles Summary */}
              <p className="text-xs sm:text-sm text-white/80 font-sans-modern leading-relaxed max-w-xl">
                Professor of Computer Science &amp; Artificial Intelligence • Director, Entrepreneurship Development Centre (EDC) • Head, Intelligent Software Engineering Research Group (ISERG), NSUK.
              </p>

              {/* Discourse Title Pill Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2 text-left">
                <div className="flex items-center justify-between text-[11px] text-[#F2E3B3] uppercase font-bold tracking-wider">
                  <span className="flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Inaugural Discourse</span>
                  </span>
                  <span className="text-white/60 font-mono text-[10px]">Wednesday, 25 November 2026</span>
                </div>
                <h3 className="text-sm sm:text-base font-serif-luxury font-bold text-white italic leading-snug">
                  "INTENTIONAL INTELLIGENCE: From Digital Trust to Human Flourishing"
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/70 pt-1 border-t border-white/10">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-[#F2E3B3]" />
                    <span>Assembly Hall, Main Campus, NSUK</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-[#F2E3B3]" />
                    <span>2:00 PM Prompt</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onRsvpToInaugural}
                  className="px-6 py-3 rounded-full bg-[#E2BE4A] text-[#043A20] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RSVP For Lecture</span>
                </button>

                <button
                  onClick={onDownloadInauguralCard}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider border border-white/15 transition-all flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5 text-[#F2E3B3]" />
                  <span>Lecture Card</span>
                </button>

                <button
                  onClick={onViewEventPage}
                  className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 font-semibold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center space-x-1.5"
                >
                  <span>Event Page</span>
                  <ExternalLink className="w-3 h-3 text-[#F2E3B3]" />
                </button>
              </div>

            </div>

            {/* Right: Framed Academic Portrait with Switcher */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[320px]">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#C9A227]/30 via-white/10 to-[#C9A227]/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
                
                <div className="relative rounded-t-[130px] rounded-b-3xl border-2 border-white/60 p-2 bg-[#043A20] shadow-2xl overflow-hidden">
                  <div className="w-full h-80 sm:h-96 rounded-t-[120px] rounded-b-2xl overflow-hidden relative">
                    <img
                      src={selectedAboutPhoto}
                      alt="Professor Rashidah Funke Olanrewaju"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#043A20]/90 border border-white/20 text-[9px] uppercase tracking-widest text-[#F2E3B3] font-bold backdrop-blur-md shadow-lg whitespace-nowrap">
                    Inaugural Lecturer • 2026
                  </div>
                </div>

                {/* Thumbnails to Switch Hero Portrait */}
                <div className="mt-3 flex items-center justify-center gap-1.5 p-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xs">
                  {[
                    { url: '/images/prof-rashidah-olanrewaju.jpg', label: 'Robes' },
                    { url: '/images/prof-rashidah-courtyard-regalia.jpg', label: 'Courtyard' },
                    { url: '/images/prof-rashidah-executive-desk.jpg', label: 'Executive' },
                    { url: '/images/prof-rashidah-garden-portrait.jpg', label: 'Garden' },
                    { url: '/images/inaugural-lecture-flyer-portrait.jpg', label: 'Flyer' }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAboutPhoto(p.url)}
                      title={p.label}
                      className={`relative w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedAboutPhoto === p.url
                          ? 'border-[#E2BE4A] ring-2 ring-[#E2BE4A]/60 scale-105'
                          : 'border-white/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* NAVIGATION TABS                                                           */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-[#E3ECE6]">
          {[
            { id: 'lecture', label: '1. The Lecture', icon: BookOpen },
            { id: 'biography', label: '2. Academic Pedigree', icon: GraduationCap },
            { id: 'career', label: '3. Leadership & Roles', icon: Briefcase },
            { id: 'contributions', label: '4. Scientific Impact', icon: Award },
            { id: 'gallery', label: '5. Gallery & Honors', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#0B6B3A] text-white shadow-md font-bold'
                    : 'bg-[#F6FAF7] text-[#5B6B63] border border-[#E3ECE6] hover:border-[#0B6B3A]/30 hover:text-[#0B6B3A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-[#0B6B3A]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: THE INAUGURAL LECTURE                                              */}
        {/* ========================================================================= */}
        {activeTab === 'lecture' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E3ECE6] shadow-sm space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#0B6B3A] font-semibold block mb-1">
                    Scholarly Elevation
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F17]">
                    Inaugural Lecture Pillars
                  </h2>
                </div>
                <div className="text-xs text-[#5B6B63]">
                  Nasarawa State University Senate Chamber & Auditorium
                </div>
              </div>

              {/* 3 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#E3ECE6] space-y-2 hover:border-[#0B6B3A]/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F3EC] border border-[#0B6B3A]/15 flex items-center justify-center text-[#0B6B3A] mb-3">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-base text-[#0F1F17]">
                    Artificial Intelligence Horizons
                  </h4>
                  <p className="text-xs text-[#5B6B63] leading-relaxed font-sans-modern">
                    Adaptive neural networks and ethical algorithmic models engineered to solve pressing African industrial and socio-economic challenges.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#E3ECE6] space-y-2 hover:border-[#0B6B3A]/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F3EC] border border-[#0B6B3A]/15 flex items-center justify-center text-[#0B6B3A] mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-base text-[#0F1F17]">
                    Cyber Resiliency & Cryptology
                  </h4>
                  <p className="text-xs text-[#5B6B63] leading-relaxed font-sans-modern">
                    Cryptographic defense architectures and software fault-tolerance models safeguarding national FinTech and digital public infrastructure.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#E3ECE6] space-y-2 hover:border-[#0B6B3A]/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F3EC] border border-[#0B6B3A]/15 flex items-center justify-center text-[#0B6B3A] mb-3">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif-luxury font-bold text-base text-[#0F1F17]">
                    National Software Transformation
                  </h4>
                  <p className="text-xs text-[#5B6B63] leading-relaxed font-sans-modern">
                    Bridging theoretical computer science with digital entrepreneurship and youth incubation for self-sustaining economic growth.
                  </p>
                </div>
              </div>

              {/* Official Proclamation Poster Showcase */}
              <div className="rounded-3xl border border-[#C9A227]/40 bg-gradient-to-br from-[#F6FAF7] to-[#E7F3EC] p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                <div className="w-full md:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-[#C9A227]/50 shrink-0 bg-white">
                  <img
                    src="/images/inaugural-lecture-flyer-portrait.jpg"
                    alt="Official 65th Inaugural Lecture Proclamation Poster"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C9A227]/40 text-[#0B6B3A] text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Official University Senate Proclamation</span>
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#0F1F17]">
                    The 65th Inaugural Lecture Proclamation
                  </h3>
                  <p className="text-xs text-[#5B6B63] leading-relaxed max-w-xl">
                    By direction of the Vice-Chancellor, Professor Sa'adatu Hassan Liman, and the University Senate, this public inaugural address constitutes a formal elevation and scholarly milestone in the academic calendar of Nasarawa State University.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                    <a
                      href="/images/inaugural-lecture-flyer-portrait.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-[#0B6B3A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#064E2B] transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#F2E3B3]" />
                      <span>View Full Resolution Flyer</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Protocol Strip */}
              <div className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#C9A227]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#0B6B3A] font-bold block">
                    Ceremonial Protocol
                  </span>
                  <p className="text-xs text-[#0F1F17] mt-0.5">
                    Academic robes required for Senate members. Guests are requested to be seated in the Assembly Hall by 01:45 PM prompt before the University Mace entrance at 2:00 PM.
                  </p>
                </div>
                <button
                  onClick={onRsvpToInaugural}
                  className="px-5 py-2.5 rounded-full bg-[#0B6B3A] text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap hover:brightness-110 transition-all shrink-0"
                >
                  RSVP For Lecture
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BIOGRAPHY & ACADEMIC PEDIGREE                                      */}
        {/* ========================================================================= */}
        {activeTab === 'biography' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E3ECE6] shadow-sm space-y-6">
              
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#0B6B3A] font-semibold block mb-1">
                  Academic Genesis
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F17]">
                  Executive Profile & Pedigree
                </h2>
              </div>

              {/* Concise Executive Brief Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F6FAF7] border border-[#E3ECE6] space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#0B6B3A] font-bold">Origin & Foundation</span>
                  <p className="text-xs text-[#0F1F17] leading-relaxed">
                    Born in Kaduna, Nigeria. Deep passion for computational mathematics and formal software systems from early youth.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F6FAF7] border border-[#E3ECE6] space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#0B6B3A] font-bold">International Scholarship</span>
                  <p className="text-xs text-[#0F1F17] leading-relaxed">
                    Trained in Malaysia (UPM & IIUM) with doctoral excellence in neural computing, intelligent software, and cryptology.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F6FAF7] border border-[#E3ECE6] space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#0B6B3A] font-bold">Institutional Impact</span>
                  <p className="text-xs text-[#0F1F17] leading-relaxed">
                    Full Professor at NSUK, elevating national computer science curricula and directing youth tech entrepreneurship at EDC.
                  </p>
                </div>
              </div>

              {/* Degrees Grid */}
              <div className="pt-4 border-t border-[#E3ECE6]">
                <h3 className="text-sm uppercase tracking-widest text-[#0B6B3A] font-bold mb-4">
                  Degrees & Higher Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {academicMilestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#E3ECE6] flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="w-9 h-9 rounded-xl bg-[#E7F3EC] border border-[#0B6B3A]/15 flex items-center justify-center text-[#0B6B3A] mb-3">
                          <GraduationCap className="w-4 h-4 text-[#0B6B3A]" />
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#0B6B3A] font-bold block">
                          {milestone.location}
                        </span>
                        <h4 className="font-serif-luxury font-bold text-sm text-[#0F1F17] mt-1">
                          {milestone.degree}
                        </h4>
                        <p className="text-xs font-semibold text-[#0B6B3A] mt-0.5">
                          {milestone.field}
                        </p>
                        <p className="text-[11px] text-[#5B6B63] mt-1">
                          {milestone.institution}
                        </p>
                      </div>
                      <p className="text-[11px] text-[#5B6B63] italic border-t border-[#E3ECE6] pt-2">
                        {milestone.highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CAREER & INSTITUTIONAL LEADERSHIP                                 */}
        {/* ========================================================================= */}
        {activeTab === 'career' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E3ECE6] shadow-sm space-y-6">
              
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#0B6B3A] font-semibold block mb-1">
                  Leadership Trajectory
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F17]">
                  Institutional Stewardship & Service
                </h2>
              </div>

              {/* Featured EDC Executive Leadership Spotlight */}
              <div className="rounded-3xl border border-[#C9A227]/40 bg-gradient-to-br from-white to-[#F6FAF7] p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                <div className="w-full md:w-56 h-72 rounded-2xl overflow-hidden shadow-lg border-2 border-[#C9A227]/50 shrink-0 bg-white">
                  <img
                    src="/images/prof-rashidah-executive-desk.jpg"
                    alt="Professor Rashidah at Executive Desk EDC"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="space-y-3 text-center md:text-left">
                  <span className="text-[10px] uppercase tracking-widest text-[#0B6B3A] font-bold block">
                    Executive Leadership · EDC Complex
                  </span>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#0F1F17]">
                    Director, Entrepreneurship Development Centre (EDC)
                  </h3>
                  <p className="text-xs text-[#5B6B63] leading-relaxed max-w-xl">
                    Leading the university's flagship entrepreneurship ecosystem, Professor Rashidah Funke Olanrewaju has driven transformative industry linkages, technology incubation, and patent commercialization, equipping over 10,000 university students with market-ready STEM and enterprise capabilities.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start text-[11px] font-semibold text-[#0B6B3A]">
                    <span className="px-3 py-1 rounded-full bg-[#E7F3EC]">10,000+ Students Mentored</span>
                    <span className="px-3 py-1 rounded-full bg-[#E7F3EC]">Incubation Clusters</span>
                    <span className="px-3 py-1 rounded-full bg-[#E7F3EC]">FinTech Security</span>
                  </div>
                </div>
              </div>

              {/* Roles Cards */}
              <div className="space-y-3">
                {careerHighlights.map((career, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#E3ECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#0B6B3A]/40 transition-all">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-serif-luxury font-bold text-sm text-[#0F1F17]">
                          {career.role}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#E7F3EC] text-[#0B6B3A]">
                          {career.period}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#0B6B3A] font-semibold">
                        {career.institution}
                      </div>
                      <p className="text-xs text-[#5B6B63] font-sans-modern">
                        {career.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Affiliations */}
              <div className="pt-4 border-t border-[#E3ECE6]">
                <h3 className="text-xs uppercase tracking-widest text-[#0B6B3A] font-bold mb-3">
                  Professional Fellowships &amp; Councils
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    'Citp (Chartered IT Practitioner)',
                    'FCRIDE (Research & Info Dev)',
                    'SMIEEE (Senior Member IEEE)',
                    'MIET (United Kingdom)',
                    'MNCS (Nigeria Computer Society)',
                    'MAITP (Association of IT Prof.)',
                    'MIAENG (Intl. Assoc. Engineers)',
                    'MWIE (Women in Engineering)',
                    'Fellow Erasmus+ (European Union)'
                  ].map((body, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F6FAF7] border border-[#E3ECE6] text-[11px] font-semibold text-[#0F1F17] flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0B6B3A] shrink-0" />
                      <span>{body}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SCIENTIFIC CONTRIBUTIONS & NATIONAL IMPACT                         */}
        {/* ========================================================================= */}
        {activeTab === 'contributions' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E3ECE6] shadow-sm space-y-6">
              
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#0B6B3A] font-semibold block mb-1">
                  Pioneering Research
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F17]">
                  Key Scientific Innovations
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {scientificContributions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#E3ECE6] flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E7F3EC] border border-[#0B6B3A]/15 text-[#0B6B3A] flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#E7F3EC] text-[#0B6B3A]">
                            {item.stat}
                          </span>
                        </div>

                        <h3 className="font-serif-luxury font-bold text-base text-[#0F1F17]">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#5B6B63] leading-relaxed font-sans-modern mt-1.5">
                          {item.description}
                        </p>
                      </div>

                      <div className="text-[10px] font-semibold text-[#0B6B3A] flex items-center space-x-1 pt-2 border-t border-[#E3ECE6]">
                        <span>Central theme in Inaugural Monograph</span>
                        <ChevronRight className="w-3 h-3 text-[#0B6B3A]" />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PHOTOGRAPHS & GALLERY                                             */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E3ECE6] shadow-sm space-y-6">
              
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#0B6B3A] font-semibold block mb-1">
                  Photographic Chronicle
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F17]">
                  Moments of Distinction
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {photoGallery.map((photo, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl overflow-hidden aspect-[3/4] border border-[#E3ECE6] shadow-md bg-[#F6FAF7]"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#043A20]/90 via-[#043A20]/30 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-[8px] uppercase tracking-wider text-[#F2E3B3] font-bold block mb-1">
                        {photo.category}
                      </span>
                      <p className="text-xs font-serif-luxury font-semibold leading-snug">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TRIBUTES & FELICITATIONS GUESTBOOK                                        */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 md:p-10 border border-[#E3ECE6] shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#0B6B3A] font-semibold block mb-1">
              Scholarly Felicitations
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F17]">
              Tributes to Professor Rashidah
            </h2>
            <p className="text-xs text-[#5B6B63] font-sans-modern mt-1">
              Leave your goodwill message or congratulatory note for her inaugural lecture.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAddTribute} className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#E3ECE6] space-y-4 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#5B6B63] block mb-1">
                  Full Name & Title *
                </label>
                <input
                  type="text"
                  required
                  value={tributeAuthor}
                  onChange={(e) => setTributeAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E3ECE6] text-xs bg-white text-[#0F1F17] placeholder-[#9AA8A0] focus:outline-hidden focus:border-[#0B6B3A]"
                  placeholder="e.g. Prof. Emmanuel Adams / Dr. Sarah Cole"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#5B6B63] block mb-1">
                  Affiliation / Department
                </label>
                <input
                  type="text"
                  value={tributeRole}
                  onChange={(e) => setTributeRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E3ECE6] text-xs bg-white text-[#0F1F17] placeholder-[#9AA8A0] focus:outline-hidden focus:border-[#0B6B3A]"
                  placeholder="e.g. Faculty Dean / Alumni Scholar"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#5B6B63] block mb-1">
                Your Felicitations *
              </label>
              <textarea
                rows={2}
                required
                value={tributeMessage}
                onChange={(e) => setTributeMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E3ECE6] text-xs bg-white text-[#0F1F17] placeholder-[#9AA8A0] focus:outline-hidden focus:border-[#0B6B3A] leading-relaxed"
                placeholder="Write your congratulatory words..."
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {tributeSubmitted ? (
                <span className="text-xs text-[#0B6B3A] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-[#0B6B3A]" />
                  <span>Tribute added to the roster!</span>
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#0B6B3A] text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Felicitations</span>
              </button>
            </div>
          </form>

          {/* List of Tributes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {tributes.map(t => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#E3ECE6] flex flex-col justify-between space-y-3"
              >
                <div className="text-xs text-[#0B6B3A]">
                  <Quote className="w-4 h-4 opacity-70" />
                </div>

                <p className="text-xs text-[#0F1F17] leading-relaxed font-serif-luxury italic">
                  "{t.message}"
                </p>

                <div className="pt-2 border-t border-[#E3ECE6] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#0F1F17] text-[11px]">{t.author}</div>
                    <div className="text-[10px] text-[#5B6B63]">{t.role}</div>
                  </div>
                  <div className="flex items-center space-x-1 text-[#0B6B3A]">
                    <Heart className="w-3 h-3 fill-[#C9A227]" />
                    <span className="text-[10px]">{t.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
