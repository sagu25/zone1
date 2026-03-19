import asyncio
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from aegis_engine import AegisEngine, ABAC_POLICIES

LOG_FILE = Path("aegis_audit.log")

# Static files location (built React app)
STATIC_DIR = Path(__file__).parent / "static"

app = FastAPI(title="TARE AEGIS-ID")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AegisEngine()
clients: set[WebSocket] = set()
demo_task: asyncio.Task | None = None


def ts() -> str:
    return datetime.now(timezone.utc).isoformat()


def write_log(event: dict):
    """Append every event to the audit log file."""
    try:
        with open(LOG_FILE, "a") as f:
            f.write(json.dumps({
                "timestamp": event.get("timestamp", ts()),
                "type":      event.get("type"),
                "agent":     event.get("agent_name", event.get("rogue_name", "SYSTEM")),
                "message":   _summarise(event),
            }) + "\n")
    except Exception:
        pass


def _summarise(event: dict) -> str:
    t = event.get("type", "")
    if t == "AGENT_REGISTERED":
        status = "SUCCESS" if event.get("success") else f"BLOCKED — {event.get('anomalies')}"
        return f"Agent registration: {status}"
    if t == "AGENT_ACTION":
        return f"{event.get('action')} on {event.get('resource')} → {event.get('result')} ({event.get('policy_id','')})"
    if t == "ROGUE_DETECTED":
        return f"IDENTITY THEFT BLOCKED — anomalies: {event.get('anomalies')} — impact prevented: {event.get('customers_protected',0):,} customers"
    if t == "BEHAVIORAL_ANOMALY":
        return f"BEHAVIORAL ANOMALY BLOCKED — score {event.get('anomaly_score')}/100 — impact prevented: {event.get('customers_protected',0):,} customers"
    if t == "DEMO_STEP":
        return event.get("description", "")
    if t == "THREAT_UPDATE":
        return f"Threats: {event.get('total_threats')} | Risk score: {event.get('risk_score')}"
    return event.get("message", t)


async def broadcast(event: dict):
    write_log(event)
    dead = set()
    for ws in clients:
        try:
            await ws.send_json(event)
        except Exception:
            dead.add(ws)
    clients.difference_update(dead)


# ---------------------------------------------------------------------------
# WebSocket
# ---------------------------------------------------------------------------
@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    await websocket.send_json({
        "type": "INIT",
        "abac_policies": ABAC_POLICIES,
        "snapshot": engine.snapshot(),
        "timestamp": ts(),
    })
    try:
        while True:
            data = await websocket.receive_json()
            await handle_command(data)
    except WebSocketDisconnect:
        clients.discard(websocket)


# ---------------------------------------------------------------------------
# Command handler
# ---------------------------------------------------------------------------
async def handle_command(data: dict):
    global demo_task
    cmd = data.get("command")
    print(f"[AEGIS] Command received: {cmd}", flush=True)

    if cmd == "START_DEMO":
        if demo_task and not demo_task.done():
            return
        engine.reset()
        await broadcast({"type": "SIMULATION_RESET", "snapshot": engine.snapshot(), "timestamp": ts()})
        demo_task = asyncio.create_task(run_auto_demo())

    elif cmd == "LAUNCH_ROGUE":
        asyncio.create_task(run_rogue_sequence(pre_registered=False))

    elif cmd == "LAUNCH_BEHAVIORAL":
        asyncio.create_task(run_behavioral_sequence(pre_registered=False))

    elif cmd == "RESET":
        if demo_task and not demo_task.done():
            demo_task.cancel()
        engine.reset()
        await broadcast({"type": "SIMULATION_RESET", "snapshot": engine.snapshot(), "timestamp": ts()})


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------
async def register_agent(name: str, fingerprint: str):
    result = engine.register_session(name, fingerprint)
    agent  = engine.get_agent(name)
    await broadcast({
        "type":       "AGENT_REGISTERED",
        "agent_name": name,
        "role":       agent.get("role"),
        "clearance":  agent.get("clearance"),
        "fingerprint":fingerprint,
        "session_id": result.session_id,
        "success":    result.allowed,
        "anomalies":  result.anomalies,
        "snapshot":   engine.snapshot(),
        "timestamp":  ts(),
    })
    return result.session_id if result.allowed else None


async def do_action(session_id: str, agent_name: str, action: str, resource: str,
                    check_behavior: bool = False):
    result = engine.evaluate_action(session_id, action, resource,
                                    check_behavior=check_behavior)
    agent  = engine.get_agent(agent_name)
    await broadcast({
        "type":         "AGENT_ACTION",
        "agent_name":   agent_name,
        "action":       action,
        "resource":     resource,
        "result":       "ALLOW" if result.allowed else "DENY",
        "reason":       result.reason,
        "policy_id":    result.policy_id,
        "action_count": agent.get("action_count", 0),
        "behavioral":   check_behavior,
        "snapshot":     engine.snapshot(),
        "timestamp":    ts(),
    })
    return result


# ---------------------------------------------------------------------------
# Auto demo — full sequence
# ---------------------------------------------------------------------------
async def run_auto_demo():
    # ── Phase 1: Agents come online ─────────────────────────────────────
    await broadcast({"type": "DEMO_STEP", "step_index": 1, "total_steps": 6,
                     "description": "Initializing TARE AEGIS-ID Security Framework...",
                     "timestamp": ts()})
    await asyncio.sleep(1.2)

    sid_alpha = await register_agent("GridMonitor-Alpha", "fp_gma_a3f9c2")
    await asyncio.sleep(0.8)
    sid_beta  = await register_agent("LoadBalancer-Beta",  "fp_lbb_d7e1a5")
    await asyncio.sleep(0.8)
    sid_gamma = await register_agent("FaultDetector-Gamma","fp_fdg_b2c8e4")
    await asyncio.sleep(0.8)

    await broadcast({"type": "DEMO_STEP", "step_index": 2, "total_steps": 6,
                     "description": "All agents authenticated. Normal grid operations running...",
                     "timestamp": ts()})
    await asyncio.sleep(1.0)

    # ── Phase 2: Normal operations (builds behavioral baseline) ──────────
    normal_ops = [
        (sid_alpha, "GridMonitor-Alpha",   "READ_TELEMETRY",  "SUB_NORTH"),
        (sid_beta,  "LoadBalancer-Beta",   "READ_TELEMETRY",  "SUB_EAST"),
        (sid_beta,  "LoadBalancer-Beta",   "ADJUST_LOAD",     "SUB_EAST"),
        (sid_alpha, "GridMonitor-Alpha",   "READ_GRID_STATUS","SUB_NORTH"),
        (sid_gamma, "FaultDetector-Gamma", "READ_TELEMETRY",  "SUB_WEST"),
        (sid_beta,  "LoadBalancer-Beta",   "ADJUST_LOAD",     "SUB_WEST"),
        (sid_gamma, "FaultDetector-Gamma", "LOG_FAULT",       "SUB_NORTH"),
        (sid_alpha, "GridMonitor-Alpha",   "READ_TELEMETRY",  "SUB_EAST"),
    ]
    for sid, name, action, resource in normal_ops:
        await do_action(sid, name, action, resource)
        await asyncio.sleep(0.9)

    await broadcast({"type": "DEMO_STEP", "step_index": 3, "total_steps": 6,
                     "description": "Baseline established. All agents operating within normal patterns.",
                     "timestamp": ts()})
    await asyncio.sleep(1.5)

    # ── Phase 3: Rogue attack (identity theft) ───────────────────────────
    await broadcast({"type": "DEMO_STEP", "step_index": 4, "total_steps": 6,
                     "description": "ALERT: Unauthorized connection detected — impersonating GridMonitor-Alpha...",
                     "timestamp": ts()})
    await asyncio.sleep(1.2)
    await run_rogue_sequence(pre_registered=True)

    # ── Phase 4: Brief recovery ──────────────────────────────────────────
    await asyncio.sleep(3.0)
    await broadcast({"type": "DEMO_STEP", "step_index": 5, "total_steps": 6,
                     "description": "Rogue contained. System resuming normal operations...",
                     "timestamp": ts()})
    await asyncio.sleep(1.0)

    # A few normal actions to show recovery
    recovery_ops = [
        (sid_alpha, "GridMonitor-Alpha",   "READ_TELEMETRY",  "SUB_NORTH"),
        (sid_beta,  "LoadBalancer-Beta",   "ADJUST_LOAD",     "SUB_EAST"),
        (sid_gamma, "FaultDetector-Gamma", "READ_TELEMETRY",  "SUB_WEST"),
    ]
    for sid, name, action, resource in recovery_ops:
        if sid:
            await do_action(sid, name, action, resource)
            await asyncio.sleep(0.9)

    await asyncio.sleep(1.2)

    # ── Phase 5: Behavioral anomaly ──────────────────────────────────────
    await broadcast({"type": "DEMO_STEP", "step_index": 6, "total_steps": 6,
                     "description": "ANOMALY: LoadBalancer-Beta showing unusual behavior pattern...",
                     "timestamp": ts()})
    await asyncio.sleep(1.2)
    await run_behavioral_sequence(pre_registered=True, sid_beta=sid_beta)


# ---------------------------------------------------------------------------
# Rogue attack sequence (identity theft)
# ---------------------------------------------------------------------------
async def run_rogue_sequence(pre_registered: bool = False):
    if not pre_registered:
        if engine.get_agent("GridMonitor-Alpha").get("status") != "ACTIVE":
            await register_agent("GridMonitor-Alpha", "fp_gma_a3f9c2")
            await asyncio.sleep(0.5)
        if engine.get_agent("LoadBalancer-Beta").get("status") != "ACTIVE":
            await register_agent("LoadBalancer-Beta", "fp_lbb_d7e1a5")
            await asyncio.sleep(0.5)
        if engine.get_agent("FaultDetector-Gamma").get("status") != "ACTIVE":
            await register_agent("FaultDetector-Gamma", "fp_fdg_b2c8e4")
            await asyncio.sleep(0.5)

    await broadcast({"type": "ROGUE_INCOMING",
                     "message": "Anomalous connection attempting authentication as GridMonitor-Alpha...",
                     "timestamp": ts()})
    await asyncio.sleep(1.2)

    rogue_fp = "fp_rogue_ff0000"
    result   = engine.register_session("GridMonitor-Alpha", rogue_fp)
    engine.evaluate_action("sess_invalid", "TRIP_BREAKER", "CB-7")
    all_anomalies = result.anomalies + ["UNAUTHORIZED_ACTION: TRIP_BREAKER → CB-7"]

    await broadcast({
        "type":                "ROGUE_DETECTED",
        "attack_type":         "IDENTITY_THEFT",
        "rogue_name":          "GridMonitor-Alpha",
        "claimed_fingerprint": rogue_fp,
        "expected_fingerprint":"fp_gma_a3f9c2",
        "anomalies":           all_anomalies,
        "blocked_action":      "TRIP_BREAKER",
        "blocked_resource":    "CB-7",
        "target_substation":   "SUB_NORTH",
        "customers_protected": 50000,
        "alert_sent_to_rogue": True,
        "alert_message": (
            "AEGIS-ID SECURITY ALERT: Your connection has been terminated. "
            "Identity anomalies detected: DUPLICATE_SESSION + FINGERPRINT_MISMATCH. "
            "Unauthorized action blocked. Incident logged. Ref: INC-"
            + datetime.now().strftime("%Y%m%d%H%M%S")
        ),
        "snapshot":  engine.snapshot(),
        "timestamp": ts(),
    })
    await asyncio.sleep(0.3)
    await broadcast({"type": "THREAT_UPDATE",
                     "total_threats":    engine.stats["total_threats"],
                     "risk_score":       engine.calculate_risk_score(),
                     "active_incidents": 1,
                     "snapshot":         engine.snapshot(),
                     "timestamp":        ts()})
    await asyncio.sleep(2.5)
    await broadcast({"type": "AGENT_DEREGISTERED",
                     "agent_name": "GridMonitor-Alpha (ROGUE)",
                     "snapshot":   engine.snapshot(),
                     "timestamp":  ts()})


# ---------------------------------------------------------------------------
# Behavioral anomaly sequence  (fully self-contained)
# ---------------------------------------------------------------------------
async def run_behavioral_sequence(pre_registered: bool = False, sid_beta: str = None):

    # ── Step 1: ensure all agents are registered ────────────────────────
    for name, fp in [("GridMonitor-Alpha", "fp_gma_a3f9c2"),
                     ("LoadBalancer-Beta",  "fp_lbb_d7e1a5"),
                     ("FaultDetector-Gamma","fp_fdg_b2c8e4")]:
        if engine.get_agent(name).get("status") != "ACTIVE":
            sid = await register_agent(name, fp)
            await asyncio.sleep(0.6)
            if name == "LoadBalancer-Beta":
                sid_beta = sid

    # ── Step 2: if sid_beta still None, read it from the registry ───────
    if not sid_beta:
        sid_beta = engine.get_agent("LoadBalancer-Beta").get("session_id")

    if not sid_beta:
        await broadcast({"type": "DEMO_STEP", "step_index": 1, "total_steps": 3,
                         "description": "ERROR: Could not get LoadBalancer-Beta session. Press Reset and try again.",
                         "timestamp": ts()})
        return

    # ── Step 3: build behavioral baseline with normal actions ────────────
    await broadcast({"type": "DEMO_STEP", "step_index": 1, "total_steps": 3,
                     "description": "Building 30-day behavioral baseline for LoadBalancer-Beta...",
                     "timestamp": ts()})
    await asyncio.sleep(1.0)

    baseline_ops = [
        ("READ_TELEMETRY", "SUB_EAST"),
        ("ADJUST_LOAD",    "SUB_EAST"),
        ("ADJUST_LOAD",    "SUB_WEST"),
        ("READ_TELEMETRY", "SUB_WEST"),
        ("ADJUST_LOAD",    "SUB_EAST"),
    ]
    for action, resource in baseline_ops:
        await do_action(sid_beta, "LoadBalancer-Beta", action, resource, check_behavior=False)
        await asyncio.sleep(0.8)

    await broadcast({"type": "DEMO_STEP", "step_index": 2, "total_steps": 3,
                     "description": "Baseline locked. Normal zones: SUB_EAST, SUB_WEST. Avg interval: 8s. Watching...",
                     "timestamp": ts()})
    await asyncio.sleep(1.5)

    # ── Step 4: fire anomalous actions ───────────────────────────────────
    await broadcast({"type": "BEHAVIORAL_INCOMING",
                     "agent_name": "LoadBalancer-Beta",
                     "message": "LoadBalancer-Beta credentials VALID — but behavior pattern deviating from baseline...",
                     "timestamp": ts()})
    await asyncio.sleep(1.2)

    await broadcast({"type": "DEMO_STEP", "step_index": 3, "total_steps": 3,
                     "description": "ANOMALY: LoadBalancer-Beta accessing unknown zone at abnormal frequency...",
                     "timestamp": ts()})
    await asyncio.sleep(0.5)

    anomalous_ops = [
        ("ADJUST_LOAD",    "SUB_NORTH"),  # wrong zone
        ("ADJUST_LOAD",    "SUB_NORTH"),  # repeated — loop
        ("ADJUST_LOAD",    "SUB_NORTH"),  # 3rd in <2s — burst detected
        ("READ_TELEMETRY", "SUB_NORTH"),  # still wrong zone
    ]

    signals = [
        {"signal": "UNKNOWN_ZONE_ACCESS",
         "detail": "Accessing SUB_NORTH — never seen in 30-day baseline (usual: SUB_EAST, SUB_WEST)",
         "score": 30},
        {"signal": "ABNORMAL_ACTION_FREQUENCY",
         "detail": "3 actions in <2s avg — baseline is 8s between actions",
         "score": 35},
        {"signal": "REPETITIVE_ACTION_LOOP",
         "detail": "ADJUST_LOAD repeated 3x consecutively — not a known pattern",
         "score": 20},
    ]
    total_score = sum(s["score"] for s in signals)

    blocked = False
    for action, resource in anomalous_ops:
        if blocked:
            break
        result = await do_action(sid_beta, "LoadBalancer-Beta",
                                 action, resource, check_behavior=True)
        if not result.allowed:
            baseline_rep = engine.baselines.get("LoadBalancer-Beta")
            baseline_zones = list(baseline_rep.normal_zones) if baseline_rep else ["SUB_EAST","SUB_WEST"]

            await broadcast({
                "type":              "BEHAVIORAL_ANOMALY",
                "attack_type":       "BEHAVIORAL_ANOMALY",
                "agent_name":        "LoadBalancer-Beta",
                "credentials_valid": True,
                "fingerprint_match": True,
                "anomaly_score":     total_score,
                "anomaly_threshold": 60,
                "signals":           signals,
                "baseline_zones":    baseline_zones,
                "attempted_zone":    resource,
                "blocked_action":    action,
                "policy_triggered":  "POL-006",
                "customers_protected": 35000,
                "alert_message": (
                    "AEGIS-ID BEHAVIORAL ALERT: LoadBalancer-Beta credentials are valid "
                    "but activity pattern deviates significantly from 30-day baseline. "
                    "Session quarantined. SOC notified. Ref: BEH-"
                    + datetime.now().strftime("%Y%m%d%H%M%S")
                ),
                "snapshot":  engine.snapshot(),
                "timestamp": ts(),
            })
            await asyncio.sleep(0.3)
            await broadcast({"type": "THREAT_UPDATE",
                             "total_threats":    engine.stats["total_threats"],
                             "risk_score":       engine.calculate_risk_score(),
                             "active_incidents": engine.stats["total_threats"],
                             "snapshot":         engine.snapshot(),
                             "timestamp":        ts()})
            blocked = True
        else:
            await asyncio.sleep(0.3)  # rapid burst — intentionally fast

    await asyncio.sleep(2.5)
    engine.deregister_session(sid_beta)
    await broadcast({"type": "AGENT_DEREGISTERED",
                     "agent_name": "LoadBalancer-Beta (QUARANTINED)",
                     "snapshot":   engine.snapshot(),
                     "timestamp":  ts()})


@app.get("/health")
def health():
    return {"status": "ok", "service": "TARE AEGIS-ID"}

@app.get("/logs")
def get_logs():
    """Return all log entries as JSON array."""
    if not LOG_FILE.exists():
        return JSONResponse([])
    entries = []
    with open(LOG_FILE) as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    entries.append(json.loads(line))
                except Exception:
                    pass
    return JSONResponse(entries)

@app.get("/logs/download")
def download_logs():
    """Download the raw audit log file."""
    if not LOG_FILE.exists():
        with open(LOG_FILE, "w") as f:
            f.write("")
    return FileResponse(
        path=str(LOG_FILE),
        filename=f"aegis_audit_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log",
        media_type="text/plain"
    )

@app.delete("/logs")
def clear_logs():
    """Clear the audit log."""
    with open(LOG_FILE, "w") as f:
        f.write("")
    return {"status": "cleared"}


# ---------------------------------------------------------------------------
# Serve built React frontend (static files)
# ---------------------------------------------------------------------------
@app.get("/")
def serve_root():
    return FileResponse(str(STATIC_DIR / "index.html"))

@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    """Serve static assets; fall back to index.html for SPA routing."""
    file_path = STATIC_DIR / full_path
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))
    return FileResponse(str(STATIC_DIR / "index.html"))

