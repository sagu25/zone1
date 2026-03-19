// Positions (in a 560 x 400 viewBox)
const SUBS = {
  SUB_NORTH: { cx: 280, cy: 70,  label: 'SUBSTATION NORTH', sublabel: '132kV / 12 Feeders' },
  SUB_EAST:  { cx: 460, cy: 310, label: 'SUBSTATION EAST',  sublabel: '132kV / 8 Feeders'  },
  SUB_WEST:  { cx: 100, cy: 310, label: 'SUBSTATION WEST',  sublabel: '132kV / 10 Feeders' },
}

const LINES = [
  { id: 'NORTH_EAST', x1: 280, y1: 70,  x2: 460, y2: 310, gradient: 'gradNE' },
  { id: 'NORTH_WEST', x1: 280, y1: 70,  x2: 100, y2: 310, gradient: 'gradNW' },
  { id: 'EAST_WEST',  x1: 460, y1: 310, x2: 100, y2: 310, gradient: 'gradEW' },
]

// Lightning bolt path (icon inside substation hex)
const BOLT = 'M-5,-10 L2,-2 L-2,-2 L5,10 L-2,2 L2,2 Z'

function SubStation({ sub, id, state }) {
  const { cx, cy, label, sublabel } = sub
  const r = 32   // outer glow ring
  const rb = 22  // body circle

  // State-driven colours
  const bodyStroke   = state === 'threat' ? '#ff2d2d' : state === 'active' ? '#00d4ff' : '#253f63'
  const glowFill     = state === 'threat' ? 'rgba(255,45,45,0.12)' : state === 'active' ? 'rgba(0,212,255,0.07)' : 'rgba(0,212,255,0.02)'
  const iconFill     = state === 'threat' ? '#ff2d2d' : state === 'active' ? '#00d4ff' : '#334d66'
  const glowAnim     = state === 'threat' ? 'subGlowPulse 0.4s ease-in-out infinite' : state === 'active' ? 'subGlowPulse 2.5s ease-in-out infinite' : 'none'

  return (
    <g>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={r} fill={glowFill}
        style={{ animation: glowAnim }} />
      {/* Body */}
      <circle cx={cx} cy={cy} r={rb} fill="#111c30"
        stroke={bodyStroke} strokeWidth={state === 'threat' ? 2.5 : 2}
        style={{ transition: 'stroke 0.4s, stroke-width 0.3s' }} />
      {/* Lightning icon */}
      <path d={BOLT} transform={`translate(${cx},${cy})`} fill={iconFill}
        style={{ transition: 'fill 0.4s' }} />
      {/* Labels */}
      <text x={cx} y={cy + rb + 16} className="sub-label">{label}</text>
      <text x={cx} y={cy + rb + 28} className="sub-sublabel">{sublabel}</text>
      {/* Status badge for threat */}
      {state === 'threat' && (
        <g>
          <rect x={cx - 42} y={cy - rb - 28} width={84} height={18} rx={3}
            fill="rgba(255,45,45,0.15)" stroke="rgba(255,45,45,0.6)" strokeWidth={1} />
          <text x={cx} y={cy - rb - 15} textAnchor="middle"
            style={{fontFamily:'var(--font-mono)',fontSize:'8px',fill:'#ff2d2d',fontWeight:700,letterSpacing:'0.1em'}}>
            ATTACK TARGET
          </text>
        </g>
      )}
      {state === 'active' && (
        <circle cx={cx + rb - 5} cy={cy - rb + 5} r={4}
          fill="var(--accent-green)" style={{filter:'drop-shadow(0 0 4px var(--accent-green))'}} />
      )}
    </g>
  )
}

export default function GridDiagram({ gridState }) {
  const { substations, flowLines, cb7Status } = gridState

  const cb7X = 280
  const cb7Y = 185  // midpoint area near north substation

  return (
    <main className="grid-panel">
      <div className="grid-panel-header">
        <div className="grid-panel-title">
          <span className="dot" />
          Grid Control Center — TARE National Grid Network
        </div>
        <div style={{fontSize:'0.58rem',fontFamily:'var(--font-mono)',color:'var(--text-dim)'}}>
          SCADA / OT LAYER  ·  REAL-TIME
        </div>
      </div>

      <div className="grid-svg-wrap">
        <svg viewBox="0 0 560 420" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          <defs>
            {/* Background grid */}
            <pattern id="bgGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1a2d48" strokeWidth="0.4" opacity="0.5" />
            </pattern>

            {/* Flow line gradients */}
            <linearGradient id="gradNE" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00e87c" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="gradNW" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00e87c" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="gradEW" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#00e87c" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00e87c" stopOpacity="0.6" />
            </linearGradient>

            {/* Rogue attack line gradient */}
            <linearGradient id="gradThreat" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%"   stopColor="#ff2d2d" stopOpacity="1" />
              <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width="560" height="420" fill="url(#bgGrid)" />

          {/* Corner labels */}
          <text x="8" y="14" style={{fontFamily:'var(--font-mono)',fontSize:'8px',fill:'var(--text-dim)',letterSpacing:'0.1em'}}>AEGIS-ID GRID MAP</text>
          <text x="8" y="410" style={{fontFamily:'var(--font-mono)',fontSize:'7px',fill:'var(--text-dim)'}}>CLASSIFICATION: RESTRICTED</text>

          {/* Power flow lines */}
          {LINES.map(line => {
            const active = flowLines[line.id]
            const isThreat = substations.SUB_NORTH === 'threat'
            const lineClass = isThreat && line.id !== 'EAST_WEST' ? 'flow-line threat' : active ? 'flow-line active' : 'flow-line'
            const stroke = isThreat && line.id !== 'EAST_WEST' ? 'url(#gradThreat)' : `url(#${line.gradient})`
            return (
              <line key={line.id}
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke={stroke}
                strokeDasharray="10 6"
                strokeWidth={active ? 2 : 1.5}
                className={lineClass}
              />
            )
          })}

          {/* Substations */}
          {Object.entries(SUBS).map(([id, sub]) => (
            <SubStation key={id} id={id} sub={sub} state={substations[id] || 'normal'} />
          ))}

          {/* CB-7 Circuit Breaker indicator */}
          <g>
            <rect x={cb7X - 28} y={cb7Y - 11} width={56} height={22} rx={4}
              className={`cb7-body cb7-${cb7Status.toLowerCase()}`}
              fill={cb7Status === 'BLOCKED' ? '#ff2d2d' : '#00e87c'}
              style={{transition:'fill 0.3s'}} />
            <text x={cb7X} y={cb7Y + 4} className="cb7-label">CB-7</text>

            {/* Status below */}
            <text x={cb7X} y={cb7Y + 26}
              className={`cb7-status ${cb7Status.toLowerCase()}`}
              style={{
                fontFamily:'var(--font-mono)', fontSize:'8px', textAnchor:'middle',
                fill: cb7Status === 'BLOCKED' ? '#ff2d2d' : '#00e87c', fontWeight:700
              }}>
              {cb7Status === 'BLOCKED' ? '✗ TRIP BLOCKED' : '✓ CLOSED'}
            </text>

            {/* Arrow pointing to CB-7 label */}
            <text x={cb7X + 38} y={cb7Y + 4}
              style={{fontFamily:'var(--font-mono)',fontSize:'7px',fill:'var(--text-dim)'}}>
              ← BREAKER
            </text>
          </g>

          {/* Rogue attack arrow (only when threat) */}
          {substations.SUB_NORTH === 'threat' && (
            <g>
              <defs>
                <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 Z" fill="#ff2d2d" />
                </marker>
              </defs>
              <line x1={430} y1={170} x2={310} y2={100}
                stroke="#ff2d2d" strokeWidth={1.5} strokeDasharray="5 3"
                markerEnd="url(#arrowRed)"
                style={{opacity:0.7, animation:'flowDash 0.5s linear infinite'}} />
              <rect x={390} y={148} width={80} height={18} rx={3}
                fill="rgba(255,45,45,0.15)" stroke="rgba(255,45,45,0.5)" strokeWidth={1} />
              <text x={430} y={161}
                style={{fontFamily:'var(--font-mono)',fontSize:'7px',fill:'#ff2d2d',textAnchor:'middle',fontWeight:700}}>
                ROGUE AGENT
              </text>
            </g>
          )}
        </svg>
      </div>
    </main>
  )
}
