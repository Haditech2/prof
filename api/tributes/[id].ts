import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, getPool, rowToWish } from '../../_lib/db';
import { getAdminEmail } from '../../_lib/auth';

function requireAdmin(req: VercelRequest): string | null {
  return getAdminEmail(req);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = requireAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: 'Sign in as the event administrator.' });
  }

  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!id) {
    return res.status(400).json({ error: 'Tribute id is required.' });
  }

  try {
    await ensureSchema();
  } catch {
    return res.status(503).json({ error: 'Tribute storage is not reachable yet.' });
  }

  if (req.method === 'DELETE') {
    const { rowCount } = await getPool().query('DELETE FROM tributes WHERE id = $1', [id]);
    if (!rowCount) {
      return res.status(404).json({ error: 'Tribute not found.' });
    }
    return res.status(200).json({ deleted: id });
  }

  // PATCH — partial admin edit.
  const body = (req.body || {}) as Record<string, unknown>;
  const allowed: Record<string, string> = {
    author: 'author',
    role: 'role',
    affiliation: 'affiliation',
    title: 'title',
    message: 'message',
    fullText: 'full_text',
    photoUrl: 'photo_url'
  };

  const assignments: string[] = [];
  const values: unknown[] = [id];
  let paramIndex = 2;

  for (const [key, column] of Object.entries(allowed)) {
    if (key in body) {
      const value = body[key];
      values.push(typeof value === 'string' ? value.trim() || null : null);
      assignments.push(`${column} = $${paramIndex++}`);
    }
  }

  if ('status' in body) {
    const status = body.status === 'published' ? 'published' : 'pending';
    assignments.push(`status = $${paramIndex++}`);
    values.push(status);
    assignments.push(`published_at = $${paramIndex++}`);
    values.push(status === 'published' ? new Date().toISOString() : null);
  }

  if (assignments.length === 0) {
    return res.status(400).json({ error: 'Nothing to update.' });
  }

  assignments.push(`updated_at = $${paramIndex++}`);
  values.push(new Date().toISOString());

  const { rows, rowCount } = await getPool().query(
    `UPDATE tributes SET ${assignments.join(', ')} WHERE id = $1 RETURNING *`,
    values
  );

  if (!rowCount) {
    return res.status(404).json({ error: 'Tribute not found.' });
  }

  return res.status(200).json({ tribute: rowToWish(rows[0]) });
}
