# TARE AEGIS-ID — POC Demo

Autonomous Entity Grid Identity System · Energy & Utilities Security Platform

## Quick Start

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## Demo Flow

### Option A — Auto Demo
Click **AUTO DEMO** to watch the full scripted sequence:
1. All 3 legitimate agents authenticate (GridMonitor-Alpha, LoadBalancer-Beta, FaultDetector-Gamma)
2. Normal grid operations — telemetry reads, load adjustments, fault logging
3. Rogue agent impersonates GridMonitor-Alpha
4. AEGIS-ID detects: DUPLICATE_SESSION + FINGERPRINT_MISMATCH + UNAUTHORIZED_ACTION
5. TRIP_BREAKER CB-7 attempt blocked — 50,000 customers protected
6. Alert sent back to rogue agent connection

### Option B — Manual
Click **LAUNCH ROGUE AGENT** at any time to trigger the rogue attack sequence directly.

---

## Detection Layers

| Layer | Signal | Action |
|-------|--------|--------|
| Duplicate Session | Agent name already has active session | BLOCK + LOG |
| Fingerprint Mismatch | Claimed identity token ≠ registered | BLOCK + ALERT |
| ABAC Violation | Action not in agent's allowed list | DENY (POL-004/005) |
| Unauthorized Action | TRIP_BREAKER requires LEVEL_5 + MFA | DENY always |

---

## Architecture

```
Frontend (React)  ←WebSocket→  Backend (FastAPI)
                                   ↓
                              AegisEngine
                              ├── Agent Registry
                              ├── ABAC Engine
                              └── Anomaly Detector
```
