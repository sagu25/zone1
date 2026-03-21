import { useState, useEffect, useRef, useCallback } from 'react'
import Header        from './components/Header'
import OperatorAgent from './components/OperatorAgent'
import CommandGateway from './components/CommandGateway'
import ZoneObservatory from './components/ZoneObservatory'
import TAREResponse  from './components/TAREResponse'
import ServiceNowCard from './components/ServiceNowCard'
import ChatAssistant from './components/ChatAssistant'
import ActivityFeed  from './components/ActivityFeed'

const WS_URL = `ws://${window.location.hostname}:${window.location.port}/ws`

const INITIAL_STATE = {
  mode:           'NORMAL',
  previous_mode:  null,
  mode_changed_at:null,
  zones:  {
    Z1: { id:'Z1', name:'Zone 1 — North Grid', health:'HEALTHY', fault:null, color:'green' },
    Z2: { id:'Z2', name:'Zone 2 — East Grid',  health:'HEALTHY', fault:null, color:'green' },
    Z3: { id:'Z3', name:'Zone 3 — West Grid',  health:'FAULT',   fault:'Voltage fluctuation — feeder instability detected', color:'red' },
  },
  assets: {
    'BRK-301':{ id:'BRK-301', type:'BREAKER', zone:'Z3', state:'CLOSED',  description:'Main Circuit Breaker Z3' },
    'FDR-301':{ id:'FDR-301', type:'FEEDER',  zone:'Z3', state:'RUNNING', description:'Feeder Controller Z3' },
    'BRK-205':{ id:'BRK-205', type:'BREAKER', zone:'Z2', state:'CLOSED',  description:'Main Circuit Breaker Z2' },
    'FDR-205':{ id:'FDR-205', type:'FEEDER',  zone:'Z2', state:'RUNNING', description:'Feeder Controller Z2' },
    'BRK-110':{ id:'BRK-110', type:'BREAKER', zone:'Z1', state:'CLOSED',  description:'Main Circuit Breaker Z1' },
    'FDR-110':{ id:'FDR-110', type:'FEEDER',  zone:'Z1', state:'RUNNING', description:'Feeder Controller Z1' },
  },
  agent: {
    id:'OP-GRID-7749', name:'GridOperator-Agent', role:'GRID_OPERATOR',
    clearance:'LEVEL_3', department:'Grid Operations', rbac_zones:['Z3'],
    status:'ACTIVE', action_count:0, last_command:null, last_result:null,
  },
  gateway_log:      [],
  zone_access_log:  [],
  anomaly_signals:  [],
  anomaly_score:    0,
  active_incident:  null,
  stats:            { total:0, allowed:0, denied:0, freeze_events:0 },
  timebox_remaining:null,
  timebox_total:    0,
}

let feedId = 0
function mkFeed(level, source, message) {
  return { id: ++feedId, level, source, message, ts: new Date().toISOString() }
}

export default function App() {
  const [snap,        setSnap]        = useState(INITIAL_STATE)
  const [chatMsgs,    setChatMsgs]    = useState([])
  const [feedItems,   setFeedItems]   = useState([])
  const [wsConnected, setWsConnected] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const wsRef = useRef(null)

  const addFeed = useCallback((level, source, message) => {
    setFeedItems(prev => [mkFeed(level, source, message), ...prev].slice(0, 300))
  }, [])

  const handleMsg = useCallback((msg) => {
    switch (msg.type) {

      case 'STATE_SNAPSHOT':
        setSnap(msg)
        break

      case 'RESET':
        setSnap(INITIAL_STATE)
        setChatMsgs([])
        setFeedItems([])
        setShowApprove(false)
        addFeed('info', 'TARE', msg.message)
        break

      case 'GATEWAY_DECISION': {
        const lvl = msg.decision === 'ALLOW' ? 'info' : 'danger'
        const sigStr = msg.signals?.length ? ` [${msg.signals.map(s=>s.signal).join('+')}]` : ''
        addFeed(lvl, 'GATEWAY', `${msg.command} → ${msg.asset_id} [${msg.decision}] ${msg.reason}${sigStr}`)
        break
      }

      case 'TARE_RESPONSE':
        addFeed('danger', 'TARE', `${msg.action} — ${msg.message}`)
        break

      case 'SERVICENOW_INCIDENT':
        addFeed('warning', 'ServiceNow', `Incident created: ${msg.incident?.incident_id}`)
        break

      case 'CHAT_MESSAGE':
        setChatMsgs(prev => [...prev, { role: msg.role, text: msg.message, ts: new Date().toISOString() }])
        if (msg.show_approve) setShowApprove(true)
        if (msg.show_approve === false) setShowApprove(false)
        break

      case 'TIMEBOX_APPROVED':
        setShowApprove(false)
        addFeed('info', 'TARE', `Time-box approved — ${msg.duration_minutes}min window active`)
        break

      case 'TIMEBOX_TICK':
        setSnap(prev => ({ ...prev, timebox_remaining: msg.remaining_seconds }))
        break

      case 'TIMEBOX_EXPIRED':
        addFeed('warning', 'TARE', msg.message)
        break

      default:
        break
    }
  }, [addFeed])

  useEffect(() => {
    let ws, timer
    const connect = () => {
      ws = new WebSocket(WS_URL)
      wsRef.current = ws
      ws.onopen    = () => { setWsConnected(true);  addFeed('info', 'TARE', 'System online — WebSocket connected.') }
      ws.onclose   = () => { setWsConnected(false); timer = setTimeout(connect, 3000) }
      ws.onerror   = () => ws.close()
      ws.onmessage = (e) => { try { handleMsg(JSON.parse(e.data)) } catch {} }
    }
    connect()
    return () => { clearTimeout(timer); ws?.close() }
  }, [handleMsg])

  const post = (path) => fetch(path, { method:'POST' })

  // Scale to fit any screen
  const layoutRef = useRef(null)
  useEffect(() => {
    const scale = () => {
      const el = layoutRef.current
      if (!el) return
      const s = Math.min(window.innerWidth / 1440, window.innerHeight / 810)
      el.style.transform = `scale(${s})`
      el.style.marginLeft = `${(window.innerWidth  - 1440 * s) / 2}px`
      el.style.marginTop  = `${(window.innerHeight - 810  * s) / 2}px`
    }
    scale()
    window.addEventListener('resize', scale)
    return () => window.removeEventListener('resize', scale)
  }, [])

  return (
    <div className="app-root">
      <div className="app-layout" ref={layoutRef}>
        <Header
          wsConnected={wsConnected}
          mode={snap.mode}
          stats={snap.stats}
          timeboxRemaining={snap.timebox_remaining}
          timeboxTotal={snap.timebox_total}
          onNormal={()  => post('/demo/normal')}
          onAnomal={()  => post('/demo/anomaly')}
          onReset={()   => post('/reset')}
        />

        <div className="main-grid">
          {/* LEFT COL */}
          <div className="col-left">
            <OperatorAgent agent={snap.agent} />
            <TAREResponse  mode={snap.mode} signals={snap.anomaly_signals} score={snap.anomaly_score} />
            <ServiceNowCard incident={snap.active_incident} />
          </div>

          {/* CENTRE COL */}
          <div className="col-centre">
            <ZoneObservatory zones={snap.zones} assets={snap.assets} accessLog={snap.zone_access_log} />
            <CommandGateway  log={snap.gateway_log} />
          </div>

          {/* RIGHT COL */}
          <div className="col-right">
            <ChatAssistant
              messages={chatMsgs}
              showApprove={showApprove}
              onApprove={() => post('/approve/timebox')}
            />
            <ActivityFeed feedItems={feedItems} />
          </div>
        </div>
      </div>
    </div>
  )
}
