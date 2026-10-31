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
    "The Vice-Chancellor, Professor Sa'adatu Hassan Liman, Ph.D. (Fellow UNESCO, ACLS, FIIFP, CBER (Oxford), fnipr (Hon)), cordially invites you to the 65th Inaugural Lecture entitled: 'INTENTIONAL INTELLIGENCE: From Digital Trust to Human Flourishing' to be delivered by Professor Rashidah Funke Olanrewaju (Citp, FCRIDE, SMIEEE, MIET, MNCS, MAITP, MIAENG, MWIE, Fellow Erasmus+ • PhD, MSc.IE, DIS (IIUM), BSc. (Hons.) (UPM)), Professor of Computer Science and Artificial Intelligence & Director, Entrepreneurship Development Centre, Nasarawa State University, Keffi.",
    "A celebration of academic distinction, pioneering AI research, and scholarly leadership. Join the University Senate as Professor Rashidah Funke Olanrewaju delivers the 65th Inaugural Lecture on 'INTENTIONAL INTELLIGENCE: From Digital Trust to Human Flourishing'.",
    "Academic excellence illuminated. You are warmly invited to witness the 65th Inaugural Lecture marking the zenith of scholarly leadership and AI innovation by Professor Rashidah Funke Olanrewaju on Wednesday, 25 November 2026 at 2:00 p.m."
  ]
};

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
    instructions: 'Senate Procession convenes at the Senate Building Foyer at 01:15 PM prompt. Guests and dignitaries must be seated in the Assembly Hall by 01:45 PM prompt. Presentation of Digital Pass or QR Code required at the VIP entrance.',
    
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
        id: 'inaug-g-ajiteru',
        url: '/images/dr-sherif-ajiteru.jpg',
        caption: 'Dr. Sherif A. R. Ajiteru — Acting Deputy Provost & IIUM Fellow',
        category: 'IIUM Fellow',
        author: 'IIUM Alumni Network'
      },
      {
        id: 'inaug-g-mentee',
        url: '/images/student-mentee-tribute.jpg',
        caption: 'Mentee & Research Scholar — Computing Department',
        category: 'Student Mentee',
        author: 'ISERG Research Group'
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
        id: 'inaug-g-poster-landscape',
        url: '/images/inaugural-poster-65th.jpg',
        caption: 'Convocation Invitation Commemorative Banner',
        category: 'Official Banner',
        author: 'NSUK Ceremonials Committee'
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
    fullName: 'Dr. Sherif A. R. Ajiteru',
    email: 's.ajiteru@achievers.edu.ng',
    phone: '+234 803 555 1200',
    attendance: 'attending',
    guestCount: 1,
    dietary: 'Halal',
    message: 'Delighted to celebrate an exemplary Muslim sister, scholar, and fellow IIUM academic family member.',
    groupCategory: 'VIP',
    submittedAt: '2026-10-24T12:00:00Z',
    qrTicketCode: 'EA-RFO-009',
    checkedIn: false,
    photoUrl: '/images/dr-sherif-ajiteru.jpg'
  },
  {
    id: 'rsvp-inaug-3',
    eventId: 'event-prof-rashidah-inaugural',
    fullName: 'Abdulwaheed Olajide Omotosho, Ph.D.',
    email: 'a.omotosho@alumni.org',
    phone: '+234 802 333 4455',
    attendance: 'attending',
    guestCount: 2,
    dietary: 'Halal',
    message: 'Our journey from Madrasa Quran memorisation to this professorial summit is our collective joy and pride.',
    groupCategory: 'Family',
    submittedAt: '2026-10-25T14:00:00Z',
    qrTicketCode: 'EA-RFO-077',
    checkedIn: false,
    photoUrl: '/images/prof-rashidah-candid-celebration.jpg'
  },
  {
    id: 'rsvp-inaug-4',
    eventId: 'event-prof-rashidah-inaugural',
    fullName: 'ISERG Computing Scholar & Mentee',
    email: 'mentee@students.nsuk.edu.ng',
    phone: '+234 814 666 7788',
    attendance: 'attending',
    guestCount: 1,
    dietary: 'None',
    message: 'Thank you for being my lecturer, mentor, and role model!',
    groupCategory: 'Colleagues',
    submittedAt: '2026-10-23T15:30:00Z',
    qrTicketCode: 'EA-RFO-312',
    checkedIn: false,
    photoUrl: '/images/student-mentee-tribute.jpg'
  },
  {
    id: 'rsvp-inaug-5',
    eventId: 'event-prof-rashidah-inaugural',
    fullName: 'Engr. Dr. Teddy Mantoro (IEEE Fellow & International Delegate)',
    email: 't.mantoro@ieee.org',
    phone: '+60 12 345 6789',
    attendance: 'attending',
    guestCount: 1,
    dietary: 'Halal',
    message: 'Flying in from Kuala Lumpur to celebrate an extraordinary research collaborator and former IIUM colleague.',
    songRequest: 'Canon in D Major — Pachelbel',
    groupCategory: 'VIP',
    submittedAt: '2026-10-20T14:30:00Z',
    qrTicketCode: 'EA-RFO-772',
    checkedIn: false,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_WISHES: GuestWish[] = [
  {
    id: 'wish-omotosho',
    eventId: 'event-prof-rashidah-inaugural',
    author: 'Abdulwaheed Olajide Omotosho, Ph.D.',
    role: 'Childhood Friend & Madrasa Colleague · Ph.D.',
    affiliation: 'Family & Childhood Companion',
    title: 'A Heartfelt Tribute to Professor Rasidah Funke Olanrewaju',
    photoUrl: '/images/prof-rashidah-candid-celebration.jpg',
    message: 'We share a cherished family bond and the invaluable experience of attending the same Madrasa, where we memorised the Holy Qur\'an. Her elevation to Professor is an inspiration to younger generations and our collective pride.',
    fullText: `A HEARTFELT TRIBUTE TO PROFESSOR RASIDAH FUNKE OLANREWAJU ON HER INAUGURAL LECTURE AT NASARAWA STATE UNIVERSITY, KEFFI

It is with immense joy, pride, and profound admiration that I celebrate Professor Rasidah Funke Olanrewaju on the occasion of her Inaugural Lecture at Nasarawa State University, Keffi.

I have known Professor Rasidah from childhood. We share a cherished family bond and the invaluable experience of attending the same Madrasa, where we memorised the Holy Qur'an. Our journey from those humble beginnings to this remarkable academic milestone is a testament to the power of knowledge, perseverance, dedication, and divine grace.

Professor Rasidah is an extraordinary intellectual, erudite scholar whose journey began as a Lecturer at International Islamic University Malaysia. Her philosophical depth, wisdom, and wealth of knowledge are truly immeasurable. Her elevation to the prestigious rank of Professor is not merely a personal achievement; it is a source of pride to our family and an inspiration to younger generations who aspire to excel in academia and contribute meaningfully to society.

Congratulations on your well-deserved professorial rank and the successful delivery of your Inaugural Lecture! Your journey is a shining example of what commitment, intellectual excellence, and determination can accomplish.

May Almighty Allah continue to increase you in knowledge, wisdom, sound health, and beneficial accomplishments. May He make this new chapter of your academic journey even more rewarding and grant you greater opportunities to contribute to humanity.

As you continue to soar to greater heights, may your achievements remain a source of pride, inspiration, and lasting impact.

Congratulations once again, Professor Rasidah Funke Olanrewaju. Your success is our collective joy and pride.

Barokah lahu fhykum.

— Abdulwaheed Olajide Omotosho, Ph.D.`,
    createdAt: '2026-10-25T16:30:00Z',
    likes: 88
  },
  {
    id: 'wish-ajiteru',
    eventId: 'event-prof-rashidah-inaugural',
    author: 'Dr. Sherif A. R. Ajiteru',
    role: 'Political Scientist & Acting Deputy Provost, Postgraduate Studies',
    affiliation: 'Achievers University, Owo, Nigeria · IIUM Alum',
    title: 'Tribute to Professor Rashidah Funke Olanrewaju',
    photoUrl: '/images/dr-sherif-ajiteru.jpg',
    message: 'As a fellow member of the International Islamic University Malaysia (IIUM) academic family, I celebrate this outstanding milestone. Her career reflects knowledge, faith, ethics, and service to humanity.',
    fullText: `TRIBUTE TO PROFESSOR RASHIDAH FUNKE OLANREWAJU ON HER INAUGURAL LECTURE
Nasarawa State University Keffi

It is with profound joy, admiration and a deep sense of pride that I celebrate an exceptional academic, distinguished computer scientist, visionary leader and exemplary Muslim sister, Professor Rashidah Funke Olanrewaju, on the auspicious occasion of her inaugural lecture at Nasarawa State University, Keffi.

An inaugural lecture represents one of the most significant milestones in the career of a university professor. It provides an accomplished scholar with the opportunity to present the substance of her intellectual journey, demonstrate the societal relevance of her research and articulate a vision for the future of her discipline. Professor Olanrewaju's attainment of this prestigious academic milestone is therefore a fitting recognition of her years of dedicated scholarship, innovative research, teaching, mentorship and service to humanity.

Professor Olanrewaju is a Professor of Computer Science at Nasarawa State University, Keffi, and the Director of the University's Entrepreneurship Development Centre. Through her leadership, the Centre continues to promote innovation, digital transformation, entrepreneurship, youth empowerment and sustainable development. Her scholarship encompasses important fields such as artificial intelligence, software engineering, information security, machine learning and humanitarian engineering.

Her academic journey possesses an admirable international dimension. She obtained advanced academic training and contributed to the academic community of the International Islamic University Malaysia, particularly within Electrical and Computer Engineering. She subsequently returned to Nigeria with valuable international experience and a firm determination to contribute to the advancement of university education, technological innovation and national development.

As a fellow member of the International Islamic University Malaysia academic family, I am particularly delighted to celebrate this outstanding achievement. Her career reflects the values for which IIUM is renowned: the integration of knowledge, faith, ethics, professional excellence and service to humanity. She has successfully translated internationally acquired knowledge and experience into meaningful contributions to Nigerian higher education and society.

Professor Olanrewaju's accomplishment is especially inspiring because she represents the harmonious relationship between Islamic faith, intellectual excellence and service to humanity. As an accomplished Muslim woman in science and technology, she stands as an admirable role model for young Muslim women, researchers and aspiring academics across Nigeria, Malaysia, Africa and the wider world.

Through discipline, perseverance and devotion to beneficial knowledge, she has demonstrated that Muslim women can attain the highest levels of scholarship, leadership and technological innovation while remaining committed to their faith and moral values. Her journey reminds us of the Islamic injunction to seek knowledge and employ it for the advancement of humanity.

On this memorable occasion, I warmly congratulate Professor Rashidah Funke Olanrewaju, her family, colleagues, students and the entire Nasarawa State University community. May this inaugural lecture open another glorious chapter in her distinguished academic career.

May Almighty Allah continue to increase her in beneficial knowledge, wisdom, sound health and professional accomplishment. May He bless her scholarship, reward her service to humanity and make her intellectual contributions a lasting source of inspiration to present and future generations.

Bārakallāhu fīki, our distinguished Professor and beloved Muslim sister. May your intellectual light continue to illuminate generations, and may your scholarship remain a source of benefit to humanity.

Congratulations on this historic academic achievement.

— Dr Sherif A. R. Ajiteru
Political Scientist and Public Policy Analyst
Acting Deputy Provost, College of Postgraduate Studies
Achievers University, Owo, Ondo State, Nigeria`,
    createdAt: '2026-10-24T12:00:00Z',
    likes: 74
  },
  {
    id: 'wish-mentee',
    eventId: 'event-prof-rashidah-inaugural',
    author: 'Mentee & Student Researcher',
    role: 'Computing Scholar & Research Mentee',
    affiliation: 'Faculty of Computing & ISERG, NSUK',
    title: 'Thank You for Being My Lecturer, Mentor & Role Model',
    photoUrl: '/images/student-mentee-tribute.jpg',
    message: 'Prof. Rashida has taught me far beyond what can be found in textbooks. She showed me that having knowledge is valuable, but using that knowledge to positively influence others is even more meaningful.',
    fullText: `TRIBUTE TO PROF. RASHIDA FUNKE OLANREWAJU

It is with great joy, respect, and heartfelt appreciation that I pay tribute to Prof. Rashida Funke Olanrewaju, a remarkable woman who has made a meaningful impact on my life as a lecturer, mentor, and role model.

As my lecturer, Prof. Rashida has taught me far beyond what can be found in textbooks or lecture notes. Her approach to teaching, her wealth of knowledge, and her dedication to her students have encouraged me to take my education more seriously and to always strive for excellence.

As my mentor, she has been a source of guidance and encouragement. Her words, advice, and experiences have helped me understand the importance of discipline, hard work, confidence, and continuous learning. She has shown me that having knowledge is valuable, but using that knowledge to positively influence others is even more meaningful.

As my role model, Prof. Rashida represents many of the qualities I admire and hope to develop in myself. Her intelligence, confidence, dedication, humility, and commitment to excellence inspire me to become a better student and, in the future, a better professional.

I am grateful for the opportunity to have learned from her and to have benefited from her guidance. Her influence has encouraged me to believe more in myself and to understand that success requires patience, determination, consistency, and a willingness to learn.

Prof. Rashida Funke Olanrewaju, this tribute is my little way of saying thank you. Thank you for teaching, guiding, encouraging, and inspiring me. Your impact may not always be expressed in words, but it is deeply appreciated and will remain a meaningful part of my journey.

May Almighty Allah continue to bless you with wisdom, good health, strength, happiness, and greater achievements. May you continue to inspire and positively influence many more generations of students.

Thank you for being not only my lecturer, but also my mentor and a role model I am proud to look up to.

With profound respect and appreciation, I celebrate you, Prof. Rashida Funke Olanrewaju.`,
    createdAt: '2026-10-23T15:30:00Z',
    likes: 63
  },
  {
    id: 'wish-vc',
    eventId: 'event-prof-rashidah-inaugural',
    author: 'Professor Sa\'adatu Hassan Liman, Ph.D.',
    role: 'Vice-Chancellor (Fellow UNESCO, ACLS, FIIFP, Hon. Fellow CBER, fnipr), NSUK',
    affiliation: 'Office of the Vice-Chancellor & University Senate',
    title: 'Historic Scholarly Distinction',
    photoUrl: '/images/vc-saadatu-hassan-liman.jpg',
    message: 'A historic day of intellectual brilliance for Nasarawa State University, Keffi. Congratulations to our distinguished scholar, Professor Rashidah Funke Olanrewaju, on your 65th Inaugural Lecture.',
    fullText: `On behalf of the University Senate, Council, management, staff, and students of Nasarawa State University, Keffi, I warmly felicitate with Professor Rashidah Funke Olanrewaju on delivering the 65th Inaugural Lecture of our university.

Her scholarship in Artificial Intelligence, cybersecurity, and entrepreneurship continues to bring tremendous honor to NSUK. As Director of our Entrepreneurship Development Centre (EDC), her vision has transformed student innovation across faculties.

We celebrate your professorial elevation and pray for many more impactful decades of service to academic excellence and national development.

— Professor Sa'adatu Hassan Liman, Ph.D.
Vice-Chancellor, Nasarawa State University, Keffi
(Fellow UNESCO, ACLS, FIIFP, Hon. Fellow CBER (Oxford), fnipr)`,
    createdAt: '2026-10-20T10:00:00Z',
    likes: 95
  }
];
