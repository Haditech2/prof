# EVERAFTER — Extraordinary Digital Invitations & Event Concierge

EVERAFTER is a high-end, responsive digital invitation and RSVP management platform built for weddings, wedding Fatiha, milestone birthdays, anniversaries, corporate galas, and special occasions.

---

## Key Features

### 1. Immersive Editorial Landing Page
- **Oversized Typography & Visual Hierarchy**: Cormorant Garamond, Playfair Display, Cinzel, and Amiri Arabic calligraphy with warm ivory (`#FAF7F0`), deep charcoal (`#20211F`), and champagne gold (`#C6A76A`) accents.
- **Interactive Live Demonstration Card**: Dynamic guest personalization simulator allowing visitors to preview the invitation as different attendees (e.g. VIP, Family, Friend).
- **Precision Real-Time Countdown**: Displays days, hours, minutes, and seconds synchronized with the event timezone. Supports 6 visual styles (Editorial Serif, Gold Luxe Digital, Circular Minimal, Flip Clock Cards, Frosted Glass, and Velvet Banner) with event-day and post-event celebration simulations.
- **Curated Haute Gallery**: Filter by category (Weddings, Wedding Fatiha & Nikah, Birthdays, Engagements, Anniversaries, Corporate), color palette, or search query.

### 2. Invitation Creation Studio
- **Split-Screen Workspace**: Real-time live canvas preview updating alongside form controls.
- **Full Event Information**: Hosts, celebrants, category, date, start/end time, timezone, venue, full address, Google Maps link, dress code, RSVP deadline, contact details, description, and custom instructions.
- **Portrait Photography & Framing**: Drag-and-drop file upload, scale/zoom controls, vertical pan shift, 6 artistic frame geometries (Royal Arch, Cameo Oval, Medallion, Curved Soft, Gold Border, Full Bleed), and 5 editorial film filters (Natural Crisp, Champagne Warm, Sepia Vintage, Noir & Blanc, Emerald Velvet).
- **Smart AI Copy Assistant**: 1-click tailored wording generator for traditional Islamic Fatiha & Nikah blessings, romantic wedding vows, black-tie milestone galas, and corporate honours.
- **Undo / Redo / Autosave**: Full state history stack and instant persistence via browser `localStorage`.

### 3. Ultra-HD Downloadable Invitation Generator
- **Multi-Format Export**: PNG (Lossless HD), JPEG (Optimized Web), and PDF (Print Ready).
- **Aspect Ratios**: Portrait (4:5.5 Classic), Story / Status (9:16 WhatsApp & Instagram Story), Square (1:1 Feed Post), and Landscape (16:9 Banner).
- **Resolution Control**: 1x Web, 2x Retina HD (Recommended), and 3x Ultra Print Ready (300 DPI equivalent) with zero watermarks.

### 4. Personalized Event Page (`/e/:slug`)
- **Vanity URL Bar**: Shareable link (e.g. `everafter.live/e/amina-and-yusuf`) with 1-click WhatsApp message formatting and clipboard copy.
- **Event Programme Timeline**: Chronological order of events with times, locations, and descriptions.
- **Venue Navigation & Map**: Destination coordinates and direct Google Maps navigation button.
- **Attire Guide**: Dress code showcase with etiquette note and color palette swatches.
- **Calendar Synchronization**: 1-click "Add to Google Calendar" and instant `.ICS` file download for Apple Calendar and Outlook.
- **Heartfelt Wishes & Memory Board**: Real-time community wall where guests can leave congratulations and likes.

### 5. Interactive RSVP Registration & Digital Pass
- **Form Fields**: Full name, email, phone, attendance status (*Joyfully Accept*, *Regretfully Decline*, *Tentative*), +1 accompanying guest names, dietary preferences (Halal, Vegetarian, Pescatarian, Kosher, Gluten-Free, Custom), warm message, and DJ song request.
- **Celebration Feedback**: Confetti shower animation upon submission.
- **Digital Guest Pass**: Generates an encrypted QR Code ticket with ticket reference ID for venue reception scanning.

### 6. Host Guest Management Dashboard
- **Real-Time KPIs**: Total responses, confirmed guests (including +1s), checked-in count, tentative responses, regrets, and confirmation rate percentage.
- **Dietary & Music Highlights**: Aggregated breakdown of dietary requirements and song requests.
- **Searchable & Filterable Registry**: Filter by attendance, group category (VIP, Family, Friends, Bridal Party, Colleagues), or search name/ticket code.
- **CSV Export**: 1-click export of the complete guest roster as a formatted spreadsheet (`.csv`).
- **Venue QR Reception Scanner**: Door check-in mode to scan or verify guest ticket codes and record venue arrivals with timestamps.

---

## Tech Stack & Architecture

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS design tokens, Glassmorphism utilities
- **Build Tool**: Vite 8
- **Icons**: Lucide React
- **Export Engine**: `html2canvas`, `jspdf`
- **QR Generation**: `qrcode`
- **Celebration Effects**: `canvas-confetti`

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Vite dev server
npm run dev

# 3. Build production bundle
npm run build
```

Local dev server runs at: `http://127.0.0.1:5173/`
