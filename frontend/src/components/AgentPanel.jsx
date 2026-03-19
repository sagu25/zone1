const ROLE_LABELS = {
  GRID_MONITOR:  'Grid Monitor',
  LOAD_BALANCER: 'Load Balancer',
  FAULT_DETECTOR:'Fault Detector',
}

function ClearanceBar({ num }) {
  return (
    <div className="clearance-bar">
      {[1,2,3,4,5].map(i => (
        <div key={i} className={`clearance-block ${i <= num ? 'filled' : 'empty'}`} />
      ))}
    </div>
  )
}

function AgentCard({ agent }) {
  const isRogue      = agent.status === 'ROGUE'
  const isAnomalous  = agent.status === 'ANOMALOUS' || agent.status === 'SUSPICIOUS'
  const isActive     = agent.status === 'ACTIVE'
  const pulseClass   = isRogue ? 'rogue' : isAnomalous ? 'anomalous' : isActive ? 'active' : 'inactive'
  const cardClass    = isRogue ? 'rogue' : isAnomalous ? 'anomalous' : isActive ? 'active' : ''

  return (
    <div className={`agent-card ${cardClass}`}>
      <div className="agent-card-header">
        <div style={{ display:'flex', alignItems:'center' }}>
          <span className={`status-pulse ${pulseClass}`} />
          <span className="agent-name">{isRogue ? '⚠ ' : ''}{agent.name}</span>
        </div>
        <span className="agent-role-badge">
          {isRogue ? 'IMPOSTOR' : isAnomalous ? 'ANOMALOUS' : ROLE_LABELS[agent.role] || agent.role}
        </span>
      </div>

      <div className="agent-meta">
        <div className="meta-item">Dept<br /><span>{agent.department || '—'}</span></div>
        <div className="meta-item">
          Clearance<br />
          <ClearanceBar num={agent.clearance_num || 0} />
          <span style={{fontSize:'0.5rem',marginTop:'2px',display:'block'}}>{agent.clearance}</span>
        </div>
        <div className="meta-item">Status<br /><span style={{color: isRogue ? 'var(--accent-red)' : isActive ? 'var(--accent-green)' : 'var(--text-dim)'}}>{agent.status}</span></div>
        <div className="meta-item">Actions<br /><span>{agent.action_count ?? 0}</span></div>
      </div>

      {!isRogue && (
        <div className="agent-actions-list">
          {(agent.allowed_actions || []).map(a => (
            <span key={a} className="action-tag">{a}</span>
          ))}
        </div>
      )}

      <div className="agent-fingerprint">
        FP: {isRogue ? 'fp_rogue_ff0000 ✗' : agent.fingerprint}
      </div>

      {agent.last_action && (
        <div className="agent-last-action">
          Last: {agent.last_action} →{' '}
          <span className={agent.last_result === 'ALLOW' ? 'allow' : 'deny'}>
            {agent.last_result}
          </span>
        </div>
      )}
    </div>
  )
}

export default function AgentPanel({ agents }) {
  return (
    <aside className="panel agents-panel">
      <div className="panel-header">
        <span className="dot" />
        Active Agents ({agents.filter(a => a.status === 'ACTIVE').length} / {agents.length})
      </div>
      <div className="panel-body">
        {agents.map(agent => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </aside>
  )
}
