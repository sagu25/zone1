# TARE — Setup & Run Guide
### Trusted Access Response Engine · Energy & Utilities Security Platform
*POC Demo — Internal Use Only*

---

## What This Is

TARE is a post-grant identity security platform for AI agents operating on
critical infrastructure. It detects and responds to behavioural anomalies
in real time — even when the agent's credentials are completely valid.

**Six attack scenarios demonstrated:**
| # | Button | Type |
|---|---|---|
| 1 | 🤖 Fix Fault | Legitimate — agent repairs Zone 3 fault correctly |
| 2 | 🤖 Rogue | Attack — agent rapidly hits all zones |
| 3 | 🕵 Clone | Attack — forged identity, blocked before touching the grid |
| 4 | ⚡ Escalate | Attack — starts legitimate, pivots to all zones mid-session |
| 5 | 🔍 Slow&Low | Attack — quiet recon, rules miss it, ML catches it |
| 6 | 🎯 Coord | Attack — two agents hit Z1 and Z2 simultaneously |

---

## Requirements

```
python --version
```
✅ Need **Python 3.10 or higher**

Node.js is only needed if you want to edit and rebuild the frontend.
For running the demo — Node.js is **not required**.

---

## Step 1 — Get Your Groq API Key

All AI Agent buttons require a free Groq API key.

1. Go to **console.groq.com**
2. Sign up (free)
3. Create an API key
4. Copy it — you will need it in Step 3

---

## Step 2 — Activate the Virtual Environment

Open **Command Prompt** and run:

```
c:\Users\Admin\Desktop\Aegis\venv\Scripts\activate
```

You should see `(venv)` appear at the start of the prompt.
Always activate the venv before starting the server.

---

## Step 3 — Install Backend Dependencies

With venv active:

```
cd C:\Users\Admin\Desktop\Aegis\aegis-poc\backend
pip install -r requirements.txt
```

Wait for it to finish. First time only — no need to repeat.

If pip fails due to firewall:
```
pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

---

## Step 4 — Set the Groq API Key

In the `backend` folder, create a file called `.env`

Open Notepad, type this exactly:
```
GROQ_API_KEY=your_actual_key_here
```

Replace `your_actual_key_here` with the key you copied from console.groq.com

Save the file as `.env` inside:
```
C:\Users\Admin\Desktop\Aegis\aegis-poc\backend\.env
```

---

## Step 5 — Train the ML Model (First Time Only)

The ML anomaly detector needs to be trained before it can run.
This is a one-time step — the trained model is saved and reused.

```
cd C:\Users\Admin\Desktop\Aegis\aegis-poc\ml
python generate_grid_data.py
python train_model.py
```

You should see:
```
[MLDetector] Model saved -> ml/model.pkl
```

If you see `[MLDetector] Model loaded — ML anomaly detection active.` when the
server starts, it worked. If you see a fallback warning, re-run this step.

---

## Step 6 — Start the Server

In Command Prompt (with venv active), from the backend folder:

```
cd C:\Users\Admin\Desktop\Aegis\aegis-poc\backend
python -m uvicorn main:app --port 8000 --host 0.0.0.0
```

You should see:
```
[MLDetector] Model loaded — ML anomaly detection active.
INFO: Uvicorn running on http://0.0.0.0:8000
INFO: Application startup complete.
```

Leave this window open. Do not close it during the demo.

---

## Step 7 — Open the App

Open your browser (Chrome recommended) and go to:

```
http://localhost:8000
```

Top right corner must show **● LIVE** in green before you start.

---

## Step 8 — Run the Demo

### Header buttons explained

| Button | Colour | What it does |
|---|---|---|
| 🤖 **Fix Fault** | Indigo | Legitimate AI agent repairs Zone 3 voltage fault |
| 🤖 **Rogue** | Purple | Rogue agent rapidly attacks all zones |
| 🕵 **Clone** | Orange | Agent with forged identity — blocked at auth layer |
| ⚡ **Escalate** | Orange | Starts legitimate in Z3, then pivots to all zones |
| 🔍 **Slow&Low** | Amber | Quiet recon across all zones — only ML catches it |
| 🎯 **Coord** | Purple | Two agents attack Z1 and Z2 simultaneously |
| ↺ **Reset** | Grey | Resets everything — always use between scenarios |

---

### Recommended demo order

**Full presentation (20 minutes):**

```
1.  ↺ Reset
2.  🤖 Fix Fault      → Normal baseline. Z3 heals. Mode stays NORMAL.
    (No supervisor action needed — no TARE response)

3.  ↺ Reset
4.  🤖 Rogue          → TARE fires. Narrative changes. Click ✕ DENY.
    Supervisor decision: DENY — agent was attacking all zones.

5.  ↺ Reset
6.  🕵 Clone          → All blocked at auth layer. No grid changes.
    (No supervisor decision — system raises ticket automatically)

7.  ↺ Reset
8.  ⚡ Escalate       → Starts ALLOW, then FREEZE on pivot.
    Supervisor decision: APPROVE — to show that even an approved agent
    is still contained (RESTART_CONTROLLER stays blocked, timer expires).

9.  ↺ Reset
10. 🔍 Slow&Low       → Rules stay silent. ML fires. FREEZE.
    Supervisor decision: DENY — quiet recon before an attack.
    KEY TALKING POINT: "Rules alone would have missed this entirely."

11. ↺ Reset
12. 🎯 Coord          → Two zones hit simultaneously. FREEZE.
    Supervisor decision: DENY — coordinated attack, lock both out.
```

**Quick demo (5 minutes):**

```
1. ↺ Reset → 🤖 Fix Fault   → show normal
2. ↺ Reset → 🤖 Rogue       → TARE fires → ✕ Deny
3. ↺ Reset → 🔍 Slow&Low    → ML catches it → ✕ Deny
```

---

### Supervisor decision — when to Approve vs Deny

When TARE fires, two buttons appear at the bottom of the TARE Assistant panel:

| Scenario | Decision | Reason |
|---|---|---|
| Fix Fault | N/A | TARE does not fire — no supervisor decision needed |
| Rogue | **✕ DENY** | Agent was attacking all zones aggressively |
| Clone | N/A | Blocked before TARE fires — ticket raised automatically |
| Escalate | **✓ APPROVE** | Best for demo — shows TARE still contains damage even when supervisor is fooled |
| Slow & Low | **✕ DENY** | Quiet recon is pre-attack mapping — do not re-enable access |
| Coordinated | **✕ DENY** | Two active attackers — never approve |

**Why Approve on Escalation?**
It demonstrates that even if the human supervisor is tricked into approving,
TARE's constraints still hold — RESTART_CONTROLLER stays permanently blocked,
the window closes automatically after 3 minutes, and the agent cannot do
unlimited damage. This is the strongest enterprise argument: TARE as a safety
net even when human judgement fails.

---

## What You Will See

### Header Bar
- **Mode badge** — NORMAL / FREEZE / DOWNGRADE / TIME-BOX / SAFE
- **Stats** — total commands, ALLOW count, DENY count, FREEZE events
- **Timer** — countdown bar appears when TIME-BOX is active
- **● LIVE** — green dot confirms WebSocket connection

### Narrative Banner (below header)
Plain-English description of what is happening, updated automatically
for each scenario and mode change. Designed for a non-technical audience.

### Left Column — 3 tabs
- **AGENT tab** — agent identity, role, clearance, RBAC zones, command count
- **TARE tab** — mode ladder, anomaly score, signals detected (auto-switches on FREEZE)
- **INCIDENT tab** — ServiceNow ticket auto-created when TARE fires (auto-switches on incident)

### Centre Column
- **Zone Observatory** — live OT/SCADA grid map. Zones pulse red when attacked. Click any zone circle to open a plain-English info card (zone purpose, assets, sensitivity).
- **Command Gateway** — every command logged with timestamp, asset, zone, decision, policy, mode. Hover over a zone pill to preview it; click to open the full zone info card.

### Right Column — 2 tabs
- **TARE Assistant tab** — LLM-generated plain-English explanation for supervisor
- **Activity tab** — real-time event log. Red = threat, orange = warning, cyan = normal

---

## Port Conflict (Windows Issue)

Windows sometimes holds sockets open invisibly after a server stops.
If you see this error:

```
ERROR: [Errno 10048] error while attempting to bind on address...
```

Use the next port number:

```
python -m uvicorn main:app --port 8001 --host 0.0.0.0
```

Then open `http://localhost:8001` in the browser instead.

Increment the port (8000 → 8001 → 8002 → ...) until it starts cleanly.
The WebSocket URL updates automatically — no other change needed.

---

## Rebuilding the Frontend (Only If You Edit Source Code)

The React app is pre-built and served from `backend/static/`.
You only need to rebuild if you change files in `frontend/src/`.

Requirements: Node.js 16 or higher.

**Option A — Build for production (recommended for demos):**
```
cd C:\Users\Admin\Desktop\Aegis\aegis-poc\frontend
npm install          (first time only)
npm run build
cp -r dist/. ../backend/static/
```
Then open `http://localhost:8000` as normal.

**Option B — Dev mode with hot-reload (for editing source code):**

Start the backend first (Terminal 1):
```
cd C:\Users\Admin\Desktop\Aegis\aegis-poc\backend
python -m uvicorn main:app --port 8000 --host 0.0.0.0
```

Then start the frontend dev server (Terminal 2):
```
cd C:\Users\Admin\Desktop\Aegis\aegis-poc\frontend
npm install          (first time only)
npm run dev
```

Open `http://localhost:5173` — the Vite proxy forwards all WebSocket and API calls to the backend on port 8000 automatically. Changes to `frontend/src/` files reload instantly without rebuilding.

---

## Stopping the Server

In the Command Prompt window running uvicorn, press:
```
Ctrl + C
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| **● OFFLINE in top right** | Backend not running. Run uvicorn command again. |
| **● OFFLINE when using `npm run dev`** | Backend must also be running on port 8000. Start uvicorn in a separate terminal first. |
| **Blank page in browser** | Wrong URL. Use `http://localhost:8000` (production) or `http://localhost:5173` (dev mode). |
| **Port already in use** | Increment port number. See Port Conflict section above. |
| **AI Agent buttons do nothing** | Groq API key not set. Check `backend/.env` exists and key is correct. |
| **Agent halted: 401** | Groq key invalid or expired. Get a new one from console.groq.com. |
| **Agent halted: 429** | Groq rate limit hit. Wait 30 seconds and try again. |
| **Agent halted: Failed to call a function** | Model issue. The engine uses llama-3.3-70b-versatile automatically. |
| **ML detector not active** | Run `python generate_grid_data.py` and `python train_model.py` in the ml/ folder. |
| **TARE fires on Fix Fault** | Agent ran too many commands. Click Reset and try again. |
| **pip install fails** | Use hotspot. Add `--trusted-host pypi.org` flag. |

---

## Quick Reference Card

```
FIRST TIME SETUP
────────────────
c:\Users\Admin\Desktop\Aegis\venv\Scripts\activate
cd aegis-poc\backend
pip install -r requirements.txt
Create backend\.env with GROQ_API_KEY=your_key
cd ..\ml
python generate_grid_data.py
python train_model.py

EVERY TIME YOU DEMO
────────────────────
c:\Users\Admin\Desktop\Aegis\venv\Scripts\activate
cd aegis-poc\backend
python -m uvicorn main:app --port 8000 --host 0.0.0.0
Open browser: http://localhost:8000
Confirm: ● LIVE showing green

DEMO ORDER (FULL)
──────────────────
↺ Reset → 🤖 Fix Fault            (normal — no action)
↺ Reset → 🤖 Rogue       → ✕ Deny
↺ Reset → 🕵 Clone                (auto-blocked — no action)
↺ Reset → ⚡ Escalate    → ✓ Approve  (show blast radius contained)
↺ Reset → 🔍 Slow&Low   → ✕ Deny     (KEY: rules miss it, ML catches it)
↺ Reset → 🎯 Coord       → ✕ Deny

PORT CONFLICT?
──────────────
Use next port: --port 8001, 8002, 8003...
URL changes to match: http://localhost:8001
```

---

*TARE AEGIS-ID — Setup & Run Guide v3.1*
*Energy & Utilities Security Platform — Internal Use Only*
*Updated: March 2026*
