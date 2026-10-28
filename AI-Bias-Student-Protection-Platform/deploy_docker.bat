@echo off
TITLE EquiLens Docker Container Deployment
echo =========================================================
echo   Starting EquiLens Docker Build & Deployment
echo =========================================================

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo [1/2] Building container image with Docker Compose...
docker compose build

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker build failed! Ensure Docker Desktop is running.
    pause
    exit /b %ERRORLEVEL%
)

echo [2/2] Launching EquiLens container...
docker compose up -d

echo.
echo =========================================================
echo  EquiLens Container is Live!
echo  Open: http://localhost:8000
echo =========================================================
echo To view container logs: docker compose logs -f
echo To stop container:     docker compose down
echo.
pause
