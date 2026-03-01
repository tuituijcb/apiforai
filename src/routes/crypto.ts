import { Hono } from 'hono';
import type { Bindings } from '../types';
import { fetchCrypto } from '../api/crypto';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const coinsParam = c.req.query('coins');
  const coinIds = coinsParam ? coinsParam.split(',') : undefined;
  const data = await fetchCrypto(coinIds);
  return c.json({ ok: true, data, ts: Date.now() });
});

export default app;
