import { apiFetch } from "../services/fetch";
import type { NewsCategory, NewsItem } from '../types';
import { CATEGORY_QUERIES, ALL_CATEGORIES } from '../config/feeds';
import { containsAlertKeyword, detectRegion, detectTopics } from '../config/keywords';
import { cache } from '../services/cache';

const CACHE_TTL = 5 * 60 * 1000; // 5 min

interface GdeltArticle {
  title: string;
  url: string;
  seendate: string;
  domain: string;
}

function parseGdeltDate(dateStr: string): number {
  if (!dateStr) return Date.now();
  const m = dateStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (m) {
    return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`).getTime();
  }
  return new Date(dateStr).getTime();
}

function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function fetchCategoryNews(category: NewsCategory): Promise<NewsItem[]> {
  const cacheKey = `news:${category}`;
  const cached = cache.get<NewsItem[]>(cacheKey);
  if (cached) return cached;

  const query = CATEGORY_QUERIES[category];
  const fullQuery = `${query} sourcelang:english`;
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(fullQuery)}&timespan=7d&mode=artlist&maxrecords=20&format=json&sort=date`;

  try {
    
    const res = await apiFetch(url);
    if (!res.ok) return [];

    const ct = res.headers.get('content-type');
    if (!ct?.includes('application/json')) return [];

    const data = await res.json() as { articles?: GdeltArticle[] };
    if (!data?.articles) return [];

    const items: NewsItem[] = data.articles.map((a, i) => {
      const alert = containsAlertKeyword(a.title || '');
      return {
        id: `gdelt-${category}-${hashCode(a.url || String(i))}-${i}`,
        title: a.title || '',
        link: a.url || '',
        timestamp: parseGdeltDate(a.seendate),
        source: a.domain || 'Unknown',
        category,
        isAlert: !!alert,
        alertKeyword: alert?.keyword,
        region: detectRegion(a.title || ''),
        topics: detectTopics(a.title || ''),
      };
    });

    cache.set(cacheKey, items, CACHE_TTL);
    return items;
  } catch {
    return [];
  }
}

export async function fetchAllNews(
  categories?: NewsCategory[],
): Promise<Record<string, NewsItem[]>> {
  const cats = categories ?? ALL_CATEGORIES;
  const results: Record<string, NewsItem[]> = {};

  // Fetch in parallel (server-side, no rate limit concern for GDELT)
  const entries = await Promise.all(
    cats.map(async (cat) => [cat, await fetchCategoryNews(cat)] as const),
  );
  for (const [cat, items] of entries) {
    results[cat] = items;
  }
  return results;
}
