import { Hono } from 'hono';
import type { Bindings } from '../types';
import { KEYS } from '../cron';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const raw = await c.env.CACHE.get(KEYS.analysis);
  if (!raw) return c.json({ ok: false, error: 'No cached data. Wait for next sync.', data: {}, ts: Date.now() });

  const all = JSON.parse(raw) as Record<string, unknown>;
  const typeParam = c.req.query('type');
  if (typeParam) {
    const types = typeParam.split(',');
    const filtered: Record<string, unknown> = {};
    if (types.includes('correlation')) filtered.correlations = all.correlations;
    if (types.includes('narrative')) filtered.narratives = all.narratives;
    if (types.includes('main-character')) filtered.mainCharacters = all.mainCharacters;
    return c.json({ ok: true, data: filtered, ts: Date.now(), cached: true });
  }
  return c.json({ ok: true, data: all, ts: Date.now(), cached: true });
});

export default app;
