export default function ThreatAlert({ alert, onDismiss }) {
  if (!alert) return null
  const isBehavioral = alert.alertType === 'BEHAVIORAL_ANOMALY'

  return isBehavioral
    ? <BehavioralAlert alert={alert} onDismiss={onDismiss} />
    : <IdentityAlert   alert={alert} onDismiss={onDismiss} />
}

/* ── Identity theft alert (existing) ─────────────────────────────── */
function IdentityAlert({ alert, onDismiss }) {
  const { rogue_name, claimed_fingerprint, expected_fingerprint,
          anomalies=[], blocked_action, blocked_resource,
          target_substation, customers_protected, alert_message, timestamp } = alert
  const incidentId = `INC-${new Date(timestamp).getTime().toString().slice(-8)}`

  return (
    <div className="threat-overlay" onClick={e => e.target===e.currentTarget && onDismiss()}>
      <div className="threat-card">
        <div className="threat-card-header">
          <div className="threat-icon">⚠</div>
          <div>
            <div className="threat-headline">IDENTITY THEFT DETECTED</div>
            <div className="threat-subheadline">AEGIS-ID Layer 1 — Identity Verification · Incident {incidentId}</div>
          </div>
        </div>
        <div className="threat-sections">
          <div className="threat-section">
            <div className="threat-section-title">Rogue Identity</div>
            <div className="threat-detail-row"><span className="threat-detail-key">Name</span><span className="threat-detail-value red">{rogue_name} (IMPOSTOR)</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Claimed FP</span><span className="threat-detail-value red">{claimed_fingerprint}</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Expected FP</span><span className="threat-detail-value green">{expected_fingerprint}</span></div>
          </div>
          <div className="threat-section">
            <div className="threat-section-title">Anomalies Detected</div>
            <div className="anomaly-tags">{anomalies.map((a,i) => <div key={i} className="anomaly-tag">{a}</div>)}</div>
          </div>
          <div className="threat-section">
            <div className="threat-section-title">Blocked Action</div>
            <div className="threat-detail-row"><span className="threat-detail-key">Action</span><span className="threat-detail-value red">{blocked_action}</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Target</span><span className="threat-detail-value red">{blocked_resource} → {target_substation?.replace('_',' ')}</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Impact Prevented</span><span className="threat-detail-value yellow">{customers_protected?.toLocaleString()} customers</span></div>
          </div>
          <div className="threat-section">
            <div className="threat-section-title">ABAC Response</div>
            <div className="threat-detail-row"><span className="threat-detail-key">Policy</span><span className="threat-detail-value red">POL-004 + POL-005</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Effect</span><span className="threat-detail-value red">DENY + ALERT</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Session</span><span className="threat-detail-value red">TERMINATED</span></div>
          </div>
          <div className="threat-section full alert-sent">
            <div className="threat-section-title" style={{color:'var(--accent-green)'}}>✓ Alert Transmitted to Rogue Agent</div>
            <div className="alert-msg">{alert_message}</div>
          </div>
        </div>
        <div className="threat-footer">
          <button className="btn btn-demo" style={{maxWidth:'240px'}} onClick={onDismiss}>✓ Acknowledge &amp; Continue</button>
        </div>
      </div>
    </div>
  )
}

/* ── Behavioral anomaly alert (new) ──────────────────────────────── */
function BehavioralAlert({ alert, onDismiss }) {
  const { agent_name, anomaly_score, anomaly_threshold, signals=[],
          baseline_zones=[], attempted_zone, credentials_valid,
          fingerprint_match, customers_protected, alert_message,
          policy_triggered, timestamp } = alert
  const incidentId = `BEH-${new Date(timestamp).getTime().toString().slice(-8)}`

  return (
    <div className="threat-overlay" onClick={e => e.target===e.currentTarget && onDismiss()}>
      <div className="threat-card" style={{borderColor:'var(--accent-orange)', boxShadow:'var(--glow-orange), 0 0 80px rgba(255,140,0,0.2)'}}>
        <div className="threat-card-header">
          <div className="threat-icon" style={{color:'var(--accent-orange)'}}>🧠</div>
          <div>
            <div className="threat-headline" style={{color:'var(--accent-orange)', textShadow:'var(--glow-orange)'}}>
              BEHAVIORAL ANOMALY DETECTED
            </div>
            <div className="threat-subheadline">AEGIS-ID Layer 3 — Behavioral Pattern Analysis · Incident {incidentId}</div>
          </div>
        </div>

        {/* Key differentiator callout */}
        <div style={{background:'rgba(255,140,0,0.08)', border:'1px solid rgba(255,140,0,0.3)', borderRadius:'5px', padding:'10px 14px', marginBottom:'14px', fontSize:'0.65rem', color:'var(--accent-orange)', lineHeight:'1.6'}}>
          ⚠ <strong>Credentials are VALID.</strong> Fingerprint MATCHES. Identity checks PASSED.<br/>
          Blocked purely on <strong>behavioral pattern deviation</strong> from 30-day baseline.
        </div>

        <div className="threat-sections">
          <div className="threat-section">
            <div className="threat-section-title">Agent Identity</div>
            <div className="threat-detail-row"><span className="threat-detail-key">Agent</span><span className="threat-detail-value" style={{color:'var(--accent-orange)'}}>{agent_name}</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Credentials</span><span className="threat-detail-value green">VALID ✓</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Fingerprint</span><span className="threat-detail-value green">MATCH ✓</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Behaviour</span><span className="threat-detail-value red">ANOMALOUS ✗</span></div>
          </div>

          <div className="threat-section">
            <div className="threat-section-title">Anomaly Score</div>
            <div style={{textAlign:'center', padding:'8px 0'}}>
              <div style={{fontSize:'2rem', fontWeight:700, fontFamily:'var(--font-mono)', color:'var(--accent-red)'}}>{anomaly_score}</div>
              <div style={{fontSize:'0.55rem', color:'var(--text-secondary)'}}>SCORE / 100</div>
              <div style={{fontSize:'0.6rem', color:'var(--accent-red)', marginTop:'4px', fontWeight:600}}>THRESHOLD: {anomaly_threshold} — EXCEEDED</div>
            </div>
            <div style={{height:'5px', background:'var(--border-dim)', borderRadius:'3px', overflow:'hidden'}}>
              <div style={{height:'100%', width:`${anomaly_score}%`, background:'linear-gradient(90deg,#00e87c,#ffd700,#ff8c00,#ff2d2d)', transition:'width 0.8s'}} />
            </div>
          </div>

          <div className="threat-section full">
            <div className="threat-section-title">Detection Signals</div>
            {signals.map((s,i) => (
              <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'6px', padding:'5px 8px', background:'rgba(255,45,45,0.05)', borderRadius:'3px', borderLeft:'2px solid var(--accent-red)'}}>
                <div>
                  <div style={{fontSize:'0.6rem', fontWeight:700, color:'var(--accent-red)', fontFamily:'var(--font-mono)'}}>{s.signal}</div>
                  <div style={{fontSize:'0.58rem', color:'var(--text-secondary)', marginTop:'2px'}}>{s.detail}</div>
                </div>
                <div style={{fontSize:'0.65rem', fontWeight:700, color:'var(--accent-red)', fontFamily:'var(--font-mono)', flexShrink:0, marginLeft:'12px'}}>+{s.score}</div>
              </div>
            ))}
          </div>

          <div className="threat-section">
            <div className="threat-section-title">Baseline vs Actual</div>
            <div className="threat-detail-row"><span className="threat-detail-key">Normal zones</span><span className="threat-detail-value green">{baseline_zones.join(', ')}</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Attempted zone</span><span className="threat-detail-value red">{attempted_zone}</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Policy</span><span className="threat-detail-value red">{policy_triggered}</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Impact Prevented</span><span className="threat-detail-value yellow">{customers_protected?.toLocaleString()} customers</span></div>
          </div>

          <div className="threat-section">
            <div className="threat-section-title">Response Action</div>
            <div className="threat-detail-row"><span className="threat-detail-key">Session</span><span className="threat-detail-value red">QUARANTINED</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">SOC</span><span className="threat-detail-value yellow">NOTIFIED</span></div>
            <div className="threat-detail-row"><span className="threat-detail-key">Playbook</span><span className="threat-detail-value yellow">TRIGGERED</span></div>
          </div>

          <div className="threat-section full alert-sent">
            <div className="threat-section-title" style={{color:'var(--accent-green)'}}>✓ Alert Transmitted to Agent &amp; SOC</div>
            <div className="alert-msg">{alert_message}</div>
          </div>
        </div>

        <div className="threat-footer">
          <button className="btn btn-demo" style={{maxWidth:'240px'}} onClick={onDismiss}>✓ Acknowledge &amp; Continue</button>
        </div>
      </div>
    </div>
  )
}
