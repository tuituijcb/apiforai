import { Hono } from 'hono';
import type { Bindings, NewsCategory, NewsItem } from '../types';
import { ALL_CATEGORIES } from '../config/feeds';
import { KEYS } from '../cron';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const catParam = c.req.query('cat');
  const limit = parseInt(c.req.query('limit') || '20', 10);

  const raw = await c.env.CACHE.get(KEYS.news);
  if (!raw) return c.json({ ok: false, error: 'No cached data. Wait for next sync.', data: [], ts: Date.now() });

  const allNews = JSON.parse(raw) as Record<string, NewsItem[]>;

  if (catParam) {
    const cats = catParam.split(',').filter(
      (x): x is NewsCategory => ALL_CATEGORIES.includes(x as NewsCategory),
    );
    if (cats.length === 1) {
      return c.json({ ok: true, data: (allNews[cats[0]] || []).slice(0, limit), ts: Date.now(), cached: true });
    }
    const filtered: Record<string, NewsItem[]> = {};
    for (const cat of cats) {
      filtered[cat] = (allNews[cat] || []).slice(0, limit);
    }
    return c.json({ ok: true, data: filtered, ts: Date.now(), cached: true });
  }

  const result: Record<string, NewsItem[]> = {};
  for (const key of Object.keys(allNews)) {
    result[key] = allNews[key].slice(0, limit);
  }
  return c.json({ ok: true, data: result, ts: Date.now(), cached: true });
});

export default app;
