# TARE AEGIS-ID — Setup & Run Guide
### Autonomous Entity Grid Identity System · POC Demo

---

## What This Is

A working security demonstration showing how AEGIS-ID detects and blocks
rogue AI agents in an Energy & Utilities grid environment.

The demo shows two real attack scenarios:
- **Attack 1** — Identity theft (stolen agent name + wrong fingerprint)
- **Attack 2** — Behavioral anomaly (valid credentials, wrong behavior pattern)

---

## Before You Start — Check These First

Open **Command Prompt** (press `Win + R`, type `cmd`, press Enter) and run:

```
python --version
```
✅ You need **Python 3.10 or higher**

```
node --version
```
✅ You need **Node.js 16 or higher**

If either is missing — see **Section A** at the bottom of this guide.

---

## Step 1 — Copy the Project

Copy the folder `aegis-poc` to your laptop.

Recommended location:
```
C:\Users\YourName\Desktop\aegis-poc\
```

---

## Step 2 — Set Up the Backend

Open **Command Prompt** and run these commands one by one:

```
cd C:\Users\YourName\Desktop\aegis-poc\backend
```

```
pip install -r requirements.txt
```

Wait for it to finish. You should see packages installing.

If it fails due to internet/firewall — connect to a personal hotspot and try again.

---

## Step 3 — Set Up the Frontend

Open a **second Command Prompt window** and run:

```
cd C:\Users\YourName\Desktop\aegis-poc\frontend
```

```
npm install
```

Wait for it to finish.

---

## Step 4 — Run the App

**In the first Command Prompt (backend):**
```
uvicorn main:app --port 8003
```

You should see:
```
INFO: Uvicorn running on http://127.0.0.1:8003
```
Leave this window open.

**In the second Command Prompt (frontend):**
```
npm run dev
```

You should see:
```
VITE ready in ...ms
➜ Local: http://localhost:5173/
```
Leave this window open too.

---

## Step 5 — Open the App

Open your browser (Chrome recommended) and go to:

```
http://localhost:5173
```

You should see the TARE AEGIS-ID dashboard.

Top right corner should show **● LIVE** in green.

---

## Step 6 — Run the Demo

You will see 4 buttons in the top header bar:

| Button | What it does |
|--------|-------------|
| **▶ Auto Demo** | Runs the full demo automatically — sit back and watch |
| **⚠ Launch Rogue** | Triggers identity theft attack only |
| **🧠 Launch Behavioral** | Triggers behavioral anomaly attack only |
| **↺ Reset** | Resets everything back to start |

### Recommended demo order:
1. Press **▶ Auto Demo** — watch the full sequence (~60 seconds)
2. Press **↺ Reset**
3. Press **⚠ Launch Rogue** to show identity theft alone
4. Press **↺ Reset**
5. Press **🧠 Launch Behavioral** to show behavioral anomaly alone

---

## Step 7 — Download the Logs

After the demo, click **⬇ Logs** button in the top right of the header.

This downloads a file called `aegis_audit_[date].log`

Open it with Notepad or Excel — it contains every event, timestamp,
agent name, action, and result from the demo.

You can also view logs in the browser at:
```
http://localhost:8003/logs
```

---

## What You Will See

### Left Panel — Active Agents
Three agent cards showing:
- Name, role, clearance level
- Green pulse = active and verified
- Orange pulse = behavioral anomaly detected
- Red pulse = rogue / impostor blocked

### Center — Grid Control Center
- Three substations (North, East, West) connected by power lines
- Animated lines = live power flow
- CB-7 = Circuit Breaker (green = safe, red = attack blocked)
- When attack happens: Substation North glows red, ATTACK TARGET label appears

### Right Panel — Threat Intelligence
- Threat count, risk score, active incidents
- ABAC Policy Matrix showing all policies

### Bottom — Activity Feed
- Every event logged in real time
- Cyan = normal operations
- Orange = warning / suspicious
- Red = threat blocked

### Alert Overlays
- **Red overlay** = Identity theft blocked (Attack 1)
- **Orange overlay** = Behavioral anomaly blocked (Attack 2)
  - Shows anomaly score breakdown
  - Shows baseline vs actual behavior
  - Shows customers protected

---

## Stopping the App

In each Command Prompt window, press:
```
Ctrl + C
```

---

## Troubleshooting

**● OFFLINE showing in top right**
→ Backend is not running. Go to backend Command Prompt and run uvicorn again.

**Browser shows blank page**
→ Frontend is not running. Go to frontend Command Prompt and run npm run dev again.

**Port already in use error**
→ Change 8003 to 8004 in the uvicorn command.
→ Also update this line in `frontend/src/App.jsx`:
```
const WS_URL = 'ws://localhost:8003/ws'
```
Change 8003 to 8004, save, and refresh browser.

**pip install fails**
→ Connect to personal hotspot (company firewall may block it).
→ Try: `pip install -r requirements.txt --trusted-host pypi.org`

**npm install fails**
→ Connect to personal hotspot.
→ Try: `npm install --legacy-peer-deps`

**Demo runs but nothing happens on screen**
→ Press Ctrl+R to refresh the browser first.
→ Make sure top right shows ● LIVE before clicking any button.

---

## Section A — Installing Python and Node.js

### Install Python
1. Go to `https://www.python.org/downloads/`
2. Download Python 3.11 or higher
3. Run installer
4. **Important** — tick the box that says **"Add Python to PATH"**
5. Click Install Now
6. Open new Command Prompt and run `python --version` to confirm

### Install Node.js
1. Go to `https://nodejs.org/`
2. Download the **LTS** version (recommended)
3. Run installer — click Next through all steps
4. Open new Command Prompt and run `node --version` to confirm

---

## Quick Reference Card

```
BACKEND
-------
cd aegis-poc\backend
pip install -r requirements.txt     (first time only)
uvicorn main:app --port 8003

FRONTEND
--------
cd aegis-poc\frontend
npm install                          (first time only)
npm run dev

BROWSER
-------
http://localhost:5173

LOGS
----
http://localhost:8003/logs           (view in browser)
Click ⬇ Logs button                  (download file)
```

---

*TARE AEGIS-ID POC — For internal demonstration purposes only*
