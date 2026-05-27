import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Redis only if tokens are present
export const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

if (!redis) {
  console.warn("No Upstash Redis configuration found. Caching will be disabled. Set UPSTASH_REDIS_REST_URL to enable.");
}
