#!/bin/bash
# Test script to verify the todo app restoration

echo "🔍 Testing Todo App Restoration..."

# Check if backend is accessible
echo "🌐 Testing backend connection..."
if curl -s http://localhost:8080/ > /dev/null 2>&1; then
    echo "✅ Backend is running and accessible"
    curl -s http://localhost:8080/ | python -m json.tool 2>/dev/null || echo "Backend API is responding"
else
    echo "❌ Backend is not accessible"
fi

# Check frontend files exist
echo "📱 Checking frontend files..."
if [ -f "frontend/package.json" ]; then
    echo "✅ Frontend package.json exists"
else
    echo "❌ Frontend package.json missing"
fi

# Check backend files exist
echo "🗄️ Checking backend files..."
if [ -f "backend/requirements.txt" ]; then
    echo "✅ Backend requirements.txt exists"
else
    echo "❌ Backend requirements.txt missing"
fi

# Check if database exists
echo "💾 Checking database..."
if [ -f "backend/todo_app.db" ]; then
    echo "✅ Database file exists"
else
    echo "⚠️ Database file missing"
fi

# Check environment configuration
echo "⚙️ Checking environment configuration..."
if [ -f "frontend/.env.local" ]; then
    if grep -q "NEXT_PUBLIC_API_URL=http://localhost:8080" "frontend/.env.local"; then
        echo "✅ Frontend API URL configured correctly"
    else
        echo "❌ Frontend API URL not configured correctly"
    fi
else
    echo "❌ Frontend environment file missing"
fi

if [ -f "backend/.env" ]; then
    echo "✅ Backend environment file exists"
else
    echo "❌ Backend environment file missing"
fi

echo "✅ Todo App restoration verification complete!"
echo ""
echo "🚀 To run the application:"
echo "   1. Start backend: cd backend && python -m uvicorn src.main:app --host 127.0.0.1 --port 8080"
echo "   2. Start frontend: cd frontend && npm run dev"
echo "   3. Visit: http://localhost:3000"