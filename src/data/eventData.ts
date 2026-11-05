import { EventData, RSVPResponse, GuestWish } from '../types';

// Production event configuration. Guest registrations and tributes intentionally
// start empty and are populated only by real visitor submissions.

export const INITIAL_EVENTS: EventData[] = [
  {
    id: 'event-prof-rashidah-inaugural',
    slug: 'prof-rashidah-inaugural-lecture',
    title: 'The 65th Inaugural Lecture of Professor Rashidah Funke Olanrewaju',
    category: 'inaugural',
    hosts: 'The Vice-Chancellor, Professor Sa\'adatu Hassan Liman, Ph.D. (Fellow UNESCO, ACLS, FIIFP, CBER (Oxford), fnipr) & University Senate, NSUK',
    celebrants: 'Professor Rashidah Funke Olanrewaju (Citp, FCRIDE, SMIEEE, MIET, MNCS, MAITP, MIAENG, MWIE, Fellow Erasmus+ | PhD, MSc.IE, DIS (IIUM), BSc. (Hons.) (UPM))',
    date: '2026-11-25',
    startTime: '14:00',
    endTime: '17:30',
    timezone: 'Africa/Lagos (GMT+1)',
    venueName: 'Assembly Hall, Main Campus, Nasarawa State University, Keffi',
    address: 'Main Campus, Keffi, Nasarawa State, Nigeria',
    mapUrl: 'https://maps.google.com/?q=Nasarawa+State+University+Keffi',
    dressCode: 'Academic Regalia for Faculty / Formal Corporate or Regal Traditional for Guests',
    dressCodeNote: 'Academic robes, hoods, and caps for University Senate and visiting professors. Black tie or corporate traditional attire for dignitaries.',
    dressCodeColors: ['#006B66', '#D6A323', '#008F87', '#FFF4DC', '#B9A1D0'],
    rsvpDeadline: '2026-11-20',
    contactPhone: '+234 803 700 8821',
    contactEmail: 'inaugural@nsuk.edu.ng',
    description: 'The Vice-Chancellor, Professor Sa\'adatu Hassan Liman (Fellow UNESCO, ACLS, FIIFP, Hon. Fellow CBER (Oxford), fnipr) cordially invites the university community, researchers, industry partners, and the general public to the 65th Inaugural Lecture entitled: "INTENTIONAL INTELLIGENCE: From Digital Trust to Human Flourishing" to be delivered by Professor Rashidah Funke Olanrewaju, Professor of Computer Science and Artificial Intelligence & Director, Entrepreneurship Development Centre, Nasarawa State University, Keffi.',
    instructions: 'Senate Procession convenes at the Senate Building Foyer at 1:15 PM. Guests and dignitaries must be seated in the Assembly Hall by 1:45 PM. Presentation of Digital Pass or QR Code required at the VIP entrance.',

    themeId: 'inaugural-prestige',
    fontPreset: 'cinzel',
    photoUrl: '/images/prof-rashidah-olanrewaju.jpg',
    photoFrame: 'arch',
    photoFilter: 'natural',
    photoScale: 1.0,
    photoPosition: { x: 0, y: 0 },
    accentColor: '#D6A323',
    backgroundColor: '#006B66',
    textColor: '#FFFBF2',
    borderStyle: 'ornate-gold',

    showCountdown: true,
    countdownStyle: 'gold-luxe',

    schedule: [
      {
        id: 'inaug-1',
        time: '13:15',
        title: 'Academic Senate Robing & Procession',
        location: 'Senate Chamber to Assembly Hall',
        description: 'Assembly of the Vice-Chancellor, Registrar, Deans, Professors, and University Mace bearer in full academic regalia.'
      },
      {
        id: 'inaug-2',
        time: '13:45',
        title: 'Arrival & Seating of Dignitaries',
        location: 'Assembly Hall Sanctuary',
        description: 'Distinguished guests, royal fathers, and scholars seated.'
      },
      {
        id: 'inaug-3',
        time: '14:00',
        title: 'Anthems & Formal Constitution of the Assembly',
        location: 'Assembly Hall Podium',
        description: 'National and University Anthems, opening invocation, formal constitution of the 65th Inaugural Assembly by the Vice-Chancellor, Professor Sa\'adatu Hassan Liman, Ph.D. (Fellow UNESCO, ACLS, FIIFP, Hon. Fellow CBER (Oxford), fnipr).'
      },
      {
        id: 'inaug-4',
        time: '14:20',
        title: 'Academic Citation of Professor Rashidah Funke Olanrewaju',
        location: 'Podium of Honor',
        description: 'Reading of the distinguished scholar\'s curriculum vitae, academic pedigree, research achievements, and international fellowships.'
      },
      {
        id: 'inaug-5',
        time: '14:35',
        title: 'Delivery of the 65th Inaugural Lecture',
        location: 'Assembly Hall Lectern',
        description: '"INTENTIONAL INTELLIGENCE: From Digital Trust to Human Flourishing" by Professor Rashidah Funke Olanrewaju.'
      },
      {
        id: 'inaug-6',
        time: '15:50',
        title: 'Formal Admission by VC & Standing Ovation',
        location: 'High Table Dais',
        description: 'Formal reception of the Inaugural Lecturer into the Distinguished College of University Professors and presentation of the Commemorative Plaque by the Vice-Chancellor.'
      },
      {
        id: 'inaug-7',
        time: '16:30',
        title: 'Inaugural Banquet & Academic Reception',
        location: 'University Banquet Pavilion',
        description: 'Buffet dining, toasts, felicitations, and goodwill presentations from international delegates.'
      }
    ],
    gallery: [
      {
        id: 'inaug-g1',
        url: '/images/prof-rashidah-olanrewaju.jpg',
        caption: 'Official Academic Portrait — Professor Rashidah Funke Olanrewaju',
        category: 'Official Portrait',
        author: 'NSUK Media & Communications'
      },
      {
        id: 'inaug-g-candid',
        url: '/images/prof-rashidah-candid-celebration.jpg',
        caption: 'Joyful Moments — Academic Celebration & Mentorship',
        category: 'Academic Mentorship',
        author: 'Family & Scholarly Archive'
      },
      {
        id: 'inaug-g-nurax',
        url: '/images/nura-x-intentional-intelligence.jpg',
        caption: 'NURA-X: Intentional Intelligence Official AI Initiative Emblem',
        category: 'AI Initiative',
        author: 'Intelligent Software Engineering Research Group (ISERG)'
      },
      {
        id: 'inaug-g-desk',
        url: '/images/prof-rashidah-executive-desk.jpg',
        caption: 'Director at Executive Desk — Entrepreneurship Development Centre (EDC)',
        category: 'Leadership & EDC',
        author: 'NSUK Information & Protocol'
      },
      {
        id: 'inaug-g-courtyard',
        url: '/images/prof-rashidah-courtyard-regalia.jpg',
        caption: 'Full Academic Regalia at University Senate Courtyard',
        category: 'Ceremonial Regalia',
        author: 'Mufasa Photography'
      },
      {
        id: 'inaug-g-garden',
        url: '/images/prof-rashidah-garden-portrait.jpg',
        caption: 'Professor Rashidah Funke Olanrewaju at NSUK Main Campus',
        category: 'Campus Chronicle',
        author: 'NSUK Media'
      },
      {
        id: 'inaug-g-flyer-portrait',
        url: '/images/inaugural-lecture-flyer-portrait.jpg',
        caption: 'Official 65th Inaugural Lecture Proclamation Poster',
        category: 'Proclamation Poster',
        author: 'Office of the Vice-Chancellor, NSUK'
      },
      {
        id: 'inaug-g-edc-portrait',
        url: '/images/prof-rashidah-edc-summit-portrait.jpg',
        caption: 'Host & Director — North Central EDC Leadership Summit',
        category: 'EDC Leadership',
        author: 'EDC Media Directorate'
      },
      {
        id: 'inaug-g-sunlight-smiling',
        url: '/images/prof-rashidah-smiling-sunlight.jpg',
        caption: 'Warm Smiles & Scholarly Grace — Campus Moments',
        category: 'Campus Chronicle',
        author: 'NSUK Media & Communications'
      },
      {
        id: 'inaug-g-edc-full',
        url: '/images/prof-rashidah-edc-summit-full.jpg',
        caption: 'Director EDC Summit Keynote & Leadership Presentation',
        category: 'EDC Leadership',
        author: 'EDC Media Directorate'
      },
      {
        id: 'inaug-g-sunlight-candid',
        url: '/images/prof-rashidah-candid-sunlight.jpg',
        caption: 'Candid Academic Reflections at Nasarawa State University',
        category: 'Campus Chronicle',
        author: 'NSUK Media'
      },
      {
        id: 'inaug-g-edc-profile',
        url: '/images/prof-rashidah-edc-summit-profile.jpg',
        caption: 'Visionary Innovation & Entrepreneurship Development',
        category: 'EDC Leadership',
        author: 'EDC Protocol'
      }
    ],
    isPublic: true,
    passwordRequired: false,
    allowPlusOne: false,
    maxGuestsPerRsvp: 1
  }
];

export const INITIAL_RSVPS: RSVPResponse[] = [];

export const INITIAL_WISHES: GuestWish[] = [];
