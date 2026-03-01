import { Hono } from 'hono';
import type { Bindings, NewsCategory } from '../types';
import { fetchAllNews, fetchCategoryNews } from '../api/news';
import { ALL_CATEGORIES } from '../config/feeds';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const catParam = c.req.query('cat');
  const limit = parseInt(c.req.query('limit') || '20', 10);

  if (catParam) {
    const cats = catParam.split(',').filter(
      (x): x is NewsCategory => ALL_CATEGORIES.includes(x as NewsCategory),
    );
    if (cats.length === 1) {
      const items = await fetchCategoryNews(cats[0]);
      return c.json({ ok: true, data: items.slice(0, limit), ts: Date.now() });
    }
    const data = await fetchAllNews(cats);
    // Apply limit per category
    for (const key of Object.keys(data)) {
      data[key] = data[key].slice(0, limit);
    }
    return c.json({ ok: true, data, ts: Date.now() });
  }

  const data = await fetchAllNews();
  for (const key of Object.keys(data)) {
    data[key] = data[key].slice(0, limit);
  }
  return c.json({ ok: true, data, ts: Date.now() });
});

export default app;
