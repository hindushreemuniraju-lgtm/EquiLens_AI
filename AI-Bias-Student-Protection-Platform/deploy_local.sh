#!/usr/bin/env bash
# =========================================================================
# EquiLens - Unified Local Production Deployment Script (Linux / macOS)
# =========================================================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "========================================================="
echo "  Starting EquiLens Production Build & Launch Procedure  "
echo "========================================================="

echo ""
echo "[1/3] Building production React frontend..."
cd "$SCRIPT_DIR/frontend"
npm ci || npm install
npm run build
echo "[OK] Frontend build succeeded!"

echo ""
echo "[2/3] Checking Python dependencies..."
cd "$SCRIPT_DIR/backend"
pip install -r requirements.txt --quiet
echo "[OK] Python dependencies verified!"

echo ""
echo "[3/3] Launching Unified EquiLens Server on http://localhost:8000 ..."
echo "---------------------------------------------------------"
echo "  Frontend SPA:           http://localhost:8000"
echo "  Backend REST API:       http://localhost:8000/api"
echo "  Interactive Swagger UI: http://localhost:8000/docs"
echo "---------------------------------------------------------"
echo "Press Ctrl+C to terminate."

python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
