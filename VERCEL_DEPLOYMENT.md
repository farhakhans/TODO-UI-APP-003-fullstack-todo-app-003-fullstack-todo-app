# Vercel Deployment Guide for Todo App

This document explains how to properly deploy your full-stack Todo application to Vercel.

## Architecture Overview

Your Todo application consists of two parts:
- **Frontend**: Next.js 14 application (located in `/frontend`)
- **Backend**: FastAPI application (located in `/backend`)

## Deployment Issue

When deploying only the frontend to Vercel, the app may not be visible or functional because:

1. The frontend expects the backend API to be available at a specific URL
2. Your local configuration uses `NEXT_PUBLIC_API_URL=http://localhost:8080`
3. The backend service is not deployed alongside the frontend

## Solution

### Step 1: Deploy Backend Service Separately

Deploy your FastAPI backend to one of these platforms:
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Heroku](https://heroku.com/)

### Step 2: Configure Environment Variables on Vercel

After deploying your backend, update your Vercel project settings:

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add/update the following variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your deployed backend URL (e.g., `https://your-backend.onrender.com`)

### Step 3: Backend CORS Configuration

Make sure your backend allows requests from your Vercel domain. In your FastAPI app (`backend/src/main.py`), update the CORS origins:

```python
# Add your Vercel domain to allowed origins
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-project.vercel.app",  # Replace with your actual Vercel URL
    # Add other domains as needed
]
```

### Step 4: Redeploy Frontend

After setting the environment variables, redeploy your frontend on Vercel for the changes to take effect.

## Alternative: Integrated Deployment

If you prefer to deploy everything together, consider moving your backend endpoints to Vercel API routes by creating files in `frontend/src/pages/api/` or `frontend/src/app/api/`.

## Troubleshooting

- If your app still doesn't work after deployment, check browser console for CORS errors
- Verify that your backend is accessible at the configured URL
- Make sure your backend is deployed to a publicly accessible URL