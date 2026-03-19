function riskLabel(score) {
  if (score >= 81) return { label: 'CRITICAL', cls: 'critical' }
  if (score >= 61) return { label: 'HIGH',     cls: 'high'     }
  if (score >= 31) return { label: 'MEDIUM',   cls: 'medium'   }
  return                   { label: 'LOW',      cls: 'low'      }
}

export default function ThreatStats({ threatCount, riskScore, activeIncidents, abacPolicies }) {
  const { label, cls } = riskLabel(riskScore)

  return (
    <aside className="panel threats-panel">
      <div className="panel-header">
        <span className="dot" style={{background:'var(--accent-red)',boxShadow:'var(--glow-red)'}} />
        Threat Intelligence
      </div>

      {/* Stat tiles */}
      <div className="stat-tiles">
        <div className="stat-tile">
          <div className={`stat-num ${threatCount > 0 ? 'danger' : 'green'}`}>{String(threatCount).padStart(2,'0')}</div>
          <div className="stat-label">Threats</div>
          <div className="stat-label">Detected</div>
        </div>
        <div className="stat-tile">
          <div className={`stat-num ${riskScore > 60 ? 'danger' : riskScore > 30 ? '' : 'green'}`}>{riskScore}</div>
          <div className="stat-label">Risk Score</div>
          <div className={`stat-sublabel ${cls}`}>{label}</div>
        </div>
        <div className="stat-tile">
          <div className={`stat-num ${activeIncidents > 0 ? 'danger' : 'green'}`}>{String(activeIncidents).padStart(2,'0')}</div>
          <div className="stat-label">Incidents</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-tile">
          <div className="stat-num green">3</div>
          <div className="stat-label">Agents</div>
          <div className="stat-label">Registered</div>
        </div>
      </div>

      {/* Risk bar */}
      <div className="risk-bar-wrap">
        <div className="risk-bar-label">
          <span>Threat Level</span>
          <span style={{color: cls === 'critical' ? 'var(--accent-red)' : 'var(--text-secondary)'}}>{label}</span>
        </div>
        <div className="risk-bar-track">
          <div className="risk-bar-fill" style={{width: `${riskScore}%`}} />
        </div>
      </div>

      {/* ABAC Policy Table */}
      <div className="abac-title">ABAC Policy Matrix</div>
      <div className="panel-body" style={{padding:'0 0 8px 0'}}>
        <table className="abac-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Action</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            {(abacPolicies || []).map(p => (
              <tr key={p.id}>
                <td style={{color:'var(--text-dim)'}}>{p.id}</td>
                <td title={p.subject}>{p.subject.replace('ROLE:','')}</td>
                <td title={p.action}>{p.action.split(' ')[0]}</td>
                <td className={p.effect.startsWith('ALLOW') ? 'effect-allow' : 'effect-deny'}>
                  {p.effect.split(' ')[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  )
}
