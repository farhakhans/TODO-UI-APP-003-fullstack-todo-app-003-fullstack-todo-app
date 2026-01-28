# Quick Start Guide: Full-Stack Todo Web Application

## Prerequisites

- Node.js 18+ with npm/yarn
- Python 3.11+
- PostgreSQL (or access to Neon PostgreSQL)
- Git

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Configuration

1. Create backend environment file (`backend/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/todoapp"
SECRET_KEY="your-super-secret-key-here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
NEON_DATABASE_URL="your-neon-database-url"
```

2. Create frontend environment file (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## Database Setup

1. Set up Neon PostgreSQL database
2. Run database migrations:
```bash
cd backend
python -m src.database.migrate
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

## Authentication Flow

1. Register a new user via POST `/api/auth/signup`
2. Sign in via POST `/api/auth/signin` to get JWT token
3. Include token in headers for protected endpoints: `Authorization: Bearer {token}`
4. Access protected resources via API endpoints

## Basic Usage

1. Sign up for a new account
2. Create tasks using the "+" button or task creation form
3. Update task details by clicking on task items
4. Mark tasks as complete/incomplete using checkboxes
5. Delete tasks using the delete button

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

## Troubleshooting

- If database migrations fail, ensure your database credentials are correct
- If authentication fails, verify JWT secret configuration
- If API calls return 401, ensure the JWT token is properly included in requests
- If the UI doesn't update after API calls, check browser console for errors