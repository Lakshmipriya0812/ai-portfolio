const requestCounts = new Map();
const RATE_LIMIT_WINDOW =
  parseInt(process.env.IP_RATE_LIMIT_WINDOW_MS) || 24 * 60 * 60 * 1000; // 24 hours
const MAX_REQUESTS_PER_IP = parseInt(process.env.MAX_REQUESTS_PER_IP) || 12; // Allow 12 requests per IP per day
const MIN_REQUEST_INTERVAL =
  parseInt(process.env.MIN_REQUEST_INTERVAL_MS) || 2000; // 2 seconds minimum between requests

// Admin whitelist - IPs that bypass rate limiting
const ADMIN_WHITELIST = new Set(
  process.env.ADMIN_IPS?.split(",").map((ip) => ip.trim()) || []
);

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
      requestCounts.delete(ip);
    }
  }
}, 60 * 60 * 1000);

export function rateLimitMiddleware(req, res, next) {
  // Get client IP (handle proxies/load balancers)
  const ip =
    req.ip ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress;

  // Admin override - whitelist bypass
  if (ADMIN_WHITELIST.has(ip)) {
    res.setHeader("X-Admin-Access", "true");
    return next();
  }

  const now = Date.now();

  // Get or initialize request data for this IP
  let requestData = requestCounts.get(ip);

  if (!requestData) {
    // First request from this IP
    requestData = {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    };
    requestCounts.set(ip, requestData);
    return next();
  }

  // Check if window has expired
  if (now - requestData.firstRequest > RATE_LIMIT_WINDOW) {
    // Reset counter for new window
    requestData.count = 1;
    requestData.firstRequest = now;
    requestData.lastRequest = now;
    return next();
  }

  // Exponential backoff - check if requests are too rapid
  const timeSinceLastRequest = now - requestData.lastRequest;
  const requiredDelay =
    MIN_REQUEST_INTERVAL * Math.pow(1.5, Math.min(requestData.count, 10));

  if (timeSinceLastRequest < requiredDelay) {
    return res.status(429).json({
      error: "Too many rapid requests",
      message: `Please wait ${Math.ceil(
        (requiredDelay - timeSinceLastRequest) / 1000
      )} seconds before trying again.`,
      retryAfter: Math.ceil((requiredDelay - timeSinceLastRequest) / 1000),
      type: "exponential_backoff",
    });
  }

  // Check if limit exceeded
  if (requestData.count >= MAX_REQUESTS_PER_IP) {
    const resetTime = new Date(requestData.firstRequest + RATE_LIMIT_WINDOW);
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: `You've reached the daily limit of ${MAX_REQUESTS_PER_IP} requests. Please try again later.`,
      resetTime: resetTime.toISOString(),
      retryAfter: Math.ceil((resetTime - now) / 1000 / 60), // minutes
      type: "daily_limit",
    });
  }

  // Increment counter
  requestData.count++;
  requestData.lastRequest = now;

  // Add rate limit headers
  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS_PER_IP);
  res.setHeader(
    "X-RateLimit-Remaining",
    MAX_REQUESTS_PER_IP - requestData.count
  );
  res.setHeader(
    "X-RateLimit-Reset",
    new Date(requestData.firstRequest + RATE_LIMIT_WINDOW).toISOString()
  );

  next();
}

// Get current stats for monitoring
export function getRateLimitStats() {
  const stats = {
    totalIPs: requestCounts.size,
    activeRequests: 0,
    limitedIPs: 0,
    whitelistedIPs: Array.from(ADMIN_WHITELIST),
    requests: [],
  };

  for (const [ip, data] of requestCounts.entries()) {
    stats.activeRequests += data.count;
    if (data.count >= MAX_REQUESTS_PER_IP) {
      stats.limitedIPs++;
    }

    stats.requests.push({
      ip: ip.replace(/\d+\.\d+\.\d+\./, "xxx.xxx.xxx."), // Anonymize for privacy
      count: data.count,
      remaining: Math.max(0, MAX_REQUESTS_PER_IP - data.count),
      firstRequest: new Date(data.firstRequest).toISOString(),
      isLimited: data.count >= MAX_REQUESTS_PER_IP,
    });
  }

  return stats;
}

// Admin functions to manage whitelist
export function addToWhitelist(ip) {
  ADMIN_WHITELIST.add(ip);
  return { success: true, message: `IP ${ip} added to whitelist` };
}

export function removeFromWhitelist(ip) {
  const removed = ADMIN_WHITELIST.delete(ip);
  return {
    success: removed,
    message: removed
      ? `IP ${ip} removed from whitelist`
      : `IP ${ip} not found in whitelist`,
  };
}

export function clearRateLimitForIP(ip) {
  const cleared = requestCounts.delete(ip);
  return {
    success: cleared,
    message: cleared
      ? `Rate limit cleared for IP ${ip}`
      : `No rate limit data found for IP ${ip}`,
  };
}
