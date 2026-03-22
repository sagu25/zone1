import { useState, useEffect } from 'react'

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

export default function Header({ wsConnected, mode, stats, timeboxRemaining, timeboxTotal, onReset, onAgentNormal, onAgentRogue, onAgentImpersonator }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])

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

      {/* Stats strip */}
      <div className="hdr-stats">
        <span className="stat-chip">CMDS <b>{stats?.total ?? 0}</b></span>
        <span className="stat-chip ok">ALLOW <b>{stats?.allowed ?? 0}</b></span>
        <span className="stat-chip bad">DENY <b>{stats?.denied ?? 0}</b></span>
        <span className="stat-chip warn">FREEZE <b>{stats?.freeze_events ?? 0}</b></span>
      </div>

      {/* Controls */}
      <div className="hdr-controls">
        <button className="hbtn hbtn-ai-green" onClick={onAgentNormal}       disabled={!wsConnected}>🤖 Agent: Fix Fault</button>
        <button className="hbtn hbtn-ai-red"   onClick={onAgentRogue}        disabled={!wsConnected}>🤖 Agent: Rogue Task</button>
        <button className="hbtn hbtn-ai-ghost" onClick={onAgentImpersonator} disabled={!wsConnected}>🕵 Agent: Impersonator</button>
        <div className="btn-divider" />
        <button className="hbtn hbtn-ghost"    onClick={onReset}             disabled={!wsConnected}>↺ Reset</button>
      </div>

      {/* Status + clock */}
      <div className="hdr-right">
        <span className={`ws-dot ${wsConnected ? 'on' : 'off'}`} />
        <span className="ws-label">{wsConnected ? 'LIVE' : 'OFFLINE'}</span>
        <span className="hdr-clock">{dateStr} &nbsp; {timeStr} UTC</span>
      </div>
    </header>
  )
}
