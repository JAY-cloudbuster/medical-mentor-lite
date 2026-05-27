import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/api.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Security Middleware
app.use(helmet());
app.disable('x-powered-by');

// CORS configuration - only allow requests from specific origin in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Global Rate Limiting
app.use('/api', apiLimiter);

// Routes
app.use('/api', apiRoutes);

// Error Handling (Must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Neural Medix API (Production Architecture) listening on port ${port}`);
});
