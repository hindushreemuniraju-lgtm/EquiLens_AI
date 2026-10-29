# EquiLens — AI Bias Mitigation & Student Protection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Full--Stack_FastAPI_%26_React-blue.svg)](https://fastapi.tiangolo.com)
[![Status](https://img.shields.io/badge/Status-Hackathon--Ready_Verified-brightgreen.svg)](README.md)

**EquiLens** is an enterprise-grade Responsible AI Command Center unifying algorithmic fairness auditing, rejection explainability, and multi-factor student scam defense.

---

## Quick Start (Unified Production Deployment)

Run the entire platform (React SPA + FastAPI REST API) unified on a single port:

```powershell
cd AI-Bias-Student-Protection-Platform
.\deploy_local.ps1
```
*Or simply double-click `AI-Bias-Student-Protection-Platform/deploy_local.bat`.*

- **Web Application**: http://localhost:8000
- **REST API & Swagger Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

---

## Project Structure & Documentation

Detailed project architecture and deployment guides are available in the project directory:

- 📖 **[Complete Platform Documentation](AI-Bias-Student-Protection-Platform/README.md)**: Feature breakdown across all six pillars, hackathon demo scripts, and architecture.
- 🚀 **[Deployment Manual](AI-Bias-Student-Protection-Platform/DEPLOYMENT.md)**: Local unified serving, Docker containerization, and 1-click cloud deployments (Render, Railway, Fly.io, Heroku).
- 🐳 **Docker Deployment**: `cd AI-Bias-Student-Protection-Platform && docker compose up --build -d`
