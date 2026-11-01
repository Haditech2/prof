import { Pool } from 'pg';
import { createHash } from 'node:crypto';

let pool: Pool | null = null;
let schemaPromise: Promise<void> | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured');
    }

    pool = new Pool({
      connectionString,
      // Hosted Postgres providers (Neon, Supabase Postgres, RDS...) terminate TLS.
      ssl: connectionString.includes('localhost')
        ? undefined
        : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30_000
    });
  }
  return pool;
}

/**
 * Creates the tributes table on first use. Safe to call on every request —
 * the DDL is cached once per serverless instance.
 */
export async function ensureSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await getPool().query(`
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
        )
      `);

      await getPool().query(
        'CREATE INDEX IF NOT EXISTS tributes_status_created_idx ON tributes (status, created_at DESC)'
      );
    })().catch((error) => {
      // Allow a later request to retry if schema bootstrapping failed.
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

/** Maps a database row to the GuestWish shape used by the frontend. */
export function rowToWish(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    author: String(row.author),
    role: row.role ? String(row.role) : undefined,
    affiliation: row.affiliation ? String(row.affiliation) : undefined,
    title: row.title ? String(row.title) : undefined,
    photoUrl: row.photo_url ? String(row.photo_url) : undefined,
    message: String(row.message),
    fullText: row.full_text ? String(row.full_text) : undefined,
    likes: Number(row.likes) || 0,
    status: row.status === 'published' ? 'published' : 'pending',
    createdAt: new Date(row.created_at as string).toISOString(),
    publishedAt: row.published_at
      ? new Date(row.published_at as string).toISOString()
      : undefined,
    updatedAt: new Date(row.updated_at as string).toISOString()
  };
}

const IP_HASH_SALT = 'tribute-wall-v1';

/** One-way, salted hash so raw visitor IPs are never stored. */
export function hashIp(ip: string): string {
  return createHash('sha256').update(`${IP_HASH_SALT}:${ip}`).digest('hex');
}
