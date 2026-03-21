export default function ServiceNowCard({ incident }) {
  return (
    <div className={`panel snow-panel ${incident ? 'snow-active' : ''}`}>
      <div className="panel-title">
        <span className="panel-icon">🎫</span> ServiceNow Incident
        {incident && <span className="snow-badge">OPEN</span>}
      </div>

      {!incident ? (
        <div className="snow-empty">No active incident</div>
      ) : (
        <div className="snow-body">
          <div className="snow-row snow-id">{incident.incident_id}</div>
          <div className="snow-row"><span>Priority</span><span className="snow-prio">{incident.priority}</span></div>
          <div className="snow-row"><span>Assigned</span><span>{incident.assigned_to}</span></div>
          <div className="snow-row"><span>Category</span><span>{incident.category}</span></div>
          <div className="snow-row"><span>State</span><span className="snow-state">{incident.state}</span></div>
          <div className="snow-desc">{incident.short_description}</div>
          <div className="snow-signals">
            {(incident.evidence?.anomaly_signals || []).map((s, i) => (
              <span key={i} className="snow-sig-chip">{s.signal}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
