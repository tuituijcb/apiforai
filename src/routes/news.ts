import { Hono } from 'hono';
import type { Bindings, NewsCategory } from '../types';
import { fetchAllNews, fetchCategoryNews, getLastDiag } from '../api/news';
import { ALL_CATEGORIES } from '../config/feeds';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const catParam = c.req.query('cat');
  const limit = parseInt(c.req.query('limit') || '20', 10);
  const debug = c.req.query('debug') === '1';

  if (catParam) {
    const cats = catParam.split(',').filter(
      (x): x is NewsCategory => ALL_CATEGORIES.includes(x as NewsCategory),
    );
    if (cats.length === 1) {
      const items = await fetchCategoryNews(cats[0]);
      const resp: Record<string, unknown> = { ok: true, data: items.slice(0, limit), ts: Date.now() };
      if (debug) resp._diag = getLastDiag();
      return c.json(resp);
    }
    const data = await fetchAllNews(cats);
    for (const key of Object.keys(data)) {
      data[key] = data[key].slice(0, limit);
    }
    const resp: Record<string, unknown> = { ok: true, data, ts: Date.now() };
    if (debug) resp._diag = getLastDiag();
    return c.json(resp);
  }

  const data = await fetchAllNews();
  for (const key of Object.keys(data)) {
    data[key] = data[key].slice(0, limit);
  }
  return c.json({ ok: true, data, ts: Date.now() });
});

export default app;
