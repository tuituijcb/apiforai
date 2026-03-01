import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Bindings } from './types';

import newsRoutes from './routes/news';
import marketsRoutes from './routes/markets';
import cryptoRoutes from './routes/crypto';
import fedRoutes from './routes/fed';
import leadersRoutes from './routes/leaders';
import analysisRoutes from './routes/analysis';
import summaryRoutes from './routes/summary';
import healthRoutes from './routes/health';
import debugRoutes from './routes/debug';

const app = new Hono<{ Bindings: Bindings }>();

// CORS for browser access
app.use('/*', cors());

// Routes
app.route('/api/news', newsRoutes);
app.route('/api/markets', marketsRoutes);
app.route('/api/crypto', cryptoRoutes);
app.route('/api/fed', fedRoutes);
app.route('/api/leaders', leadersRoutes);
app.route('/api/analysis', analysisRoutes);
app.route('/api/summary', summaryRoutes);
app.route('/api/health', healthRoutes);
app.route('/api/debug', debugRoutes);

// Root
app.get('/', (c) => {
  return c.json({
    name: 'apiforai',
    version: '1.0.0',
    endpoints: [
      'GET /api/news?cat=ai,tech&limit=10',
      'GET /api/markets?scope=indices,sectors,commodities',
      'GET /api/crypto?coins=bitcoin,ethereum',
      'GET /api/fed',
      'GET /api/leaders',
      'GET /api/analysis?type=correlation,narrative,main-character',
      'GET /api/summary',
      'GET /api/health',
    ],
  });
});

export default app;
