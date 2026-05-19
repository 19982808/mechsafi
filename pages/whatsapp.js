import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const WA_SYS = `You are MECH SAFI AI — a WhatsApp AI mechanic assistant for Prestige Auto Centre, Westlands, Nairobi, Kenya.

STRICT STYLE RULES:
• Keep every message SHORT — maximum 6 lines, WhatsApp style
• Never write long paragraphs
• Use line breaks, *bold*, and emojis naturally
• Detect language: Swahili reply Swahili; English reply English; mixed reply mixed
• For car problems: ask ONE focused question, then give short answer
• For pricing: give KES range briefly, then invite them to come in
• For bookings: confirm enthusiastically
• Be warm and local — like a trusted Kenyan mechanic friend
• Sign off as "— MECH SAFI 🔧" only on the very first message
• Garage hours: Mon–Sat, 7am–6pm. Location: Westlands, Nairobi`;

const SCENARIOS = [
  { emoji:'🚗', label:'Engine noise',     msg:'My Toyota Harrier is making a knocking sound when I start it in the morning' },
  { emoji:'💰', label:'Get a quote',      msg:'How much to replace clutch on Subaru Forester 2010?' },
  { emoji:'⚡', label:'Hybrid warning',   msg:'My Toyota Prius hybrid light is on and car has lost power completely' },
  { emoji:'📅', label:'Book appointment', msg:'I want to bring my car in tomorrow for a full service' },
  { emoji:'🗝️', label:'Smart key issue',  msg:'My Mercedes C200 push button is not responding at all' },
  { emoji:'🇰🇪', label:'Swahili question',msg:'Gari yangu inatoa moshi mweusi, shida nini na bei ngapi?' },
];

function ts() { return new Date().toLocaleTimeString('en-KE',{hour:'2-digit',minute:'2-digit',hour12:true}); }

export default function WhatsAppDemo() {
  const [msgs, setMsgs]       = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [leads, setLeads]     = useState([
    { id:'#4821', preview:'AC yangu haifanyi kazi...', time:'09:14 AM', status:'new',    tag:'AC Repair',   kes:'KES 8–14k' },
    { id:'#4820', preview:'How much for timing belt?', time:'08:55 AM', status:'quoted', tag:'Engine',      kes:'KES 18–22k' },
    { id:'#4819', preview:'My Prius won\'t start',    time:'08:31 AM', status:'booked', tag:'Hybrid',      kes:'KES 5–45k' },
  ]);
  const [stats, setStats] = useState({ chats:3, leads:2, booked:1 });
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, loading]);

  const send = async (text) => {
    const t = (text || input).trim();
    if (!t || loading) return;
    setInput('');
    const next = [...msgs, { role:'user', content:t, time:ts() }];
    setMsgs(next);
    setLoading(true);

    const tag = t.toLowerCase().includes('hybrid')||t.toLowerCase().includes('prius') ? 'Hybrid' :
                t.toLowerCase().includes('key')||t.toLowerCase().includes('start') ? 'Smart Key' :
                t.toLowerCase().includes('clutch')||t.toLowerCase().includes('gear') ? 'Gearbox' :
                t.toLowerCase().includes('ac') ? 'AC Repair' : 'General';

    setTimeout(() => {
      setLeads(p => [{ id:'#'+Math.floor(Math.random()*9000+1000), preview:t.slice(0,45)+'...', time:ts(), status:'new', tag, kes:'Pending' }, ...p.slice(0,5)]);
      setStats(p => ({ ...p, chats:p.chats+1, leads:p.leads+1 }));
    }, 800);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: WA_SYS,
          messages: next.map(m => ({ role:m.role, content:m.content })),
          max_tokens: 400
        })
      });
      const d = await r.json();
      const reply = d.content?.[0]?.text || '⚠️ Could not get response.';
      setMsgs(p => [...p, { role:'assistant', content:reply, time:ts() }]);
      if (reply.includes('KES')) setLeads(p => p.map((l,i) => i===0?{...l,status:'quoted',kes:reply.match(/KES[\s]*[\d,]+/)?.[0]||l.kes}:l));
    } catch {
      setMsgs(p => [...p, { role:'assistant', content:'⚠️ Connection error. Please try again.', time:ts() }]);
    }
    setLoading(false);
  };

  const statusColor = { new:'#F59E0B', quoted:'#60A5FA', booked:'#22C55E' };

  const bg='#060A14', surf='#0D1628', surf2='#111F3A', bd='rgba(255,255,255,0.08)';
  const text='#E8F0FF', muted='rgba(232,240,255,0.5)', green='#25D366', orange='#FF6B1A';
  const font="'Inter',sans-serif", display="'Space Grotesk',sans-serif";

  return (
    <>
      <Head>
        <title>MECH SAFI — WhatsApp AI Demo</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0;}
          body{background:${bg};font-family:${font};}
          ::-webkit-scrollbar{width:3px;}
          ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:2px;}
          input,textarea{font-family:${font};outline:none;}
          @keyframes tdot{0%,80%,100%{transform:scale(.7);opacity:.4}40%{transform:scale(1.1);opacity:1}}
          @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        `}</style>
      </Head>

      <div style={{ height:'100vh', display:'flex', flexDirection:'column', color:text }}>

        {/* HEADER */}
        <div style={{ background:surf, borderBottom:`1px solid ${bd}`, padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <a href="/" style={{ color:muted, fontSize:13, textDecoration:'none', marginRight:8 }}>← Home</a>
            <div style={{ width:32, height:32, borderRadius:8, background:orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🔧</div>
            <div>
              <div style={{ fontFamily:display, fontWeight:700, fontSize:15 }}>MECH<span style={{color:orange}}>SAFI</span> — WhatsApp AI Demo</div>
              <div style={{ fontSize:11, color:muted }}>Left: customer view · Right: garage live feed</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:20 }}>
            {[['💬',stats.chats,'Chats'],['🎯',stats.leads,'Leads'],['📅',stats.booked,'Booked']].map(([ic,v,l],i)=>(
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:display, fontWeight:700, fontSize:16, color:i===1?orange:text }}>{v}</div>
                <div style={{ fontSize:10, color:muted }}>{ic} {l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

          {/* LEFT: CUSTOMER WHATSAPP */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', borderRight:`1px solid ${bd}` }}>
            <div style={{ padding:'8px 14px', background:'rgba(37,211,102,0.05)', borderBottom:`1px solid rgba(37,211,102,0.15)`, fontSize:11, color:green, fontWeight:600, flexShrink:0 }}>
              📱 CUSTOMER VIEW — What your customers experience on WhatsApp
            </div>
            <div style={{ background:'#075E54', padding:'10px 14px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🔧</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'#fff', fontFamily:display }}>Prestige Auto Centre</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.8)' }}>● MECH SAFI AI — Responds instantly</div>
              </div>
            </div>

            {msgs.length===0 && (
              <div style={{ padding:'10px 12px', background:'rgba(37,211,102,0.04)', borderBottom:`1px solid ${bd}`, flexShrink:0 }}>
                <div style={{ fontSize:11, color:muted, marginBottom:7, fontWeight:600 }}>TRY A SCENARIO:</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {SCENARIOS.map((s,i)=>(
                    <button key={i} onClick={()=>send(s.msg)} style={{ background:'rgba(37,211,102,0.08)', border:'1px solid rgba(37,211,102,0.2)', color:green, padding:'6px 11px', borderRadius:20, cursor:'pointer', fontSize:11.5, fontFamily:font }}>
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ flex:1, overflowY:'auto', padding:'14px 12px', background:'#0A1520', display:'flex', flexDirection:'column', gap:10 }}>
              {msgs.length===0 && (
                <div style={{ textAlign:'center', padding:'30px 20px' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>💬</div>
                  <div style={{ fontSize:13, color:muted, lineHeight:1.7 }}>Pick a scenario above or type a message below.<br/>The AI responds just like a real garage WhatsApp bot.</div>
                </div>
              )}
              {msgs.map((m,i)=>{
                const isUser = m.role==='user';
                return (
                  <div key={i} style={{ display:'flex', justifyContent:isUser?'flex-end':'flex-start', animation:'slideIn .3s ease' }}>
                    {!isUser && <div style={{ width:26, height:26, borderRadius:'50%', background:orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, marginRight:7, flexShrink:0, alignSelf:'flex-end' }}>🔧</div>}
                    <div style={{ maxWidth:'78%', padding:'9px 13px', borderRadius:isUser?'16px 4px 16px 16px':'4px 16px 16px 16px', background:isUser?'#025C4C':'#1F2B3E', color:isUser?'#E9FFEF':'#E8F0FF', fontSize:13, lineHeight:1.65, whiteSpace:'pre-wrap' }}>
                      {m.content}
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:4, textAlign:'right' }}>{m.time} {isUser?'✓✓':''}</div>
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div style={{ display:'flex', alignItems:'flex-end', gap:7 }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>🔧</div>
                  <div style={{ background:'#1F2B3E', borderRadius:'4px 16px 16px 16px', padding:'10px 14px', display:'flex', gap:4, alignItems:'center' }}>
                    {[0,.2,.4].map((d,i)=><span key={i} style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:green, animation:`tdot 1.2s ease-in-out ${d}s infinite` }}/>)}
                    <span style={{ fontSize:11, color:muted, marginLeft:6 }}>MECH SAFI AI typing...</span>
                  </div>
                </div>
              )}
              <div ref={endRef}/>
            </div>

            <div style={{ padding:'10px 12px', background:'#128C7E', display:'flex', gap:10, alignItems:'flex-end', flexShrink:0 }}>
              <div style={{ flex:1, background:'rgba(0,0,0,0.25)', borderRadius:24, padding:'8px 14px' }}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
                  disabled={loading} placeholder="Type as a customer..." rows={1}
                  style={{ width:'100%', background:'transparent', border:'none', color:'#fff', fontSize:13, fontFamily:font, resize:'none', lineHeight:1.5, minHeight:22, maxHeight:80, overflowY:'auto' }}
                  onInput={e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,80)+'px';}}/>
              </div>
              <button onClick={()=>send()} disabled={!input.trim()||loading} style={{ width:40, height:40, borderRadius:'50%', background:loading||!input.trim()?'rgba(255,255,255,0.2)':orange, border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {loading?'⏳':'➤'}
              </button>
            </div>
          </div>

          {/* RIGHT: GARAGE LIVE FEED */}
          <div style={{ width:300, display:'flex', flexDirection:'column', flexShrink:0 }}>
            <div style={{ padding:'8px 14px', background:'rgba(255,107,26,0.05)', borderBottom:`1px solid rgba(255,107,26,0.15)`, fontSize:11, color:orange, fontWeight:600 }}>
              🔧 GARAGE OWNER VIEW — Live incoming leads
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, padding:'10px 12px', borderBottom:`1px solid ${bd}`, flexShrink:0 }}>
              {[['💬',stats.chats,'Chats',green],['🎯',stats.leads,'Leads',orange],['📅',stats.booked,'Booked',text],['✅',leads.filter(l=>l.status==='booked').length,'Confirmed',green]].map(([ic,v,l,c],i)=>(
                <div key={i} style={{ background:surf2, borderRadius:8, padding:'9px 10px', textAlign:'center' }}>
                  <div style={{ fontFamily:display, fontSize:17, fontWeight:700, color:c }}>{v}</div>
                  <div style={{ fontSize:10, color:muted, marginTop:2 }}>{ic} {l}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:'8px 12px', borderBottom:`1px solid ${bd}`, display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:green, animation:'pulse 2s infinite' }}/>
              <div style={{ fontSize:12, color:green, fontWeight:600 }}>AI ACTIVE — Responding automatically</div>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:'9px 10px', display:'flex', flexDirection:'column', gap:7 }}>
              {leads.map((lead,i)=>(
                <div key={i+lead.id} style={{ background:surf, border:`1px solid ${bd}`, borderRadius:11, padding:'11px 12px', animation:'slideIn .4s ease' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <div style={{ fontSize:10, color:muted, fontFamily:"'Share Tech Mono',monospace" }}>{lead.id}</div>
                    <span style={{ background:`${statusColor[lead.status]}22`, color:statusColor[lead.status], padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:600 }}>
                      {lead.status==='new'?'🔔 New':lead.status==='quoted'?'📋 Quoted':'📅 Booked'}
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:text, marginBottom:5, lineHeight:1.5, fontStyle:'italic' }}>"{lead.preview}"</div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11 }}>
                    <span style={{ background:'rgba(0,207,255,0.1)', color:'#22D3EE', padding:'2px 7px', borderRadius:5 }}>{lead.tag}</span>
                    <span style={{ color:lead.kes!=='Pending'?orange:muted }}>{lead.kes}</span>
                  </div>
                  <div style={{ fontSize:10, color:muted, marginTop:6, textAlign:'right' }}>{lead.time}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:'10px 12px', borderTop:`1px solid ${bd}`, flexShrink:0 }}>
              <div style={{ background:'rgba(37,211,102,0.07)', border:'1px solid rgba(37,211,102,0.2)', borderRadius:9, padding:'9px 12px', fontSize:12, color:green, lineHeight:1.6 }}>
                💡 Every chat above is a real lead. The AI qualifies them — you only confirm bookings.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
