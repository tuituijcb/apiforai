import { apiFetch } from "../services/fetch";
import type { CryptoItem } from '../types';
import { CRYPTO } from '../config/markets';
import { cache } from '../services/cache';

const CACHE_TTL = 60 * 1000; // 1 min

interface CoinGeckoResponse {
  [id: string]: { usd: number; usd_24h_change?: number };
}

export async function fetchCrypto(coinIds?: string[]): Promise<CryptoItem[]> {
  const coins = coinIds
    ? CRYPTO.filter(c => coinIds.includes(c.id))
    : CRYPTO;
  if (coins.length === 0) return [];

  const ids = coins.map(c => c.id).join(',');
  const cacheKey = `crypto:${ids}`;
  const cached = cache.get<CryptoItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    
    const res = await apiFetch(url);
    if (!res.ok) return coins.map(c => ({ id: c.id, symbol: c.symbol, name: c.name, price: 0, change24h: 0, changePercent24h: 0 }));

    const data = await res.json() as CoinGeckoResponse;
    const items: CryptoItem[] = coins.map(c => {
      const p = data[c.id];
      return {
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        price: p?.usd ?? 0,
        change24h: p?.usd_24h_change ?? 0,
        changePercent24h: p?.usd_24h_change ?? 0,
      };
    });

    cache.set(cacheKey, items, CACHE_TTL);
    return items;
  } catch {
    return coins.map(c => ({ id: c.id, symbol: c.symbol, name: c.name, price: 0, change24h: 0, changePercent24h: 0 }));
  }
}
