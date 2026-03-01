import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Bindings } from './types';
import { refreshAll, KEYS } from './cron';

import newsRoutes from './routes/news';
import marketsRoutes from './routes/markets';
import cryptoRoutes from './routes/crypto';
import fedRoutes from './routes/fed';
import leadersRoutes from './routes/leaders';
import analysisRoutes from './routes/analysis';
import summaryRoutes from './routes/summary';
import healthRoutes from './routes/health';

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

// Routes (all read from KV cache)
app.route('/api/news', newsRoutes);
app.route('/api/markets', marketsRoutes);
app.route('/api/crypto', cryptoRoutes);
app.route('/api/fed', fedRoutes);
app.route('/api/leaders', leadersRoutes);
app.route('/api/analysis', analysisRoutes);
app.route('/api/summary', summaryRoutes);
app.route('/api/health', healthRoutes);

// Manual refresh trigger
app.post('/api/refresh', async (c) => {
  const result = await refreshAll(c.env);
  return c.json({ ...result, ts: Date.now() });
});

// Status: last sync time
app.get('/api/status', async (c) => {
  const lastSync = await c.env.CACHE.get(KEYS.lastSync);
  return c.json({ lastSync, ts: Date.now() });
});

// Root
app.get('/', (c) => {
  return c.json({
    name: 'apiforai',
    version: '2.0.0',
    cache: 'KV (hourly cron sync)',
    endpoints: [
      'GET /api/news?cat=ai,tech&limit=10',
      'GET /api/markets?scope=indices,sectors,commodities',
      'GET /api/crypto?coins=bitcoin,ethereum',
      'GET /api/fed',
      'GET /api/leaders',
      'GET /api/analysis?type=correlation,narrative,main-character',
      'GET /api/summary',
      'GET /api/health',
      'GET /api/status',
      'POST /api/refresh (manual sync)',
    ],
  });
});

// Cron handler
export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(refreshAll(env));
  },
};
