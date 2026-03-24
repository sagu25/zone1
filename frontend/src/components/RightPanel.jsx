import { useState, useEffect, useRef } from 'react'
import ChatAssistant from './ChatAssistant'
import ActivityFeed  from './ActivityFeed'

export default function RightPanel({ messages, feedItems, showApprove, onApprove, onDeny }) {
  const [tab, setTab] = useState('chat')
  const [unread, setUnread] = useState(0)
  const prevLenRef = useRef(feedItems.length)

  // Badge activity tab when new feed items arrive but chat is active
  useEffect(() => {
    const diff = feedItems.length - prevLenRef.current
    if (tab === 'chat' && diff > 0) {
      setUnread(n => n + diff)
    }
    prevLenRef.current = feedItems.length
  }, [feedItems.length])

  const switchTab = (t) => {
    setTab(t)
    if (t === 'feed') setUnread(0)
  }

  return (
    <div className="right-tabbed-wrap">
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
