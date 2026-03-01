import { Hono } from 'hono';
import type { Bindings } from '../types';
import { fetchAllNews } from '../api/news';
import { fetchCrypto } from '../api/crypto';
import { fetchMarkets } from '../api/markets';
import { analyzeCorrelations } from '../analysis/correlation';
import { analyzeMainCharacters } from '../analysis/main-character';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const finnhubKey = c.env.FINNHUB_API_KEY || '';

  const [newsMap, crypto, markets] = await Promise.all([
    fetchAllNews(),
    fetchCrypto(['bitcoin', 'ethereum']),
    fetchMarkets(finnhubKey, ['indices']),
  ]);

  const allNews = Object.values(newsMap).flat();
  const alerts = allNews.filter(n => n.isAlert);
  const correlations = analyzeCorrelations(allNews);
  const mainChars = analyzeMainCharacters(allNews);

  // Compact summary
  const summary = {
    ts: Date.now(),
    totalNews: allNews.length,
    alerts: alerts.length,
    topAlerts: alerts.slice(0, 5).map(a => a.title),
    topNews: Object.fromEntries(
      Object.entries(newsMap).map(([cat, items]) => [cat, items.slice(0, 3).map(i => i.title)]),
    ),
    crypto: crypto.map(c => ({ symbol: c.symbol, price: c.price, change: `${c.changePercent24h > 0 ? '+' : ''}${c.changePercent24h.toFixed(1)}%` })),
    indices: (markets.indices ?? []).map(i => ({ name: i.name, price: i.price, change: `${i.changePercent > 0 ? '+' : ''}${i.changePercent.toFixed(2)}%` })),
    hotTopics: correlations.slice(0, 5).map(c => ({ topic: c.topic, count: c.count, momentum: c.momentum })),
    mainCharacters: mainChars.slice(0, 5).map(m => ({ name: m.name, mentions: m.mentions })),
  };

  return c.json({ ok: true, data: summary, ts: Date.now() });
});

export default app;
