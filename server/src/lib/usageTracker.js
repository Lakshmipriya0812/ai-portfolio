// API usage tracking and monitoring
let totalRequests = 0;
let cacheHits = 0;
let cacheMisses = 0;
let apiCalls = 0;
const startTime = Date.now();

export function trackRequest() {
  totalRequests++;
}

export function trackCacheHit() {
  cacheHits++;
}

export function trackCacheMiss() {
  cacheMisses++;
}

export function trackAPICall() {
  apiCalls++;
}

export function getUsageStats() {
  const uptime = Date.now() - startTime;
  const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
  const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

  return {
    uptime: {
      milliseconds: uptime,
      formatted: `${uptimeHours}h ${uptimeMinutes}m`,
    },
    requests: {
      total: totalRequests,
      cacheHits,
      cacheMisses,
      cacheHitRate:
        totalRequests > 0
          ? ((cacheHits / totalRequests) * 100).toFixed(2) + "%"
          : "0%",
    },
    api: {
      totalCalls: apiCalls,
      savings:
        cacheHits > 0
          ? `Saved ${cacheHits} API calls via caching`
          : "No cache hits yet",
    },
    efficiency: {
      requestsPerAPICall:
        apiCalls > 0 ? (totalRequests / apiCalls).toFixed(2) : "N/A",
      message:
        apiCalls > 0
          ? `Each API call serves ${(totalRequests / apiCalls).toFixed(
              1
            )} requests on average`
          : "Waiting for first API call",
    },
  };
}

export function resetStats() {
  totalRequests = 0;
  cacheHits = 0;
  cacheMisses = 0;
  apiCalls = 0;
}
