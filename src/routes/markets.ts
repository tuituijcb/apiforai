import { Hono } from 'hono';
import type { Bindings } from '../types';
import { fetchMarkets, type MarketScope } from '../api/markets';

const VALID_SCOPES: MarketScope[] = ['indices', 'sectors', 'commodities'];
const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const apiKey = c.env.FINNHUB_API_KEY || '';
  const scopeParam = c.req.query('scope');

  const scopes = scopeParam
    ? scopeParam.split(',').filter((s): s is MarketScope => VALID_SCOPES.includes(s as MarketScope))
    : undefined;

  const data = await fetchMarkets(apiKey, scopes);
  return c.json({ ok: true, data, ts: Date.now(), configured: !!apiKey });
});

export default app;
