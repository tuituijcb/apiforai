import { Hono } from 'hono';
import type { Bindings } from '../types';
import { KEYS } from '../cron';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const raw = await c.env.CACHE.get(KEYS.fed);
  if (!raw) return c.json({ ok: false, error: 'No cached data. Wait for next sync.', data: [], ts: Date.now() });
  return c.json({ ok: true, data: JSON.parse(raw), ts: Date.now(), cached: true });
});

export default app;
