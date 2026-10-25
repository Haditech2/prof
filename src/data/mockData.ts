import { EventData, RSVPResponse, GuestWish, InvitationThemePreset } from '../types';

export const PRESET_THEMES: InvitationThemePreset[] = [
  {
    id: 'inaugural-prestige',
    name: 'Imperial Senate Regalia',
    category: 'inaugural',
    description: 'Academic regalia prestige featuring midnight navy, gilded laureates, and formal university Senate typography.',
    fontPreset: 'cinzel',
    accentColor: '#C5A869',
    backgroundColor: '#0E1726',
    textColor: '#F8FAFC',
    borderStyle: 'ornate-gold',
    photoFrame: 'arch',
    photoFilter: 'natural',
    tag: 'Flagship Academic'
  },
  {
    id: 'nsuk-emerald',
    name: 'NSUK Emerald & Champagne',
    category: 'inaugural',
    description: 'University forest emerald paired with shimmering champagne gold and formal academic serif fonts.',
    fontPreset: 'playfair',
    accentColor: '#DFC79B',
    backgroundColor: '#12382C',
    textColor: '#FAF8F5',
    borderStyle: 'ornate-gold',
    photoFrame: 'arch',
    photoFilter: 'champagne',
    tag: 'University Crest'
  },
  {
    id: 'celestial-midnight',
    name: 'Cybernetics & Intelligence',
    category: 'inaugural',
    description: 'Deep starlight navy celebrating artificial intelligence, cryptography, and modern scholarly excellence.',
    fontPreset: 'cinzel',
    accentColor: '#DFC79B',
    backgroundColor: '#0A0F1D',
    textColor: '#F8FAFC',
    borderStyle: 'minimal-double',
    photoFrame: 'square-gold',
    photoFilter: 'natural',
    tag: 'AI & Innovation'
  },
  {
    id: 'royal-ivory',
    name: 'Chancellor Ivory Parchment',
    category: 'inaugural',
    description: 'Classic university archival ivory parchment with embossed gold leaf framing.',
    fontPreset: 'serif-luxury',
    accentColor: '#9A7E47',
    backgroundColor: '#FAF8F5',
    textColor: '#1A1C1E',
    borderStyle: 'ornate-gold',
    photoFrame: 'oval',
    photoFilter: 'natural',
    tag: 'Archival Parchment'
  }
];

export const AI_TEXT_PRESETS: Record<string, string[]> = {
  inaugural: [
    "The Vice-Chancellor, on behalf of the University Senate and Governing Council, cordially requests the honour of your presence at the Inaugural Lecture entitled: 'Intelligent Horizons: Navigating Artificial Intelligence, Cyber Resiliency, and Software Innovation for National Transformation' to be delivered by Professor Rashidah Funke Olanrewaju.",
    "A celebration of academic distinction, pioneering research, and scholarly triumph. Join the University Senate as Professor Rashidah Funke Olanrewaju presents her seminal contributions to Artificial Intelligence, Software Engineering, and National Development.",
    "Academic excellence illuminated. You are warmly invited to witness the milestone Inaugural Lecture marking the zenith of scholarly leadership, cybersecurity innovations, and educational mentorship by Professor Rashidah Funke Olanrewaju."
  ]
};

export const INITIAL_EVENTS: EventData[] = [
  {
    id: 'event-prof-rashidah-inaugural',
    slug: 'prof-rashidah-inaugural-lecture',
    title: 'The Inaugural Lecture of Professor Rashidah Funke Olanrewaju',
    category: 'inaugural',
    hosts: 'The Vice-Chancellor & University Senate, Nasarawa State University, Keffi',
    celebrants: 'Professor Rashidah Funke Olanrewaju, Ph.D., FNCS, MIET',
    date: '2026-11-26',
    startTime: '10:00',
    endTime: '14:00',
    timezone: 'Africa/Lagos (GMT+1)',
    venueName: '1,000-Seat University Main Auditorium, NSUK',
    address: 'Main Campus, Keffi, Nasarawa State, Nigeria',
    mapUrl: 'https://maps.google.com/?q=Nasarawa+State+University+Keffi',
    dressCode: 'Academic Regalia for Faculty / Formal Corporate or Regal Traditional for Guests',
    dressCodeNote: 'Academic robes, hoods, and caps for University Senate and visiting professors. Black tie or corporate traditional attire for dignitaries.',
    dressCodeColors: ['#0E1726', '#C5A869', '#12382C', '#FAF8F5'],
    rsvpDeadline: '2026-11-15',
    contactPhone: '+234 803 700 8821',
    contactEmail: 'inaugural@nsuk.edu.ng',
    description: 'The Vice-Chancellor on behalf of the University Senate cordially invites the academic community, industry leaders, global researchers, and the general public to the milestone Inaugural Lecture entitled: "Intelligent Horizons: Navigating Artificial Intelligence, Cyber Resiliency, and Software Innovation for National Transformation" to be delivered by Professor Rashidah Funke Olanrewaju.',
    instructions: 'Senate Procession convenes at the Senate Building Foyer at 09:30 AM prompt. Guests must be seated by 09:45 AM. Presentation of Digital Pass or QR Code required at the VIP entrance.',
    
    themeId: 'inaugural-prestige',
    fontPreset: 'cinzel',
    photoUrl: '/images/prof-rashidah-olanrewaju.jpg',
    photoFrame: 'arch',
    photoFilter: 'natural',
    photoScale: 1.0,
    photoPosition: { x: 0, y: 0 },
    accentColor: '#C5A869',
    backgroundColor: '#0E1726',
    textColor: '#F8FAFC',
    borderStyle: 'ornate-gold',
    
    showCountdown: true,
    countdownStyle: 'gold-luxe',
    
    schedule: [
      {
        id: 'inaug-1',
        time: '09:30',
        title: 'Academic Senate Robing & Procession',
        location: 'Senate Chamber to Auditorium',
        description: 'Assembly of the Vice-Chancellor, Registrar, Deans, Professors, and University Mace bearer in full academic regalia.'
      },
      {
        id: 'inaug-2',
        time: '10:00',
        title: 'National & University Anthems / Welcome Remarks',
        location: 'Main Auditorium Sanctuary',
        description: 'Opening invocation, formal constitution of the Inaugural Assembly by the Vice-Chancellor.'
      },
      {
        id: 'inaug-3',
        time: '10:30',
        title: 'Academic Citation of Professor Rashidah Funke Olanrewaju',
        location: 'Podium of Honor',
        description: 'Reading of the distinguished scholar\'s curriculum vitae, academic pedigree, research discoveries, and international honors.'
      },
      {
        id: 'inaug-4',
        time: '11:00',
        title: 'Delivery of the Inaugural Lecture',
        location: 'Auditorium Lectern',
        description: '"Intelligent Horizons: Navigating Artificial Intelligence, Cyber Resiliency, and Software Innovation for National Transformation".'
      },
      {
        id: 'inaug-5',
        time: '12:30',
        title: 'Vice-Chancellor\'s Formal Admission & Standing Ovation',
        location: 'High Table Dais',
        description: 'Formal reception of the Inaugural Lecturer into the Distinguished College of University Professors and presentation of the Commemorative Plaque.'
      },
      {
        id: 'inaug-6',
        time: '13:15',
        title: 'Inaugural Banquet & Academic Reception',
        location: 'University Banquet Pavilion',
        description: 'Buffet dining, toasts, cultural musical serenades, and goodwill presentations from international delegates.'
      }
    ],
    gallery: [
      {
        id: 'inaug-g1',
        url: '/images/prof-rashidah-olanrewaju.jpg',
        caption: 'Professor Rashidah Funke Olanrewaju in Official Academic Portrait',
        author: 'NSUK Media & Communications'
      },
      {
        id: 'inaug-g2',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
        caption: 'Academic Senate Assembly & Research Symposia',
        author: 'University Archives'
      },
      {
        id: 'inaug-g3',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
        caption: 'Mentoring Young Women in Artificial Intelligence & Robotics',
        author: 'ISERG Laboratory'
      },
      {
        id: 'inaug-g4',
        url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
        caption: 'Delivering Keynote on AI Ethics & National Digital Transformation',
        author: 'National Computing Conference'
      }
    ],
    isPublic: true,
    passwordRequired: false,
    allowPlusOne: true,
    maxGuestsPerRsvp: 2
  }
];

export const INITIAL_RSVPS: RSVPResponse[] = [
  {
    id: 'rsvp-inaug-1',
    eventId: 'event-prof-rashidah-inaugural',
    fullName: 'Professor Sa\'adatu Hassan Liman (Vice-Chancellor)',
    email: 'vc@nsuk.edu.ng',
    phone: '+234 803 111 0001',
    attendance: 'attending',
    guestCount: 2,
    plusOneNames: ['Principal Officers Entourage'],
    dietary: 'None',
    message: 'On behalf of the University Senate, Council, and community, we celebrate Professor Rashidah Funke Olanrewaju on this historic Inaugural Lecture. A true beacon of academic excellence.',
    songRequest: 'Academic Processional Fanfare & Symphony',
    groupCategory: 'VIP',
    submittedAt: '2026-10-18T10:00:00Z',
    qrTicketCode: 'EA-RFO-001',
    checkedIn: true,
    checkedInAt: '2026-10-23T09:30:00Z',
    photoUrl: '/images/vc-saadatu-hassan-liman.jpg'
  },
  {
    id: 'rsvp-inaug-2',
    eventId: 'event-prof-rashidah-inaugural',
    fullName: 'Professor Olayemi Durosinmi (Dean, Faculty of Computing)',
    email: 'dean.computing@nsuk.edu.ng',
    phone: '+234 802 222 3344',
    attendance: 'attending',
    guestCount: 2,
    plusOneNames: ['Dr. Amina Garba'],
    dietary: 'Halal',
    message: 'A proud milestone for our faculty and the entire Nigerian computing academia. Heartfelt congratulations, Prof. Rashidah!',
    songRequest: 'Elgar — Pomp and Circumstance',
    groupCategory: 'Colleagues',
    submittedAt: '2026-10-19T11:15:00Z',
    qrTicketCode: 'EA-RFO-108',
    checkedIn: true,
    checkedInAt: '2026-10-23T09:40:00Z',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rsvp-inaug-3',
    eventId: 'event-prof-rashidah-inaugural',
    fullName: 'Engr. Dr. Teddy Mantoro (IEEE Fellow & International Delegate)',
    email: 't.mantoro@ieee.org',
    phone: '+60 12 345 6789',
    attendance: 'attending',
    guestCount: 1,
    dietary: 'Halal',
    message: 'Flying in from Kuala Lumpur to celebrate an extraordinary research collaborator and former IIUM colleague. Congratulations on your Professorial Inauguration!',
    songRequest: 'Canon in D Major — Pachelbel',
    groupCategory: 'VIP',
    submittedAt: '2026-10-20T14:30:00Z',
    qrTicketCode: 'EA-RFO-772',
    checkedIn: false,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rsvp-inaug-4',
    eventId: 'event-prof-rashidah-inaugural',
    fullName: 'Fatima Zahra Usman (President, Women in Tech NSUK)',
    email: 'fz.usman@students.nsuk.edu.ng',
    phone: '+234 814 555 1290',
    attendance: 'attending',
    guestCount: 2,
    plusOneNames: ['Aisha Abdullahi'],
    dietary: 'None',
    message: 'Thank you for inspiring generations of young women to pursue artificial intelligence and engineering. We are so proud of our Director!',
    songRequest: 'Alicia Keys — Girl on Fire',
    groupCategory: 'Friends',
    submittedAt: '2026-10-21T16:00:00Z',
    qrTicketCode: 'EA-RFO-931',
    checkedIn: false,
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rsvp-inaug-5',
    eventId: 'event-prof-rashidah-inaugural',
    fullName: 'Dr. Kabir Al-Hassan (Nigeria Computer Society Council)',
    email: 'kabir.alhassan@ncs.org.ng',
    phone: '+234 803 888 2341',
    attendance: 'attending',
    guestCount: 2,
    plusOneNames: ['Hajiya Maryam Kabir'],
    dietary: 'Halal',
    message: 'A celebration of scholarship and distinguished service to the computing profession in Nigeria. Warm congratulations Prof. Rashidah Funke Olanrewaju.',
    songRequest: 'Symphony No. 9 in D minor',
    groupCategory: 'VIP',
    submittedAt: '2026-10-22T09:20:00Z',
    qrTicketCode: 'EA-RFO-441',
    checkedIn: false,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_WISHES: GuestWish[] = [
  {
    id: 'wish-1',
    eventId: 'event-prof-rashidah-inaugural',
    author: 'Professor Sa\'adatu Hassan Liman (Vice-Chancellor)',
    message: 'A historic day of intellectual brilliance for Nasarawa State University, Keffi. Congratulations to our distinguished scholar, Professor Rashidah Funke Olanrewaju, on your Inaugural Lecture.',
    createdAt: '2026-10-20T10:00:00Z',
    likes: 42
  },
  {
    id: 'wish-2',
    eventId: 'event-prof-rashidah-inaugural',
    author: 'International Islamic University Malaysia (IIUM) Alumni Network',
    message: 'From Kulliyyah of Information and Communication Technology in Gombak to the highest summits of professorial honor in Nigeria. We are immensely proud of our alumna!',
    createdAt: '2026-10-21T14:20:00Z',
    likes: 35
  },
  {
    id: 'wish-3',
    eventId: 'event-prof-rashidah-inaugural',
    author: 'Information Security & Systems Research Group (ISERG) NSUK',
    message: 'To our visionary mentor and group lead: your unwavering passion for cryptographic breakthroughs and artificial intelligence continues to inspire us every single day. Congratulations, Professor!',
    createdAt: '2026-10-22T08:45:00Z',
    likes: 29
  },
  {
    id: 'wish-4',
    eventId: 'event-prof-rashidah-inaugural',
    author: 'Students & Incubator Startups, EDC NSUK',
    message: 'Your leadership at the Entrepreneurship Development Centre gave us the courage to build tech ventures from scratch. Thank you for being our mentor, leader, and academic mother!',
    createdAt: '2026-10-23T11:05:00Z',
    likes: 38
  }
];
