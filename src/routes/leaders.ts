import { Hono } from 'hono';
import type { Bindings } from '../types';
import { fetchWorldLeaders } from '../api/leaders';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const data = await fetchWorldLeaders();
  return c.json({ ok: true, data, ts: Date.now() });
});

export default app;
