# Security & Production Checklist

## ✅ Pre-Deployment Security Audit

### 1. Environment Variables

- [x] All API keys moved to `.env` file
- [x] `.env` file added to `.gitignore`
- [x] `env-template.txt` contains no actual secrets
- [x] All hardcoded URLs replaced with environment variables
- [x] Rate limiting values configurable via environment variables

### 2. API Key Security

✅ **All API keys are properly secured:**

- `GEMINI_API_KEY` - Google Gemini
- `OPENAI_API_KEY` - OpenAI GPT
- `ANTHROPIC_API_KEY` - Anthropic Claude
- `HUGGINGFACE_API_KEY` - Hugging Face

✅ **Never commit:**

- `.env` files
- Any file with actual API keys
- Log files that might contain sensitive data

### 3. Rate Limiting Protection

✅ **Implemented:**

- IP-based rate limiting (configurable via `MAX_REQUESTS_PER_IP`)
- Express global rate limiter (configurable via `RATE_LIMIT_MAX_REQUESTS`)
- Exponential backoff for rapid requests
- Admin IP whitelist support (`ADMIN_IPS`)
- Response caching (48 hours default, configurable via `CACHE_DURATION_MS`)

### 4. CORS Configuration

✅ **Properly configured:**

- Whitelist-based origin checking
- Configurable via `ALLOWED_ORIGINS` environment variable
- Credentials support enabled for authenticated requests

### 5. Security Headers

✅ **Helmet.js configured** with:

- Content Security Policy (CSP)
- XSS Protection
- Frame Options
- Strict Transport Security (production)

### 6. Error Handling

✅ **Secure error responses:**

- Detailed errors only in development mode
- Generic errors in production
- No stack traces exposed to clients
- Proper error logging without exposing secrets

---

## 📋 Production Deployment Checklist

### Before Deploying

#### 1. Environment Configuration

```bash
# Create production .env file
cp env-template.txt .env

# Edit with production values
nano .env
```

**Required variables:**

```env
# Set to production
NODE_ENV=production

# Use your actual API key
GEMINI_API_KEY=your_actual_key_here

# Production port
PORT=3001

# Production origins (your actual domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Adjust rate limits for production traffic
MAX_REQUESTS_PER_IP=12
IP_RATE_LIMIT_WINDOW_MS=86400000

# Set cache duration (48 hours recommended)
CACHE_DURATION_MS=172800000
```

#### 2. Security Hardening

**Update CORS Origins:**

```env
# Replace localhost with your production domain
ALLOWED_ORIGINS=https://yourportfolio.com
```

**Set Admin IPs (optional):**

```env
# Add your IP for testing without rate limits
ADMIN_IPS=203.0.113.1
```

**Enable HTTPS (required for production):**

- Use SSL/TLS certificate (Let's Encrypt recommended)
- Force HTTPS redirects
- Set secure cookie flags

#### 3. Rate Limiting Adjustment

Based on your traffic expectations:

**Low Traffic (< 100 visitors/day):**

```env
MAX_REQUESTS_PER_IP=12
IP_RATE_LIMIT_WINDOW_MS=86400000  # 24 hours
```

**Medium Traffic (100-500 visitors/day):**

```env
MAX_REQUESTS_PER_IP=10
IP_RATE_LIMIT_WINDOW_MS=86400000  # 24 hours
CACHE_DURATION_MS=172800000       # 48 hours
```

**High Traffic (500+ visitors/day):**

```env
MAX_REQUESTS_PER_IP=8
IP_RATE_LIMIT_WINDOW_MS=43200000  # 12 hours
CACHE_DURATION_MS=259200000       # 72 hours
```

#### 4. API Provider Limits

**Gemini Free Tier:**

- 50 requests/day
- With caching: Supports 200-300 unique visitors/day
- Monitor via: `curl https://yourapi.com/api/stats/usage`

**If exceeding limits:**

1. Increase cache duration
2. Reduce `MAX_REQUESTS_PER_IP`
3. Upgrade to paid tier
4. Switch to OpenAI/Anthropic

#### 5. Build Production Assets

```bash
# Build frontend
cd client
npm run build

# Test production build locally
npm run preview

# Verify no console errors
```

#### 6. Server Configuration

**For VPS/Cloud:**

```bash
# Install PM2 for process management
npm install -g pm2

# Start server with PM2
cd server
pm2 start npm --name "portfolio-api" -- start

# Enable auto-restart on reboot
pm2 startup
pm2 save
```

**For Serverless (Vercel/Netlify):**

- Ensure environment variables are set in platform dashboard
- Configure API routes properly
- Test rate limiting works with serverless functions

#### 7. Monitoring Setup

**Add monitoring endpoints:**

```bash
# Check usage stats
curl https://yourapi.com/api/stats/usage

# Check rate limits
curl https://yourapi.com/api/stats/rate-limits

# Health check
curl https://yourapi.com/health
```

**Set up alerts:**

- API quota approaching limit (80%)
- Error rate spikes
- High response times (>30s)
- Server downtime

---

## 🔒 Security Best Practices

### 1. API Key Rotation

- Rotate API keys every 90 days
- Use separate keys for dev/staging/prod
- Revoke compromised keys immediately

### 2. Logging Security

✅ **Never log:**

- API keys or tokens
- Full IP addresses in public logs
- User personal information
- Request bodies containing sensitive data

✅ **Do log:**

- Request timestamps
- Rate limit violations
- Error types (without sensitive details)
- Cache hit rates
- Provider failures

### 3. Regular Security Audits

**Monthly:**

- Review rate limit statistics
- Check for unusual traffic patterns
- Verify API key usage
- Update dependencies: `npm audit fix`

**Quarterly:**

- Rotate API keys
- Review and update CORS origins
- Check for new security vulnerabilities
- Update rate limit thresholds based on traffic

### 4. Backup & Recovery

**Environment Variables:**

```bash
# Keep encrypted backup of .env
# Store in secure location (not in git)
gpg -c server/.env
# Creates: server/.env.gpg
```

**Database/Cache:**

- No sensitive data stored in cache
- Cache is in-memory (cleared on restart)
- No persistent storage needed

### 5. Incident Response Plan

**If API key is compromised:**

1. Immediately revoke key in provider dashboard
2. Generate new key
3. Update `.env` with new key
4. Restart server
5. Monitor for unusual activity
6. Review logs for unauthorized access

**If rate limits are bypassed:**

1. Check `ADMIN_IPS` for unauthorized IPs
2. Reduce `MAX_REQUESTS_PER_IP` temporarily
3. Block specific IPs in firewall
4. Review rate limiter code for bugs

---

## 🧪 Pre-Deployment Testing

### 1. Security Tests

```bash
# Test rate limiting
for i in {1..15}; do
  curl -X POST http://localhost:3001/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "test"}';
done
# Should see 429 errors after limit

# Test CORS
curl -H "Origin: https://evil.com" http://localhost:3001/api/chat
# Should be blocked

# Test admin whitelist
export ADMIN_IPS=127.0.0.1
# Restart server, test should bypass limits
```

### 2. Performance Tests

```bash
# Test cache efficiency
curl http://localhost:3001/api/stats/usage
# Check cacheEfficiency > 70%

# Test response times
time curl http://localhost:3001/api/sections/about
# Should be <1s for cached, ~20s for fresh
```

### 3. Error Handling Tests

```bash
# Test invalid API key
export GEMINI_API_KEY=invalid_key
# Should fallback gracefully

# Test missing environment variable
unset GEMINI_API_KEY
# Should use fallback provider
```

---

## 📊 Production Monitoring

### Key Metrics to Track

1. **API Usage:**

   - Requests per day
   - Cache hit rate (target: >70%)
   - Provider response times

2. **Rate Limiting:**

   - IPs hitting limits
   - Rate limit violations per day
   - Admin whitelist usage

3. **Errors:**

   - 429 (rate limit) responses
   - 500 (server) errors
   - Provider failures

4. **Performance:**
   - Average response time
   - 95th percentile response time
   - Uptime percentage

### Monitoring Tools

**Free Options:**

- [UptimeRobot](https://uptimerobot.com) - Uptime monitoring
- [Papertrail](https://www.papertrail.com) - Log aggregation
- PM2 Dashboard - Process monitoring

**Paid Options:**

- Datadog - Full stack monitoring
- New Relic - Application performance
- Sentry - Error tracking

---

## ✅ Final Pre-Launch Checklist

- [ ] All environment variables set correctly
- [ ] `.env` file not committed to git
- [ ] CORS configured for production domain
- [ ] Rate limits appropriate for traffic
- [ ] HTTPS enabled and enforced
- [ ] Monitoring endpoints accessible
- [ ] Error handling tested
- [ ] Cache working correctly (check stats endpoint)
- [ ] API keys valid and working
- [ ] Admin whitelist configured (if needed)
- [ ] Backup of environment variables stored securely
- [ ] Documentation updated with production URLs
- [ ] Health check endpoint responding
- [ ] Frontend connecting to production API
- [ ] No console.log statements with sensitive data

---

## 🆘 Emergency Contacts

**API Provider Support:**

- Google Gemini: https://ai.google.dev/support
- OpenAI: https://help.openai.com
- Anthropic: https://support.anthropic.com

**Security Issues:**

- Report vulnerabilities: security@yourdomain.com
- Rate limit issues: Check `/api/stats/rate-limits`
- Emergency API key rotation: Update `.env` and restart

---

**Last Updated:** November 2025  
**Next Review:** February 2026
