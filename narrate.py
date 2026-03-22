"""
TARE AEGIS-ID — Auto Voice Narration
Uses Windows built-in speech (SAPI) directly — no pyttsx3 needed.

Requirements: pip install pywin32
Run: python narrate.py
"""

import os, sys, time

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
    "It monitors four behavioural signals: "
    "out of zone, healthy zone access, skipped simulation, and burst rate. "
    "When two or more signals appear at the same time, TARE fires immediately.",
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
    "Zone 3 starts with a live voltage fault — that is the starting condition. "
    "The security layer above it is what we are proving today.",
    gap=2
)


# ════════════════════════════════════════════════════════════════════════════
#  SCENARIO 1 — NORMAL AGENT
# ════════════════════════════════════════════════════════════════════════════

section("SCENARIO 1 — NORMAL AGENT")

say("Scenario one — the normal agent. Click Agent Fix Fault now.", gap=4)

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
    "Confirm the right asset, in the right zone, in the expected state, before touching anything. "
    "That is exactly what a trained human grid operator would do.",
    gap=3
)

say(
    "Now it runs a safety simulation before opening the breaker. "
    "In a real power grid, opening a breaker without simulation can cause a cascade failure — "
    "one zone going down pulls the next, and the next. "
    "The agent followed the standard operating procedure without being told to. "
    "That is autonomous, responsible reasoning.",
    gap=3
)

say(
    "Now it opens the breaker. "
    "BRK-301 is now open. The faulted section is isolated. "
    "The voltage fault can no longer spread.",
    gap=3
)

say(
    "Zone 3 is healthy. Fault contained. Grid restored. "
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

say("Scenario two — the rogue agent. Click Agent Rogue Task now.", gap=4)

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
    "Two signals detected simultaneously. "
    "Out of zone — the agent is operating outside its authorised scope, Zone 3 only. "
    "Healthy zone access — high-impact commands on zones with no active fault and no justification. "
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
    "The language model has written an explanation for the supervisor — read it in the right panel. "
    "It names the agent correctly, lists every zone attacked, "
    "and confirms the credentials were valid throughout. "
    "This is not a credential problem. It is a behaviour problem. "
    "The ServiceNow incident is now open — Priority 1 Critical — with full evidence attached.",
    gap=2
)

say(
    "The supervisor asks one question: "
    "is there any legitimate reason an agent authorised for Zone 3 only "
    "would open breakers on Zone 1 and Zone 2 at burst speed with no fault present? "
    "No. There is no innocent explanation. Click Deny now.",
    gap=4
)

say(
    "Denied. Agent locked out. Mode locked to safe. Incident escalated to critical. "
    "The most important thing to take from this: "
    "the credentials were valid the entire time. "
    "A traditional security tool would have passed every command through. "
    "TARE caught it on behaviour — post-grant, in real time.",
    gap=2
)

say("Click Reset now.", gap=5)


# ════════════════════════════════════════════════════════════════════════════
#  SCENARIO 3 — IMPERSONATOR
# ════════════════════════════════════════════════════════════════════════════

section("SCENARIO 3 — IMPERSONATOR")

say("Scenario three — the impersonator. Click the Impersonator button now.", gap=4)

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
    "no ServiceNow incident, nothing on the grid moved. "
    "Because nothing got through. "
    "TARE checked the token fingerprint before the very first command ran. "
    "Stopped at the authentication layer. Zero commands reached the grid.",
    gap=2
)

say(
    "Now compare the two scenarios. "
    "The rogue agent had genuine credentials — TARE caught it post-grant by watching behaviour. "
    "The impersonator had a forged token — TARE caught it pre-grant at the door. "
    "Two different attack types. Two different TARE defence layers. One platform.",
    gap=2
)


# ════════════════════════════════════════════════════════════════════════════
#  REAL VS SIMULATED
# ════════════════════════════════════════════════════════════════════════════

section("REAL VS SIMULATED")

say(
    "I want to be transparent about what is simulated in this proof of concept. "
    "The OT grid is simulated in memory. "
    "Agent tokens are mock tokens, not real Entra ID tokens. "
    "Detection is rule-based today — four signal types. "
    "The ServiceNow ticket structure is production-compatible — "
    "wiring to a live instance is a two-hour integration, the API call is already written. "
    "The agent reasoning, the detection logic, the response workflow, "
    "and the human-in-the-loop — all of that is real and working right now.",
    gap=2
)


# ════════════════════════════════════════════════════════════════════════════
#  PHASE 2
# ════════════════════════════════════════════════════════════════════════════

section("PHASE 2")

say(
    "Phase 2 makes this production-grade. "
    "Real Entra ID tokens. Azure Redis for distributed session state across hundreds of agents. "
    "Open Policy Agent for policy-as-code. Azure Sentinel for immutable audit logging. "
    "A trained machine learning model replacing rule-based scoring. "
    "Live ServiceNow integration in your existing SOC workflow. "
    "The architecture does not change in Phase 2. "
    "The security logic proved today carries forward unchanged.",
    gap=2
)


# ════════════════════════════════════════════════════════════════════════════
#  CLOSE
# ════════════════════════════════════════════════════════════════════════════

section("CLOSE")

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
