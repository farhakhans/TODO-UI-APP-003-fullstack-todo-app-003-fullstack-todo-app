@echo off
echo Starting Todo App Project...

REM Kill existing node processes
echo Killing existing Node processes...
taskkill /f /im node.exe 2>nul

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start backend server in new window
echo Starting Backend Server...
start "Todo Backend" cmd /k "cd /d "D:\DocuBook-Chatbot folder\TODO-UI-APP\backend" && python -m uvicorn src.main:app --host 127.0.0.1 --port 8080"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend server in new window
echo Starting Frontend Server...
start "Todo Frontend" cmd /k "cd /d "D:\DocuBook-Chatbot folder\TODO-UI-APP\frontend" && npx next dev"

echo.
echo Project started successfully!
echo.
echo Backend: http://localhost:8080
echo Frontend: Will be available on the first available port (usually http://localhost:3000)
echo.
echo Press any key to exit...
pause >nul