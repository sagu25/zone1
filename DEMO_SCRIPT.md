# TARE AEGIS-ID — Demo Presentation Script
### For Internal Presentation Use Only

---

## Before You Present

**Setup checklist:**
- [ ] Backend running — Command Prompt shows `Uvicorn running on http://127.0.0.1:8003`
- [ ] Frontend running — Browser open at `http://localhost:5173`
- [ ] Top right shows **● LIVE** in green
- [ ] Press **↺ Reset** once before starting to clear any previous demo data
- [ ] Browser in full screen — press **F11**

---

## OPENING

**[Stand near the screen. Point at the dashboard.]**

> "What you're looking at is AEGIS-ID — our AI agent security
> platform built specifically for Energy & Utilities environments.
>
> Think of it as a security guard that sits between your AI agents
> and your critical grid infrastructure. It watches every agent,
> every action, every second — and the moment something feels wrong,
> it blocks it before any harm is done.
>
> Let me walk you through it."

---

## SECTION 1 — THE DASHBOARD

**[Point at LEFT panel — agent cards]**

> "On the left, we have our three AI agents — already working in
> the system.
>
> GridMonitor-Alpha — its job is to read telemetry from substations.
> Just reads. Nothing else.
>
> LoadBalancer-Beta — adjusts load distribution across the grid.
>
> FaultDetector-Gamma — detects and logs faults across the network.
>
> Each agent has an identity card. Name, role, clearance level,
> and a fingerprint — see this code here, fp_gma_a3f9c2 — that is
> GridMonitor-Alpha's unique identity signature. Nobody else has
> that exact fingerprint."

---

**[Point at CENTER — grid diagram]**

> "In the center, this is our TARE national grid. Three substations
> — North, East, and West — connected by live transmission lines.
> The animated lines show power flowing in real time.
>
> And this button here — CB-7 — is a circuit breaker at Substation
> North. If someone trips it, Substation North goes offline.
> 50,000 homes lose power instantly."

---

**[Point at RIGHT panel — ABAC policy matrix]**

> "On the right is our policy engine — this is Attribute Based
> Access Control, or ABAC.
>
> Every agent has rules it must follow. Look at POL-004 —
> TRIP_BREAKER is DENY for every single agent in this system.
> No exceptions. No matter who asks, no matter what credentials
> they have — no agent can trip a breaker without LEVEL-5
> clearance and multi-factor authentication.
>
> The policy is the law."

---

## SECTION 2 — NORMAL OPERATIONS

**[Press ▶ AUTO DEMO button]**

**[Wait for agents to come online — green pulses appear]**

> "Watch the left panel. Agents coming online one by one.
>
> Green pulse — they're verified. Fingerprint matched. Role
> confirmed. AEGIS-ID checked their identity and said — yes,
> you are who you say you are. Come in."

---

**[Watch the activity feed at the bottom scrolling]**

> "Now they're working. GridMonitor-Alpha reading telemetry.
> LoadBalancer-Beta adjusting load. FaultDetector-Gamma logging
> a fault.
>
> Everything normal. Everything allowed. And look at the bottom
> — the activity feed — every single action is logged. Who did
> what, to which substation, allowed or denied, and which policy
> governs it.
>
> This is your complete audit trail. Downloadable. Referenceable.
> Ready for compliance review at any time."

---

**[Watch the header message change to "Baseline established"]**

> "This is important. AEGIS-ID is not just watching.
> It is learning.
>
> Right now it is building a behavioral profile for each agent.
> What zones they normally access. How fast they normally work.
> What actions they always do. What they have never done.
>
> This is the 30-day behavioral baseline being established.
> This is what makes the second attack so powerful — and we will
> get to that in a moment."

---

## SECTION 3 — ATTACK 1 — IDENTITY THEFT

**[Header changes to WARNING — point at it immediately]**

> "Something just happened. A bad actor has obtained
> GridMonitor-Alpha's name and is attempting to connect
> to our system."

---

**[Point at Substation North turning red]**

> "AEGIS-ID runs its checks instantly.
>
> Check one — is GridMonitor-Alpha already logged in?
> Yes. It is active right now. So why is a second connection
> trying to log in as the same agent at the same time?
> That is a duplicate session. Immediately suspicious.
>
> Check two — does the fingerprint match?
> The real GridMonitor-Alpha has fp_gma_a3f9c2.
> This intruder is presenting fp_rogue_ff0000.
> They do not match. This is an impostor."

---

**[Point at CB-7 turning red — TRIP BLOCKED appearing]**

> "The rogue agent tried to trip CB-7. Tried to take down
> Substation North and cut power to 50,000 customers.
>
> AEGIS-ID blocked it before the command even reached the grid.
>
> CB-7 stays closed. The grid stays up. 50,000 customers —
> they do not even know this happened."

---

**[Red alert overlay appears — point at it]**

> "And then AEGIS-ID does something critical — it does not
> just block silently.
>
> It raises a full incident report. Who the rogue was. What
> fingerprint they presented. What action they attempted.
> Which policy stopped them.
>
> And it sends an alert directly back to the rogue agent
> connection. It says — we know what you tried. Your session
> is terminated. This incident is logged. You have been caught."

---

**[Point at risk score jumping — top right]**

> "Risk score jumps to 70. One threat detected. One active
> incident. The system is aware and on alert."

---

**[Click Acknowledge & Continue]**

---

## SECTION 4 — RECOVERY

**[Watch normal operations resume in the feed]**

> "The system recovers immediately. The legitimate agents
> continue their work. The grid never went down.
>
> This is the important point — the attack was contained with
> zero operational impact."

---

## SECTION 5 — ATTACK 2 — BEHAVIORAL ANOMALY

**[Header changes again — point at it]**

> "Now. This is the attack that most security systems miss.
> The sophisticated one. The one that keeps security teams
> up at night.
>
> Watch carefully."

---

**[Point at LoadBalancer-Beta card turning orange]**

> "LoadBalancer-Beta just connected. Valid credentials.
> Fingerprint matches perfectly.
>
> Identity check — passed.
> Fingerprint check — passed.
> ABAC check — passed.
>
> In a traditional security system, this agent is in.
> No questions asked. Full access.
>
> But AEGIS-ID is watching something else entirely.
> The behavior."

---

**[Watch rapid actions in the activity feed]**

> "Look at the activity feed. LoadBalancer-Beta is suddenly
> doing things it has never done before.
>
> It is accessing Substation North. In its entire history,
> its entire 30-day baseline, it has only ever touched
> Substation East and West. North is completely outside
> its normal zone.
>
> It is firing three actions in under two seconds. Its normal
> pace is one action every eight seconds. This is fifteen
> times faster than normal.
>
> And it is repeating the same action in a loop — ADJUST_LOAD,
> ADJUST_LOAD, ADJUST_LOAD — a pattern it has never shown once
> in its baseline period.
>
> Something is very wrong with this agent."

---

**[Orange alert overlay appears — point at it]**

> "AEGIS-ID scores each anomaly signal.
>
> Accessing an unknown zone — 30 points.
> Abnormal action frequency — 35 points.
> Repetitive action loop — 20 points.
>
> Total score — 85 out of 100.
> Threshold is 60.
> Blocked.
>
> And look at this alert — it is different from the first one.
> It clearly states — credentials are valid, fingerprint is a
> match — but the behavioral pattern is wrong. This agent has
> been compromised or hijacked.
>
> Session quarantined. SOC notified. Playbook triggered.
> 35,000 customers protected."

---

**[Click Acknowledge & Continue]**

---

## CLOSING — LAND THE MESSAGE

**[Step away from the screen. Face the room.]**

> "So let me summarize what just happened.
>
> Attack one — the attacker had the right name. In most systems,
> that combined with a valid token might be enough to get in.
> AEGIS-ID caught it through duplicate session detection and
> fingerprint mismatch. Three seconds. Blocked.
>
> Attack two — the attacker had valid credentials. Valid
> fingerprint. Passed every single identity check. In most
> systems, they are inside and causing damage before anyone
> knows. AEGIS-ID caught it purely because the behavior did
> not match the 30-day baseline. Blocked before a single
> unauthorized action completed.
>
> Three detection layers. Two sophisticated attacks.
> Zero impact on the grid. Zero customers affected."

---

> "In production, these simulated tokens become real Azure
> Active Directory tokens. The activity feed connects to
> Azure Sentinel. The policy engine runs on Open Policy Agent.
> The behavioral baseline feeds into a trained ML model on
> real identity logs.
>
> But the logic you saw today — that detection, that block,
> that alert, that audit trail — that is real. That is running
> right now. What we are asking for in Phase 2 is to
> productionise exactly this."

---

## HANDLING QUESTIONS

---

**Q: "Is this actually AI or just rules?"**

> "Great question. The detection logic in the POC is
> rule-based scoring — deliberate, because it makes the
> behavior transparent and explainable to regulators and
> auditors. In Phase 2 we layer a trained behavioral model
> on top of this foundation. But even rule-based anomaly
> scoring caught both attacks today — which tells you the
> framework is sound."

---

**Q: "What if the attacker goes slowly over weeks?"**

> "That is exactly why the baseline window is 30 days and
> not 30 minutes. Slow drift from baseline still shows up —
> the score builds gradually. We can also set thresholds
> to trigger a soft alert at 40, a restriction at 60, and
> a full block at 80. Graduated response, not binary."

---

**Q: "How does this connect to our existing Entra ID?"**

> "The simulated tokens in the POC become real Entra ID
> JWT tokens in production. AEGIS-ID sits as a gateway
> layer — it receives the token, validates it with Entra,
> then adds the behavioral and ABAC layer on top. We are
> not replacing your identity provider. We are extending it."

---

**Q: "What about the audit logs?"**

> "Every event — authentication, action, block, alert —
> is written to an immutable audit log. You can download
> it right now from the dashboard. In production this feeds
> directly into Azure Sentinel and your SIEM. Full chain
> of evidence for NERC CIP and NIS2 compliance."

---

**Q: "Is this production ready?"**

> "This is a proof of concept demonstrating that the core
> detection logic works. Phase 2 is containerising this
> on Azure, connecting real data sources, and training the
> behavioral model on your actual identity logs. The hard
> part — proving the concept — is done."

---

**Q: "What happens to the agent after it is blocked?"**

> "In this POC — session terminated and alert sent. In
> production the response is graduated. Level one — warn
> and log. Level two — restrict permissions temporarily.
> Level three — quarantine and require re-authentication.
> Level four — full block, SOC alert, and playbook trigger.
> The response matches the severity."

---

## DEMO BUTTON REFERENCE

| Button | When to use |
|--------|-------------|
| **▶ Auto Demo** | Start of presentation — full automatic sequence |
| **⚠ Launch Rogue** | If you want to show identity theft attack only |
| **🧠 Launch Behavioral** | If you want to show behavioral anomaly only |
| **↺ Reset** | Between demos to start fresh |
| **⬇ Logs** | At the end — download audit log to show the audience |

---

## TIMING GUIDE

| Section | Approx Time |
|---------|------------|
| Opening + dashboard walkthrough | 2 minutes |
| Normal operations (auto running) | 1.5 minutes |
| Attack 1 — Identity theft | 2 minutes |
| Recovery | 30 seconds |
| Attack 2 — Behavioral anomaly | 2 minutes |
| Closing statement | 1.5 minutes |
| Q&A | 5 minutes |
| **Total** | **~15 minutes** |

---

*TARE AEGIS-ID POC Demo Script — For internal use only*
*Prepared for Energy & Utilities Security Platform demonstration*
