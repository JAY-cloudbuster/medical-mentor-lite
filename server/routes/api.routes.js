import express from 'express';
import { defineTerm, getRelatedTerms, generateQuiz, getGraph } from '../controllers/gemini.controller.js';
import { getYoutubeVideos } from '../controllers/youtube.controller.js';
import { getProfile, getActivities, getSavedTerms } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// AI Routes — requireAuth ensures all analytics events have a valid userId
router.post('/define', requireAuth, aiLimiter, defineTerm);
router.post('/related', requireAuth, aiLimiter, getRelatedTerms);
router.post('/quiz', requireAuth, aiLimiter, generateQuiz);
router.post('/graph', requireAuth, aiLimiter, getGraph);
router.get('/youtube', requireAuth, getYoutubeVideos);

// Protected Dashboard Routes
router.get('/dashboard/profile', requireAuth, getProfile);
router.get('/dashboard/activities', requireAuth, getActivities);
router.get('/dashboard/terms', requireAuth, getSavedTerms);

export default router;
