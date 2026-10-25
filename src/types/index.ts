export type AspectRatioType = 'story' | 'portrait' | 'square' | 'landscape';

export type EventCategory = 
  | 'wedding'
  | 'fatiha'
  | 'birthday'
  | 'anniversary'
  | 'engagement'
  | 'graduation'
  | 'naming'
  | 'corporate'
  | 'cultural'
  | 'inaugural';

export type CountdownStyle = 
  | 'editorial'
  | 'gold-luxe'
  | 'circular'
  | 'flip'
  | 'glass'
  | 'banner';

export type PhotoFrameShape = 
  | 'arch'
  | 'oval'
  | 'medallion'
  | 'rounded'
  | 'square-gold'
  | 'full';

export type PhotoFilter = 
  | 'natural'
  | 'vintage'
  | 'editorial-bw'
  | 'champagne'
  | 'emerald';

export type FontPreset = 
  | 'serif-luxury'
  | 'playfair'
  | 'cinzel'
  | 'script'
  | 'arabic';

export type BorderStyle = 
  | 'ornate-gold'
  | 'minimal-double'
  | 'botanical-leaf'
  | 'arabesque'
  | 'none';

export type AttendanceStatus = 'attending' | 'declined' | 'tentative';

export type GuestGroup = 'VIP' | 'Family' | 'Friends' | 'Bridal Party' | 'Colleagues' | 'General';

export type DietaryOption = 'None' | 'Vegetarian' | 'Halal' | 'Kosher' | 'Gluten-Free' | 'Pescatarian' | 'Other';

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location?: string;
  description?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  author?: string;
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  hosts: string;
  celebrants: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;
  venueName: string;
  address: string;
  mapUrl?: string;
  dressCode: string;
  dressCodeNote?: string;
  dressCodeColors?: string[];
  rsvpDeadline: string;
  contactPhone: string;
  contactEmail: string;
  description: string;
  instructions?: string;
  
  // Theme & Styling
  themeId: string;
  fontPreset: FontPreset;
  photoUrl: string;
  photoFrame: PhotoFrameShape;
  photoFilter: PhotoFilter;
  photoScale: number; // 0.8 to 2.0
  photoPosition: { x: number; y: number };
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderStyle: BorderStyle;
  
  // Countdown
  showCountdown: boolean;
  countdownStyle: CountdownStyle;
  
  // Schedule & Details
  schedule: ScheduleItem[];
  gallery: GalleryPhoto[];
  
  // Access & Privacy
  isPublic: boolean;
  passwordRequired: boolean;
  accessPassword?: string;
  allowPlusOne: boolean;
  maxGuestsPerRsvp: number;
}

export interface RSVPResponse {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  attendance: AttendanceStatus;
  guestCount: number;
  plusOneNames?: string[];
  dietary: DietaryOption;
  dietaryDetails?: string;
  message?: string;
  songRequest?: string;
  groupCategory: GuestGroup;
  submittedAt: string;
  qrTicketCode: string;
  checkedIn: boolean;
  checkedInAt?: string;
  photoUrl?: string; // Guest's photo for the "I Will Be There" DP banner
}

export interface GuestWish {
  id: string;
  eventId: string;
  author: string;
  message: string;
  createdAt: string;
  likes: number;
}

export interface InvitationThemePreset {
  id: string;
  name: string;
  category: EventCategory;
  description: string;
  fontPreset: FontPreset;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderStyle: BorderStyle;
  photoFrame: PhotoFrameShape;
  photoFilter: PhotoFilter;
  bgGradient?: string;
  tag: string;
}
