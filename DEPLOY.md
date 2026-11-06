# Publishing the RSVP app (Vercel + PostgreSQL)

The tribute wall and generated RSVP poster wall use a real shared backend, with
localStorage as an offline/local-development fallback.

## How it works

- Visitors submit tributes on the profile page, event page, or the homepage quick-post box.
  Every submission is stored with `status='pending'` and is **not** public until an admin approves it.
- Admin opens the **Admin** nav item (also "Tribute Moderation" in the footer), signs in with
  email + password, then can: publish / unpublish, edit (author, role, affiliation, title,
  message, status), or delete each tribute.
- The **Secretariat** guest registry and check-in tools are hidden from public visitors. The
  link appears only after the server validates the administrator's signed session cookie;
  direct dashboard rendering is guarded by the same authenticated state.
- Likes on published tributes are public; visitor IPs are stored only as salted hashes, never raw.
- Confirmed/generated RSVP posters are published immediately to the public poster wall. Re-generating
  with the same digital pass updates the existing wall card instead of creating a duplicate.
- Poster portraits are reduced to lightweight wall thumbnails before upload; the full-quality portrait
  stays in the visitor's browser for the 1920 × 2560 download.
- Spam defences: honeypot field, message length cap, per-instance login throttle
  (5 failed attempts → 10 min block), HMAC-signed HttpOnly session cookie (7-day TTL).

## API endpoints (Vercel serverless)

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /api/tributes` | public | published tributes |
| `POST /api/tributes` | public | submit (stored pending) |
| `POST /api/tributes/:id/like` | public | like a published tribute |
| `GET /api/auth/session` | public | is the visitor signed in as admin |
| `POST /api/auth/login` | public | admin sign-in |
| `POST /api/auth/session` | admin | sign out |
| `GET /api/tributes?all=1` | admin | pending + published |
| `PATCH /api/tributes/:id` | admin | edit / publish / unpublish |
| `DELETE /api/tributes/:id` | admin | delete |
| `GET /api/posters?eventId=:id` | public | latest generated RSVP posters |
| `POST /api/posters` | public | create or update a visitor's poster wall entry |

## One-time setup

1. **Create a PostgreSQL database** — e.g. a free [Neon](https://neon.tech) database
   (or Vercel Postgres from the Vercel dashboard). The `tributes` and `rsvp_posters`
   tables are created automatically on the first API request; no manual migration needed.
2. **Add environment variables** in Vercel (Project → Settings → Environment Variables),
   and in `.env` locally (see `.env.example`):
   - `DATABASE_URL` — the Postgres connection string. Existing Vercel Postgres/Neon
     integrations may provide `POSTGRES_URL` automatically instead.
   - `ADMIN_EMAIL` — the admin sign-in email
   - `ADMIN_PASSWORD` or (recommended) `ADMIN_PASSWORD_HASH`
     - hash generator command is in `.env.example`
   - `ADMIN_SESSION_SECRET` — long random string (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
3. **Deploy** — `git push` to the repo connected to Vercel, or run `vercel --prod`.
   The `api/` folder deploys as Vercel serverless functions automatically and the SPA
   rewrite in `vercel.json` does not shadow `/api/*` (filesystem routes win).

## Local development without a database

`npm run dev` works without `DATABASE_URL`: shared API calls fail gracefully, and generated
posters remain visible on that visitor's local wall with a "saved on this device" notice.
Nothing needs to be configured for frontend development.
