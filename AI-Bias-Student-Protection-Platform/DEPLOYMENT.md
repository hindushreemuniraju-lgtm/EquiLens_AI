# EquiLens Deployment Guide
**Complete Manual for Local Unified Serving, Containerization, and Cloud Deployment**

EquiLens is architected to support multiple zero-friction deployment targets:
1. **Unified Single-Port Local Production Server** (Frontend SPA + Backend API unified on port 8000).
2. **Docker & Docker Compose Containerization** (Multi-stage build with persistent SQLite volume).
3. **1-Click Cloud Deployment** (Render, Railway, Fly.io, Heroku via provided blueprints).
4. **Enterprise Linux VM / Cloud Instance** (Systemd + Nginx on AWS, GCP, Azure, or DigitalOcean).

---

## Architecture Overview

```
                      +-----------------------------------+
                      |   Client Web Browser / Recruiter  |
                      +-----------------+-----------------+
                                        | (Port 8000)
                                        v
+-------------------------------------------------------------------------------+
|                            EquiLens Unified Server                            |
|                                                                               |
|   Static Requests (/, /fairness-scorecard, /assets/*)                         |
|   ===> FastAPI StaticFiles / FileResponse ===> React SPA (frontend/dist)      |
|                                                                               |
|   API Requests (/api/fairness/audit, /api/scam/analyze, etc.)                 |
|   ===> FastAPI APIRouter ===> 6 Pillar Processing Engines                     |
|                                                                               |
|   Database                                                                    |
|   ===> SQLite WAL Mode Engine (backend/equilens.db)                           |
+-------------------------------------------------------------------------------+
```

---

## Option 1: Unified Local Production Server (Recommended for Immediate Evaluation)

In this mode, the production React build is served directly through FastAPI. You do **not** need two terminal windows or port proxies; everything runs on **`http://localhost:8000`**.

### On Windows (PowerShell):
```powershell
cd "c:\PROJECTS\3RD SEM\HACKATHONS'\EquiLens\AI-Bias-Student-Protection-Platform"
.\deploy_local.ps1
```
*Or simply double-click **`deploy_local.bat`**.*

### On Linux / macOS (Bash):
```bash
cd AI-Bias-Student-Protection-Platform
chmod +x deploy_local.sh
./deploy_local.sh
```

### Manual Command Line:
```bash
# 1. Build frontend
cd frontend
npm install
npm run build
cd ..

# 2. Start unified server
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Access Points:
- **Web Application**: `http://localhost:8000`
- **REST API Base**: `http://localhost:8000/api`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`

---

## Option 2: Docker Container Deployment

EquiLens provides an optimized multi-stage `Dockerfile` (Node 20 Alpine for building the frontend + Python 3.11 Slim for the runtime) and `docker-compose.yml`.

### Prerequisites:
- Docker Desktop or Docker Engine installed and running.

### 1-Click Launch (Windows):
Double-click **`deploy_docker.bat`**.

### Manual Command:
```bash
cd AI-Bias-Student-Protection-Platform

# Build and start in background
docker compose up --build -d

# View real-time logs
docker compose logs -f

# Stop the container
docker compose down
```

### Docker Healthcheck & Data Persistence:
- Persistent SQLite database is mounted into the `equilens_data` volume.
- Automatic container health checks poll `http://localhost:8000/api/health` every 30 seconds.

---

## Option 3: 1-Click Cloud Deployment

### Target A: Render.com (Blueprint Deploy)
EquiLens includes a pre-configured `render.yaml`:
1. Push your repository to GitHub or GitLab.
2. In the Render Dashboard, click **New +** -> **Blueprint**.
3. Select your repository. Render automatically reads `render.yaml`, builds the frontend, installs Python requirements, and binds the unified server to `$PORT`.

### Target B: Railway.app
EquiLens includes `railway.json` and a `Dockerfile`:
1. Open [Railway.app](https://railway.app) and create a **New Project**.
2. Select **Deploy from GitHub repo**.
3. Railway detects the `Dockerfile` and builds the multi-stage image automatically.
4. Set the port to `8000` in service variables (if not auto-detected).

### Target C: Heroku / Fly.io
EquiLens includes a `Procfile`:
```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```
Deploy via the standard CLI:
```bash
heroku create equilens-platform
git push heroku main
```

---

## Option 4: Linux Virtual Machine (Ubuntu 22.04 / 24.04 on AWS / GCP / DigitalOcean)

### Step 1: System Packages
```bash
sudo apt update && sudo apt install -y python3-pip python3-venv nodejs npm nginx git
```

### Step 2: Clone & Build
```bash
git clone <your-repo-url> /opt/equilens
cd /opt/equilens/frontend
npm install && npm run build

cd /opt/equilens/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 3: Setup Systemd Service (`/etc/systemd/system/equilens.service`)
```ini
[Unit]
Description=EquiLens Unified Responsible AI Server
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/equilens/backend
ExecStart=/opt/equilens/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 2
Restart=always

[Install]
WantedBy=multi-user.target
```
Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable equilens
sudo systemctl start equilens
```

### Step 4: Configure Nginx (`/etc/nginx/sites-available/equilens`)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/equilens /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Option 5: Environment Variables Reference

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `8000` | Port on which the unified server listens. |
| `EQUILENS_DB_PATH` | `equilens.db` | Path to persistent SQLite database. |
| `PYTHONUNBUFFERED` | `1` | Forces realtime stdout logging for containers. |

---

## Verification & Post-Deployment Testing

Once deployed to any target, verify the deployment using the built-in health endpoint:

```bash
# Health check probe
curl http://localhost:8000/api/health
# Response: {"status":"ONLINE","service":"EquiLens AI Bias & Candidate Protection Engine","version":"1.0.0","docs_url":"/docs"}

# Platform stats
curl http://localhost:8000/api/overview/stats

# Interactive API Explorer
Open http://localhost:8000/docs in your browser.
```
