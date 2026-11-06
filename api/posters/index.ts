import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  ensureSchema,
  getPool,
  hashIp,
  hashPosterClientKey,
  rowToPoster
} from '../_lib/db.js';
import { clientIp } from '../_lib/auth.js';

const DEFAULT_EVENT_ID = 'event-prof-rashidah-inaugural';
const MAX_NAME_LENGTH = 160;
const MAX_EVENT_ID_LENGTH = 160;
const MAX_CLIENT_KEY_LENGTH = 240;
const MAX_PHOTO_LENGTH = 170_000;

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanPhotoUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const url = value.trim();
  if (!url) return undefined;
  if (/^data:image\/(?:jpeg|jpg|png|webp);base64,/i.test(url) && url.length <= MAX_PHOTO_LENGTH) {
    return url;
  }
  if (/^https:\/\//i.test(url) && url.length <= 2000) return url;
  return undefined;
}

function boundedNumber(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();
  } catch {
    return res.status(503).json({ error: 'The poster wall is not reachable yet.' });
  }

  if (req.method === 'GET') {
    const eventId = cleanText(req.query.eventId, MAX_EVENT_ID_LENGTH) || DEFAULT_EVENT_ID;
    const { rows } = await getPool().query(
      `SELECT * FROM rsvp_posters WHERE event_id = $1 ORDER BY updated_at DESC LIMIT 200`,
      [eventId]
    );
    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).json({ posters: rows.map(rowToPoster) });
  }

  if (req.method === 'POST') {
    const body = (req.body || {}) as Record<string, unknown>;

    // Honeypot: silently accept automated submissions without publishing them.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return res.status(201).json({ poster: null });
    }

    const eventId = cleanText(body.eventId, MAX_EVENT_ID_LENGTH) || DEFAULT_EVENT_ID;
    const fullName = cleanText(body.fullName, MAX_NAME_LENGTH);
    const clientKey = cleanText(body.clientKey, MAX_CLIENT_KEY_LENGTH);

    if (!fullName || !clientKey) {
      return res.status(400).json({ error: 'A guest name and RSVP reference are required.' });
    }

    const ipHash = hashIp(clientIp(req));
    const clientKeyHash = hashPosterClientKey(clientKey);

    // Prevent automated creation of large public walls while allowing updates
    // to an existing visitor poster at any time.
    const existing = await getPool().query(
      'SELECT id FROM rsvp_posters WHERE event_id = $1 AND client_key_hash = $2 LIMIT 1',
      [eventId, clientKeyHash]
    );
    if (!existing.rowCount) {
      const recent = await getPool().query(
        `SELECT COUNT(*)::int AS count FROM rsvp_posters
         WHERE ip_hash = $1 AND created_at > now() - interval '1 hour'`,
        [ipHash]
      );
      if (Number(recent.rows[0]?.count || 0) >= 20) {
        return res.status(429).json({ error: 'Too many posters were created recently. Please try again later.' });
      }
    }

    const id = `poster-${randomUUID()}`;
    const { rows } = await getPool().query(
      `INSERT INTO rsvp_posters (
         id, event_id, client_key_hash, attendee_name, photo_url,
         photo_scale, photo_offset_x, photo_offset_y, ip_hash
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (event_id, client_key_hash) DO UPDATE SET
         attendee_name = EXCLUDED.attendee_name,
         photo_url = EXCLUDED.photo_url,
         photo_scale = EXCLUDED.photo_scale,
         photo_offset_x = EXCLUDED.photo_offset_x,
         photo_offset_y = EXCLUDED.photo_offset_y,
         updated_at = now()
       RETURNING *`,
      [
        id,
        eventId,
        clientKeyHash,
        fullName,
        cleanPhotoUrl(body.photoUrl) ?? null,
        boundedNumber(body.photoScale, 1, 1.5, 1),
        boundedNumber(body.photoOffsetX, -12, 12, 0),
        boundedNumber(body.photoOffsetY, -12, 12, 0),
        ipHash
      ]
    );

    return res.status(201).json({ poster: rowToPoster(rows[0]) });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
