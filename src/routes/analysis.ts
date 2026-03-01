import { Hono } from 'hono';
import type { Bindings } from '../types';
import { fetchAllNews } from '../api/news';
import { analyzeCorrelations } from '../analysis/correlation';
import { analyzeNarratives } from '../analysis/narrative';
import { analyzeMainCharacters } from '../analysis/main-character';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
  const typeParam = c.req.query('type');
  const types = typeParam
    ? typeParam.split(',')
    : ['correlation', 'narrative', 'main-character'];

  // Fetch all news first (needed for analysis)
  const newsMap = await fetchAllNews();
  const allNews = Object.values(newsMap).flat();

  const result: Record<string, unknown> = {};

  if (types.includes('correlation')) {
    result.correlations = analyzeCorrelations(allNews);
  }
  if (types.includes('narrative')) {
    result.narratives = analyzeNarratives(allNews);
  }
  if (types.includes('main-character')) {
    result.mainCharacters = analyzeMainCharacters(allNews);
  }

  return c.json({ ok: true, data: result, ts: Date.now() });
});

export default app;
