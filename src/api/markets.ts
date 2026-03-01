import type { MarketItem } from '../types';
import { INDICES, INDEX_ETF_MAP, SECTORS, COMMODITIES, COMMODITY_ETF_MAP } from '../config/markets';
import { cache } from '../services/cache';

const CACHE_TTL = 60 * 1000; // 1 min

interface FinnhubQuote {
  c: number;
  d: number;
  dp: number;
}

async function fetchQuote(symbol: string, apiKey: string): Promise<FinnhubQuote | null> {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json() as FinnhubQuote;
    if (data.c === 0 && data.dp === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export async function fetchIndices(apiKey: string): Promise<MarketItem[]> {
  const cacheKey = 'markets:indices';
  const cached = cache.get<MarketItem[]>(cacheKey);
  if (cached) return cached;
  if (!apiKey) return INDICES.map(i => ({ symbol: i.symbol, name: i.name, price: NaN, change: NaN, changePercent: NaN, type: 'index' as const }));

  const items = await Promise.all(
    INDICES.map(async (idx) => {
      const etf = INDEX_ETF_MAP[idx.symbol] || idx.symbol;
      const q = await fetchQuote(etf, apiKey);
      return { symbol: idx.symbol, name: idx.name, price: q?.c ?? NaN, change: q?.d ?? NaN, changePercent: q?.dp ?? NaN, type: 'index' as const };
    }),
  );
  cache.set(cacheKey, items, CACHE_TTL);
  return items;
}

export async function fetchSectors(apiKey: string): Promise<MarketItem[]> {
  const cacheKey = 'markets:sectors';
  const cached = cache.get<MarketItem[]>(cacheKey);
  if (cached) return cached;
  if (!apiKey) return SECTORS.map(s => ({ symbol: s.symbol, name: s.name, price: NaN, change: NaN, changePercent: NaN, type: 'sector' as const }));

  const items = await Promise.all(
    SECTORS.map(async (sec) => {
      const q = await fetchQuote(sec.symbol, apiKey);
      return { symbol: sec.symbol, name: sec.name, price: q?.c ?? NaN, change: q?.d ?? NaN, changePercent: q?.dp ?? NaN, type: 'sector' as const };
    }),
  );
  cache.set(cacheKey, items, CACHE_TTL);
  return items;
}

export async function fetchCommodities(apiKey: string): Promise<MarketItem[]> {
  const cacheKey = 'markets:commodities';
  const cached = cache.get<MarketItem[]>(cacheKey);
  if (cached) return cached;
  if (!apiKey) return COMMODITIES.map(c => ({ symbol: c.symbol, name: c.name, price: NaN, change: NaN, changePercent: NaN, type: 'commodity' as const }));

  const items = await Promise.all(
    COMMODITIES.map(async (com) => {
      const etf = COMMODITY_ETF_MAP[com.symbol] || com.symbol;
      const q = await fetchQuote(etf, apiKey);
      return { symbol: com.symbol, name: com.name, price: q?.c ?? NaN, change: q?.d ?? NaN, changePercent: q?.dp ?? NaN, type: 'commodity' as const };
    }),
  );
  cache.set(cacheKey, items, CACHE_TTL);
  return items;
}

export type MarketScope = 'indices' | 'sectors' | 'commodities';

export async function fetchMarkets(apiKey: string, scopes?: MarketScope[]): Promise<Record<string, MarketItem[]>> {
  const s = scopes ?? ['indices', 'sectors', 'commodities'];
  const result: Record<string, MarketItem[]> = {};
  if (s.includes('indices')) result.indices = await fetchIndices(apiKey);
  if (s.includes('sectors')) result.sectors = await fetchSectors(apiKey);
  if (s.includes('commodities')) result.commodities = await fetchCommodities(apiKey);
  return result;
}
