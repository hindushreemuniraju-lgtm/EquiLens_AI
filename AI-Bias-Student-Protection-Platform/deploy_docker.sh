#!/usr/bin/env bash
# =========================================================================
# EquiLens - Docker Container Deployment Script (Linux / macOS)
# =========================================================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "========================================================="
echo "  Starting EquiLens Docker Build & Deployment            "
echo "========================================================="

echo "[1/2] Building container image with Docker Compose..."
docker compose build

echo "[2/2] Launching EquiLens container in detached mode..."
docker compose up -d

echo ""
echo "========================================================="
echo "  EquiLens Container is Live!"
echo "  Open: http://localhost:8000"
echo "========================================================="
echo "To view container logs: docker compose logs -f"
echo "To stop container:      docker compose down"
echo ""
