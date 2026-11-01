import { GuestWish } from '../types';

export interface AdminTribute extends GuestWish {
  status: 'pending' | 'published';
  createdAt: string;
  updatedAt?: string;
}

const API_BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'same-origin',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = await response.json();
      if (payload && typeof payload.error === 'string') message = payload.error;
    } catch {
      /* keep generic message */
    }
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export interface TributeSubmission {
  eventId: string;
  author: string;
  role?: string;
  affiliation?: string;
  title?: string;
  message: string;
  fullText?: string;
  photoUrl?: string;
}

export const tributesApi = {
  /** Published tributes for all visitors. */
  async listPublished(): Promise<GuestWish[]> {
    const data = await request<{ tributes: GuestWish[] }>('/tributes');
    return data.tributes;
  },

  /** All tributes including pending ones (admin only). */
  async listAll(): Promise<AdminTribute[]> {
    const data = await request<{ tributes: AdminTribute[] }>('/tributes?all=1');
    return data.tributes;
  },

  /** Public submission — stored as pending until an administrator publishes it. */
  async submit(submission: TributeSubmission): Promise<{ id: string; status: string }> {
    return request('/tributes', {
      method: 'POST',
      body: JSON.stringify({ ...submission, website: '' }) // honeypot stays empty for humans
    });
  },

  async like(id: string): Promise<{ likes: number }> {
    return request(`/tributes/${encodeURIComponent(id)}/like`, { method: 'POST' });
  },

  // ——— Admin ———
  async session(): Promise<{ authenticated: boolean }> {
    return request('/auth/session');
  },

  async login(email: string, password: string): Promise<{ authenticated: boolean }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async logout(): Promise<void> {
    await request('/auth/session', { method: 'POST' });
  },

  async update(
    id: string,
    patch: Partial<TributeSubmission & { status: 'pending' | 'published' }>
  ): Promise<AdminTribute> {
    const data = await request<{ tribute: AdminTribute }>(`/tributes/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch)
    });
    return data.tribute;
  },

  async remove(id: string): Promise<void> {
    await request(`/tributes/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
};
