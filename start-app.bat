@echo off
echo Starting Todo App...

REM Start backend in a new window
start cmd /k "cd /d "D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app\backend" && echo Starting Backend Server... && python -m uvicorn src.main:app --host 127.0.0.1 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start cmd /k "cd /d "D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app\frontend" && echo Starting Frontend Server... && npm run dev"

echo Applications started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000 or http://localhost:3001 (if 3000 is busy)
pause