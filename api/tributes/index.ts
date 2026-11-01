import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, getPool, hashIp, rowToWish } from '../_lib/db';
import { clientIp, getAdminEmail } from '../_lib/auth';

const MAX_MESSAGE_LENGTH = 8000;
const MAX_IDENTITY_LENGTH = 200;

function clean(value: unknown): string | undefined {
  return typeof value === 'string' ? value.trim().slice(0, MAX_IDENTITY_LENGTH) || undefined : undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();
  } catch (error) {
    return res.status(503).json({ error: 'Tribute storage is not reachable yet.' });
  }

  const isAdmin = Boolean(getAdminEmail(req));

  if (req.method === 'GET') {
    const wantAll = req.query.all === '1';
    const status = wantAll && isAdmin ? ['pending', 'published'] : ['published'];
    const { rows } = await getPool().query(
      `SELECT * FROM tributes WHERE status = ANY($1::text[]) ORDER BY created_at DESC LIMIT 500`,
      [status]
    );
    return res.status(200).json({
      tributes: rows.map(rowToWish),
      viewer: { isAdmin }
    });
  }

  if (req.method === 'POST') {
    const body = (req.body || {}) as Record<string, unknown>;

    // Honeypot: silently accept junk so bots think they succeeded.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return res.status(201).json({ id: 'accepted', status: 'pending' });
    }

    const author = clean(body.author);
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const eventId = clean(body.eventId) || 'event-prof-rashidah-inaugural';

    if (!author || !message) {
      return res.status(400).json({ error: 'Your name and a message are required.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Please keep the message under ${MAX_MESSAGE_LENGTH} characters.` });
    }

    const id = `wish-${randomUUID()}`;
    await getPool().query(
      `INSERT INTO tributes (id, event_id, author, role, affiliation, title, photo_url, message, full_text, status, likes, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', 1, $10)`,
      [
        id,
        eventId,
        author,
        clean(body.role) ?? null,
        clean(body.affiliation) ?? null,
        clean(body.title) ?? null,
        clean(body.photoUrl) ?? null,
        message.slice(0, MAX_MESSAGE_LENGTH),
        typeof body.fullText === 'string' && body.fullText.trim()
          ? body.fullText.trim().slice(0, 40_000)
          : null,
        hashIp(clientIp(req))
      ]
    );

    return res.status(201).json({ id, status: 'pending' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
