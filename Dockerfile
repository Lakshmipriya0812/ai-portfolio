# ============================================
# Multi-stage Dockerfile for Full-Stack App
# React (Vite) + Node.js (Express)
# Optimized for Fly.io deployment
# use node 20 alpine as base image
# ============================================

# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/client

# Copy frontend package files
COPY client/package*.json ./

# Install dependencies with clean install for reproducibility
RUN npm ci --only=production=false

# Copy frontend source code
COPY client/ ./

# Build the React app (outputs to dist/)
RUN npm run build

# ============================================
# Stage 2: Build Backend Dependencies
# ============================================
FROM node:20-alpine AS backend-builder

# Set working directory for backend
WORKDIR /app/server

# Copy backend package files
COPY server/package*.json ./

# Install dependencies with clean install
RUN npm ci --only=production

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy backend source
COPY server/ ./server/

# Copy backend node_modules from builder stage
COPY --from=backend-builder /app/server/node_modules ./server/node_modules

# Copy built frontend from frontend-builder stage to server directory
COPY --from=frontend-builder /app/client/dist ./server/client/dist

# Create storage folder and empty indexStore.json to avoid ENOENT
# RUN mkdir -p /app/server/storage

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set working directory to server
WORKDIR /app/server

# Environment variables
ENV NODE_ENV=production \
    PORT=8080

# Expose the port (Fly.io uses 8080 by default)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${PORT}/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["sh", "-c", "test -f storage/indexStore.json && node src/server.js"]

