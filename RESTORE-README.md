# Todo App Restoration Guide

## Application Overview
This is a full-stack todo application with the following features:
- User authentication and authorization
- Task management (Create, Read, Update, Delete)
- Task filtering and status tracking
- Responsive UI with modern design
- Secure API with JWT authentication

## Project Structure
```
TODO-UI-APP/
├── backend/                 # FastAPI backend
│   ├── src/
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication logic
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   └── main.py         # Application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   └── todo_app.db        # SQLite database
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Application routes
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   └── services/      # API services
│   ├── package.json       # Node.js dependencies
│   └── .env.local         # Environment variables
└── start-project.bat      # Startup script
```

## How to Run the Application

### Method 1: Using the Startup Script (Recommended)
```bash
# Run the startup script
start-project.bat
```

### Method 2: Manual Startup

1. **Start the Backend Server:**
```bash
cd backend
python -m uvicorn src.main:app --host 127.0.0.1 --port 8080
```

2. **Start the Frontend Server:**
```bash
cd frontend
npm run dev
```

## Configuration
- Backend API runs on `http://localhost:8080`
- Frontend runs on `http://localhost:3000` (or first available port)
- API URL is configured in `frontend/.env.local`

## Key Features
- User registration and login
- Secure JWT-based authentication
- Create, update, delete, and filter tasks
- Task completion toggling
- Priority and due date management
- Responsive design with Tailwind CSS
- Animated UI elements with Framer Motion

## API Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/toggle-complete` - Toggle task completion

## Database
- SQLite database stored as `todo_app.db`
- Tables: `users` and `tasks`
- Initialized with `init_db.py`

## Troubleshooting
- If the app doesn't start, make sure ports 8080 (backend) and 3000+ (frontend) are available
- Clear browser cache if authentication issues occur
- Check that all dependencies are installed
- Ensure environment variables are properly set