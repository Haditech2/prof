import { createHmac, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const ADMIN_COOKIE = 'oa_admin_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface SessionPayload {
  sub: string;
  exp: number;
  nonce: string;
}

function base64Url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function hmac(secret: string, data: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

export function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured');
  }
  return secret;
}

export function createSessionToken(email: string): string {
  const payload: SessionPayload = {
    sub: email.toLowerCase(),
    exp: Date.now() + SESSION_TTL_MS,
    nonce: randomUUID()
  };
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${hmac(sessionSecret(), encoded)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token || !token.includes('.')) return null;

  const [encoded, signature] = token.split('.');
  try {
    const expected = hmac(sessionSecret(), encoded);
    const provided = signature;
    if (
      expected.length !== provided.length ||
      !timingSafeEqual(Buffer.from(expected), Buffer.from(provided))
    ) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Returns the admin email for the request, or null when not signed in. */
export function getAdminEmail(req: VercelRequest): string | null {
  const header = req.headers.cookie;
  if (!header) return null;

  const match = header
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`));

  if (!match) return null;
  const payload = verifySessionToken(decodeURIComponent(match.slice(ADMIN_COOKIE.length + 1)));
  return payload ? payload.sub : null;
}

export function setSessionCookie(res: VercelResponse, token: string): void {
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
  );
}

export function clearSessionCookie(res: VercelResponse): void {
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
}

/**
 * Verifies admin credentials. Supports password hashing (scrypt) via
 * ADMIN_PASSWORD_HASH ("scrypt$<saltHex>$<hashHex>") or a plain
 * ADMIN_PASSWORD secret; HASH is preferred.
 */
export function verifyAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!expectedEmail || email.trim().toLowerCase() !== expectedEmail) {
    return false;
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    const [scheme, saltHex, expectedHex] = hash.split('$');
    if (scheme !== 'scrypt' || !saltHex || !expectedHex) return false;
    const derived = scryptSync(password, Buffer.from(saltHex, 'hex'), 64);
    const expected = Buffer.from(expectedHex, 'hex');
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  if (!expectedPassword) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expectedPassword);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Tiny best-effort login throttle per serverless instance. */
const attempts = new Map<string, { failures: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 10 * 60 * 1000;

export function checkLoginRate(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const entry = attempts.get(ip);
  const now = Date.now();

  if (entry && entry.blockedUntil > now) {
    return { allowed: false, retryAfterMs: entry.blockedUntil - now };
  }

  if (entry && entry.blockedUntil <= now) {
    attempts.delete(ip);
  }

  return { allowed: true };
}

export function recordLoginFailure(ip: string): void {
  const entry = attempts.get(ip) || { failures: 0, blockedUntil: 0 };
  entry.failures += 1;
  if (entry.failures >= MAX_ATTEMPTS) {
    entry.blockedUntil = Date.now() + BLOCK_MS;
  }
  attempts.set(ip, entry);
}

export function recordLoginSuccess(ip: string): void {
  attempts.delete(ip);
}

/** Shallow IP extraction from proxy headers. */
export function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}
