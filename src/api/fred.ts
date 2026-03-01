import { apiFetch } from "../services/fetch";
import type { EconomicIndicator } from '../types';
import { cache } from '../services/cache';

const CACHE_TTL = 30 * 60 * 1000; // 30 min

const INDICATORS = [
  { id: 'GDP', name: 'Real GDP', unit: 'Billions $' },
  { id: 'UNRATE', name: 'Unemployment Rate', unit: '%' },
  { id: 'CPIAUCSL', name: 'Consumer Price Index', unit: 'Index' },
  { id: 'FEDFUNDS', name: 'Federal Funds Rate', unit: '%' },
  { id: 'T10Y2Y', name: '10Y-2Y Treasury Spread', unit: '%' },
  { id: 'WALCL', name: 'Fed Balance Sheet', unit: 'Millions $' },
];

async function fetchSeries(seriesId: string, apiKey: string): Promise<{ value: number; date: string } | null> {
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`;
    
    const res = await apiFetch(url);
    if (!res.ok) return null;
    const data = await res.json() as { observations?: { value: string; date: string }[] };
    const obs = data.observations?.[0];
    if (!obs || obs.value === '.') return null;
    return { value: parseFloat(obs.value), date: obs.date };
  } catch {
    return null;
  }
}

export async function fetchFedIndicators(apiKey: string): Promise<EconomicIndicator[]> {
  const cacheKey = 'fed:indicators';
  const cached = cache.get<EconomicIndicator[]>(cacheKey);
  if (cached) return cached;
  if (!apiKey) return [];

  const results = await Promise.all(
    INDICATORS.map(async (ind) => {
      const obs = await fetchSeries(ind.id, apiKey);
      return {
        id: ind.id,
        name: ind.name,
        value: obs?.value ?? NaN,
        unit: ind.unit,
        date: obs?.date ?? '',
      };
    }),
  );

  cache.set(cacheKey, results, CACHE_TTL);
  return results;
}
