@echo off
REM Verification Script - Checks if all files are in place

setlocal enabledelayedexpansion

echo.
echo =====================================
echo IoT Simulation - Setup Verification
echo =====================================
echo.

set errors=0

REM Check backend files
echo Checking backend files...
call :check_file "backend\server.js" "✓ Backend server" "✗ Backend server MISSING"
call :check_file "backend\package.json" "✓ Backend package.json" "✗ Backend package.json MISSING"
call :check_file "backend\simulation\networkGraph.js" "✓ Network graph module" "✗ Network graph MISSING"
call :check_file "backend\simulation\sensorEngine.js" "✓ Sensor engine module" "✗ Sensor engine MISSING"
call :check_file "backend\simulation\routingEngine.js" "✓ Routing engine module" "✗ Routing engine MISSING"
call :check_file "backend\simulation\failureManager.js" "✓ Failure manager module" "✗ Failure manager MISSING"

REM Check frontend files
echo.
echo Checking frontend files...
call :check_file "frontend\package.json" "✓ Frontend package.json" "✗ Frontend package.json MISSING"
call :check_file "frontend\src\App.jsx" "✓ React App component" "✗ React App MISSING"
call :check_file "frontend\src\index.js" "✓ React index.js" "✗ React index MISSING"
call :check_file "frontend\src\components\NetworkGraph.jsx" "✓ Network graph component" "✗ Network graph component MISSING"
call :check_file "frontend\src\components\Dashboard.jsx" "✓ Dashboard component" "✗ Dashboard component MISSING"
call :check_file "frontend\src\components\ControlPanel.jsx" "✓ Control panel component" "✗ Control panel component MISSING"
call :check_file "frontend\src\hooks\useWebSocket.js" "✓ WebSocket hook" "✗ WebSocket hook MISSING"

REM Check node_modules
echo.
echo Checking installed dependencies...
if exist "backend\node_modules" (
    echo ✓ Backend node_modules installed
) else (
    echo ✗ Backend node_modules NOT installed
    set /a errors=errors+1
)

if exist "frontend\node_modules" (
    echo ✓ Frontend node_modules installed
) else (
    echo ✗ Frontend node_modules NOT installed
    set /a errors=errors+1
)

REM Check Docker files
echo.
echo Checking Docker configuration...
call :check_file "docker-compose.yml" "✓ Docker Compose config" "✗ Docker Compose MISSING"
call :check_file "Dockerfile" "✓ Main Dockerfile" "✗ Main Dockerfile MISSING"

REM Summary
echo.
echo =====================================
if %errors% equ 0 (
    echo ✓ All checks passed! Setup complete.
    echo.
    echo To start the simulation:
    echo   1. Terminal 1: cd backend ^&^& npm run dev
    echo   2. Terminal 2: cd frontend ^&^& npm start
    echo   3. Browser: http://localhost:3000
) else (
    echo ✗ %errors% issue(s) found. Please review above.
)
echo =====================================
echo.

endlocal
exit /b %errors%

:check_file
if exist "%~1" (
    echo %~2
) else (
    echo %~3
    set /a errors=errors+1
)
exit /b
