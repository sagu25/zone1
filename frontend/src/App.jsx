import { useState, useEffect, useRef, useCallback } from 'react'
import Header from './components/Header'
import AgentPanel from './components/AgentPanel'
import GridDiagram from './components/GridDiagram'
import ThreatStats from './components/ThreatStats'
import ActivityFeed from './components/ActivityFeed'
import ThreatAlert from './components/ThreatAlert'

const WS_URL = 'ws://localhost:8003/ws'

const INITIAL_AGENTS = {
  'GridMonitor-Alpha':  { name: 'GridMonitor-Alpha',  role: 'GRID_MONITOR',   clearance: 'LEVEL_3', clearance_num: 3, department: 'Grid Operations', status: 'INACTIVE', allowed_actions: ['READ_TELEMETRY','READ_GRID_STATUS'],            fingerprint: 'fp_gma_a3f9c2', action_count: 0, last_action: null, last_result: null },
  'LoadBalancer-Beta':  { name: 'LoadBalancer-Beta',  role: 'LOAD_BALANCER',  clearance: 'LEVEL_4', clearance_num: 4, department: 'Grid Operations', status: 'INACTIVE', allowed_actions: ['READ_TELEMETRY','ADJUST_LOAD','READ_GRID_STATUS'], fingerprint: 'fp_lbb_d7e1a5', action_count: 0, last_action: null, last_result: null },
  'FaultDetector-Gamma':{ name: 'FaultDetector-Gamma',role: 'FAULT_DETECTOR', clearance: 'LEVEL_3', clearance_num: 3, department: 'Maintenance',     status: 'INACTIVE', allowed_actions: ['READ_TELEMETRY','LOG_FAULT','READ_GRID_STATUS'],   fingerprint: 'fp_fdg_b2c8e4', action_count: 0, last_action: null, last_result: null },
}

let feedCounter = 0

export default function App() {
  const [wsConnected, setWsConnected]         = useState(false)
  const [agents, setAgents]                   = useState(INITIAL_AGENTS)
  const [feedItems, setFeedItems]             = useState([])
  const [threatCount, setThreatCount]         = useState(0)
  const [riskScore, setRiskScore]             = useState(0)
  const [activeIncidents, setActiveIncidents] = useState(0)
  const [alertData, setAlertData]             = useState(null)   // covers both rogue + behavioral
  const [demoRunning, setDemoRunning]         = useState(false)
  const [stepText, setStepText]               = useState('')
  const [abacPolicies, setAbacPolicies]       = useState([])
  const [gridState, setGridState]             = useState({
    substations: { SUB_NORTH: 'normal', SUB_EAST: 'normal', SUB_WEST: 'normal' },
    flowLines:   { NORTH_EAST: false, NORTH_WEST: false, EAST_WEST: false },
    cb7Status:   'CLOSED',
  })
  const wsRef = useRef(null)

  const addFeedItem = useCallback((level, agentName, message) => {
    feedCounter++
    const id = feedCounter
    setFeedItems(prev => [{ id, level, agentName, message, timestamp: new Date().toISOString() }, ...prev].slice(0, 200))
  }, [])

  const handleMessage = useCallback((msg) => {
    if (msg.snapshot) {
      const snap = msg.snapshot
      setThreatCount(snap.stats?.total_threats ?? 0)
      setRiskScore(snap.risk_score ?? 0)
      if (snap.agents) {
        setAgents(prev => {
          const next = { ...prev }
          snap.agents.forEach(a => { if (next[a.name]) next[a.name] = { ...next[a.name], ...a } })
          return next
        })
      }
    }

    switch (msg.type) {

      case 'INIT':
        if (msg.abac_policies) setAbacPolicies(msg.abac_policies)
        break

      case 'SIMULATION_RESET':
        setAgents(INITIAL_AGENTS)
        setFeedItems([])
        setThreatCount(0)
        setRiskScore(0)
        setActiveIncidents(0)
        setAlertData(null)
        setDemoRunning(false)
        setStepText('')
        setGridState({ substations: { SUB_NORTH:'normal', SUB_EAST:'normal', SUB_WEST:'normal' }, flowLines:{ NORTH_EAST:false, NORTH_WEST:false, EAST_WEST:false }, cb7Status:'CLOSED' })
        addFeedItem('info', 'AEGIS-ID', 'System reset. Awaiting demo.')
        break

      case 'DEMO_STEP':
        setStepText(msg.description)
        addFeedItem('info', 'SYSTEM', msg.description)
        setDemoRunning(true)
        break

      case 'AGENT_REGISTERED':
        if (msg.success) {
          setAgents(prev => ({ ...prev, [msg.agent_name]: { ...(prev[msg.agent_name]||{}), status:'ACTIVE', session_id: msg.session_id } }))
          setGridState(prev => ({ ...prev, flowLines:{ NORTH_EAST:true, NORTH_WEST:true, EAST_WEST:true } }))
          addFeedItem('info', msg.agent_name, `Authenticated · Session [${msg.session_id}] · Fingerprint verified`)
        } else {
          addFeedItem('danger', msg.agent_name, `BLOCKED — ${msg.anomalies?.join(', ')}`)
        }
        break

      case 'AGENT_ACTION': {
        const lvl = msg.result === 'ALLOW' ? 'info' : 'danger'
        const prefix = msg.behavioral ? '🧠 BEHAVIORAL CHECK — ' : ''
        addFeedItem(lvl, msg.agent_name, `${prefix}${msg.action} → ${msg.resource} [${msg.result}] · ${msg.result === 'ALLOW' ? msg.policy_id : msg.reason}`)
        if (msg.result === 'ALLOW') {
          setGridState(prev => ({ ...prev, substations:{ ...prev.substations, [msg.resource]:'active' }, flowLines:{ NORTH_EAST:true, NORTH_WEST:true, EAST_WEST:true } }))
        }
        break
      }

      case 'ROGUE_INCOMING':
        addFeedItem('warning', 'AEGIS-ID', msg.message)
        setStepText(msg.message)
        break

      case 'BEHAVIORAL_INCOMING':
        addFeedItem('warning', 'AEGIS-ID', msg.message)
        setStepText(msg.message)
        setAgents(prev => ({ ...prev, [msg.agent_name]: { ...(prev[msg.agent_name]||{}), status:'SUSPICIOUS' } }))
        break

      case 'ROGUE_DETECTED':
        setAlertData({ ...msg, alertType: 'IDENTITY_THEFT' })
        setActiveIncidents(i => i + 1)
        setGridState(prev => ({ ...prev, substations:{ ...prev.substations, SUB_NORTH:'threat' }, cb7Status:'BLOCKED' }))
        setAgents(prev => ({ ...prev, 'GridMonitor-Alpha':{ ...prev['GridMonitor-Alpha'], status:'ROGUE' } }))
        addFeedItem('danger', 'AEGIS-ID', `IDENTITY THEFT BLOCKED · Rogue impersonating GridMonitor-Alpha · TRIP_BREAKER CB-7 prevented · 50,000 customers protected`)
        setDemoRunning(false)
        break

      case 'BEHAVIORAL_ANOMALY':
        setAlertData({ ...msg, alertType: 'BEHAVIORAL_ANOMALY' })
        setActiveIncidents(i => i + 1)
        setGridState(prev => ({ ...prev, substations:{ ...prev.substations, SUB_NORTH:'threat' } }))
        setAgents(prev => ({ ...prev, 'LoadBalancer-Beta':{ ...prev['LoadBalancer-Beta'], status:'ANOMALOUS' } }))
        addFeedItem('danger', 'AEGIS-ID', `BEHAVIORAL ANOMALY BLOCKED · LoadBalancer-Beta valid credentials but pattern score ${msg.anomaly_score}/100 > threshold 60 · Session quarantined · 35,000 customers protected`)
        setDemoRunning(false)
        break

      case 'THREAT_UPDATE':
        setThreatCount(msg.total_threats ?? 0)
        setRiskScore(msg.risk_score ?? 0)
        setActiveIncidents(msg.active_incidents ?? 0)
        break

      case 'AGENT_DEREGISTERED':
        addFeedItem('info', 'AEGIS-ID', `Session terminated: ${msg.agent_name}`)
        setDemoRunning(false)
        // Reset substation after rogue/anomaly cleared
        setGridState(prev => ({ ...prev, substations:{ ...prev.substations, SUB_NORTH:'active' } }))
        break

      default:
        break
    }
  }, [addFeedItem])

  useEffect(() => {
    let ws, reconnectTimer
    const connect = () => {
      ws = new WebSocket(WS_URL)
      wsRef.current = ws
      ws.onopen    = () => { setWsConnected(true);  addFeedItem('info', 'AEGIS-ID', 'WebSocket connected. System online.') }
      ws.onclose   = () => { setWsConnected(false); reconnectTimer = setTimeout(connect, 3000) }
      ws.onerror   = () => ws.close()
      ws.onmessage = (e) => { try { handleMessage(JSON.parse(e.data)) } catch {} }
    }
    connect()
    return () => { clearTimeout(reconnectTimer); ws?.close() }
  }, [handleMessage])

  const sendCommand = (command) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ command }))
      if (command !== 'RESET') setDemoRunning(true)
    }
  }

  return (
    <div className="app-layout">
      <Header
        wsConnected={wsConnected}
        threatCount={threatCount}
        stepText={stepText}
        demoRunning={demoRunning}
        onStartDemo={()    => sendCommand('START_DEMO')}
        onLaunchRogue={()  => sendCommand('LAUNCH_ROGUE')}
        onLaunchBehavioral={()=> sendCommand('LAUNCH_BEHAVIORAL')}
        onReset={()        => sendCommand('RESET')}
      />
      <AgentPanel agents={Object.values(agents)} />
      <GridDiagram gridState={gridState} />
      <ThreatStats threatCount={threatCount} riskScore={riskScore} activeIncidents={activeIncidents} abacPolicies={abacPolicies} />
      <ActivityFeed feedItems={feedItems} />
      {alertData && <ThreatAlert alert={alertData} onDismiss={() => setAlertData(null)} />}
    </div>
  )
}
