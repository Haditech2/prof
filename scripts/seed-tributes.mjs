/**
 * Seeds the shared tribute wall with the curated tributes from
 * src/data/mockData.ts. Run once against your production database:
 *
 *   node --env-file=.env ./scripts/seed-tributes.mjs
 *
 * Safe to re-run: existing ids are skipped (ON CONFLICT DO NOTHING).
 */
import { readFileSync } from 'node:fs';
import { Pool } from 'pg';

const REQUIRED_ENV = ['DATABASE_URL'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing ${key}. Set it in .env or the environment.`);
    process.exit(1);
  }
}

// --- Pull INITIAL_WISHES out of the TypeScript source without a build step ---
const source = readFileSync(new URL('../src/data/mockData.ts', import.meta.url), 'utf8');
const match = source.match(/export const INITIAL_WISHES: GuestWish\[\] = (\[[\s\S]*?\n\]);/);
if (!match) {
  console.error('Could not locate INITIAL_WISHES in src/data/mockData.ts');
  process.exit(1);
}
// The literal is plain JSON-compatible TS (quoted keys are strings). Evaluate it safely.
const wishes = new Function(`"use strict"; return (${match[1].replace(/\bundefined\b/g, 'null')});`)();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost')
    ? undefined
    : { rejectUnauthorized: false }
});

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS tributes (
    id            TEXT PRIMARY KEY,
    event_id      TEXT NOT NULL,
    author        TEXT NOT NULL,
    role          TEXT,
    affiliation   TEXT,
    title         TEXT,
    photo_url     TEXT,
    message       TEXT NOT NULL,
    full_text     TEXT,
    status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'published')),
    likes         INTEGER NOT NULL DEFAULT 0,
    ip_hash       TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at  TIMESTAMPTZ,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS tributes_status_created_idx ON tributes (status, created_at DESC);
`;

try {
  await pool.query(SCHEMA);

  let seeded = 0;
  for (const w of wishes) {
    const { rowCount } = await pool.query(
      `INSERT INTO tributes
         (id, event_id, author, role, affiliation, title, photo_url, message, full_text, status, likes, created_at, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'published', $10, $11, $11)
       ON CONFLICT (id) DO NOTHING`,
      [
        w.id,
        w.eventId || 'event-prof-rashidah-inaugural',
        w.author,
        w.role ?? null,
        w.affiliation ?? null,
        w.title ?? null,
        w.photoUrl ?? null,
        w.message,
        w.fullText ?? null,
        w.likes ?? 0,
        w.createdAt ? new Date(w.createdAt) : new Date()
      ]
    );
    seeded += rowCount ?? 0;
  }
  console.log(`Seeded ${seeded} tributes (${wishes.length - seeded} already present).`);
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
