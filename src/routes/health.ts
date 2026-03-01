import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ status: 'ok', ts: Date.now(), version: '1.0.0' });
});

export default app;
