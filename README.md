# NSUK 65th Inaugural Lecture RSVP

Official RSVP and personalized attendee-poster portal for the 65th Inaugural Lecture of Professor Rashidah Funke Olanrewaju at Nasarawa State University, Keffi.

## Features

- Concise event introduction with date, time, venue, and lecture topic
- RSVP confirmation with optional guest portrait
- Live 1920 × 2560 attendee-poster preview and download
- Oval portrait crop controls for zoom and positioning
- Public generated-poster wall with cross-device PostgreSQL persistence
- Digital QR guest pass and administrator check-in tools
- Moderated tribute and felicitation wall
- Local browser fallback when the shared API is unavailable

## Production data policy

The repository contains no seeded guests, generated posters, or sample tributes. RSVP and tribute collections start empty and are populated only by real visitor submissions.

## Development

```bash
npm install
npm run dev
```

The Vite app runs at the URL printed in the terminal.

## Validation

```bash
npm run build
npm run lint
```

## Deployment

The project is configured for Vercel serverless functions and PostgreSQL. See [`DEPLOY.md`](./DEPLOY.md) for environment variables, API routes, and setup details.

Core environment variables:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
