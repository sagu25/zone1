import { useState, useEffect, useRef, useMemo } from 'react'
import ChatAssistant from './ChatAssistant'
import ActivityFeed  from './ActivityFeed'

const SRC_META = {
  GATEWAY:    { icon: '⟳', label: 'GATEWAY',  cls: 'ls-gateway', desc: 'Command gateway decisions (ALLOW/DENY)' },
  TARE:       { icon: '⚡', label: 'TARE',     cls: 'ls-tare',    desc: 'TARE engine — freeze, downgrade, timebox events' },
  AUTH:       { icon: '🔐', label: 'AUTH',     cls: 'ls-auth',    desc: 'Authentication — identity & token checks' },
  ServiceNow: { icon: '🎫', label: 'SNOW',     cls: 'ls-snow',    desc: 'ServiceNow incidents auto-created by TARE' },
  SUPERVISOR: { icon: '👤', label: 'SUPERVISOR', cls: 'ls-super', desc: 'Supervisor approve / deny decisions' },
  ML:         { icon: '🧠', label: 'ML',       cls: 'ls-ml',      desc: 'ML anomaly detection — IsolationForest + RandomForest' },
}

export function LiveStatsBar({ feedItems, stats }) {
  const counts = useMemo(() => {
    const c = {}
    feedItems.forEach(f => {
      const src = f.source
      c[src] = (c[src] || 0) + 1
      if (src === 'GATEWAY' && f.message?.includes('ML_ANOMALY')) {
        c['ML'] = (c['ML'] || 0) + 1
      }
    })
    return c
  }, [feedItems])

  const latest = feedItems[0]

  return (
    <div className="panel live-monitor-panel">
      <div className="panel-title"><span className="panel-icon">📡</span> Live Event Monitor</div>

      {/* Session stats row */}
      {stats && (
        <div className="ls-session-stats">
          <span className="ls-stat-chip ls-sc-total" title="Total commands"><b>{stats.total ?? 0}</b><span>CMDS</span></span>
          <span className="ls-stat-chip ls-sc-allow" title="Allowed"><b>{stats.allowed ?? 0}</b><span>ALLOW</span></span>
          <span className="ls-stat-chip ls-sc-deny"  title="Denied"><b>{stats.denied ?? 0}</b><span>DENY</span></span>
          <span className="ls-stat-chip ls-sc-frz"   title="Freeze events"><b>{stats.freeze_events ?? 0}</b><span>FRZ</span></span>
        </div>
      )}

      {/* Source event counts */}
      <div className="ls-counts">
        {Object.entries(SRC_META).map(([src, meta]) => (
          <span key={src} className={`ls-chip ${meta.cls}`} title={meta.desc}>
            <span className="ls-icon">{meta.icon}</span>
            <span className="ls-label">{meta.label}</span>
            <span className="ls-num">{counts[src] || 0}</span>
          </span>
        ))}
      </div>

      {/* Latest event */}
      <div className="ls-latest-wrap">
        <span className="ls-latest-label">LATEST</span>
        {latest ? (
          <div className="ls-latest">
            <span className="ls-latest-src">{latest.source}</span>
            <span className="ls-latest-msg">{latest.message}</span>
          </div>
        ) : (
          <div className="ls-latest"><span className="ls-latest-msg ls-dim">Awaiting events…</span></div>
        )}
      </div>
    </div>
  )
}

export default function RightPanel({ messages, feedItems, showApprove, onApprove, onDeny }) {
  const [tab, setTab] = useState('chat')
  const [unread, setUnread] = useState(0)
  const prevLenRef = useRef(feedItems.length)

  useEffect(() => {
    const diff = feedItems.length - prevLenRef.current
    if (tab === 'chat' && diff > 0) setUnread(n => n + diff)
    prevLenRef.current = feedItems.length
  }, [feedItems.length])

  const switchTab = (t) => {
    setTab(t)
    if (t === 'feed') setUnread(0)
  }

  return (
    <div className="right-tabbed-wrap">
      {/* Live stats bar */}
      <LiveStatsBar feedItems={feedItems} />

      {/* Tabs */}
      <div className="panel-tabs">
        <button className={`ptab ${tab==='chat'?'ptab-active':''}`} onClick={()=>switchTab('chat')}>
          💬 TARE Assistant
        </button>
        <button className={`ptab ${tab==='feed'?'ptab-active':''}`} onClick={()=>switchTab('feed')}>
          📋 Activity
          {unread > 0 && tab!=='feed' && <span className="ptab-count">{unread > 9 ? '9+' : unread}</span>}
        </button>
      </div>

      <div className={`ptab-body ${tab==='chat'?'':'ptab-hidden'}`}>
        <ChatAssistant messages={messages} showApprove={showApprove} onApprove={onApprove} onDeny={onDeny} />
      </div>
      <div className={`ptab-body ${tab==='feed'?'':'ptab-hidden'}`}>
        <ActivityFeed feedItems={feedItems} />
      </div>
    </div>
  )
}
