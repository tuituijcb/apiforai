interface CacheEntry<T> {
  data: T;
  expires: number;
}

/**
 * Simple in-memory TTL cache.
 * Works within a single CF Worker invocation (request-scoped).
 * For cross-request caching, use CF KV or Cache API later.
 */
export class SimpleCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expires: Date.now() + ttlMs });
  }

  clear(): void {
    this.store.clear();
  }
}

/** Global cache instance (lives for the Worker's lifetime, not just one request) */
export const cache = new SimpleCache();
