const MODE_ORDER = ['NORMAL', 'FREEZE', 'DOWNGRADE', 'TIMEBOX_ACTIVE', 'SAFE']

const MODE_META = {
  NORMAL:         { icon: '◉', label: 'NORMAL' },
  FREEZE:         { icon: '❄', label: 'FREEZE' },
  DOWNGRADE:      { icon: '▼', label: 'DOWNGRADE' },
  TIMEBOX_ACTIVE: { icon: '⏱', label: 'TIME-BOX' },
  SAFE:           { icon: '✓', label: 'SAFE' },
}

const LEVEL_MAP = {
  NORMAL:         'ok',
  FREEZE:         'critical',
  DOWNGRADE:      'danger',
  TIMEBOX_ACTIVE: 'timebox',
  SAFE:           'safe',
}

function getNarrative(mode, agent) {
  switch (mode) {
    case 'NORMAL':
      if (!agent || agent.action_count === 0)
        return 'System online — GridOperator-Agent authorized for Zone 3. TARE monitoring all commands in real time.'
      return `Agent operating within baseline — ${agent.action_count} command${agent.action_count !== 1 ? 's' : ''} executed in authorized Zone 3. No anomalies detected.`
    case 'FREEZE':
      return 'TARE FREEZE ACTIVE — High-impact grid operations halted immediately. Anomalous behavior pattern detected. Awaiting supervisor decision.'
    case 'DOWNGRADE':
      return 'Privileges DOWNGRADED to read-only + diagnostics. Blast radius contained. Supervisor approval required to restore switching operations.'
    case 'TIMEBOX_ACTIVE':
      return 'TIME-BOX APPROVED — Supervisor granted 3-minute window. Switching re-enabled. RESTART_CONTROLLER remains permanently blocked.'
    case 'SAFE':
      return 'SAFE MODE — Time-boxed access expired. All high-impact operations blocked. Awaiting operator review before resuming.'
    default:
      return 'TARE monitoring active.'
  }
}

export default function NarrativeBanner({ mode, agent }) {
  const currentIdx = MODE_ORDER.indexOf(mode)
  const level      = LEVEL_MAP[mode] || 'ok'
  const narrative  = getNarrative(mode, agent)

  return (
    <div className={`narrative-banner banner-${level}`}>

      {/* Lifecycle pipeline */}
      <div className="lc-pipeline">
        {MODE_ORDER.map((m, i) => {
          const meta      = MODE_META[m]
          const isCurrent = i === currentIdx
          const isPast    = i < currentIdx
          const cls       = [
            'lc-step',
            isCurrent ? `lc-current lc-${m}` : isPast ? 'lc-past' : 'lc-future',
          ].join(' ')
          return (
            <span key={m} style={{ display:'flex', alignItems:'center' }}>
              <span className={cls}>
                {isPast ? '✓' : meta.icon}&nbsp;{meta.label}
              </span>
              {i < MODE_ORDER.length - 1 && (
                <span className="lc-arrow">›</span>
              )}
            </span>
          )
        })}
      </div>

      {/* Divider */}
      <span className="banner-divider" />

      {/* Narrative text */}
      <span className="banner-narrative">{narrative}</span>
    </div>
  )
}
