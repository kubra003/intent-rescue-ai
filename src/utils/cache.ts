/**
 * IntentRescue AI: Gemini Response Caching Layer
 * Minimizes API latency and token usage for common emergency queries.
 * In a production environment, this would use Redis.
 */
class ResponseCache {
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly TTL = 1000 * 60 * 60; // 1 Hour

  constructor() {
    this.cache = new Map();
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
    
    // Simple pruning if cache gets too large (> 100 entries)
    if (this.cache.size > 100) {
      const firstEntry = this.cache.keys().next().value;
      if (firstEntry) this.cache.delete(firstEntry);
    }
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const geminiCache = new ResponseCache();
