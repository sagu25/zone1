import { useState, useEffect, useRef } from 'react'

const MODE_META = {
  NORMAL:       { label:'NORMAL',        cls:'mode-normal',    icon:'◉' },
  FREEZE:       { label:'FREEZE',        cls:'mode-freeze',    icon:'❄' },
  DOWNGRADE:    { label:'DOWNGRADE',     cls:'mode-downgrade', icon:'▼' },
  TIMEBOX_ACTIVE:{ label:'TIME-BOX',     cls:'mode-timebox',   icon:'⏱' },
  SAFE:         { label:'SAFE',          cls:'mode-safe',      icon:'✓' },
}

function fmtTime(secs) {
  if (secs == null) return ''
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2,'0')}`
}

const SCENARIOS = [
  { label: '🤖 Fix Fault',  cls: 'hbtn-ai-green',  title: 'Legitimate fault repair agent',     key: 'normal' },
  { label: '🤖 Rogue',      cls: 'hbtn-ai-red',    title: 'Rogue agent attack',                key: 'rogue' },
  { label: '🕵 Clone',      cls: 'hbtn-ai-ghost',  title: 'Identity impersonation attack',     key: 'clone' },
  { label: '⚡ Escalate',   cls: 'hbtn-ai-orange', title: 'Privilege escalation attack',       key: 'escalation' },
  { label: '🔍 Slow&Low',   cls: 'hbtn-ai-yellow', title: 'Slow & low reconnaissance',         key: 'slowlow' },
  { label: '🎯 Coord',      cls: 'hbtn-ai-purple', title: 'Coordinated multi-agent attack',    key: 'coordinated' },
]

export default function Header({ wsConnected, mode, timeboxRemaining, timeboxTotal,
  darkMode, onToggleTheme, scenarioActive,
  onReset, onAgentNormal, onAgentRogue, onAgentImpersonator,
  onAgentCoordinated, onAgentEscalation, onAgentSlowLow }) {
  const [now, setNow] = useState(new Date())
  const [ddOpen, setDdOpen] = useState(false)
  const ddRef = useRef(null)

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])

  useEffect(() => {
    function handleClick(e) { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const HANDLERS = { normal: onAgentNormal, rogue: onAgentRogue, clone: onAgentImpersonator, escalation: onAgentEscalation, slowlow: onAgentSlowLow, coordinated: onAgentCoordinated }

  const meta    = MODE_META[mode] || MODE_META.NORMAL
  const pct     = timeboxTotal > 0 && timeboxRemaining != null ? (timeboxRemaining / timeboxTotal) * 100 : 0
  const timeStr = now.toLocaleTimeString('en-GB', { hour12:false })
  const dateStr = now.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })

  return (
    <header className="tare-header">
      {/* Brand */}
      <div className="hdr-brand">
        <div className="hdr-logo">TARE</div>
        <div className="hdr-sub">Trusted Access Response Engine · E&amp;U Security Platform</div>
      </div>

      {/* Mode badge */}
      <div className={`hdr-mode ${meta.cls}`}>
        <span className="mode-icon">{meta.icon}</span>
        <span className="mode-label">{meta.label}</span>
        {mode === 'TIMEBOX_ACTIVE' && timeboxRemaining != null && (
          <div className="timebox-pill">
            <div className="timebox-bar" style={{ width:`${pct}%` }} />
            <span className="timebox-text">{fmtTime(timeboxRemaining)}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="hdr-controls">
        {/* Scenarios dropdown */}
        <div className="scenario-dd" ref={ddRef}>
          <button
            className="hbtn hbtn-dd"
            disabled={!wsConnected || scenarioActive}
            title={scenarioActive ? 'Scenario running — click Reset to stop' : 'Choose a demo scenario'}
            onClick={() => !scenarioActive && setDdOpen(o => !o)}
          >
            {scenarioActive ? '⏳ Running…' : `▶ Demo Scenarios ${ddOpen ? '▲' : '▼'}`}
          </button>
          {ddOpen && (
            <div className="dd-menu">
              {SCENARIOS.map(s => (
                <button key={s.key} className={`dd-item hbtn ${s.cls}`} title={s.title}
                  disabled={!wsConnected}
                  onClick={() => { HANDLERS[s.key]?.(); setDdOpen(false) }}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="btn-divider" />
        <button className="hbtn hbtn-ghost" onClick={onReset} disabled={!wsConnected} title="Reset system">↺ Reset</button>
      </div>

      {/* Status + clock */}
      <div className="hdr-right">
        <button className="theme-toggle" onClick={onToggleTheme} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {darkMode ? '☀' : '☾'}
        </button>
        <span className={`ws-dot ${wsConnected ? 'on' : 'off'}`} />
        <span className="ws-label">{wsConnected ? 'LIVE' : 'OFFLINE'}</span>
        <span className="hdr-clock">{dateStr} &nbsp; {timeStr} UTC</span>
      </div>
    </header>
  )
}
