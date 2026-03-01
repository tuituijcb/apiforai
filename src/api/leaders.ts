import type { WorldLeader, LeaderNews } from '../types';
import { WORLD_LEADERS } from '../config/leaders';
import { cache } from '../services/cache';

const CACHE_TTL = 10 * 60 * 1000; // 10 min

interface GdeltArticle {
  title: string;
  url: string;
  domain: string;
}

async function fetchLeaderNews(keywords: string[]): Promise<LeaderNews[]> {
  const query = keywords.map(k => `"${k}"`).join(' OR ');
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=(${encodeURIComponent(query)}) sourcelang:english&timespan=3d&mode=artlist&maxrecords=5&format=json&sort=date`;

  try {
    const { apiFetch } = await import("../services/fetch");
    const res = await apiFetch(url);
    if (!res.ok) return [];
    const ct = res.headers.get('content-type');
    if (!ct?.includes('application/json')) return [];
    const data = await res.json() as { articles?: GdeltArticle[] };
    return (data.articles ?? []).map(a => ({
      source: a.domain || 'Unknown',
      title: a.title || '',
      link: a.url || '',
    }));
  } catch {
    return [];
  }
}

export async function fetchWorldLeaders(): Promise<WorldLeader[]> {
  const cacheKey = 'leaders:all';
  const cached = cache.get<WorldLeader[]>(cacheKey);
  if (cached) return cached;

  const leaders = await Promise.all(
    WORLD_LEADERS.map(async (cfg) => ({
      id: cfg.id,
      name: cfg.name,
      title: cfg.title,
      country: cfg.country,
      flag: cfg.flag,
      news: await fetchLeaderNews(cfg.keywords),
    })),
  );

  cache.set(cacheKey, leaders, CACHE_TTL);
  return leaders;
}
