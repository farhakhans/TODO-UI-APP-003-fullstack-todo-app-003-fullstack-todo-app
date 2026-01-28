@echo off
echo Stopping any existing Python processes...

REM Kill any existing Python processes
taskkill /f /im python.exe 2>nul

REM Wait a moment for processes to close
timeout /t 3 /nobreak >nul

echo Starting Todo App Backend...
cd /d "D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app\backend"
echo Starting Backend Server on port 8000...
python -m uvicorn src.main:app --host 127.0.0.1 --port 8000

pause