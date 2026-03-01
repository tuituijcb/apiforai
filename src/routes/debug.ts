import { Hono } from 'hono';
import { apiFetch } from '../services/fetch';

const app = new Hono();

// Test raw fetch vs apiFetch
app.get('/', async (c) => {
  const query = '(%22artificial%20intelligence%22%20OR%20AI)%20sourcelang%3Aenglish';
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&timespan=7d&mode=artlist&maxrecords=3&format=json&sort=date`;

  // Test with apiFetch (same as news.ts uses)
  try {
    const res = await apiFetch(url);
    const status = res.status;
    const ct = res.headers.get('content-type');
    const text = await res.text();
    return c.json({
      method: 'apiFetch',
      status,
      contentType: ct,
      bodyLength: text.length,
      bodyPreview: text.slice(0, 500),
    });
  } catch (err: unknown) {
    return c.json({ method: 'apiFetch', error: String(err) });
  }
});

// Test what news.ts actually constructs
app.get('/url', async (c) => {
  const query = '("artificial intelligence" OR "machine learning" OR AI OR ChatGPT) sourcelang:english';
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&timespan=7d&mode=artlist&maxrecords=3&format=json&sort=date`;

  try {
    const res = await apiFetch(url);
    const status = res.status;
    const ct = res.headers.get('content-type');
    const text = await res.text();
    const hasArticles = text.includes('"articles"');
    return c.json({
      constructedUrl: url,
      status,
      contentType: ct,
      bodyLength: text.length,
      hasArticles,
      bodyPreview: text.slice(0, 500),
    });
  } catch (err: unknown) {
    return c.json({ error: String(err) });
  }
});

export default app;
