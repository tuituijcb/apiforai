/**
 * Enhanced fetch with proper headers for CF Workers.
 * Some APIs (CoinGecko, GDELT) reject requests without User-Agent.
 */
const DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent': 'apiforai/1.0 (Cloudflare Worker)',
  'Accept': 'application/json',
};

export async function apiFetch(url: string, opts?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...opts,
    headers: {
      ...DEFAULT_HEADERS,
      ...opts?.headers,
    },
  });
}
