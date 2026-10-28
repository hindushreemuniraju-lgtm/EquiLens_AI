# =========================================================================
# EquiLens - Unified Local Production Deployment Script (PowerShell)
# =========================================================================

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  Starting EquiLens Production Build & Launch Procedure  " -ForegroundColor Magenta
Write-Host "=========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Build Frontend
Write-Host "`n[1/3] Building production React frontend..." -ForegroundColor Yellow
Set-Location -Path "$ScriptDir\frontend"
npm install --no-audit --prefer-offline
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ERROR] Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Frontend build succeeded! (Static assets ready in frontend/dist)" -ForegroundColor Green

# 2. Check Python Environment
Write-Host "`n[2/3] Checking Python dependencies..." -ForegroundColor Yellow
Set-Location -Path "$ScriptDir\backend"
python -m pip install -r requirements.txt --quiet
Write-Host "[OK] Python environment verified!" -ForegroundColor Green

# 3. Launch Unified Server
Write-Host "`n[3/3] Launching Unified EquiLens Server on http://localhost:8000 ..." -ForegroundColor Cyan
Write-Host "---------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  Frontend SPA: http://localhost:8000" -ForegroundColor Green
Write-Host "  Backend REST API: http://localhost:8000/api" -ForegroundColor Green
Write-Host "  Interactive Swagger UI: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "---------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow

python -m uvicorn main:app --host 0.0.0.0 --port 8000
