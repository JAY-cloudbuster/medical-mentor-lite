# Production Deployment Guide

## Frontend (Vite/React)
1. Ensure `VITE_API_URL` (if applicable) points to your production backend.
2. Run `npm run build`.
3. Deploy the `/dist` directory to Vercel, Netlify, or AWS S3.

## Backend (Node.js/Express)
1. Ensure `.env` is properly populated with your production `GEMINI_API_KEY`.
2. Start using PM2 for process management: `pm2 start server.js --name "medix-api"`.
3. Set up a reverse proxy (Nginx) to map port 3001 to port 443 with an SSL certificate.

## Important Note
Never commit the `.env` file! Always inject secrets directly into the hosting provider's interface.
