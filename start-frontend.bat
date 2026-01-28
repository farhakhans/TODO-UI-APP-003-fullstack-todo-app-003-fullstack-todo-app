@echo off
echo Stopping any existing node processes...

REM Kill any existing node processes
taskkill /f /im node.exe 2>nul

REM Wait a moment for processes to close
timeout /t 3 /nobreak >nul

echo Starting Todo App Frontend...
cd /d "D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app\frontend"
echo Starting Frontend Server on port 3000...
npm run dev

pause