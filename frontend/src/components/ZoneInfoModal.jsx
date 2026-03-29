// Zone display names and rich info for non-technical audiences
export const ZONE_DISPLAY = { Z1: 'Zone 1', Z2: 'Zone 2', Z3: 'Zone 3' }

// Real photo paths served from /public/zones/
const ZONE_PHOTO = {
  Z1: '/zones/z1.jpeg',
  Z2: '/zones/z2.png',
  Z3: '/zones/z3.png',
}

export const ZONE_INFO = {
  Z1: {
    display:     'Zone 1 — North Grid',
    region:      'Northern Critical Infrastructure District',
    type:        'Critical',
    typeColor:   '#ff4d6d',
    description: 'HIGHEST PRIORITY — directly powers hospitals, emergency response centres, and national data centres in the northern district. A fault here triggers an immediate P1 incident. Any action on this zone requires senior approval and strict safety protocols.',
    assets: [
      { id: 'BRK-110', type: 'Circuit Breaker',   role: 'Guards life-critical infrastructure. Breaker operation here must follow mandatory safety simulation — skipping this step is a serious violation that can cut power to hospitals and emergency services.' },
      { id: 'FDR-110', type: 'Feeder Controller', role: 'Maintains stable, uninterrupted power to hospitals, 999 emergency dispatch and government data centres. A restart here requires supervisor sign-off due to direct risk to human life.' },
    ],
  },
  Z2: {
    display:     'Zone 2 — East Grid',
    region:      'Eastern Commercial & Residential District',
    type:        'Sensitive',
    typeColor:   '#ff9a3c',
    description: 'Medium-priority zone covering the eastern commercial hub and residential areas — office towers, shopping centres and thousands of homes. Disruption here has wide public impact and must be handled with care.',
    assets: [
      { id: 'BRK-205', type: 'Circuit Breaker',   role: 'Protects the eastern grid from overloads during peak demand. Prevents a single fault from blacking out the entire commercial and residential district.' },
      { id: 'FDR-205', type: 'Feeder Controller', role: 'Balances electricity load across the eastern network in real time, preventing voltage drops and ensuring stable power for offices, shops and homes.' },
    ],
  },
  Z3: {
    display:     'Zone 3 — West Grid',
    region:      'Western Industrial & Logistics District',
    type:        'Operational',
    typeColor:   '#00d4ff',
    description: 'Lower-priority operational zone serving the western industrial corridor — manufacturing plants, warehouses and logistics hubs. This is the ACTIVE FAULT ZONE in the current scenario. The AI agent is authorised to investigate and restore it.',
    assets: [
      { id: 'BRK-301', type: 'Circuit Breaker',   role: 'Controls power isolation for the western industrial grid. The current voltage fault on this breaker is what the AI agent has been tasked to investigate and resolve.' },
      { id: 'FDR-301', type: 'Feeder Controller', role: 'Distributes power across the western industrial zone. It supports the manufacturing load but — unlike Zone 1 — a temporary restart here carries lower risk to public safety.' },
    ],
  },
}

// SVG illustrations — exported so hover tooltip can reuse them
export function ZoneIllustration({ zoneId, color }) {
  // Z1 — Critical / Hospital (most sensitive)
  if (zoneId === 'Z1') return (
    <svg viewBox="0 0 160 100" width="160" height="100">
      {/* Main hospital building */}
      <rect x="28" y="32" width="104" height="64" fill="none" stroke={color} strokeWidth="2.5" rx="2"/>
      {/* Hospital cross — vertical */}
      <rect x="68" y="10" width="24" height="52" fill="none" stroke={color} strokeWidth="2.5" rx="2"/>
      {/* Hospital cross — horizontal */}
      <rect x="52" y="24" width="56" height="24" fill="none" stroke={color} strokeWidth="2.5" rx="2"/>
      {/* Plus sign inside cross */}
      <line x1="80" y1="18" x2="80" y2="40" stroke={color} strokeWidth="3" opacity="0.8"/>
      <line x1="68" y1="30" x2="92" y2="30" stroke={color} strokeWidth="3" opacity="0.8"/>
      {/* Entrance */}
      <rect x="68" y="72" width="24" height="24" fill="none" stroke={color} strokeWidth="2"/>
      {/* Windows */}
      <rect x="36" y="44" width="14" height="12" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="56" y="44" width="10" height="12" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="94" y="44" width="10" height="12" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="110" y="44" width="14" height="12" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="36" y="62" width="14" height="12" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="110" y="62" width="14" height="12" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      {/* Emergency siren */}
      <circle cx="20" cy="20" r="8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7"/>
      <line x1="20" y1="12" x2="20" y2="8" stroke={color} strokeWidth="2" opacity="0.7"/>
      <line x1="26" y1="14" x2="29" y2="11" stroke={color} strokeWidth="2" opacity="0.7"/>
      <line x1="28" y1="20" x2="32" y2="20" stroke={color} strokeWidth="2" opacity="0.7"/>
      {/* Ground */}
      <line x1="5" y1="96" x2="155" y2="96" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    </svg>
  )

  // Z2 — Sensitive / City skyline (commercial & residential)
  if (zoneId === 'Z2') return (
    <svg viewBox="0 0 160 100" width="160" height="100">
      {/* Tall central tower */}
      <rect x="58" y="14" width="28" height="82" fill="none" stroke={color} strokeWidth="2.5" rx="1"/>
      {/* Antenna */}
      <line x1="72" y1="14" x2="72" y2="6" stroke={color} strokeWidth="1.5"/>
      <circle cx="72" cy="5" r="2" fill={color}/>
      {/* Left building */}
      <rect x="18" y="38" width="36" height="58" fill="none" stroke={color} strokeWidth="2" rx="1"/>
      {/* Right building */}
      <rect x="90" y="28" width="38" height="68" fill="none" stroke={color} strokeWidth="2" rx="1"/>
      {/* Window grids — central */}
      {[22,32,42,52,62,72,82].map(y => [62,75].map(x => (
        <rect key={`${x}-${y}`} x={x} y={y} width="7" height="5" fill="none" stroke={color} strokeWidth="1" opacity="0.6" rx="0.5"/>
      )))}
      {/* Window grids — left */}
      {[44,54,64,74].map(y => [22,32,42].map(x => (
        <rect key={`l${x}-${y}`} x={x} y={y} width="7" height="5" fill="none" stroke={color} strokeWidth="1" opacity="0.6" rx="0.5"/>
      )))}
      {/* Window grids — right */}
      {[34,44,54,64,74].map(y => [93,103,113].map(x => (
        <rect key={`r${x}-${y}`} x={x} y={y} width="7" height="5" fill="none" stroke={color} strokeWidth="1" opacity="0.6" rx="0.5"/>
      )))}
      {/* Ground */}
      <line x1="5" y1="96" x2="155" y2="96" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    </svg>
  )

  // Z3 — Operational / Factory (industrial, least sensitive)
  return (
    <svg viewBox="0 0 160 100" width="160" height="100">
      {/* Factory building */}
      <rect x="20" y="52" width="120" height="44" fill="none" stroke={color} strokeWidth="2.5" rx="2"/>
      {/* Smokestacks */}
      <rect x="32" y="24" width="14" height="30" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="57" y="12" width="14" height="42" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="82" y="18" width="14" height="36" fill="none" stroke={color} strokeWidth="2"/>
      {/* Smoke puffs */}
      <circle cx="39" cy="20" r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="64" cy="8"  r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="89" cy="14" r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      {/* Door */}
      <rect x="67" y="72" width="16" height="24" fill="none" stroke={color} strokeWidth="2"/>
      {/* Windows */}
      <rect x="28" y="62" width="12" height="10" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="48" y="62" width="12" height="10" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="95" y="62" width="12" height="10" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="115" y="62" width="12" height="10" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      {/* Fault warning triangle */}
      <polygon points="140,55 150,72 130,72" fill="none" stroke={color} strokeWidth="1.8" opacity="0.8"/>
      <text x="140" y="70" textAnchor="middle" fontSize="10" fill={color} fontWeight="bold" opacity="0.9">!</text>
      {/* Ground */}
      <line x1="5" y1="96" x2="155" y2="96" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    </svg>
  )
}

export default function ZoneInfoModal({ zoneId, zones, assets, onClose }) {
  if (!zoneId) return null
  const info   = ZONE_INFO[zoneId]
  if (!info) return null
  const zState  = zones?.[zoneId] || {}
  const isFault = zState.health === 'FAULT'
  const faultMsg = zState.fault || null
  const photoSrc = ZONE_PHOTO[zoneId]

  return (
    <div className="zone-modal-overlay" onClick={onClose}>
      <div className="zone-modal zone-modal-vertical" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="zone-modal-close" onClick={onClose}>✕</button>

        {/* Real photo */}
        {photoSrc && (
          <div className="zone-modal-photo">
            <img src={photoSrc} alt={info.display} />
            <div className="zone-modal-photo-label">{info.region}</div>
          </div>
        )}

        {/* SVG illustration + header inline */}
        <div className="zone-modal-top-row">
          <div className="zone-modal-illustration-sm" style={{ borderColor: info.typeColor + '44', background: info.typeColor + '0d' }}>
            <ZoneIllustration zoneId={zoneId} color={info.typeColor} />
          </div>
          <div className="zone-modal-header">
            <div className="zone-modal-name">{info.display}</div>
            <div className="zone-modal-badges">
              <span className="zone-modal-type" style={{ borderColor: info.typeColor + '80', color: info.typeColor, background: info.typeColor + '18' }}>
                {info.type} Zone
              </span>
              <span className={`zone-modal-status ${isFault ? 'zms-fault' : 'zms-ok'}`}>
                {isFault ? '⚠ FAULT ACTIVE' : '✓ HEALTHY'}
              </span>
            </div>
          </div>
        </div>

        {/* Active fault alert */}
        {isFault && faultMsg && (
          <div className="zone-modal-fault-alert">
            <div className="zmfa-title">⚡ Active Fault Detected</div>
            <div className="zmfa-msg">{faultMsg}</div>
            <div className="zmfa-impact">
              The AI agent has been tasked to investigate and restore this zone.
              TARE is monitoring all commands issued against this zone in real time.
            </div>
          </div>
        )}

        {/* Description */}
        <div className="zone-modal-section">
          <div className="zone-modal-section-label">What is this zone?</div>
          <p className="zone-modal-desc">{info.description}</p>
        </div>

        {/* Assets */}
        <div className="zone-modal-section">
          <div className="zone-modal-section-label">Assets in this zone</div>
          {info.assets.map(a => {
            const ast = assets?.[a.id]
            return (
              <div key={a.id} className="zone-modal-asset">
                <div className="zma-header">
                  <span className="zma-id">{a.id}</span>
                  <span className="zma-type">{a.type}</span>
                  {ast && (
                    <span className={`zma-state ${ast.state === 'OPEN' || ast.state === 'RESTARTING' ? 'zma-warn' : 'zma-ok'}`}>
                      {ast.state}
                    </span>
                  )}
                </div>
                <p className="zma-role">{a.role}</p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
