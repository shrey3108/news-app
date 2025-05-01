@echo off
title Real-Time News App Deployment

echo [DEPLOYMENT] Starting automatic deployment...

REM Check Docker installation
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Navigate to project directory
cd /d "%~dp0"

REM Clean up old resources
echo [DEPLOYMENT] Cleaning up old Docker resources...
docker system prune -f > nul 2>&1

REM Stop and remove existing containers
echo [DEPLOYMENT] Stopping existing containers...
docker-compose down > nul 2>&1

REM Build and start new containers
echo [DEPLOYMENT] Building and starting new containers...
docker-compose up --build -d

if %errorlevel% equ 0 (
    echo [SUCCESS] 🚀 Deployment Successful!
    echo Access Points:
    echo - Frontend: http://localhost:3000
    echo - Backend: http://localhost:5000
    echo - Swagger Docs: http://localhost:5000/api-docs
) else (
    echo [ERROR] Deployment Failed. Check logs for details.
    docker-compose logs
)

REM Show running containers
docker ps

pause
