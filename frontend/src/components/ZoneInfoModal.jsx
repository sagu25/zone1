// Zone display names and rich info for non-technical audiences
export const ZONE_DISPLAY = { Z1: 'Zone 1', Z2: 'Zone 2', Z3: 'Zone 3' }

const ZONE_INFO = {
  Z1: {
    display:     'Zone 1 — North Grid',
    region:      'Northern Industrial District',
    type:        'Industrial',
    typeColor:   '#00d4ff',
    description: 'Powers the northern industrial corridor — manufacturing plants, warehouses and logistics hubs. This zone handles the heaviest power loads on the entire grid and runs 24/7 to support continuous production operations.',
    assets: [
      { id: 'BRK-110', type: 'Circuit Breaker',    role: 'Automatically isolates electrical faults to prevent failures from cascading across the northern grid. Think of it as a safety switch that cuts power when something goes wrong.' },
      { id: 'FDR-110', type: 'Feeder Controller',  role: 'Regulates and distributes power from the main substation to each industrial consumer. It acts like a smart traffic controller for electricity flow.' },
    ],
  },
  Z2: {
    display:     'Zone 2 — East Grid',
    region:      'Eastern Commercial & Residential District',
    type:        'Commercial',
    typeColor:   '#00e87c',
    description: 'Serves the eastern commercial hub and residential estates — office towers, shopping centres, hospitals and thousands of homes. Disruption here directly affects daily life for a large urban population.',
    assets: [
      { id: 'BRK-205', type: 'Circuit Breaker',    role: 'Protects the eastern grid from overloads and short circuits, especially during peak demand hours. Prevents a single fault from blacking out the entire district.' },
      { id: 'FDR-205', type: 'Feeder Controller',  role: 'Balances electricity load across the eastern network in real time, preventing brownouts and ensuring stable voltage for sensitive equipment.' },
    ],
  },
  Z3: {
    display:     'Zone 3 — West Grid',
    region:      'Western Critical Services District',
    type:        'Critical',
    typeColor:   '#ff8c00',
    description: 'Highest-priority zone — directly supplies hospitals, emergency services, and data centres in the western district. Any fault here is treated as a critical incident. This is the active fault zone in the current scenario.',
    assets: [
      { id: 'BRK-301', type: 'Circuit Breaker',    role: 'Isolating a fault here protects life-critical services. Controlled breaker operation must follow strict safety simulation before execution — no shortcuts allowed.' },
      { id: 'FDR-301', type: 'Feeder Controller',  role: 'Keeps power stable for hospitals and emergency dispatch centres even under grid stress. A restart here requires supervisor approval due to risk to critical services.' },
    ],
  },
}

// SVG illustrations — simple, clean, recognisable for non-technical viewers
function ZoneIllustration({ zoneId, color }) {
  if (zoneId === 'Z1') return (
    <svg viewBox="0 0 160 100" width="160" height="100">
      {/* Factory — industrial zone */}
      <rect x="20" y="52" width="120" height="44" fill="none" stroke={color} strokeWidth="2.5" rx="2"/>
      {/* Smokestacks */}
      <rect x="32" y="24" width="14" height="30" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="57" y="12" width="14" height="42" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="82" y="18" width="14" height="36" fill="none" stroke={color} strokeWidth="2"/>
      {/* Smoke puffs */}
      <circle cx="39" cy="20" r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="64" cy="8" r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="89" cy="14" r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      {/* Door */}
      <rect x="67" y="72" width="16" height="24" fill="none" stroke={color} strokeWidth="2"/>
      {/* Windows */}
      <rect x="28" y="62" width="12" height="10" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="48" y="62" width="12" height="10" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="95" y="62" width="12" height="10" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      <rect x="115" y="62" width="12" height="10" fill="none" stroke={color} strokeWidth="1.5" rx="1"/>
      {/* Ground line */}
      <line x1="5" y1="96" x2="155" y2="96" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      {/* Power lines */}
      <line x1="130" y1="30" x2="150" y2="20" stroke={color} strokeWidth="1" strokeDasharray="3,2" opacity="0.5"/>
      <line x1="150" y1="20" x2="155" y2="50" stroke={color} strokeWidth="1" strokeDasharray="3,2" opacity="0.5"/>
      <circle cx="150" cy="20" r="3" fill={color} opacity="0.7"/>
    </svg>
  )

  if (zoneId === 'Z2') return (
    <svg viewBox="0 0 160 100" width="160" height="100">
      {/* City skyline — commercial zone */}
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

  // Z3 — Critical / Hospital
  return (
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
      {/* Ambulance symbol */}
      <circle cx="140" cy="85" r="8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <text x="140" y="89" textAnchor="middle" fontSize="10" fill={color} opacity="0.8">🚑</text>
      {/* Ground */}
      <line x1="5" y1="96" x2="155" y2="96" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    </svg>
  )
}

export default function ZoneInfoModal({ zoneId, zones, assets, onClose }) {
  if (!zoneId) return null
  const info   = ZONE_INFO[zoneId]
  if (!info) return null
  const zState = zones?.[zoneId] || {}
  const isFault = zState.health === 'FAULT'

  return (
    <div className="zone-modal-overlay" onClick={onClose}>
      <div className="zone-modal" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="zone-modal-close" onClick={onClose}>✕</button>

        {/* Illustration */}
        <div className="zone-modal-illustration" style={{ borderColor: info.typeColor + '44', background: info.typeColor + '0d' }}>
          <ZoneIllustration zoneId={zoneId} color={info.typeColor} />
        </div>

        {/* Header */}
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
          <div className="zone-modal-region">{info.region}</div>
        </div>

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
