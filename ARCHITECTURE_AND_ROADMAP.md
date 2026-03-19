# TARE AEGIS-ID — Architecture, POC Mapping & Future Roadmap
### Autonomous Entity Grid Identity System — Energy & Utilities Security Platform

---

## 1. What Problem Are We Solving?

Energy & Utilities environments are increasingly running AI agents that perform
critical operations — reading grid telemetry, adjusting load, detecting faults,
issuing maintenance commands. These agents operate 24/7 with minimal human
oversight.

The threat is not just external hackers. It is:

- A compromised agent with stolen credentials
- A legitimate agent that has been hijacked and is now behaving differently
- A rogue agent impersonating a trusted one
- A service account doing something it has never done before

Traditional IAM systems stop at the login gate. Once an identity is verified,
the agent is trusted. AEGIS-ID adds the layer that comes after — continuous
verification of behavior, not just identity.

---

## 2. The Three Architecture Diagrams — What They Show

---

### Diagram 1 — High Level Flow (aegisid.png)

```
Identity Signals
      │
      ▼
Log Ingestion (Log Connector → SIEM / Central Log Store)
      │
      ▼
Identity Behavior AI
  ├── Anomaly Detection (Time, Location, Access Pattern)
  └── Baseline Learning (Normal Login Behavior)
      │
      ▼
Risk Scoring for User Sessions
      │
      ▼
Response
  ├── Step-up MFA / Temporary Access Restriction
  ├── Security Alert to SOC
  └── SOC Analyst Review and Validation
```

**What this diagram says:**
Identity signals flow in, get analyzed for anomalies against a learned baseline,
get scored for risk, and trigger a graduated response. The human analyst is the
final layer — not the first.

---

### Diagram 2 — Detailed Component Architecture (ARCHIUPDATEAEGIS.png)

```
Signals & Sources          Ingestion Layer           POC Data Layer
─────────────────          ──────────────           ──────────────
IdP Logs (Entra/Okta) ─┐
PAM / Vault Events     ├──► Collector Forwarder ──► Event Stream ──► Raw Event Store
ZTNA / VPN Logs        │    (Syslog / CEF / API)    (Kafka/EventHub)  (Blob / S3)
EDR Alerts             ┘                                │
                                                        ▼
                                                  Feature Store
                                                  (Elastic/Redis)
                                                        │
                                                        ▼
                                                  Identity Graph
                                                  (Postgres/Neo4j)

AEGIS-ID Core POC
──────────────────
Risk Scoring Service ──► Guardrails Policy Engine ──► Playbook Orchestrator
(Rules + optional ML)    (Policy as Code)              (Logic Apps / Step Fn)
                                                        │
                              ┌─────────────────────────┼─────────────────┐
                              ▼                         ▼                 ▼
                    Audit Log (append only)    Enforcement & Actuators   Case Mgmt
                                               ├── Conditional Access    (ServiceNow
                                               ├── Session Revoke         / Jira)
                                               ├── PAM Session Recording
                                               └── ZTNA App Restriction
```

**What this diagram says:**
Multiple identity signal sources feed into an ingestion layer, get stored and
enriched in a data layer, then flow through the AEGIS-ID core — risk scoring,
policy evaluation, and orchestrated response. Enforcement is automated.
Humans review cases, not raw events.

---

### Diagram 3 — Sequence Flow (ARCHIAEGIS UPDA.png)

```
User/Attacker → IdP (Entra/Okta) → Event Stream → Risk Scoring → Policy Engine
                                                                        │
                                                              ┌─────────┴─────────┐
                                                              ▼                   ▼
                                                         Orchestrator      Case Management
                                                              │
                                                    Enforcement (CA/PAM/ZTNA)
                                                              │
                                                    ◄─────────┘
                                            Feedback loop back to IdP
                                            (publish outcome for tuning)
```

**What this diagram says:**
The full sequence from sign-in to enforcement. The attacker's sign-in event
triggers a chain — event published, scored, policy evaluated, orchestrator
fires enforcement actions, outcome fed back for model improvement. End to end
in real time.

---

## 3. What Our POC Builds — Component by Component

---

### 3.1 Identity Signals Layer

| Architecture Component | POC Implementation | Type |
|------------------------|-------------------|------|
| Entra ID / Okta sign-in logs | Simulated agent tokens with name, role, department | Simulated |
| VPN / Remote access logs | IP-based session per agent | Simulated |
| PAM / Vault events | Agent fingerprint (hash of identity attributes) | Simulated |
| EDR alerts | Out of scope for POC | Not built |

---

### 3.2 Ingestion Layer

| Architecture Component | POC Implementation | Type |
|------------------------|-------------------|------|
| Log Connector / Syslog / CEF | FastAPI WebSocket server receiving all agent events | Built |
| Event Stream (Kafka / Event Hub) | WebSocket broadcast to all connected clients | Built (simplified) |
| Collector Forwarder | Direct agent-to-gateway communication | Built |

---

### 3.3 POC Data Layer

| Architecture Component | POC Implementation | Type |
|------------------------|-------------------|------|
| Raw Event Store (Blob/S3) | aegis_audit.log — append only flat file | Built (simplified) |
| Feature Store (Elastic/Redis) | In-memory Python dict per agent session | Simulated |
| Identity Graph (Postgres/Neo4j) | AGENT_REGISTRY_TEMPLATE dict in aegis_engine.py | Simulated |

---

### 3.4 AEGIS-ID Core — Risk Scoring

| Architecture Component | POC Implementation | Type |
|------------------------|-------------------|------|
| Baseline learning of normal behavior | BehavioralBaseline class — records zones, timing, sequence | Built |
| Anomaly detection on time/location/pattern | score_anomaly() — 4 signal types, weighted scoring | Built |
| Risk scoring for sessions | calculate_risk_score() — 0 to 100 live score | Built |
| Optional ML layer | Rule-based scoring (ML is Phase 2) | Simulated |

---

### 3.5 AEGIS-ID Core — Policy Engine (ABAC)

| Architecture Component | POC Implementation | Type |
|------------------------|-------------------|------|
| Policy as Code | ABAC_POLICIES list — POL-001 to POL-006 | Built |
| Guardrails engine | evaluate_action() — checks every action against policies | Built |
| Attribute based evaluation | Role + clearance + scope + behavior score all evaluated | Built |
| Policy enforcement | ALLOW / DENY returned per action with policy ID | Built |

**Policies built:**

| Policy | Rule | Effect |
|--------|------|--------|
| POL-001 | GRID_MONITOR can READ telemetry | ALLOW |
| POL-002 | LOAD_BALANCER can ADJUST_LOAD | ALLOW |
| POL-003 | FAULT_DETECTOR can LOG_FAULT | ALLOW |
| POL-004 | TRIP_BREAKER requires LEVEL_5 + MFA | DENY always |
| POL-005 | Fingerprint mismatch or duplicate session | DENY + ALERT |
| POL-006 | Behavioral anomaly score > 60 | DENY + ALERT |

---

### 3.6 Orchestrated Response

| Architecture Component | POC Implementation | Type |
|------------------------|-------------------|------|
| Playbook orchestrator | Automated sequence: detect → block → alert → terminate | Built |
| Audit log append only | aegis_audit.log — every event written, downloadable | Built |
| Session revoke / sign out | deregister_session() — immediate termination | Built |
| Alert to SOC | Alert overlay + message sent back to rogue agent | Built |
| Case management (ServiceNow/Jira) | Acknowledge button — simulates case creation | Simulated |
| Conditional access (MFA step-up) | Full block in POC (graduated response in Phase 2) | Simulated |
| PAM session recording | Logged in activity feed | Simulated |
| ZTNA app restriction | Out of scope for POC | Not built |
| Feedback for model tuning | Not implemented | Phase 2 |

---

### 3.7 User Interface

| What it shows | Purpose |
|---------------|---------|
| Agent cards (left panel) | Live status of all registered agents — role, clearance, fingerprint, actions |
| Grid diagram (center) | SCADA-style visualization of substations and power flow |
| Threat Intelligence (right) | Risk score, threat count, ABAC policy matrix |
| Activity Feed (bottom) | Real-time immutable audit log of every event |
| Alert overlays | Full incident detail on detection — identity theft (red) and behavioral anomaly (orange) |
| Download Logs button | Exports audit log for compliance reference |

---

## 4. Two Attack Scenarios — Built and Demonstrated

---

### Attack 1 — Identity Theft

**What happens:**
A rogue agent presents the same name as a legitimate active agent
but with a different fingerprint.

**Detection layers fired:**
1. Duplicate session check — same name already active
2. Fingerprint mismatch — claimed FP does not match registered FP
3. ABAC violation — TRIP_BREAKER denied by POL-004

**Result:**
Blocked before any action reaches the grid.
50,000 customers protected.

**Maps to Diagram 3 sequence:**
Sign-in with unusual device → Event published → Risk scored →
Policy DENY → Enforcement → Incident logged → Alert to attacker

---

### Attack 2 — Behavioral Anomaly

**What happens:**
A legitimate agent with valid credentials and matching fingerprint
suddenly behaves outside its established baseline pattern.

**Detection signals scored:**

| Signal | Trigger | Score |
|--------|---------|-------|
| UNKNOWN_ZONE_ACCESS | Accessed SUB_NORTH — never in 30-day baseline | +30 |
| ABNORMAL_ACTION_FREQUENCY | 3 actions in < 2 seconds — baseline is 8 seconds | +35 |
| REPETITIVE_ACTION_LOOP | Same action 3x consecutively | +20 |
| UNUSUAL_TIME_OF_ACCESS | Action between 10PM and 5AM | +15 |

**Threshold:** Score > 60 = BLOCKED

**Result:**
Blocked purely on behavior. Identity checks all passed.
35,000 customers protected.

**This is the key differentiator** — credentials valid, fingerprint valid,
identity verified — but still blocked. No traditional IAM system does this.

---

## 5. What the POC Proves

| Hypothesis | Proved? |
|------------|---------|
| ABAC policies can enforce fine-grained agent permissions | ✅ Yes |
| Duplicate session + fingerprint mismatch can detect identity theft | ✅ Yes |
| Behavioral baseline can detect compromised agents with valid credentials | ✅ Yes |
| Graduated response (warn / restrict / block) is implementable | ✅ Framework built |
| Full audit trail can be generated and exported | ✅ Yes |
| Real-time detection and blocking is achievable | ✅ Yes — sub-second |
| The concept is demonstrable to non-technical stakeholders | ✅ Yes — live UI |

---

## 6. What is Simulated (Phase 2 Targets)

| What is simulated in POC | What replaces it in production |
|--------------------------|-------------------------------|
| Agent tokens (hardcoded) | Entra ID / Okta JWT tokens |
| In-memory session store | Azure Redis Cache |
| In-memory agent registry | Azure Postgres / Neo4j identity graph |
| Flat file audit log | Azure Sentinel / Microsoft Defender |
| Rule-based risk scoring | Trained ML model on real identity logs |
| Simple alert overlay | ServiceNow / Jira case creation via API |
| Hardcoded ABAC policies | OPA (Open Policy Agent) on Azure |
| Simulated baseline | 30-day real behavioral data from production logs |
| Manual demo simulation | Real agent events from live E&U systems |

---

## 7. Phase 2 — What We Build Next

### 7.1 Infrastructure

```
Agent → Entra ID (real JWT) → AEGIS-ID Gateway → Azure Redis (sessions)
                                     │
                              OPA Policy Engine
                                     │
                              Azure Sentinel (logs)
                                     │
                              ServiceNow (cases)
```

### 7.2 ML Behavioral Model

- Ingest 30 days of real identity logs from Entra ID and PAM systems
- Train a model on normal agent behavior patterns
- Replace rule-based scoring with model confidence scores
- Continuously retrain on new data — the feedback loop from Diagram 3

### 7.3 Graduated Response Levels

| Level | Trigger | Action |
|-------|---------|--------|
| 1 — Warn | Score 30-45 | Log warning, notify agent owner |
| 2 — Restrict | Score 46-60 | Reduce permissions temporarily |
| 3 — Quarantine | Score 61-80 | Suspend session, require re-auth |
| 4 — Block | Score 81-100 | Full block, SOC alert, playbook trigger |

### 7.4 Additional Signal Sources

| Signal | What it adds |
|--------|-------------|
| VPN / ZTNA logs | Detect unusual network location |
| EDR alerts | Correlate endpoint risk with identity risk |
| PAM vault events | Detect privilege escalation patterns |
| Calendar / HR data | Flag access during leave or off-hours |

### 7.5 Compliance Coverage

| Standard | How AEGIS-ID addresses it |
|----------|--------------------------|
| NERC CIP | Continuous monitoring of critical asset access |
| NIS2 | Real-time incident detection and audit trail |
| ISO 27001 | Access control policy enforcement and logging |
| GDPR | Immutable audit log with downloadable evidence |

---

## 8. Summary — POC vs Production vs Future

```
                    POC (Now)          Production (Phase 2)    Future (Phase 3)
                    ─────────          ────────────────────    ───────────────
Identity Source     Simulated tokens   Entra ID JWT            Multi-IdP federation
Session Store       In-memory dict     Azure Redis             Distributed cache
Policy Engine       Hardcoded rules    OPA on Azure            Self-updating policies
Behavioral Model    Rule-based score   ML trained model        Continuous learning
Signal Sources      Agent events only  Entra+PAM+VPN+EDR       Full SIEM integration
Response            Block + alert UI   Playbook automation     Autonomous remediation
Audit Trail         Flat file log      Azure Sentinel          Regulatory dashboard
Case Management     Acknowledge button ServiceNow / Jira       Auto-escalation
Coverage            AI agents only     AI + human + service    All identity types
```

---

## 9. One Line Summary for Leadership

> AEGIS-ID adds a continuous behavioral intelligence layer on top of existing
> identity infrastructure — catching compromised agents and identity theft in
> real time, before any harm reaches the grid, using the patterns of behavior
> as the final and most powerful line of defence.

---

*TARE AEGIS-ID — Architecture & Roadmap Document*
*Energy & Utilities Security Platform — Internal Use Only*
