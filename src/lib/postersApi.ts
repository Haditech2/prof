import { GeneratedPoster } from '../types';

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
      /* keep the generic message */
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export interface PosterSubmission {
  eventId: string;
  clientKey: string;
  fullName: string;
  photoUrl?: string;
  photoScale: number;
  photoOffsetX: number;
  photoOffsetY: number;
}

export const postersApi = {
  async list(eventId: string): Promise<GeneratedPoster[]> {
    const query = new URLSearchParams({ eventId });
    const data = await request<{ posters: GeneratedPoster[] }>(`/posters?${query.toString()}`, {
      cache: 'no-store'
    });
    return data.posters;
  },

  async save(submission: PosterSubmission): Promise<GeneratedPoster> {
    const data = await request<{ poster: GeneratedPoster }>('/posters', {
      method: 'POST',
      body: JSON.stringify({ ...submission, website: '' })
    });
    return data.poster;
  }
};
