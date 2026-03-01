import { Hono } from 'hono';
import { apiFetch } from '../services/fetch';

const app = new Hono();

// Test with the exact encoding news.ts uses
app.get('/', async (c) => {
  const cat = c.req.query('cat') || 'ai';
  
  const queries: Record<string, string> = {
    ai: '("artificial intelligence" OR "machine learning" OR AI OR ChatGPT) sourcelang:english',
    ai_simple: '("artificial intelligence" OR AI) sourcelang:english',
    tech: '(technology OR software OR startup) sourcelang:english',
  };
  
  const query = queries[cat] || queries.ai;
  
  // Same encoding as news.ts
  const encoded = query.replace(/ /g, '%20').replace(/"/g, '%22');
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encoded}&timespan=7d&mode=artlist&maxrecords=3&format=json&sort=date`;

  try {
    const res = await apiFetch(url);
    const status = res.status;
    const ct = res.headers.get('content-type');
    const text = await res.text();
    return c.json({ cat, url, status, contentType: ct, bodyLength: text.length, bodyPreview: text.slice(0, 300) });
  } catch (err: unknown) {
    return c.json({ cat, url, error: String(err) });
  }
});

export default app;
