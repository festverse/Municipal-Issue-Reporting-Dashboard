/**
 * @file app.js
 * @description Express application configuration.
 *
 * Responsibilities:
 *  1. Load environment variables (dotenv)
 *  2. Create the Express app
 *  3. Apply global middleware (security, parsing, logging)
 *  4. Mount all route modules under /api/*
 *  5. Register 404 catch-all and global error handler
 *
 * This module exports the configured `app` but does NOT call app.listen().
 * Listening is handled in index.js so the app can also be imported for testing.
 */

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// ── Route modules ──────────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/ticket.routes');
const zoneRoutes = require('./routes/zone.routes');
const categoryRoutes = require('./routes/category.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const chatRoutes = require('./routes/chat.routes');

// ── Create Express app ─────────────────────────────────────────────
const app = express();

// ── Global middleware ──────────────────────────────────────────────

// Security headers (CSP, HSTS, X-Frame, etc.)
app.use(helmet());

// Cross-Origin Resource Sharing — wide open for now; tighten in production
app.use(cors());

// HTTP request logging (dev: coloured, prod: Apache combined)
app.use(requestLogger());

// Body parsers
app.use(express.json({ limit: '10kb' }));             // JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // form data

// Basic rate limiter — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// ── Health check ───────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ── Route mounting ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chats', chatRoutes);

// ── 404 catch-all for undefined routes ─────────────────────────────
app.use((req, _res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server.`, 404));
});

// ── Global error handler (must be last) ────────────────────────────
app.use(errorHandler);

module.exports = app;
