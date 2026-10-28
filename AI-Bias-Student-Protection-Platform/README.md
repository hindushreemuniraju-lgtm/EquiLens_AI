# EquiLens — AI Bias Mitigation & Student Protection Platform
**Consolidated Feature Architecture: Algorithmic Fairness, Rejection Explainability, and Anti-Scam Protection**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com)
[![Status](https://img.shields.io/badge/hackathon--ready-verified-brightgreen.svg)](https://github.com)
[![Compliance](https://img.shields.io/badge/regulatory-EU_AI_Act_%26_NIST_AI_RMF-orange.svg)](https://github.com)

---

## 1. Executive Summary & Core Purpose

Modern recruitment fails students on two fronts:
1. **Algorithmic Bias**: Complex black-box candidate scoring systems quietly exclude qualified students based on proxy variables, gender, caste, age, and college tiers without transparent explanation.
2. **Predatory Recruitment Scams**: Coordinated fraudulent syndicates target vulnerable student job-seekers with fake offer letters, upfront training fees, and phishing portals.

**EquiLens** is an enterprise-grade Responsible AI Command Center that unifies **rigorous quantitative model auditing and automated bias remediation** for employers with **proactive, privacy-preserving threat defense** for students.

> **ABSOLUTE PRIORITY**: Algorithmic fairness and AI bias mitigation are the central mission of EquiLens. All student protection and privacy modules operate in synergy without eclipsing this core purpose.

---

## 2. Palette & Design Language
EquiLens enforces the mandatory enterprise visual identity:
- **Jet Black (`#0A0A0A`)**: Command center backdrop and low-contrast surface foundations.
- **Cerulean Blue (`#007BA7`)**: Primary interactive controls, mathematical metrics, and compliant certifications.
- **Neon Rose (`#FF2D95`)**: High-priority bias alerts, 80% adverse impact violations, and predatory scam warnings.

---

## 3. The Six Pillars Feature Matrix

| Pillar | Implemented Modules & Capabilities | Status |
| :--- | :--- | :--- |
| **Pillar 1: Data Ingestion & Proxy Leakage** | Multi-Modal Ingestion (CSV, Parquet, Excel, JSON), automated schema inspection, sensitive attribute isolation, job rubric bias tracer, Cramer's V proxy leakage guard, live ATS streaming REST API. | **Verified Working** |
| **Pillar 2: Fairness Metrics & Auditing** | Demographic Parity Ratio (DPR), Equal Opportunity Difference (EOD), Average Odds Difference (AOD), EEOC 80% Disparate Impact rule, 0–100 Executive Fairness Health Index, real-time threshold sandbox, counterfactual device twin, hidden-prompt gaming audit. | **Verified Working** |
| **Pillar 3: Rejection Explainability** | Exact mathematical SHAP factor attributions (TreeExplainer), positive/negative credential waterfall charts, automated bias-free rejection sanity check, constructive candidate feedback cards with learning pathways. | **Verified Working** |
| **Pillar 4: Algorithmic Remediation** | Pre-processing (sample reweighting), In-processing (fairness-constrained Exponentiated Gradient optimization), Post-processing (calibrated group threshold reranking), Pareto efficiency trade-off spectrum. | **Verified Working** |
| **Pillar 5: Student Defense & Scam Shield** | 10-step hackathon demonstration workflow, NLP scam threat scoring, live typewriter PII redaction, SHA-256 pattern fingerprinting, crowdsourced registry, multilingual Indic scanner (Hindi, Kannada, Tamil, Telugu), 1-click cybercrime complaint drafter (cybercrime.gov.in), safe reply assistant, interactive learn mode. | **Verified Working** |
| **Pillar 6: Privacy by Design & DPDP** | Purpose-specific granular consent engine, regional language notices, isolated demographic audit vault, 1-click DPDP Act 2023 / GDPR Right to Erasure workflow, cryptographic deletion certificates, automated retention rules. | **Verified Working** |
| **Roadmap Innovation** | Vendor-monoculture cross-pipeline lockout discovery across 4 enterprise ATS platforms with Monoculture Lockout Index (82.4/100). | **Synthetic Demo** |

---

## 4. Project Directory Structure

```
AI-Bias-Student-Protection-Platform/
├── backend/
│   ├── api/
│   │   └── routes.py              # Central FastAPI router connecting all pillars
│   ├── ai/                        # Model training, scoring, evaluation pipelines
│   ├── database/
│   │   └── db.py                  # SQLite WAL database initialization and audit logging
│   ├── explainability/
│   │   └── shap_explainer.py      # SHAP TreeExplainer, sanity verifier, feedback generator
│   ├── fairness/
│   │   └── metrics.py             # DPR, EOD, AOD, 80% rule, executive health index
│   ├── privacy/
│   │   ├── consent_engine.py      # Granular purpose consent and withdrawal engine
│   │   ├── isolated_auditing.py   # Isolated demographic vault & 1-click DPDP erasure
│   │   └── pii_redactor.py        # PII detection & regex token masking
│   ├── remediation/
│   │   └── lab.py                 # Pre/In/Post processing and Pareto trade-off runner
│   ├── scam_detection/
│   │   ├── analyzer.py            # Multi-factor NLP recruitment scam detector
│   │   ├── cybercrime_report.py   # 1-click cybercrime.gov.in complaint drafter
│   │   ├── fingerprint.py         # Cryptographic SHA-256 pattern hashing & HMAC
│   │   ├── learn_mode.py          # Interactive student cybersecurity literacy quizzes
│   │   ├── multilingual.py        # Indic NLP scanner (Hindi, Kannada, Tamil, Telugu)
│   │   └── safe_reply.py          # Corporate verification response generator
│   ├── services/
│   │   ├── device_twin.py         # Counterfactual media degradation & latency simulation
│   │   ├── hidden_prompt.py       # Resume gaming & prompt injection audit
│   │   ├── proxy_guard.py         # Cramer's V & ANOVA proxy correlation detector
│   │   ├── rubric_tracer.py       # Exclusionary rubric phrase detector & rewrite
│   │   └── vendor_monoculture.py  # Roadmap: Cross-ATS multi-pipeline lockout analysis
│   ├── tests/
│   │   └── test_all_pillars.py    # Pytest unit & integration test suite (6/6 Passed)
│   ├── equilens.db                # Persistent SQLite database with seeded registry
│   ├── main.py                    # Application entry point with CORS
│   └── test_backend.py            # Quick backend verification script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FairnessHealthGauge.tsx   # SVG circular fairness health index gauge
│   │   │   ├── LiveTypewriterRedactor.tsx# Animated live PII token masking
│   │   │   ├── Navbar.tsx                # Enterprise top bar with live backend status
│   │   │   └── Sidebar.tsx               # 20 workspace links grouped under Six Pillars
│   │   ├── pages/                        # 20 Dedicated full-stack workspace pages
│   │   ├── services/
│   │   │   └── api.ts                    # Central API client
│   │   ├── types/
│   │   │   └── index.ts                  # TypeScript data interfaces
│   │   ├── App.tsx                       # Router configuration
│   │   ├── index.css                     # Tailwind CSS and Jet Black theme tokens
│   │   └── main.tsx                      # DOM entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── data/
│   ├── recruitment_fairness_audit.csv    # 1,200 tech applicant benchmark dataset
│   ├── sample_job_descriptions.json      # Biased & inclusive job posting samples
│   ├── scam_registry_seed.json           # Known crowdsourced threat signatures
│   └── seed_data.py                      # Data generation and hashing script
├── docs/                                 # Architecture diagrams and specifications
├── .env.example                          # Environment configuration template
└── README.md                             # Comprehensive platform documentation
```

---

## 5. Quick Start Instructions (Local Execution)

EquiLens is designed to be **immediately runnable locally without requiring paid API keys**.

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ (Tested on Node v24)
- npm 9+

---

### Step 1: Backend Setup & Launch

1. Navigate to the backend directory:
   ```bash
   cd AI-Bias-Student-Protection-Platform/backend
   ```

2. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn pydantic numpy pandas scipy scikit-learn fairlearn shap pytest python-multipart requests
   ```

3. Initialize and seed the local database:
   ```bash
   python database/db.py
   ```

4. Launch the FastAPI server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *The interactive Swagger API documentation will be available at: `http://127.0.0.1:8000/docs`*

---

### Step 2: Frontend Setup & Launch (Dev Mode)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd AI-Bias-Student-Protection-Platform/frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to: `http://localhost:5173`*

---

### Step 3: Production Deployment (Unified Single-Port & Docker)

EquiLens is fully configured for production deployment via multiple zero-friction options (see detailed [DEPLOYMENT.md](DEPLOYMENT.md)):

#### Option A: 1-Click Unified Local Production Server (Single Port 8000)
Run the entire platform (Frontend SPA + Backend API) on a single port without running two separate servers:
- **Windows (PowerShell)**: `.\deploy_local.ps1` (or double-click `deploy_local.bat`)
- **Linux / macOS**: `./deploy_local.sh`
- **Access Point**: Open `http://localhost:8000`

#### Option B: Docker Container Deployment
- **Docker Compose**: `docker compose up --build -d`
- **Windows Shortcut**: Double-click `deploy_docker.bat`
- **Access Point**: Open `http://localhost:8000`

#### Option C: 1-Click Cloud Deployment
- **Render.com**: Pre-configured `render.yaml` blueprint included.
- **Railway.app**: `railway.json` and Dockerfile ready for 1-click deploy.
- **Heroku / Fly.io**: `Procfile` included.

---

### Step 4: Run Automated Test Suite

Verify that all fairness calculations, proxy leakages, PII redactions, and privacy erasure workflows pass:
```bash
cd AI-Bias-Student-Protection-Platform/backend
python -m pytest tests/test_all_pillars.py -v
```
**Expected Output:**
```
tests/test_all_pillars.py::test_fairness_scorecard_and_80_percent_rule PASSED
tests/test_all_pillars.py::test_proxy_leakage_detection PASSED
tests/test_all_pillars.py::test_rubric_tracer_exclusionary_language PASSED
tests/test_all_pillars.py::test_pii_redaction_and_fingerprinting PASSED
tests/test_all_pillars.py::test_multilingual_regional_scam_detection PASSED
tests/test_all_pillars.py::test_granular_consent_and_erasure PASSED
======================== 6 passed in 2.68s ========================
```

---

## 6. Hackathon Demonstration Guide

### Demonstration A: The Critical 10-Step Scam Shield Flow
1. Navigate to `http://localhost:5173/scam-shield` (or click **HACKATHON DEMO** in the top navbar).
2. The official specification sample message is pre-filled:
   `"Pay ₹2500 training fee to HR Ramesh at 98450-XXXXX for Google Bangalore offer letter."`
3. Click **"Analyze Message & Execute Defense"**:
   - **Step 2**: Identifies upfront training fee (₹2500), unverified recruiter, unsolicited Google offer, and direct payment extortion.
   - **Step 3**: Animates live cryptographic PII redaction: masks personal name to `[PERSON]` and phone number to `[PHONE]`.
   - **Step 4**: Computes deterministic SHA-256 fingerprint from normalized structure without leaking raw personal data.
   - **Step 5**: Queries the local persistent database registry to match against crowdsourced threat signatures.
   - **Step 6**: Displays multi-factor Critical threat classification with evidence.
   - **Step 7**: Generates polite, assertive corporate verification inquiry requesting company email domain and CIN.
   - **Step 8**: Formats a formal cybercrime complaint draft for `cybercrime.gov.in` under Section 66D IT Act, 2000.
   - **Step 9 & 10**: Confirms immutable forensic logging in SQLite audit trail.

---

### Demonstration B: The Central AI Bias Mitigation Demonstration
1. Navigate to **Fairness Scorecard** (`/fairness-scorecard`).
2. Observe the baseline unconstrained model evaluation on 1,200 tech applicants:
   - **Male Selection Rate**: `51.4%`
   - **Female Selection Rate**: `20.2%`
   - **80% Rule Disparate Impact Ratio**: `0.393` (Severe violation, well below `0.80` threshold).
   - **Executive Fairness Health Index**: Flagged with **ADVERSE IMPACT DETECTED**.
3. Open the **Proxy Leakage Guard** (`/proxy-guard`):
   - Demonstrates that `college_tier` and `postal_code` exhibit high statistical association ($>0.40$) with protected cohorts, proving that simply omitting demographic columns fails to prevent discrimination.
4. Open the **Threshold Sandbox** (`/threshold-sandbox`):
   - Interactively adjust the group cutoff sliders for Female and Non-Binary candidates in real time and watch selection rates and false positive rates equalize dynamically.
5. Open the **Bias Remediation Lab** (`/remediation-lab`):
   - Select **Pre-processing (Sample Reweighting)** or **In-processing (Fairness-Constrained Exponentiated Gradient)**.
   - Click **"Execute Remediation Pipeline"**.
   - Compare before vs. after metrics: Demographic Parity Ratio jumps from `0.393` to `0.842` (Compliant with 80% Rule) with only a negligible 2.1% accuracy trade-off.
   - Inspect the **Pareto Trade-off Frontier** table.
6. Open **SHAP Credential Attribution** (`/explainability`):
   - Review exact mathematical credential weights (coding score, system design, certifications) driving individual rejection decisions.
7. Open **Live ATS API & Export** (`/live-api`):
   - Click **"Generate Compliance Report"** to export an official audit certification mapped to the EU AI Act and NIST AI Risk Management Framework.

---

## 7. Transparency, Limitations & Production Hardening

### Features Operating Locally with Real Computation:
- Quantitative fairness calculations (DPR, EOD, AOD, 80% Disparate Impact, Executive Health Index).
- Statistical proxy correlation analysis (Cramer's V and ANOVA F-statistic).
- Machine learning model training, evaluation, and SHAP TreeExplainer attributions.
- Algorithmic debiasing via sample reweighting and Fairlearn constrained optimization.
- NLP recruitment scam analysis and PII regex redaction.
- Cryptographic SHA-256 threat fingerprinting and keyed HMAC matching.
- SQLite persistent storage, granular consent ledger, and 1-click DPDP Right to Erasure.

### Features Using Labeled Demonstrations / Benchmarks:
- **Device & Media Twin**: Because ffmpeg binaries vary across host platforms, the module features a verified counterfactual acoustic and visual degradation benchmark measuring interview evaluator sensitivity.
- **Vendor-Monoculture Lockout**: Roadmapped innovation module utilizing clearly labeled synthetic cross-ATS telemetry to demonstrate multi-pipeline lockout protocols.

### Production Hardening Roadmap:
- Transition SQLite persistence layer to PostgreSQL with row-level encryption.
- Connect live webhooks to enterprise ATS platforms (Greenhouse, Workday, Lever).
- Deploy zero-knowledge proof verification for decentralized cross-company applicant auditing.
