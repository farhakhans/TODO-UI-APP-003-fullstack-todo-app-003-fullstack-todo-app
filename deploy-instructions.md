# Deployment Instructions for Full-Stack TODO App

## Current Issue
The sign-in functionality is failing because the frontend deployed on Vercel cannot connect to the backend API. The frontend is looking for the backend at `NEXT_PUBLIC_API_URL`, which defaults to `http://localhost:8080` when not set.

## Solution Steps

### Step 1: Deploy the Backend API
You need to deploy your FastAPI backend to a cloud platform that supports Python applications:

#### Option A: Deploy to Render.com (Recommended)
1. Create an account at [Render](https://render.com/)
2. Create a new Web Service
3. Connect to your GitHub repository
4. Choose Python runtime
5. Set the build command: `pip install -r requirements.txt`
6. Set the start command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables:
   - `DATABASE_URL`: Your database connection string
   - `SECRET_KEY`: A strong secret key for JWT tokens
   - `BACKEND_CORS_ORIGINS`: Your Vercel frontend URL (e.g., `https://frontend-fjp2z60tz-farhakhans-projects.vercel.app`)

#### Option B: Deploy to Railway
1. Create an account at [Railway](https://railway.app/)
2. Connect to your GitHub repository
3. Follow the Python/FastAPI deployment guide
4. Set the start command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

### Step 2: Update CORS Settings in Backend
Before deploying your backend, update the CORS settings in `backend/src/main.py`:

```python
# Add your Vercel frontend URL to allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # For local development
        "https://frontend-fjp2z60tz-farhakhans-projects.vercel.app",  # Your Vercel URL
        # Add your actual Vercel URL here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 3: Configure Frontend Environment Variables on Vercel
Once your backend is deployed and you have the backend URL:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `frontend` project
3. Go to Settings → Environment Variables
4. Add a new environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your deployed backend URL (e.g., `https://your-app.onrender.com`)

### Step 4: Redeploy Frontend
After setting the environment variables, trigger a new deployment on Vercel.

## Alternative: Using Railway for Both Frontend and Backend
You can also deploy both your frontend and backend to Railway:
1. Create two separate services in Railway
2. The backend service will be your FastAPI app
3. The frontend service will be your Next.js app
4. Use Railway's internal networking to connect them

## Testing the Connection
After deployment:
1. Visit your frontend URL
2. Check browser developer tools (Network tab) to see if API calls are reaching your backend
3. Verify that CORS errors are gone

## Sample Backend Deployment Files
If you're using Render, you might need a `runtime.txt` file in your backend directory:
```
python-3.11
```

And update your `requirements.txt` to ensure all dependencies are listed.

## Need Help?
If you need assistance with any of these steps, please refer to the individual platform documentation or contact their support.