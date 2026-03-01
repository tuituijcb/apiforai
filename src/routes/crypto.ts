import { Hono } from 'hono';
import type { Bindings, CryptoItem } from '../types';
import { KEYS } from '../cron';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const raw = await c.env.CACHE.get(KEYS.crypto);
  if (!raw) return c.json({ ok: false, error: 'No cached data. Wait for next sync.', data: [], ts: Date.now() });

  let data = JSON.parse(raw) as CryptoItem[];
  const coinsParam = c.req.query('coins');
  if (coinsParam) {
    const ids = coinsParam.split(',');
    data = data.filter(c => ids.includes(c.id));
  }
  return c.json({ ok: true, data, ts: Date.now(), cached: true });
});

export default app;
