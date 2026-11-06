import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminEmail, clearSessionCookie } from '../_lib/auth.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ authenticated: Boolean(getAdminEmail(req)) });
  }

  if (req.method === 'POST') {
    clearSessionCookie(res);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
