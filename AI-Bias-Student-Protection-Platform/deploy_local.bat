@echo off
TITLE EquiLens Unified Production Server
echo =========================================================
echo   Starting EquiLens Production Build & Launch Procedure
echo =========================================================

set SCRIPT_DIR=%~dp0

echo.
echo [1/3] Building production React frontend...
cd /d "%SCRIPT_DIR%frontend"
call npm install --no-audit
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b %ERRORLEVEL%
)
echo [OK] Frontend build succeeded!

echo.
echo [2/3] Checking Python dependencies...
cd /d "%SCRIPT_DIR%backend"
call python -m pip install -r requirements.txt --quiet
echo [OK] Python dependencies verified!

echo.
echo [3/3] Launching Unified EquiLens Server on http://localhost:8000 ...
echo ---------------------------------------------------------
echo   Frontend SPA:           http://localhost:8000
echo   Backend REST API:       http://localhost:8000/api
echo   Interactive Swagger UI: http://localhost:8000/docs
echo ---------------------------------------------------------
echo Press Ctrl+C to terminate.

call python -m uvicorn main:app --host 0.0.0.0 --port 8000
pause
