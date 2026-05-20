import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const SCENARIOS = [
  { emoji:'🚗', label:'Engine noise',      msg:'My Toyota Harrier is making a knocking sound when I start it in the morning' },
  { emoji:'💰', label:'Get a quote',       msg:'How much to replace clutch on Subaru Forester 2010?' },
  { emoji:'⚡', label:'Hybrid warning',    msg:'My Toyota Prius hybrid light is on and car has lost power completely' },
  { emoji:'📅', label:'Book service',      msg:'I want to bring my car in tomorrow for a full service' },
  { emoji:'🗝️', label:'Key issue',         msg:'My Mercedes C200 push button is not responding at all' },
  { emoji:'🇰🇪', label:'Swahili',          msg:'Gari yangu inatoa moshi mweusi, shida nini na bei ngapi?' },
];

function ts() {
  return new Date().toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit', hour12:true });
}

export default function WhatsAppDemo() {
  const [msgs, setMsgs]         = useState([]);
  const [history, setHistory]   = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [mobileTab, setMobileTab] = useState('chat'); // 'chat' | 'leads'
  const [leads, setLeads]       = useState([
    { id:'#4821', preview:'AC yangu haifanyi kazi...', time:'09:14 AM', status:'new',    tag:'AC Repair', kes:'KES 8–14k' },
    { id:'#4820', preview:'How much for timing belt?', time:'08:55 AM', status:'quoted', tag:'Engine',    kes:'KES 18–22k' },
    { id:'#4819', preview:"My Prius won't start",      time:'08:31 AM', status:'booked', tag:'Hybrid',   kes:'KES 5–45k' },
  ]);
  const [stats, setStats] = useState({ chats:3, leads:2, booked:1 });
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [msgs, loading]);

  const send = async (text) => {
    const t = (text || input).trim();
    if (!t || loading) return;
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const currentHistory = history;
    setMsgs(prev => [...prev, { role:'user', content:t, time:ts() }]);
    setLoading(true);

    const lower = t.toLowerCase();
    const tag = lower.includes('hybrid') || lower.includes('prius')   ? 'Hybrid'    :
                lower.includes('key')   || lower.includes('start')    ? 'Smart Key' :
                lower.includes('clutch')|| lower.includes('gear')     ? 'Gearbox'   :
                lower.includes('ac')                                   ? 'AC Repair' : 'General';

    setTimeout(() => {
      setLeads(p => [{
        id: '#' + Math.floor(Math.random() * 9000 + 1000),
        preview: t.slice(0, 42) + '...',
        time: ts(), status:'new', tag, kes:'Pending'
      }, ...p.slice(0, 5)]);
      setStats(p => ({ ...p, chats: p.chats + 1, leads: p.leads + 1 }));
    }, 800);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t, history: currentHistory })
      });
      const d = await r.json();
      const reply = d.reply || '⚠️ Could not get response.';

      setMsgs(prev => [...prev, { role:'assistant', content:reply, time:ts() }]);
      setHistory(prev => [
        ...prev,
        { role:'user',      content:t     },
        { role:'assistant', content:reply }
      ]);

      if (reply.includes('KES')) {
        setLeads(p => p.map((l, i) =>
          i === 0 ? { ...l, status:'quoted', kes: reply.match(/KES[\s\d,–-]+/)?.[0]?.trim() || l.kes } : l
        ));
      }
    } catch {
      setMsgs(p => [...p, { role:'assistant', content:'⚠️ Connection error. Please try again.', time:ts() }]);
    }

    setLoading(false);
  };

  const statusColor = { new:'#F59E0B', quoted:'#60A5FA', booked:'#22C55E' };
  const green = '#25D366', orange = '#FF6B1A';

  return (
    <>
      <Head>
        <title>MECH SAFI — WhatsApp AI Demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet"/>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { height: 100%; background: #060A14; font-family: 'DM Sans', sans-serif; color: #E8F0FF; -webkit-tap-highlight-color: transparent; }
          ::-webkit-scrollbar { width: 3px; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
          input, textarea, button { font-family: 'DM Sans', sans-serif; outline: none; }
          button { cursor: pointer; border: none; }

          @keyframes tdot {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
            40%            { transform: scale(1.1); opacity: 1;   }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50%       { opacity: 1;   }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }

          .msg-bubble { animation: slideUp 0.25s ease; }

          /* ── LAYOUT ── */
          .app          { height: 100dvh; display: flex; flex-direction: column; overflow: hidden; }
          .body-area    { flex: 1; display: flex; overflow: hidden; }

          /* Desktop: side-by-side */
          .chat-panel   { flex: 1; display: flex; flex-direction: column; border-right: 1px solid rgba(255,255,255,0.07); min-width: 0; }
          .leads-panel  { width: 300px; flex-shrink: 0; display: flex; flex-direction: column; }

          /* Mobile: stacked, tabbed */
          @media (max-width: 700px) {
            .leads-panel          { display: none; }
            .leads-panel.active   { display: flex; flex: 1; width: 100%; }
            .chat-panel.hidden    { display: none; }
            .desktop-stats        { display: none; }
            .mobile-tabs          { display: flex !important; }
            .header-sub           { display: none; }
          }
          @media (min-width: 701px) {
            .mobile-tabs          { display: none !important; }
            .leads-panel          { display: flex !important; }
            .chat-panel           { display: flex !important; }
          }

          /* Chat messages area */
          .messages-area {
            flex: 1;
            overflow-y: auto;
            padding: 14px 12px;
            background: #080F1C;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          /* Input row */
          .input-row {
            display: flex;
            gap: 8px;
            align-items: flex-end;
            padding: 10px 12px;
            background: #128C7E;
            flex-shrink: 0;
          }
          .input-wrap {
            flex: 1;
            background: rgba(0,0,0,0.25);
            border-radius: 24px;
            padding: 9px 14px;
            display: flex;
            align-items: flex-end;
          }
          .input-wrap textarea {
            width: 100%;
            background: transparent;
            border: none;
            color: #fff;
            font-size: 15px;
            resize: none;
            line-height: 1.5;
            min-height: 24px;
            max-height: 100px;
            overflow-y: auto;
          }
          .input-wrap textarea::placeholder { color: rgba(255,255,255,0.55); }
          .send-btn {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            transition: background 0.2s, transform 0.1s;
          }
          .send-btn:active { transform: scale(0.93); }

          /* Scenario chips */
          .chips-wrap {
            padding: 10px 12px;
            background: rgba(37,211,102,0.04);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            flex-shrink: 0;
          }
          .chip {
            background: rgba(37,211,102,0.09);
            border: 1px solid rgba(37,211,102,0.22);
            color: ${green};
            padding: 7px 12px;
            border-radius: 20px;
            font-size: 12.5px;
            white-space: nowrap;
            transition: background 0.15s;
          }
          .chip:active { background: rgba(37,211,102,0.2); }

          /* Leads panel internals */
          .lead-card {
            background: #0D1628;
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 12px;
            padding: 12px 13px;
            animation: fadeIn 0.3s ease;
          }

          /* Mobile tabs bar */
          .mobile-tabs {
            border-top: 1px solid rgba(255,255,255,0.08);
            background: #0D1628;
            flex-shrink: 0;
          }
          .tab-btn {
            flex: 1;
            padding: 12px 8px;
            font-size: 13px;
            font-weight: 600;
            background: transparent;
            color: rgba(232,240,255,0.45);
            border-top: 2px solid transparent;
            transition: color 0.15s, border-color 0.15s;
          }
          .tab-btn.active { color: #E8F0FF; border-top-color: ${orange}; }
        `}</style>
      </Head>

      <div className="app">

        {/* ── HEADER ── */}
        <div style={{ background:'#0D1628', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'11px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <a href="/" style={{ color:'rgba(232,240,255,0.4)', fontSize:13, textDecoration:'none', marginRight:4 }}>← Home</a>
            <div style={{ width:32, height:32, borderRadius:8, background:orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🔧</div>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15 }}>
                MECH<span style={{color:orange}}>SAFI</span> <span style={{ fontWeight:400, fontSize:13, color:'rgba(232,240,255,0.5)' }}>AI Demo</span>
              </div>
              <div className="header-sub" style={{ fontSize:11, color:'rgba(232,240,255,0.4)' }}>Left: customer · Right: garage feed</div>
            </div>
          </div>

          {/* Desktop stats */}
          <div className="desktop-stats" style={{ display:'flex', gap:20 }}>
            {[['💬', stats.chats,'Chats'], ['🎯', stats.leads,'Leads'], ['📅', stats.booked,'Booked']].map(([ic,v,l],i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16, color:i===1?orange:'#E8F0FF' }}>{v}</div>
                <div style={{ fontSize:10, color:'rgba(232,240,255,0.4)' }}>{ic} {l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="body-area">

          {/* CHAT PANEL */}
          <div className={`chat-panel${mobileTab === 'leads' ? ' hidden' : ''}`}>

            {/* WhatsApp header bar */}
            <div style={{ background:'#075E54', padding:'10px 14px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🔧</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#fff', fontFamily:"'Space Grotesk',sans-serif" }}>Prestige Auto Centre</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)' }}>● Kamau (MECH SAFI AI) — Online</div>
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', background:'rgba(0,0,0,0.2)', borderRadius:12, padding:'3px 9px', flexShrink:0 }}>📱 Customer view</div>
            </div>

            {/* Scenario chips — only shown before first message */}
            {msgs.length === 0 && (
              <div className="chips-wrap">
                <div style={{ fontSize:11, color:'rgba(232,240,255,0.4)', marginBottom:8, fontWeight:600, letterSpacing:0.5 }}>TRY A SCENARIO:</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {SCENARIOS.map((s, i) => (
                    <button key={i} className="chip" onClick={() => send(s.msg)}>
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="messages-area">
              {msgs.length === 0 && (
                <div style={{ textAlign:'center', padding:'40px 20px', animation:'fadeIn 0.4s ease' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
                  <div style={{ fontSize:14, color:'rgba(232,240,255,0.45)', lineHeight:1.8 }}>
                    Pick a scenario above or type a message.<br/>
                    Kamau replies like a real Nairobi mechanic.
                  </div>
                </div>
              )}

              {msgs.map((m, i) => {
                const isUser = m.role === 'user';
                return (
                  <div key={i} className="msg-bubble" style={{ display:'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems:'flex-end', gap:7 }}>
                    {!isUser && (
                      <div style={{ width:28, height:28, borderRadius:'50%', background:orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🔧</div>
                    )}
                    <div style={{
                      maxWidth:'80%',
                      padding:'9px 13px',
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      background: isUser ? '#025C4C' : '#1A2740',
                      color: isUser ? '#E9FFEF' : '#E8F0FF',
                      fontSize:14,
                      lineHeight:1.65,
                      whiteSpace:'pre-wrap',
                      wordBreak:'break-word'
                    }}>
                      {m.content}
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:5, textAlign:'right' }}>
                        {m.time}{isUser ? ' ✓✓' : ''}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div style={{ display:'flex', alignItems:'flex-end', gap:7 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🔧</div>
                  <div style={{ background:'#1A2740', borderRadius:'4px 16px 16px 16px', padding:'11px 15px', display:'flex', gap:5, alignItems:'center' }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <span key={i} style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:green, animation:`tdot 1.2s ease-in-out ${d}s infinite` }}/>
                    ))}
                    <span style={{ fontSize:11, color:'rgba(232,240,255,0.4)', marginLeft:6 }}>Kamau anaandika...</span>
                  </div>
                </div>
              )}

              <div ref={endRef}/>
            </div>

            {/* Input */}
            <div className="input-row">
              <div className="input-wrap">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                  onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }}
                  disabled={loading}
                  placeholder="Type as a customer..."
                  rows={1}
                />
              </div>
              <button
                className="send-btn"
                onClick={() => send()}
                disabled={!input.trim() || loading}
                style={{ background: (!input.trim() || loading) ? 'rgba(255,255,255,0.15)' : orange }}
              >
                {loading ? '⏳' : '➤'}
              </button>
            </div>
          </div>

          {/* LEADS PANEL */}
          <div className={`leads-panel${mobileTab === 'leads' ? ' active' : ''}`}>
            <div style={{ padding:'8px 14px', background:'rgba(255,107,26,0.05)', borderBottom:'1px solid rgba(255,107,26,0.12)', fontSize:11, color:orange, fontWeight:600, flexShrink:0 }}>
              🔧 GARAGE OWNER VIEW — Live incoming leads
            </div>

            {/* Mini stats */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, padding:'10px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
              {[
                ['💬', stats.chats,  'Chats',     green ],
                ['🎯', stats.leads,  'Leads',     orange],
                ['📅', stats.booked, 'Booked',    '#E8F0FF'],
                ['✅', leads.filter(l => l.status === 'booked').length, 'Confirmed', green]
              ].map(([ic, v, l, c], i) => (
                <div key={i} style={{ background:'#111F3A', borderRadius:8, padding:'9px 10px', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:700, color:c }}>{v}</div>
                  <div style={{ fontSize:10, color:'rgba(232,240,255,0.4)', marginTop:2 }}>{ic} {l}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:'8px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:green, animation:'pulse 2s infinite' }}/>
              <div style={{ fontSize:12, color:green, fontWeight:600 }}>AI ACTIVE — Responding automatically</div>
            </div>

            <div style={{ flex:1, overflowY:'auto', padding:'10px', display:'flex', flexDirection:'column', gap:7 }}>
              {leads.map((lead, i) => (
                <div key={i + lead.id} className="lead-card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <div style={{ fontSize:10, color:'rgba(232,240,255,0.35)', fontFamily:'monospace' }}>{lead.id}</div>
                    <span style={{ background:`${statusColor[lead.status]}20`, color:statusColor[lead.status], padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:600 }}>
                      {lead.status === 'new' ? '🔔 New' : lead.status === 'quoted' ? '📋 Quoted' : '📅 Booked'}
                    </span>
                  </div>
                  <div style={{ fontSize:12.5, color:'#C8D8F0', marginBottom:6, lineHeight:1.5, fontStyle:'italic' }}>"{lead.preview}"</div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11 }}>
                    <span style={{ background:'rgba(0,207,255,0.1)', color:'#22D3EE', padding:'2px 7px', borderRadius:5 }}>{lead.tag}</span>
                    <span style={{ color: lead.kes !== 'Pending' ? orange : 'rgba(232,240,255,0.35)' }}>{lead.kes}</span>
                  </div>
                  <div style={{ fontSize:10, color:'rgba(232,240,255,0.3)', marginTop:7, textAlign:'right' }}>{lead.time}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
              <div style={{ background:'rgba(37,211,102,0.07)', border:'1px solid rgba(37,211,102,0.18)', borderRadius:9, padding:'9px 12px', fontSize:12, color:green, lineHeight:1.65 }}>
                💡 Every chat is a real lead. The AI qualifies them — you only confirm bookings.
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE TABS ── */}
        <div className="mobile-tabs" style={{ display:'none' }}>
          <button className={`tab-btn${mobileTab === 'chat'  ? ' active' : ''}`} onClick={() => setMobileTab('chat')}>
            💬 Chat {msgs.length > 0 ? `(${msgs.filter(m=>m.role==='user').length})` : ''}
          </button>
          <button className={`tab-btn${mobileTab === 'leads' ? ' active' : ''}`} onClick={() => setMobileTab('leads')}>
            🎯 Live Leads ({leads.length})
          </button>
        </div>

      </div>
    </>
  );
}
