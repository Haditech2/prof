import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  clientIp,
  checkLoginRate,
  clearSessionCookie,
  createSessionToken,
  recordLoginFailure,
  recordLoginSuccess,
  setSessionCookie,
  verifyAdminCredentials
} from '../_lib/auth.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = clientIp(req);
  const rate = checkLoginRate(ip);
  if (!rate.allowed) {
    return res.status(429).json({
      error: 'Too many attempts. Try again shortly.',
      retryAfterMs: rate.retryAfterMs
    });
  }

  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    if (!verifyAdminCredentials(email, password)) {
      recordLoginFailure(ip);
      // Identical generic message so responses never reveal which part failed.
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Admin credentials are not configured on the server yet.'
    });
  }

  recordLoginSuccess(ip);
  setSessionCookie(res, createSessionToken(email));
  return res.status(200).json({ authenticated: true, email: email.trim().toLowerCase() });
}
