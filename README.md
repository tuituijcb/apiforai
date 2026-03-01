# apiforai

Cloudflare Workers API for AI agents — aggregates global news, markets, crypto, and geopolitical data into clean JSON endpoints.

## Endpoints

| Endpoint | Description | Query Params |
|---|---|---|
| `GET /api/news` | Global news (GDELT) | `cat` (ai,tech,finance,gov,politics,intel), `limit` |
| `GET /api/markets` | Stock indices, sectors, commodities (Finnhub) | `scope` (indices,sectors,commodities) |
| `GET /api/crypto` | Cryptocurrency prices (CoinGecko) | `coins` (bitcoin,ethereum,...) |
| `GET /api/fed` | Federal Reserve indicators (FRED) | — |
| `GET /api/leaders` | World leaders news tracking | — |
| `GET /api/analysis` | Cross-source analysis | `type` (correlation,narrative,main-character) |
| `GET /api/summary` | Compact all-in-one summary | — |
| `GET /api/health` | Health check | — |

## Setup

```bash
npm install
npm run dev          # Local dev server
npm run deploy       # Deploy to Cloudflare Workers
```

## API Keys (optional)

```bash
wrangler secret put FINNHUB_API_KEY    # For market data (free: finnhub.io)
wrangler secret put FRED_API_KEY       # For Fed indicators (free: fred.stlouisfed.org)
```

News and crypto endpoints work without any API keys.

## Stack

- **Hono** — Lightweight web framework
- **Cloudflare Workers** — Edge runtime
- **TypeScript** — Strict mode
