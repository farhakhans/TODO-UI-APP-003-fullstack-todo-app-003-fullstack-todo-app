@echo off
REM Test script to verify the todo app restoration

echo 🔍 Testing Todo App Restoration...
echo.

REM Check if backend is accessible
echo 🌐 Testing backend connection...
curl -s http://localhost:8080/ >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Backend is running and accessible
) else (
    echo ❌ Backend is not accessible
)

REM Check frontend files exist
echo 📱 Checking frontend files...
if exist "frontend\package.json" (
    echo ✅ Frontend package.json exists
) else (
    echo ❌ Frontend package.json missing
)

REM Check backend files exist
echo 🗄️  Checking backend files...
if exist "backend\requirements.txt" (
    echo ✅ Backend requirements.txt exists
) else (
    echo ❌ Backend requirements.txt missing
)

REM Check if database exists
echo 💾 Checking database...
if exist "backend\todo_app.db" (
    echo ✅ Database file exists
) else (
    echo ⚠️  Database file missing
)

REM Check environment configuration
echo ⚙️  Checking environment configuration...
if exist "frontend\.env.local" (
    findstr /C:"NEXT_PUBLIC_API_URL=http://localhost:8080" "frontend\.env.local" >nul
    if %errorlevel% == 0 (
        echo ✅ Frontend API URL configured correctly
    ) else (
        echo ❌ Frontend API URL not configured correctly
    )
) else (
    echo ❌ Frontend environment file missing
)

if exist "backend\.env" (
    echo ✅ Backend environment file exists
) else (
    echo ❌ Backend environment file missing
)

echo.
echo ✅ Todo App restoration verification complete!
echo.
echo 🚀 To run the application:
echo    1. Start backend: cd backend ^&^& python -m uvicorn src.main:app --host 127.0.0.1 --port 8080
echo    2. Start frontend: cd frontend ^&^& npm run dev
echo    3. Visit: http://localhost:3000