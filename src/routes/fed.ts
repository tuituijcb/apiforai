import { Hono } from 'hono';
import type { Bindings } from '../types';
import { fetchFedIndicators } from '../api/fred';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const apiKey = c.env.FRED_API_KEY || '';
  if (!apiKey) {
    return c.json({ ok: false, error: 'FRED_API_KEY not configured', data: [], ts: Date.now() });
  }
  const data = await fetchFedIndicators(apiKey);
  return c.json({ ok: true, data, ts: Date.now() });
});

export default app;
