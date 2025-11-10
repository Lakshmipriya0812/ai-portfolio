# Rate Limiting Testing Guide

## Quick Test Instructions

### 1. Start the Application

**Terminal 1 - Backend:**

```bash
cd server
npm start
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

### 2. Test Basic Rate Limiting

#### A. Test Normal Usage (Should Work)

1. Open `http://localhost:5173` in browser
2. Ask a question: "Tell me about your skills"
3. Wait for response (should work normally)
4. Ask 2-3 more questions (should all work)

#### B. Test Rate Limit Trigger (For Quick Testing)

**Temporarily Lower Limit:**

1. Edit `server/src/middleware/rateLimiter.js`
2. Change `MAX_REQUESTS_PER_IP = 12` to `MAX_REQUESTS_PER_IP = 2`
3. Restart backend server
4. Make 3 requests from same browser
5. **Expected**: 3rd request shows modal saying "Rate limit reached"
6. **Expected**: Chat input becomes disabled with placeholder "Rate limit reached"
7. **Expected**: Modal blocks further chat attempts

**Reset to Normal:**

1. Change back to `MAX_REQUESTS_PER_IP = 12`
2. Restart backend server

### 3. Test Cache Efficiency

1. Ask question: "What are your skills?"
2. Note response time (~20 seconds)
3. Ask same question again
4. **Expected**: Instant response (cache hit)
5. Check backend logs - should see "Cache hit" message

### 4. Test Monitoring Endpoints

**Check Usage Statistics:**

```bash
curl http://localhost:3001/api/stats/usage
```

**Expected Response:**

```json
{
  "success": true,
  "stats": {
    "totalRequests": 15,
    "cacheHits": 8,
    "cacheMisses": 7,
    "apiCalls": 7,
    "cacheEfficiency": "53.3%",
    "uptime": 1234
  }
}
```

**Check Rate Limit Statistics:**

```bash
curl http://localhost:3001/api/stats/rate-limits
```

**Expected Response:**

```json
{
  "success": true,
  "stats": {
    "totalIPs": 1,
    "rateLimitedIPs": 0,
    "requests": [
      {
        "ip": "::1",
        "count": 3,
        "lastRequest": "2025-06-01T10:30:00.000Z"
      }
    ]
  }
}
```

### 5. Test Frontend UI

#### Modal Appearance

- **Should have**: Warning icon (red circle with exclamation)
- **Should have**: Title "Rate Limit Reached"
- **Should have**: Friendly error message with reset time
- **Should have**: Info box with cache message
- **Should have**: Backdrop blur preventing interaction

#### Chat Input Behavior

- **When rate limited**:
  - Input textarea disabled
  - Placeholder changes to "Rate limit reached"
  - Send button disabled
  - Cursor shows "not-allowed"

### 6. Test Error Handling

**Test 429 Response:**

1. Trigger rate limit (make 13 requests)
2. Open browser DevTools → Network tab
3. Next request should show:
   - Status: 429 Too Many Requests
   - Response body includes `resetTime` and `retryAfter`
   - Frontend shows modal (not just console error)

### 7. Test Persistence

**Test State Persistence:**

1. Trigger rate limit
2. Try to send another message
3. **Expected**: Message is blocked immediately (no API call)
4. **Expected**: Modal remains visible
5. Navigate to different section and back
6. **Expected**: Rate limit state persists in chat

### 8. Test Different IPs (Optional)

**Test IP Isolation:**

1. Make 12 requests from Computer A
2. Make 1 request from Computer B (or mobile on same network but different IP)
3. **Expected**: Computer B is not rate limited
4. **Expected**: Each IP tracked independently

### 9. Performance Testing

**Test Response Times:**

1. First question (cache miss): ~20 seconds ✅
2. Same question again (cache hit): <500ms ✅
3. Different question (cache miss): ~20 seconds ✅
4. Common question (likely cached): <500ms ✅

### 10. Clear Cache Test

**Test Cache Clearing:**

```bash
# Clear all cached responses
curl -X POST http://localhost:3001/api/clear-cache
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

Then ask a previously cached question - should take full time again.

## Expected Behaviors Summary

| Scenario                 | Expected Behavior                 |
| ------------------------ | --------------------------------- |
| First 12 requests        | All work normally                 |
| 13th request             | Shows rate limit modal            |
| Try to send after limit  | Blocked immediately (no API call) |
| Same question twice      | Second is instant (cached)        |
| Common questions         | High cache hit rate               |
| Unique questions         | Slower (API call)                 |
| Refresh page after limit | Rate limit state persists         |
| Different IP             | Independent limit counter         |

## Troubleshooting

### Modal Not Showing

- Check browser console for errors
- Verify `isRateLimited` state is being set
- Check that `RateLimitModal.tsx` is imported in `Chat.tsx`

### Input Still Enabled

- Verify `disabled` prop is passed to `ChatInput`
- Check that `isRateLimited` is true in useChat hook

### Rate Limit Not Triggering

- Check backend logs for rate limiter middleware execution
- Verify `rateLimitMiddleware` is applied to routes in `server.js`
- Check if your IP is in the whitelist

### Cache Not Working

- Check backend logs for "Cache hit" vs "Cache miss"
- Verify CACHE_DURATION is set to 48 hours
- Try clearing cache and testing again

## Production Checklist

Before deploying:

- [ ] Set `MAX_REQUESTS_PER_IP = 12` (not 2)
- [ ] Set `CACHE_DURATION = 48 * 60 * 60 * 1000` (48 hours)
- [ ] Configure `WHITELISTED_IPS` environment variable (if needed)
- [ ] Test with actual Gemini API (not localhost)
- [ ] Monitor `/api/stats/usage` for first few days
- [ ] Adjust limits based on actual traffic patterns

## Success Criteria

✅ **Rate limiting works**: 13th request shows modal
✅ **Caching works**: Repeated questions are instant
✅ **UI blocks input**: Chat disabled after rate limit
✅ **Modal is user-friendly**: Clear message and reset time
✅ **Monitoring works**: Stats endpoints return data
✅ **No crashes**: Backend handles errors gracefully
✅ **Persistence works**: State survives navigation

---

**Note**: For production testing with real traffic, monitor the system for the first week and adjust parameters as needed based on actual usage patterns.
