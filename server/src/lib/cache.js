// Simple in-memory cache for AI responses
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for fresher responses

export function getCachedResponse(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
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
