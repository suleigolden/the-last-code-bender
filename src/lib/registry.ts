import type { Bender, Leaderboard, Radar } from '@/types/registry';
import { REGISTRY_DATA } from '@/lib/registry-data';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchRegistry(): Promise<Bender[]> {
  return REGISTRY_DATA;
}

export async function fetchLeaderboard(): Promise<Leaderboard> {
  return fetchJson<Leaderboard>('/registry/leaderboard.json');
}

export async function fetchRadar(): Promise<Radar> {
  return fetchJson<Radar>('/registry/radar.json');
}
