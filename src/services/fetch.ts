/**
 * Enhanced fetch with proper headers and timeout for CF Workers.
 */
const DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent': 'apiforai/1.0 (Cloudflare Worker)',
  'Accept': 'application/json',
};

export async function apiFetch(url: string, opts?: RequestInit & { timeoutMs?: number }): Promise<Response> {
  const { timeoutMs = 45000, ...fetchOpts } = opts ?? {};

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...fetchOpts,
      signal: controller.signal,
      headers: {
        ...DEFAULT_HEADERS,
        ...fetchOpts?.headers,
      },
    });
  } finally {
    clearTimeout(timer);
  }
}
