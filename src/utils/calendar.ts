import { EventData } from '../types';

/**
 * Format a date and time into Google Calendar & ICS standard format (YYYYMMDDTHHmmssZ)
 */
export function formatCalendarDate(dateStr: string, timeStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr ? timeStr.split(':').map(Number) : [12, 0];
    
    // Create UTC date representation
    const d = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  } catch {
    return '20261218T140000Z';
  }
}

/**
 * Generate a Google Calendar Add Event URL
 */
export function generateGoogleCalendarUrl(event: EventData): string {
  const startIso = formatCalendarDate(event.date, event.startTime);
  const endIso = formatCalendarDate(event.date, event.endTime || '22:00');
  
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(
    `${event.description}\n\nVenue: ${event.venueName}\nAddress: ${event.address}\n\nDress Code: ${event.dressCode}\n\nOffice of Professor Rashidah Funke Olanrewaju • Nasarawa State University, Keffi`
  );
  const location = encodeURIComponent(`${event.venueName}, ${event.address}`);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

/**
 * Generate and trigger download of an .ICS calendar file
 */
export function downloadIcsFile(event: EventData): void {
  const startIso = formatCalendarDate(event.date, event.startTime);
  const endIso = formatCalendarDate(event.date, event.endTime || '22:00');
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nasarawa State University Inaugural Lecture Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:nsuk-inaugural-${event.id}-${Date.now()}@nsuk.edu.ng`,
    `DTSTAMP:${formatCalendarDate(new Date().toISOString().slice(0, 10), '12:00')}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${event.title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.venueName}, ${event.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${event.slug || 'event'}-invitation.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
