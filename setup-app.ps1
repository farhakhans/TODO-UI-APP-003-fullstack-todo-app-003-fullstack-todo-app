# PowerShell script to move project to a path without spaces and start the application

Write-Host "Setting up TODO Application in a path without spaces..." -ForegroundColor Green

# Define source and destination paths
$sourcePath = "D:\DocuBook-Chatbot folder\TODO-UI-APP"
$destinationPath = "D:\TodoApp"

# Check if source exists
if (-not (Test-Path $sourcePath)) {
    Write-Host "Error: Source path does not exist: $sourcePath" -ForegroundColor Red
    exit 1
}

# Check if destination already exists
if (Test-Path $destinationPath) {
    Write-Host "Warning: Destination path already exists: $destinationPath" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite? (y/N)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "Operation cancelled." -ForegroundColor Yellow
        exit 0
    }
    Remove-Item -Path $destinationPath -Recurse -Force
}

# Copy the entire project to the new location
Write-Host "Copying project to $destinationPath..." -ForegroundColor Cyan
Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse -Force

Write-Host "Project copied successfully!" -ForegroundColor Green

# Update the environment file to use the correct API URL
$envFilePath = "$destinationPath\frontend\.env.local"
if (Test-Path $envFilePath) {
    $envContent = Get-Content $envFilePath
    $envContent = $envContent -replace 'http://localhost:8080', 'http://localhost:8080'
    Set-Content -Path $envFilePath -Value $envContent
    Write-Host "Updated environment file with correct API URL" -ForegroundColor Green
}

# Kill any existing processes on ports 8080 and 3000-3010
Write-Host "Stopping existing processes..." -ForegroundColor Cyan
$ports = 8080
for ($i = 3000; $i -le 3010; $i++) {
    $ports += $i
}

foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped process on port $port" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "The project has been moved to: $destinationPath" -ForegroundColor White
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Open a new terminal/command prompt" -ForegroundColor White
Write-Host "2. Navigate to the new directory: cd '$destinationPath'" -ForegroundColor White
Write-Host "3. Start backend: cd backend && python -m uvicorn src.main:app --host 0.0.0.0 --port 8080" -ForegroundColor White
Write-Host "4. In another terminal: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Cyan
Write-Host "- Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "- Frontend UI: http://localhost:3001 (or next available port)" -ForegroundColor White
Write-Host ""

Pause