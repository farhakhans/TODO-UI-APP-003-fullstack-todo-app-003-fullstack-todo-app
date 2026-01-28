# Vercel Environment Configuration for Todo App

## Required Environment Variables

To properly deploy your Todo app to Vercel, you need to configure the following environment variables:

### Frontend (Vercel Project Settings)

1. **NEXT_PUBLIC_API_URL** - The URL of your deployed backend service
   - Example: `https://your-backend.onrender.com` (if deployed to Render)
   - Example: `https://your-backend-production.up.railway.app` (if deployed to Railway)

## Backend (Separate Hosting Provider)

When deploying your backend to a separate service (like Render, Railway, etc.), you also need to set:

1. **BACKEND_CORS_ORIGINS** - Comma-separated list of allowed origins
   - Example: `https://your-frontend.vercel.app,https://www.yourdomain.com`
   - Include your Vercel deployment URL here

## Deployment Steps

1. Deploy your backend service to a hosting provider (Render, Railway, Heroku, etc.)
2. Note the URL of your deployed backend
3. Go to your Vercel dashboard
4. Select your frontend project
5. Go to Settings → Environment Variables
6. Add the following variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your deployed backend URL (e.g., `https://your-backend.onrender.com`)
7. Redeploy your frontend on Vercel

## Example Configuration

### Vercel Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Backend Environment Variables (on hosting provider):
```
BACKEND_CORS_ORIGINS=https://your-frontend.vercel.app
DATABASE_URL=your_database_connection_string
SECRET_KEY=your_secret_key
```

## Troubleshooting

- If input fields don't appear or tasks can't be added, check the browser console for CORS errors
- Verify that your backend is accessible at the configured URL
- Ensure your backend allows requests from your Vercel domain
- Check that authentication tokens are being properly stored and sent with requests