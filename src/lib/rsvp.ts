import { RSVPResponse } from '../types';

export const MY_RSVP_STORAGE_KEY = 'prof_rashidah_my_rsvp_id';

export const createRsvpTicketCode = (slug: string) => {
  const prefix = slug.slice(0, 3).toUpperCase();
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return `EA-${prefix}-${10000 + (value[0] % 90000)}`;
  }
  return `EA-${prefix}-${String(Date.now()).slice(-5)}`;
};

export const createRsvpDraft = (eventId: string): RSVPResponse => ({
  id: 'rsvp-draft',
  eventId,
  fullName: '',
  email: '',
  phone: '',
  attendance: 'attending',
  guestCount: 1,
  dietary: 'None',
  groupCategory: 'General',
  submittedAt: '',
  qrTicketCode: '',
  checkedIn: false
});

export const guestFallbackEmail = (fullName: string) => {
  const localPart = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '') || 'guest';
  return `${localPart}@guest.nsuk.edu.ng`;
};
