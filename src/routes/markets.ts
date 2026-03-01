import { Hono } from 'hono';
import type { Bindings, MarketItem } from '../types';
import { KEYS } from '../cron';

type MarketScope = 'indices' | 'sectors' | 'commodities';
const VALID_SCOPES: MarketScope[] = ['indices', 'sectors', 'commodities'];
const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const raw = await c.env.CACHE.get(KEYS.markets);
  if (!raw) return c.json({ ok: false, error: 'No cached data. Wait for next sync.', data: {}, ts: Date.now() });

  const all = JSON.parse(raw) as Record<string, MarketItem[]>;
  const scopeParam = c.req.query('scope');
  if (scopeParam) {
    const scopes = scopeParam.split(',').filter((s): s is MarketScope => VALID_SCOPES.includes(s as MarketScope));
    const filtered: Record<string, MarketItem[]> = {};
    for (const s of scopes) filtered[s] = all[s] || [];
    return c.json({ ok: true, data: filtered, ts: Date.now(), cached: true });
  }
  return c.json({ ok: true, data: all, ts: Date.now(), cached: true });
});

export default app;
