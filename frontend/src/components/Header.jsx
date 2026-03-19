import { useState, useEffect } from 'react'

export default function Header({ wsConnected, threatCount, stepText, demoRunning,
  onStartDemo, onLaunchRogue, onLaunchBehavioral, onReset }) {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  const timeStr = time.toLocaleTimeString('en-GB', { hour12: false })
  const dateStr = time.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })

  return (
    <header className="header">
      <div className="header-brand">
        <div>
          <div className="header-logo">TARE <span>|</span> AEGIS-ID</div>
          <div className="header-subtitle">Autonomous Entity Grid Identity System · E&amp;U Security Platform</div>
        </div>
      </div>

      <div className="header-center">{stepText || 'SYSTEM OPERATIONAL — AWAITING DEMO'}</div>

      <div className="header-controls">
        <button className="hbtn hbtn-demo" onClick={onStartDemo} disabled={!wsConnected || demoRunning}>
          {demoRunning ? <><span className="spinner" /> Running...</> : '▶ Auto Demo'}
        </button>
        <button className="hbtn hbtn-rogue" onClick={onLaunchRogue} disabled={!wsConnected}>
          ⚠ Launch Rogue
        </button>
        <button className="hbtn hbtn-behavioral" onClick={onLaunchBehavioral} disabled={!wsConnected}>
          🧠 Launch Behavioral
        </button>
        <button className="hbtn hbtn-reset" onClick={onReset} disabled={!wsConnected}>
          ↺ Reset
        </button>
      </div>

      <div className="header-right">
        <div className="ws-indicator">
          <span className={`ws-dot ${wsConnected ? 'connected' : 'disconnected'}`} />
          {wsConnected ? 'LIVE' : 'OFFLINE'}
        </div>
        <div className={`threat-badge ${threatCount > 0 ? 'active' : ''}`}>
          ⚑ {threatCount} THREAT{threatCount !== 1 ? 'S' : ''}
        </div>
        <a
          href="http://localhost:8003/logs/download"
          target="_blank"
          rel="noreferrer"
          className="hbtn hbtn-reset"
          style={{textDecoration:'none', padding:'5px 10px', fontSize:'0.6rem'}}
          title="Download full audit log"
        >
          ⬇ Logs
        </a>
        <div className="header-time">{dateStr} &nbsp; {timeStr} UTC</div>
      </div>
    </header>
  )
}
