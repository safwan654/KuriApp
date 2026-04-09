@echo off
echo.
echo 🚀 Launching KuriHub Next.js App...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install it from https://nodejs.org/
    pause
    exit /b %errorlevel%
)

echo [STEP 1] Checking Dependencies...
if not exist "node_modules" (
    echo [INFO] node_modules not found. Installing...
    call npm install
)

echo.
echo [STEP 2] Starting Dev Server...
echo Point your browser to: http://localhost:3000
echo.
call npm run dev
pause
