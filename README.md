# Full-Stack Todo Web Application

A multi-user, full-stack todo application with authentication, responsive UI, and secure data isolation.

## Live Demo

**Check out the live application:** [https://todo-frontend-blush.vercel.app/](https://todo-frontend-blush.vercel.app/)

## Features

- **Multi-user support**: Each user has their own isolated task space
- **Authentication**: Secure JWT-based authentication with Better Auth
- **Responsive UI**: Works on mobile, tablet, and desktop devices
- **Task management**: Create, read, update, delete, and toggle completion of tasks
- **Data persistence**: Tasks persist across sessions with Neon PostgreSQL database
- **Production-ready**: Built with security and scalability in mind

## Tech Stack

- **Frontend**: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI with Python 3.11+
- **Database**: Neon Serverless PostgreSQL with SQLModel ORM
- **Authentication**: Better Auth with JWT tokens
- **Styling**: Tailwind CSS for responsive design

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (or access to Neon PostgreSQL)
- Git

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/todoapp"
   SECRET_KEY="your-super-secret-key-here"
   ALGORITHM="HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   NEON_DATABASE_URL="your-neon-database-url"
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

## Running the Application

### Development Mode

1. Start the backend:
   ```bash
   cd backend
   uvicorn src.main:app --reload --port 8000
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

### Production Mode

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend:
   ```bash
   cd backend
   uvicorn src.main:app --host 0.0.0.0 --port 8000
   ```

## API Documentation

The API is documented using OpenAPI/Swagger. Access the documentation at:
- Local: `http://localhost:8000/docs`
- Alternative: `http://localhost:8000/redoc`

## Security Features

- JWT-based authentication with expiration
- User isolation - users can only access their own tasks
- Input validation and sanitization
- Rate limiting to prevent abuse
- Secure password hashing with bcrypt

## Architecture

The application follows a monorepo architecture with clear separation between frontend and backend:

```
backend/
├── src/
│   ├── models/          # SQLModel database models
│   ├── services/        # Business logic services
│   ├── api/             # FastAPI endpoints
│   ├── auth/            # Authentication logic
│   ├── middleware/      # Middleware components
│   └── database/        # Database configuration
└── tests/
    ├── unit/
    ├── integration/
    └── contract/

frontend/
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable UI components
│   ├── lib/             # Shared utilities
│   ├── services/        # API service clients
│   └── contexts/        # React contexts
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Vercel Deployment (Frontend Only)

To deploy the frontend to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend service (e.g., `https://your-backend.onrender.com`)
4. The build command will automatically be detected as `cd frontend && npm run build`
5. The output directory will be `frontend/out`

> **Note**: Since this is a full-stack application with a separate backend, you'll need to deploy the backend service separately. See `VERCEL_DEPLOYMENT.md` for detailed instructions.

### Backend Deployment

The backend FastAPI application needs to be deployed separately. You can deploy it to:
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Heroku](https://heroku.com/)
- [AWS](https://aws.amazon.com/)
- [Google Cloud](https://cloud.google.com/)
- [Azure](https://azure.microsoft.com/)

### Full Deployment Configuration

For a complete deployment:

1. Deploy the backend to a cloud provider
2. Update the backend's CORS settings to include your Vercel frontend URL
3. Set the `NEXT_PUBLIC_API_URL` environment variable in Vercel to point to your deployed backend
4. Deploy the frontend to Vercel
5. Test that the frontend can communicate with the backend

For detailed step-by-step instructions, refer to [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).
