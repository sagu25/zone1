const ZONE_COLORS = {
  HEALTHY: { ring:'#22c55e', fill:'#052e16', label:'#86efac' },
  FAULT:   { ring:'#ef4444', fill:'#2d0505', label:'#fca5a5' },
}
const ASSET_ICONS = { BREAKER:'⚡', FEEDER:'〰' }
const STATE_CLS   = { CLOSED:'ast-closed', RUNNING:'ast-running', OPEN:'ast-open', RESTARTING:'ast-restart' }

export default function ZoneObservatory({ zones, assets, accessLog }) {
  const zoneList = ['Z3','Z2','Z1']  // Z3 on top (fault/active), healthy below

  return (
    <div className="panel zone-panel">
      <div className="panel-title"><span className="panel-icon">🗺</span> Zone Observatory</div>

      <div className="zones-grid">
        {zoneList.map(zid => {
          const z   = zones?.[zid]
          if (!z) return null
          const col = ZONE_COLORS[z.health] || ZONE_COLORS.HEALTHY
          const zAssets = Object.values(assets || {}).filter(a => a.zone === zid)
          const recentHits = (accessLog || []).filter(e => e.zone === zid).length

          return (
            <div key={zid} className="zone-card" style={{ borderColor: col.ring, background: col.fill }}>
              <div className="zone-header">
                <span className="zone-id" style={{ color: col.label }}>{zid}</span>
                <span className={`zone-health ${z.health === 'FAULT' ? 'health-fault' : 'health-ok'}`}>
                  {z.health === 'FAULT' ? '⚠ FAULT' : '✓ HEALTHY'}
                </span>
                <span className="zone-hits">{recentHits} accesses</span>
              </div>
              <div className="zone-name">{z.name}</div>
              {z.fault && <div className="zone-fault-msg">{z.fault}</div>}

              <div className="zone-assets">
                {zAssets.map(ast => (
                  <div key={ast.id} className={`asset-chip ${STATE_CLS[ast.state] || ''}`}>
                    <span className="ast-icon">{ASSET_ICONS[ast.type]}</span>
                    <span className="ast-id">{ast.id}</span>
                    <span className="ast-state">{ast.state}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
