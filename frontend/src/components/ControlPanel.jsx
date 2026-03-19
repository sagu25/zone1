export default function ControlPanel({ demoRunning, wsConnected, onStartDemo, onLaunchRogue, onReset }) {
  return (
    <div className="control-panel">
      <div className="control-title">Demo Controls</div>

      <button
        className="btn btn-demo"
        onClick={onStartDemo}
        disabled={!wsConnected || demoRunning}
      >
        {demoRunning ? (
          <><span className="spinner" /> Running Demo...</>
        ) : (
          '▶  Auto Demo'
        )}
      </button>

      <button
        className="btn btn-rogue"
        onClick={onLaunchRogue}
        disabled={!wsConnected}
      >
        ⚠  Launch Rogue Agent
      </button>

      <button
        className="btn btn-reset"
        onClick={onReset}
        disabled={!wsConnected}
      >
        ↺  Reset System
      </button>

      <div className="control-status">
        {wsConnected
          ? demoRunning ? 'Simulation in progress...' : 'Ready · Backend connected'
          : 'Connecting to backend...'}
      </div>

      {/* Legend */}
      <div style={{marginTop:'auto',fontSize:'0.55rem',color:'var(--text-dim)',borderTop:'1px solid var(--border-dim)',paddingTop:'8px'}}>
        <div style={{marginBottom:'3px',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase'}}>Detection Layers</div>
        {['Duplicate Session', 'Fingerprint Mismatch', 'ABAC Violation', 'Unauthorized Action'].map(l => (
          <div key={l} style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'2px'}}>
            <span style={{width:'5px',height:'5px',background:'var(--accent-blue)',borderRadius:'50%',flexShrink:0}} />
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
