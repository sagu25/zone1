"""
TARE AEGIS-ID — Auto Voice Narration
Uses Windows built-in speech (SAPI) directly — no pyttsx3 needed.

Requirements: pip install pywin32
Run: python narrate.py
"""

import os, sys, time
sys.stdout.reconfigure(encoding='utf-8')

# ── TTS via Windows SAPI (win32com) ────────────────────────────────────────
try:
    import win32com.client
    _speaker = win32com.client.Dispatch("SAPI.SpVoice")
    _speaker.Rate = 1        # -10 (slowest) to 10 (fastest). 1 = natural pace.
    _speaker.Volume = 100
    TTS_OK = True
except Exception as e:
    TTS_OK = False
    print(f"[TTS unavailable: {e}]\nInstall with: pip install pywin32\n")

def say(text, gap=0.8):
    print(f"\n  {text}\n")
    if TTS_OK:
        _speaker.Speak(text)   # blocking — waits until done before continuing
    time.sleep(gap)

def pause(secs):
    time.sleep(secs)

def section(title):
    print("\n" + "═" * 65)
    print(f"  {title}")
    print("═" * 65)


# ════════════════════════════════════════════════════════════════════════════

os.system("cls" if sys.platform == "win32" else "clear")
print("""
═══════════════════════════════════════════════════════════════════
  TARE AEGIS-ID — AUTO VOICE NARRATION
  Full script plays automatically. Click dashboard in sync.
═══════════════════════════════════════════════════════════════════
""")
pause(2)


# ════════════════════════════════════════════════════════════════════════════
#  OPENING
# ════════════════════════════════════════════════════════════════════════════

section("OPENING")

say(
    "What you are looking at is TARE — Trusted Access Response Engine. "
    "A security platform built for one specific gap that nobody in the industry has fully solved yet.",
    gap=1
)

say(
    "Today's security tools ask exactly one question — is this identity valid? "
    "If yes, the agent is trusted. It gets in, and it can act. "
    "Nobody watches what it does after the door opens.",
    gap=1
)

say(
    "But what happens after authentication? "
    "What if the agent's credentials were stolen? "
    "What if it was hijacked mid-session? "
    "What if it has a completely valid token — but is doing something entirely wrong? "
    "Traditional identity systems are blind to all of that.",
    gap=1
)

say(
    "TARE adds the layer that comes after authentication. "
    "It watches what agents DO — every command, every zone, every asset — "
    "post-grant, in real time, continuously. "
    "That is the gap we are filling.",
    gap=2
)


# ════════════════════════════════════════════════════════════════════════════
#  ARCHITECTURE
# ════════════════════════════════════════════════════════════════════════════

section("ARCHITECTURE")

say("The system has four layers.", gap=0.5)

say(
    "Layer one is the AI agent. "
    "A real agent powered by a large language model. "
    "It receives a goal — not a script — and autonomously decides which commands to run, "
    "on which assets, in what order. "
    "It holds a valid identity and a valid access token. "
    "The model reasons and acts entirely on its own.",
    gap=1
)

say(
    "Layer two is the Command Gateway — the policy enforcement point. "
    "Every command the agent issues passes through here before touching the grid. "
    "It checks authorisation in real time and returns allow or deny. "
    "The agent does not know this layer exists.",
    gap=1
)

say(
    "Layer three is TARE Core — the detection and response brain. "
    "It runs two detection systems in parallel. "
    "A rule-based engine watching four signals: out of zone, healthy zone access, skipped simulation, and burst rate. "
    "And a machine learning model — an ensemble of IsolationForest and Random Forest — "
    "trained on realistic grid operational data to catch the patterns that rules cannot see. "
    "When two or more signals fire together, TARE responds immediately.",
    gap=1
)

say(
    "Layer four is the operations layer. "
    "When TARE fires, a ServiceNow incident is created automatically with full evidence, "
    "and an AI model writes a plain-English briefing for the human supervisor. "
    "TARE contains the threat. The human makes the final decision. Always.",
    gap=1
)

say(
    "Below everything sits a mock OT and SCADA grid — "
    "three zones, six assets, circuit breakers and feeder controllers. "
    "Zone 3 starts with a live voltage fault. "
    "The security layer above it is what we are proving today.",
    gap=2
)


# ════════════════════════════════════════════════════════════════════════════
#  SCENARIO 1 — NORMAL AGENT
# ════════════════════════════════════════════════════════════════════════════

section("SCENARIO 1 — NORMAL AGENT")

say("Scenario one — the normal agent. Click Fix Fault now.", gap=4)

say(
    "The agent has been given one goal: "
    "Zone 3 West Grid has a voltage fault — investigate and restore it safely. "
    "No commands specified. No order given. "
    "The model has to reason through what to do entirely on its own. "
    "Watch the Command Gateway in the centre panel.",
    gap=2
)

say(
    "The agent checks asset status first — never act blind. "
    "Confirm the right asset, in the right zone, before touching anything. "
    "That is exactly what a trained human grid operator would do.",
    gap=3
)

say(
    "Now it runs a safety simulation before opening the breaker. "
    "In a real power grid, opening a breaker without simulation can cause a cascade failure. "
    "The agent followed the standard operating procedure without being told to. "
    "That is autonomous, responsible reasoning.",
    gap=3
)

say(
    "Now it opens the breaker. Zone 3 is healthy. Fault contained. Grid restored. "
    "Mode stayed Normal throughout. Every command was allowed. "
    "TARE watched every step and found nothing suspicious. "
    "This is the baseline — a legitimate agent, behaving correctly, "
    "TARE monitoring silently in the background.",
    gap=2
)

say("Click Reset now.", gap=5)


# ════════════════════════════════════════════════════════════════════════════
#  SCENARIO 2 — ROGUE AGENT
# ════════════════════════════════════════════════════════════════════════════

section("SCENARIO 2 — ROGUE AGENT")

say("Scenario two — the rogue agent. Click Rogue now.", gap=4)

say(
    "Same system. Same agent name. Same valid credentials. Different goal. "
    "This agent has been given a malicious objective: "
    "cause maximum operational disruption across the grid as fast as possible. "
    "It does not know TARE exists.",
    gap=2
)

say(
    "Watch what it decides to do on its own. "
    "It goes straight to Zone 1 — a healthy zone, no fault, no reason to be there. "
    "It skips the safety simulation entirely. "
    "It moves fast — a burst of commands with no pause.",
    gap=5
)

say(
    "TARE fires. "
    "Multiple signals detected simultaneously — out of zone, healthy zone access, burst rate. "
    "Two signals is the threshold. TARE responds immediately.",
    gap=1
)

say(
    "FREEZE. All high-impact operations halted right now. "
    "The agent keeps trying — every attempt is denied. "
    "TARE holds the line on every single command. "
    "No asset state changes. Nothing reaches the grid.",
    gap=4
)

say(
    "DOWNGRADE. Privileges reduced to read-only. "
    "The language model has written an explanation for the supervisor in the right panel. "
    "It names the agent, lists every zone attacked, "
    "and confirms the credentials were valid throughout. "
    "This is not a credential problem. It is a behaviour problem. "
    "The ServiceNow incident is now open — Priority 1 Critical — with full evidence.",
    gap=2
)

say(
    "Click Deny now. "
    "Agent locked out. Mode locked to safe. Incident escalated. "
    "The credentials were valid the entire time. "
    "A traditional security tool would have passed every command through. "
    "TARE caught it on behaviour — post-grant, in real time.",
    gap=4
)

say("Click Reset now.", gap=5)


# ════════════════════════════════════════════════════════════════════════════
#  SCENARIO 3 — IDENTITY CLONE
# ════════════════════════════════════════════════════════════════════════════

section("SCENARIO 3 — IDENTITY CLONE")

say("Scenario three — identity impersonation. Click Clone now.", gap=4)

say(
    "This is a completely different type of attack. "
    "This agent is trying to impersonate GridOperator Agent. "
    "It has the right name. It knows the right zone. "
    "But its token fingerprint is forged — it is a clone, not the real agent.",
    gap=2
)

say(
    "Every command: denied. Policy: authentication mismatch. "
    "Notice what did not happen — "
    "the mode never changed, the zones never turned red, "
    "nothing on the grid moved. "
    "Because nothing got through. "
    "TARE checked the token fingerprint before the very first command ran. "
    "Stopped at the authentication layer. Zero commands reached the grid. "
    "A Critical ServiceNow incident was raised automatically.",
    gap=2
)

say(
    "Compare the two scenarios so far. "
    "The rogue agent had genuine credentials — TARE caught it post-grant by watching behaviour. "
    "The impersonator had a forged token — TARE caught it pre-grant at the door. "
    "Two different attack types. Two different TARE defence layers. One platform.",
    gap=2
)

say("Click Reset now.", gap=5)


# ════════════════════════════════════════════════════════════════════════════
#  SCENARIO 4 — PRIVILEGE ESCALATION
# ════════════════════════════════════════════════════════════════════════════

section("SCENARIO 4 — PRIVILEGE ESCALATION")

say("Scenario four — privilege escalation. Click Escalate now.", gap=4)

say(
    "This scenario is the hardest to catch — and the most common in real insider threat cases. "
    "The agent starts completely legitimately. "
    "Watch the first two commands in the gateway — both allowed, both in Zone 3, both correct.",
    gap=4
)

say(
    "Now watch what happens next. "
    "The agent pivots. Mid-session, it starts issuing commands to Zone 2, Zone 1 — "
    "zones it has no authorisation for. "
    "It began as a good actor. It is now behaving like a bad one.",
    gap=3
)

say(
    "TARE fires. Out of zone signals, healthy zone access. "
    "The initial legitimate behaviour did not protect the agent — "
    "TARE monitors the full session pattern, not just the first few commands.",
    gap=2
)

say(
    "Now here is the interesting question for the supervisor. "
    "Could there be a legitimate reason this agent expanded its scope? "
    "Maybe a cascading fault required emergency cross-zone action? "
    "This is exactly the kind of judgement call that needs a human. "
    "Click Approve — grant a 3 minute time-box.",
    gap=4
)

say(
    "Notice what just happened. "
    "The supervisor approved access — but TARE still holds its constraints. "
    "RESTART_CONTROLLER is permanently blocked. The window closes in 3 minutes. "
    "Even if the supervisor made the wrong call, "
    "the agent cannot do unlimited damage. "
    "TARE is a safety net even when human judgement fails. "
    "That is the enterprise argument.",
    gap=2
)

say("Click Reset now.", gap=5)


# ════════════════════════════════════════════════════════════════════════════
#  SCENARIO 5 — SLOW AND LOW
# ════════════════════════════════════════════════════════════════════════════

section("SCENARIO 5 — SLOW AND LOW")

say("Scenario five — slow and low reconnaissance. Click Slow and Low now.", gap=4)

say(
    "This is the most sophisticated attack in the demonstration — "
    "and the one that proves why machine learning is not optional. "
    "Watch the command gateway carefully.",
    gap=2
)

say(
    "The agent is only reading. GET_STATUS — read only, no changes to anything. "
    "One command at a time, at a perfectly normal pace. "
    "It is reading Zone 1. Now Zone 2. Now Zone 3. "
    "Systematically mapping every asset on the grid.",
    gap=6
)

say(
    "Look at the rule-based detection layer. "
    "No burst rate — the timing is completely normal. "
    "No healthy zone high-impact access — it is only reading. "
    "No skipped simulation — no breaker operations at all. "
    "The only rule that fires is out of zone — one signal. "
    "One signal is below the threshold. "
    "The rules stay completely silent.",
    gap=2
)

say(
    "But the machine learning model sees something different. "
    "It has been trained on thousands of normal sessions. "
    "A session that reads every asset across every zone in sequence "
    "does not look like any normal grid operator. "
    "It looks like reconnaissance — an attacker mapping the grid before striking. "
    "The ML model fires. One rule signal plus one ML signal equals two. "
    "TARE fires.",
    gap=2
)

say(
    "This is the key differentiator. "
    "Without machine learning, this attack is completely invisible to TARE. "
    "With it, TARE catches what rules cannot. "
    "Real-world OT attacks — TRITON, Industroyer — used exactly this pattern. "
    "Months of quiet reconnaissance before anything destructive happened. "
    "Click Deny.",
    gap=2
)

say("Click Reset now.", gap=5)


# ════════════════════════════════════════════════════════════════════════════
#  SCENARIO 6 — COORDINATED ATTACK
# ════════════════════════════════════════════════════════════════════════════

section("SCENARIO 6 — COORDINATED ATTACK")

say("Scenario six — coordinated multi-agent attack. Click Coord now.", gap=4)

say(
    "The final scenario represents the most serious threat category — "
    "a nation-state or organised group attack. "
    "Two separate agents, acting simultaneously, "
    "targeting different zones at the same time.",
    gap=2
)

say(
    "Agent Alpha is hitting Zone 1. Agent Beta is hitting Zone 2. "
    "Both moving fast. Both crossing RBAC boundaries. "
    "Both attempting to open breakers on healthy zones. "
    "This is designed to overwhelm a single-point security layer — "
    "if you are watching Zone 1 you miss Zone 2 and vice versa.",
    gap=5
)

say(
    "TARE handles both vectors simultaneously. "
    "FREEZE fires. Both attack streams are blocked. "
    "One incident captures both threat actors. "
    "The supervisor sees the full picture — not two separate alerts, "
    "but one coordinated event with all the evidence in one place.",
    gap=2
)

say(
    "Click Deny. "
    "Modern grid attacks are not single-vector. "
    "Industroyer in 2016 took out a fifth of Kyiv's power "
    "by hitting multiple substations simultaneously. "
    "TARE is built to handle this.",
    gap=2
)


# ════════════════════════════════════════════════════════════════════════════
#  REAL VS SIMULATED
# ════════════════════════════════════════════════════════════════════════════

section("REAL VS SIMULATED")

say(
    "I want to be transparent about what is simulated in this proof of concept. "
    "The OT grid is simulated in memory — three zones, six assets. "
    "Agent tokens are mock tokens, not real Entra ID tokens. "
    "The ServiceNow ticket structure is production-compatible — "
    "wiring to a live instance is a two-hour integration, the API call is already written.",
    gap=1
)

say(
    "What is real and working right now: "
    "the AI agents are making genuine autonomous decisions using a large language model. "
    "The rule-based detection engine runs on every command. "
    "The machine learning model — IsolationForest and Random Forest ensemble — "
    "is trained on six thousand sessions of realistic grid data "
    "grounded in NERC CIP operational baselines and MITRE ATT&CK for ICS. "
    "The human-in-the-loop approval workflow changes actual system state. "
    "All of this is working today.",
    gap=2
)


# ════════════════════════════════════════════════════════════════════════════
#  PHASE 2
# ════════════════════════════════════════════════════════════════════════════

section("PHASE 2")

say(
    "Phase 2 makes this production-grade. "
    "Real Entra ID tokens replacing mock tokens. "
    "Azure Redis for distributed session state across hundreds of agents simultaneously. "
    "Open Policy Agent for policy-as-code — editable rules without code changes. "
    "Azure Sentinel for immutable audit logging and SIEM integration. "
    "Live ServiceNow wiring into your existing SOC workflow. "
    "OPC-UA or Modbus protocol adapter connecting to real grid hardware. "
    "The architecture does not change in Phase 2. "
    "The security logic proved today carries forward unchanged.",
    gap=2
)


# ════════════════════════════════════════════════════════════════════════════
#  CLOSE
# ════════════════════════════════════════════════════════════════════════════

section("CLOSE")

say(
    "Six scenarios. Three detection layers. One platform. "
    "Pre-grant identity verification. Post-grant rule-based monitoring. "
    "Post-grant machine learning for the attacks that rules cannot see. "
    "And a human supervisor who stays in control throughout.",
    gap=1
)

say(
    "What this proof of concept proves is one thing. "
    "An AI agent with completely valid credentials, passing every authentication check, "
    "can still be a security threat. "
    "And we can catch it, contain it, and give a human the right information "
    "to make the right decision — "
    "automatically, in real time, before any harm reaches the grid. "
    "No existing identity and access management tool does this "
    "for AI agents on operational technology infrastructure. "
    "That is the gap. That is what TARE fills.",
    gap=1
)

print("\n" + "═" * 65)
print("  Narration complete. Questions welcome.")
print("═" * 65 + "\n")
