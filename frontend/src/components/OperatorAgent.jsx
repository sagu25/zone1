const STATUS_CLS = {
  ACTIVE:    'agent-active',
  ANOMALOUS: 'agent-anomalous',
  FROZEN:    'agent-frozen',
}

export default function OperatorAgent({ agent }) {
  if (!agent) return null
  const cls = STATUS_CLS[agent.status] || 'agent-active'

  return (
    <div className={`panel agent-panel ${cls}`}>
      <div className="panel-title">
        <span className="panel-icon">🤖</span> Operator Agent
        <span className={`status-badge ${cls}`}>{agent.status}</span>
      </div>

      <div className="agent-id-row">
        <span className="agent-id">{agent.id}</span>
        <span className="agent-name">{agent.name}</span>
      </div>

      <div className="agent-meta">
        <div className="meta-row"><span>Role</span><span>{agent.role}</span></div>
        <div className="meta-row"><span>Clearance</span><span>{agent.clearance}</span></div>
        <div className="meta-row"><span>Department</span><span>{agent.department}</span></div>
        <div className="meta-row"><span>Commands</span><span>{agent.action_count}</span></div>
      </div>

      <div className="rbac-row">
        <span className="rbac-label">RBAC Zones</span>
        {(agent.rbac_zones || []).map(z => (
          <span key={z} className="zone-chip chip-auth">{z}</span>
        ))}
        {/* Show non-authorised zones greyed */}
        {['Z1','Z2','Z3'].filter(z => !(agent.rbac_zones||[]).includes(z)).map(z => (
          <span key={z} className="zone-chip chip-deny">{z}</span>
        ))}
      </div>

      {agent.last_command && (
        <div className="agent-last">
          <span className="last-label">Last Command</span>
          <span className={`last-result ${agent.last_result === 'ALLOW' ? 'result-ok' : 'result-deny'}`}>
            {agent.last_command} → {agent.last_result}
          </span>
        </div>
      )}
    </div>
  )
}
