# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# ============================================
# Stage 2: Build Backend Dependencies
# ============================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

# ============================================
# Stage 3: Production Image
# ============================================
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

# backend root
WORKDIR /app/server

# Copy backend source code correctly
COPY server/ ./

# Copy backend node_modules into correct place
COPY --from=backend-builder /app/server/node_modules ./node_modules

# Copy frontend build output into correct backend location
COPY --from=frontend-builder /app/client/dist ./client/dist

# Create storage folder and empty indexStore.json to avoid ENOENT
# RUN mkdir -p /app/server/storage

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:${PORT}/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["node", "src/server.js"]
