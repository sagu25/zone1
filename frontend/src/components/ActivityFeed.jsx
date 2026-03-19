function formatTs(iso) {
  try {
    return new Date(iso).toLocaleTimeString('en-GB', { hour12: false })
  } catch { return '--:--:--' }
}

export default function ActivityFeed({ feedItems }) {
  return (
    <section className="feed-panel">
      <div className="panel-header">
        <span className="dot" />
        Activity Feed — Real-time Event Log
        <span style={{marginLeft:'auto',fontSize:'0.55rem',color:'var(--text-dim)'}}>
          {feedItems.length} events
        </span>
      </div>
      <div className="feed-body">
        {feedItems.map(item => (
          <div key={item.id} className={`feed-item ${item.level}`}>
            <span className="feed-ts">{formatTs(item.timestamp)}</span>
            <span className="feed-badge">{item.level.toUpperCase()}</span>
            <span className="feed-agent">[{item.agentName}]</span>
            <span className="feed-msg">{item.message}</span>
          </div>
        ))}
        {feedItems.length === 0 && (
          <div style={{padding:'12px',fontSize:'0.6rem',color:'var(--text-dim)',fontFamily:'var(--font-mono)',textAlign:'center'}}>
            Awaiting events — press AUTO DEMO or LAUNCH ROGUE AGENT
          </div>
        )}
      </div>
    </section>
  )
}
