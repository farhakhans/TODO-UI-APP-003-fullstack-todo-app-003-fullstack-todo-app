# Todo App - Vercel Deployment

This is a full-stack Todo application that can be deployed for free on Vercel.

## Features
- User authentication (sign up/sign in)
- Task management (create, read, update, delete)
- Responsive design
- Modern UI with Tailwind CSS

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Deploy to Vercel:
```bash
vercel --prod
```

4. When prompted for environment variables, set:
   - `NEXT_PUBLIC_USE_LOCAL_ROUTES`: `true`

### Option 2: GitHub Integration

1. Push your code to a GitHub repository
2. Go to [https://vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Before deploying, go to "Environment Variables" and add:
   - `NEXT_PUBLIC_USE_LOCAL_ROUTES`: `true`
6. Click "Deploy"

## How It Works

This deployment uses mock API routes hosted on Vercel's serverless functions, so no external backend is required. All data is stored in memory (resets with each serverless function cold start).

## Notes

- Data is temporary and resets periodically (part of the free tier limitations)
- For a production app with persistent data, you would connect to a database
- The UI and all functionality work exactly the same as the full-stack version

## Troubleshooting

If you encounter any issues:
1. Make sure `NEXT_PUBLIC_USE_LOCAL_ROUTES` is set to `true`
2. Clear your browser cache and try again
3. Check the browser console for any error messages