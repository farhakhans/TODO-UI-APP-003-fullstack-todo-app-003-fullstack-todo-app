# PowerShell script to help configure backend environment for Vercel deployment

Write-Host "Setting up backend for Vercel deployment..." -ForegroundColor Green

# Check if we're in the backend directory
if (!(Test-Path "src\main.py")) {
    Write-Host "Error: This script should be run from the backend directory" -ForegroundColor Red
    exit 1
}

Write-Host "Creating backend .env file with recommended settings..." -ForegroundColor Green

# Create a sample .env file with proper CORS settings
$content = @"
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/todoapp
NEON_DATABASE_URL=your_neon_database_url_here

# Security Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Configuration
DEBUG=False

# CORS Configuration - Add your Vercel deployment URL here
# Example: BACKEND_CORS_ORIGINS=https://your-project.vercel.app,https://www.yourdomain.com
BACKEND_CORS_ORIGINS=https://todo-frontend-blush.vercel.app,*.vercel.app,https://frontend-fjp2z60tz-farhakhans-projects.vercel.app
"@

Set-Content -Path ".env" -Value $content

Write-Host "Backend .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Important: Update the DATABASE_URL and SECRET_KEY values in the .env file before deploying." -ForegroundColor Yellow
Write-Host "Also update BACKEND_CORS_ORIGINS with your specific Vercel deployment URL." -ForegroundColor Yellow