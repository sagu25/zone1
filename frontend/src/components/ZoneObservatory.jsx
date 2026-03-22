// Zone positions in a 580 × 200 viewBox
// Z3 (FAULT) = top-centre, Z2 = bottom-left, Z1 = bottom-right
const ZONE_POS = {
  Z3: { cx: 290, cy: 52 },
  Z2: { cx: 100, cy: 160 },
  Z1: { cx: 480, cy: 160 },
}

const LINKS = [
  { from:'Z3', to:'Z2', id:'l32' },
  { from:'Z3', to:'Z1', id:'l31' },
  { from:'Z2', to:'Z1', id:'l21' },
]

const ASSETS_BY_ZONE = {
  Z3: ['BRK-301','FDR-301'],
  Z2: ['BRK-205','FDR-205'],
  Z1: ['BRK-110','FDR-110'],
}

function zoneColor(zone, anomalyZones) {
  if (anomalyZones.includes(zone.id)) return { stroke:'#ff2d2d', fill:'rgba(255,45,45,0.12)', text:'#ff6b6b', glow:'drop-shadow(0 0 8px rgba(255,45,45,0.7))' }
  if (zone.health === 'FAULT')        return { stroke:'#ff8c00', fill:'rgba(255,140,0,0.1)',  text:'#ffa040', glow:'drop-shadow(0 0 8px rgba(255,140,0,0.5))' }
  return { stroke:'#00e87c', fill:'rgba(0,232,124,0.07)', text:'#00e87c', glow:'drop-shadow(0 0 6px rgba(0,232,124,0.4))' }
}

function stateColor(state) {
  if (state === 'OPEN' || state === 'RESTARTING') return '#ff8c00'
  if (state === 'CLOSED' || state === 'RUNNING')  return '#00e87c'
  return '#6b8fa3'
}

const THREAT_MODES = new Set(['FREEZE', 'DOWNGRADE', 'TIMEBOX_ACTIVE'])

export default function ZoneObservatory({ zones, assets, accessLog, mode }) {
  if (!zones || !assets) return null

  // Only show anomaly highlighting when TARE is actively in a threat mode
  const anomalyZones = THREAT_MODES.has(mode)
    ? (accessLog || []).filter(e => e.zone !== 'Z3').map(e => e.zone)
    : []

  const isAnomaly = anomalyZones.length > 0

  return (
    <div className="panel zone-panel">
      <div className="panel-title">
        <span className="dot" />
        Zone Observatory · OT/SCADA Grid Map
        <span style={{ marginLeft:'auto', fontSize:'0.5rem', color:'var(--text-dim)', fontFamily:'var(--font-mono)' }}>
          REAL-TIME
        </span>
      </div>

      <div className="zone-svg-wrap">
        <svg viewBox="0 0 580 210" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Background dot-grid */}
            <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.7" fill="#1a2f4e" opacity="0.6" />
            </pattern>

            {/* Normal flow gradient */}
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00e87c" stopOpacity="0.6" />
            </linearGradient>

            {/* Attack gradient */}
            <linearGradient id="attackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#ff2d2d" stopOpacity="1" />
              <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.7" />
            </linearGradient>

            {/* Arrow markers */}
            <marker id="arrowBlue" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0.5 L0,5.5 L6,3 Z" fill="#00d4ff" />
            </marker>
            <marker id="arrowRed" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0.5 L0,5.5 L6,3 Z" fill="#ff2d2d" />
            </marker>
          </defs>

          {/* Background */}
          <rect width="580" height="210" fill="url(#dotGrid)" />

          {/* Corner tags */}
          <text x="6" y="12" className="zone-lbl" style={{ textAnchor:'start', fontSize:'7px' }}>TARE GRID MAP</text>
          <text x="574" y="12" className="zone-lbl" style={{ textAnchor:'end', fontSize:'7px' }}>CLASSIFICATION: RESTRICTED</text>

          {/* Power lines between zones */}
          {LINKS.map(link => {
            const a = ZONE_POS[link.from]
            const b = ZONE_POS[link.to]
            const dx = b.cx - a.cx; const dy = b.cy - a.cy
            const len = Math.sqrt(dx*dx + dy*dy)
            const r = 34
            const x1 = a.cx + (dx/len)*r
            const y1 = a.cy + (dy/len)*r
            const x2 = b.cx - (dx/len)*r
            const y2 = b.cy - (dy/len)*r
            const isThreatLine = isAnomaly && (link.from !== 'Z2' || link.to !== 'Z1')
            return (
              <g key={link.id}>
                {/* Base line */}
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isThreatLine ? 'url(#attackGrad)' : 'url(#flowGrad)'}
                  strokeWidth={isThreatLine ? 2 : 1.5}
                  strokeDasharray="10 5"
                  markerEnd={isThreatLine ? 'url(#arrowRed)' : 'url(#arrowBlue)'}
                  style={{
                    animation: 'flowDash 0.8s linear infinite',
                    strokeOpacity: isThreatLine ? undefined : 0.7,
                    ...(isThreatLine ? { animation: 'flowDash 0.3s linear infinite' } : {}),
                  }}
                />
              </g>
            )
          })}

          {/* Zone nodes */}
          {Object.values(zones).map(zone => {
            const pos  = ZONE_POS[zone.id]
            if (!pos) return null
            const col  = zoneColor(zone, anomalyZones)
            const isAttacked = anomalyZones.includes(zone.id)
            const zAssets = ASSETS_BY_ZONE[zone.id] || []

            return (
              <g key={zone.id}>
                {/* Outer glow ring */}
                <circle cx={pos.cx} cy={pos.cy} r={38}
                  fill={col.fill}
                  style={{ filter: col.glow, animation: isAttacked ? 'subPulse 0.5s ease-in-out infinite' : zone.health === 'FAULT' ? 'subPulse 2s ease-in-out infinite' : 'none' }}
                />
                {/* Zone circle */}
                <circle cx={pos.cx} cy={pos.cy} r={30}
                  fill="#0a1525"
                  stroke={col.stroke}
                  strokeWidth={isAttacked ? 2.5 : 1.8}
                  style={{ transition: 'stroke 0.3s' }}
                />

                {/* Zone ID */}
                <text x={pos.cx} y={pos.cy - 6} className="zone-id-lbl" fill={col.text}>{zone.id}</text>
                {/* Health */}
                <text x={pos.cx} y={pos.cy + 8} className="zone-hlth" fill={col.text} opacity={0.8}>
                  {zone.health === 'FAULT' ? '⚠ FAULT' : isAttacked ? '⚡ ATTACKED' : '✓ HEALTHY'}
                </text>

                {/* Attack target badge */}
                {isAttacked && (
                  <g>
                    <rect x={pos.cx - 36} y={pos.cy - 52} width={72} height={14} rx={3}
                      fill="rgba(255,45,45,0.15)" stroke="rgba(255,45,45,0.6)" strokeWidth={1}
                      style={{ animation: 'subPulse 0.5s step-end infinite' }}
                    />
                    <text x={pos.cx} y={pos.cy - 42}
                      style={{ fontFamily:'var(--font-mono)', fontSize:'6.5px', fill:'#ff2d2d', fontWeight:700, textAnchor:'middle', letterSpacing:'0.1em' }}>
                      ANOMALY TARGET
                    </text>
                  </g>
                )}

                {/* Asset mini-chips below zone */}
                {zAssets.map((aid, i) => {
                  const ast = assets[aid]
                  if (!ast) return null
                  const ax = pos.cx + (i === 0 ? -28 : 28)
                  const ay = pos.cy + 44
                  return (
                    <g key={aid}>
                      <rect x={ax - 22} y={ay - 9} width={44} height={16} rx={3}
                        fill="rgba(14,29,53,0.9)" stroke={stateColor(ast.state)} strokeWidth={0.8} />
                      <text x={ax} y={ay - 1} className="asset-lbl">{aid}</text>
                      <text x={ax} y={ay + 7} className="asset-state" fill={stateColor(ast.state)}>{ast.state}</text>
                    </g>
                  )
                })}
              </g>
            )
          })}

          {/* "RBAC boundary" label */}
          <rect x={190} y={4} width={200} height={12} rx={3}
            fill="rgba(0,232,124,0.06)" stroke="rgba(0,232,124,0.2)" strokeWidth={0.8} />
          <text x={290} y={13}
            style={{ fontFamily:'var(--font-mono)', fontSize:'6.5px', fill:'#00e87c', fontWeight:700, textAnchor:'middle', letterSpacing:'0.08em' }}>
            AGENT RBAC: Z3 ONLY
          </text>
        </svg>
      </div>
    </div>
  )
}
