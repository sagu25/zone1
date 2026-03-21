const DEC_CLS = { ALLOW:'dec-allow', DENY:'dec-deny' }

function fmtTs(ts) {
  if (!ts) return ''
  return ts.slice(11, 19)
}

export default function CommandGateway({ log }) {
  return (
    <div className="panel gw-panel">
      <div className="panel-title"><span className="panel-icon">🛡</span> Command Gateway (PEP)</div>

      {(!log || log.length === 0) ? (
        <div className="gw-empty">Awaiting commands…</div>
      ) : (
        <div className="gw-table-wrap">
          <table className="gw-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Command</th>
                <th>Asset</th>
                <th>Zone</th>
                <th>Decision</th>
                <th>Policy</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {log.map(e => (
                <tr key={e.id} className={e.signals?.length ? 'row-anomaly' : ''}>
                  <td className="gw-ts">{fmtTs(e.ts)}</td>
                  <td className="gw-cmd">{e.command}</td>
                  <td className="gw-asset">{e.asset_id}</td>
                  <td className="gw-zone">{e.zone}</td>
                  <td><span className={`dec-badge ${DEC_CLS[e.decision]}`}>{e.decision}</span></td>
                  <td className="gw-policy">{e.policy}</td>
                  <td className="gw-mode">{e.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
