import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ingestData } from './routes/ingest.js';
import sectionRoutes from './routes/sections.js'; 
import { errorHandler } from './middleware/errorHandler.js';
import { chatHandler } from './controllers/chatControllers.js';
import { validateChatRequest } from './middleware/validation.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------- Security Middleware -----------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// ----------------- CORS -----------------
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ----------------- Rate Limiting -----------------
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ----------------- Middleware -----------------
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ----------------- Health Check -----------------
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ----------------- API Routes -----------------

// Ingest route fixed: runs the ingestion function
app.post('/api/ingest', async (req, res, next) => {
  try {
    const result = await ingestData();
    res.json({ success: true, message: 'Data ingested successfully', ...result });
  } catch (err) {
    next(err);
  }
});

// Sections route
app.use('/api/sections', sectionRoutes);

// Chat route with validation
app.post('/api/chat', validateChatRequest, chatHandler);

// ----------------- Production: serve frontend -----------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/dist/index.html'));
  });
}

// ----------------- 404 Handler -----------------
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// ----------------- Error Handling -----------------
app.use(errorHandler);

// ----------------- Start Server -----------------
app.listen(PORT, () => {
  console.log(`AI Portfolio Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// ----------------- Graceful Shutdown -----------------
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;