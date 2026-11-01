import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, getPool, hashIp } from '../../_lib/db';
import { clientIp } from '../../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

  const { rows, rowCount } = await getPool().query(
    `UPDATE tributes SET likes = likes + 1, updated_at = updated_at
     WHERE id = $1 AND status = 'published'
     RETURNING likes`,
    [id]
  );

  if (!rowCount) {
    return res.status(404).json({ error: 'Tribute not found.' });
  }

  // Anonymous viewers keep a per-channel like below the fold; hashing avoids
  // storing raw IPs while still being stable.
  const channel = hashIp(clientIp(req)).slice(0, 12);

  return res.status(200).json({ likes: Number(rows[0].likes), channel });
}
