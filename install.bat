@echo off
REM Windows Setup Script for IoT Simulation

echo.
echo =====================================
echo IoT Self-Healing Infrastructure
echo Setup Script (Windows)
echo =====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected: 
node --version

REM Setup Backend
echo.
echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Setup Frontend
echo.
echo Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ✓ Setup Complete!
echo.
echo To start the simulation:
echo.
echo 1. In Terminal 1 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo 2. In Terminal 2 (Frontend):
echo    cd frontend
echo    npm start
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
pause
