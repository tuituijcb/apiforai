import type { Bindings, NewsItem } from './types';
import { fetchAllNews } from './api/news';
import { fetchMarkets } from './api/markets';
import { fetchCrypto } from './api/crypto';
import { fetchFedIndicators } from './api/fred';
import { fetchWorldLeaders } from './api/leaders';
import { analyzeCorrelations } from './analysis/correlation';
import { analyzeNarratives } from './analysis/narrative';
import { analyzeMainCharacters } from './analysis/main-character';

/** KV keys */
const KEYS = {
  news: 'data:news',
  markets: 'data:markets',
  crypto: 'data:crypto',
  fed: 'data:fed',
  leaders: 'data:leaders',
  analysis: 'data:analysis',
  summary: 'data:summary',
  lastSync: 'meta:lastSync',
} as const;

/** Write JSON to KV with 2-hour expiration (safety net) */
async function kvPut(kv: KVNamespace, key: string, data: unknown): Promise<void> {
  await kv.put(key, JSON.stringify(data), { expirationTtl: 7200 });
}

export async function refreshAll(env: Bindings): Promise<{ ok: boolean; keys: string[]; errors: string[] }> {
  const errors: string[] = [];
  const keys: string[] = [];
  const kv = env.CACHE;

  // 1. News
  try {
    const news = await fetchAllNews();
    await kvPut(kv, KEYS.news, news);
    keys.push('news');
  } catch (e) { errors.push(`news: ${e}`); }

  // 2. Markets
  try {
    const markets = await fetchMarkets(env.FINNHUB_API_KEY || '');
    await kvPut(kv, KEYS.markets, markets);
    keys.push('markets');
  } catch (e) { errors.push(`markets: ${e}`); }

  // 3. Crypto
  try {
    const crypto = await fetchCrypto();
    await kvPut(kv, KEYS.crypto, crypto);
    keys.push('crypto');
  } catch (e) { errors.push(`crypto: ${e}`); }

  // 4. Fed
  try {
    const fed = await fetchFedIndicators(env.FRED_API_KEY || '');
    await kvPut(kv, KEYS.fed, fed);
    keys.push('fed');
  } catch (e) { errors.push(`fed: ${e}`); }

  // 5. Leaders
  try {
    const leaders = await fetchWorldLeaders();
    await kvPut(kv, KEYS.leaders, leaders);
    keys.push('leaders');
  } catch (e) { errors.push(`leaders: ${e}`); }

  // 6. Analysis (depends on news)
  try {
    const newsRaw = await kv.get(KEYS.news);
    if (newsRaw) {
      const newsMap = JSON.parse(newsRaw) as Record<string, NewsItem[]>;
      const allNews = Object.values(newsMap).flat();
      const analysis = {
        correlations: analyzeCorrelations(allNews),
        narratives: analyzeNarratives(allNews),
        mainCharacters: analyzeMainCharacters(allNews),
      };
      await kvPut(kv, KEYS.analysis, analysis);
      keys.push('analysis');
    }
  } catch (e) { errors.push(`analysis: ${e}`); }

  // 7. Summary (compact)
  try {
    const [newsRaw, cryptoRaw, marketsRaw, analysisRaw] = await Promise.all([
      kv.get(KEYS.news),
      kv.get(KEYS.crypto),
      kv.get(KEYS.markets),
      kv.get(KEYS.analysis),
    ]);

    const newsMap = newsRaw ? JSON.parse(newsRaw) : {};
    const allNews: NewsItem[] = Object.values(newsMap).flat() as NewsItem[];
    const crypto = cryptoRaw ? JSON.parse(cryptoRaw) : [];
    const markets = marketsRaw ? JSON.parse(marketsRaw) : {};
    const analysis = analysisRaw ? JSON.parse(analysisRaw) : {};

    const alerts = allNews.filter((n: NewsItem) => n.isAlert);
    const summary = {
      ts: Date.now(),
      totalNews: allNews.length,
      alerts: alerts.length,
      topAlerts: alerts.slice(0, 5).map((a: NewsItem) => a.title),
      topNews: Object.fromEntries(
        Object.entries(newsMap).map(([cat, items]) => [cat, (items as NewsItem[]).slice(0, 3).map((i: NewsItem) => i.title)]),
      ),
      crypto: (crypto as { symbol: string; price: number; changePercent24h: number }[]).map((c) => ({
        symbol: c.symbol, price: c.price, change: `${c.changePercent24h > 0 ? '+' : ''}${c.changePercent24h.toFixed(1)}%`,
      })),
      indices: ((markets as { indices?: { name: string; price: number; changePercent: number }[] }).indices ?? []).map((i) => ({
        name: i.name, price: i.price, change: `${i.changePercent > 0 ? '+' : ''}${i.changePercent.toFixed(2)}%`,
      })),
      hotTopics: ((analysis as { correlations?: { topic: string; count: number; momentum: string }[] }).correlations ?? []).slice(0, 5),
      mainCharacters: ((analysis as { mainCharacters?: { name: string; mentions: number }[] }).mainCharacters ?? []).slice(0, 5),
    };
    await kvPut(kv, KEYS.summary, summary);
    keys.push('summary');
  } catch (e) { errors.push(`summary: ${e}`); }

  // Update sync timestamp
  await kv.put(KEYS.lastSync, new Date().toISOString());

  return { ok: errors.length === 0, keys, errors };
}

export { KEYS };
