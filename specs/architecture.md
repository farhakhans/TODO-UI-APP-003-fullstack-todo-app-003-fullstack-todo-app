# Full-Stack Todo Application Architecture

## Monorepo Architecture

The application follows a monorepo architecture with clear separation between frontend and backend components:

- All code resides in a single repository
- Frontend and backend code are organized in separate directories
- Shared configurations and documentation are at the root level
- Dependencies are managed cohesively across both frontend and backend

## Frontend / Backend Separation

The application is divided into two distinct layers:

**Frontend**:
- Built with Next.js 16+ using App Router
- Implements responsive UI with Tailwind CSS
- Consumes backend API via HTTP requests
- Manages client-side state and user sessions

**Backend**:
- Built with FastAPI framework
- Exposes REST API endpoints
- Handles business logic and data validation
- Interfaces with database for persistence

## JWT-Based Authentication Flow

The authentication flow follows these steps:

1. User submits credentials via frontend login form
2. Backend validates credentials against stored user data
3. Backend generates JWT with user identity claims
4. JWT is returned to frontend and stored in browser
5. Subsequent requests include JWT in Authorization header
6. Backend validates JWT for each protected request
7. JWT expiry triggers re-authentication requirement

## Request Lifecycle

The complete request lifecycle follows this pattern:

**Frontend → API → DB**:

1. User performs action in frontend UI
2. Frontend sends HTTP request to backend API with JWT
3. Backend API validates JWT and user permissions
4. Backend processes request and accesses database if needed
5. Database operations are performed with user-specific filters
6. Backend returns response to frontend
7. Frontend updates UI based on response