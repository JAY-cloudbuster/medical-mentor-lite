import { rateLimit } from 'express-rate-limit';

// Global API rate limiter to protect against DOS
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" }
});

// Strict rate limiter for AI-backed endpoints to protect API key quota
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 min per IP for AI routes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "AI generation quota exceeded for this IP, please try again after 15 minutes" }
});
