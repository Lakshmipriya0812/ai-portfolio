import { trackCacheHit, trackCacheMiss } from "./usageTracker.js";

const cache = new Map();
const CACHE_DURATION =
  parseInt(process.env.CACHE_DURATION_MS) || 48 * 60 * 60 * 1000; // 48 hours default

export function getCachedResponse(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    trackCacheHit();
    return cached.data;
  }
  trackCacheMiss();
  return null;
}

export function setCachedResponse(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache() {
  cache.clear();
}
