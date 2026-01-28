# Complete Deployment Guide for TODO App

## Current Status
Your frontend is deployed at: https://frontend-8zjcihobl-farhakhans-projects.vercel.app

## Issue
Sign-in is failing because your frontend doesn't know where to find the backend API.

## Solution: Deploy Backend and Configure API URL

### Step 1: Deploy Your Backend to Render.com

1. Go to https://render.com
2. Create an account and click "New +" → "Web Service"
3. Connect to GitHub and select your repository: `farhakhans/TODO-UI-APP-003-fullstack-todo-app`
4. Set the root directory to: `backend`
5. Runtime: Python
6. Build command: `pip install -r requirements.txt`
7. Start command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
8. Environment variables (optional but recommended):
   - DATABASE_URL: your database connection string
   - SECRET_KEY: a random secret key for JWT
   - BACKEND_CORS_ORIGINS: https://frontend-8zjcihobl-farhakhans-projects.vercel.app (your frontend URL)

### Step 2: Update CORS Settings in Your Backend

Before deploying, update `backend/src/main.py` to allow requests from your Vercel frontend:

```python
# In backend/src/main.py, update the CORSMiddleware section:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # For local development
        "https://frontend-8zjcihobl-farhakhans-projects.vercel.app",  # Your Vercel frontend
        # Add your actual Vercel URL here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 3: Set Environment Variable in Vercel

After deploying your backend to Render, you'll get a URL like `https://your-app-name.onrender.com`.

Then go to your Vercel dashboard:
1. Visit https://vercel.com/dashboard
2. Select your `frontend` project
3. Go to Settings → Environment Variables
4. Update or add `NEXT_PUBLIC_API_URL` with your backend URL:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-app-name.onrender.com` (replace with your actual backend URL)
   - Target: Production

### Step 4: Redeploy Your Frontend

After setting the environment variable, redeploy your frontend for the changes to take effect.

## Alternative: Quick Test Setup

If you want to test quickly without deploying your own backend:

1. Temporarily set `NEXT_PUBLIC_API_URL` to a placeholder value like `http://localhost:8080`
2. Run your backend locally with `cd backend && python -m uvicorn src.main:app --reload`
3. Use a service like ngrok to expose your local backend publicly
4. Update the environment variable with the ngrok URL

## Verification

After completing these steps:
1. Visit your frontend at https://frontend-8zjcihobl-farhakhans-projects.vercel.app
2. Try signing in
3. Check browser console for any API errors
4. Verify that API requests are reaching your backend

## Troubleshooting

- If you still see CORS errors, double-check that your backend allows requests from your Vercel URL
- If API calls fail, verify that your backend is accessible at the configured URL
- Check browser network tab to see the actual API request URLs and responses