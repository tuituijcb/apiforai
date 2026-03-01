import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  const url = 'https://api.gdeltproject.org/api/v2/doc/doc?query=(%22artificial%20intelligence%22%20OR%20AI)%20sourcelang%3Aenglish&timespan=7d&mode=artlist&maxrecords=3&format=json&sort=date';
  
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'apiforai/1.0' },
    });
    const status = res.status;
    const ct = res.headers.get('content-type');
    const text = await res.text();
    return c.json({
      status,
      contentType: ct,
      bodyLength: text.length,
      bodyPreview: text.slice(0, 500),
    });
  } catch (err: unknown) {
    return c.json({ error: String(err) });
  }
});

export default app;
