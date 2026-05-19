import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

/* ══════════════════════════════════════
   MECH SAFI — GARAGE DASHBOARD
   Full job management + AI brain
   ══════════════════════════════════════ */

const bg='#060A14', surf='#0D1628', surf2='#111F3A', surf3='#162444';
const bd='rgba(255,255,255,0.08)', bd2='rgba(255,255,255,0.15)';
const orange='#FF6B1A', green='#22C55E', red='#EF4444';
const yellow='#F59E0B', blue='#60A5FA', purple='#A78BFA', cyan='#22D3EE';
const text='#E8F0FF', muted='rgba(232,240,255,0.52)';
const font="'Inter',sans-serif", disp="'Space Grotesk',sans-serif", mono="'Share Tech Mono',monospace";

const STATUS = {
  waiting:    { label:'Waiting',     color:yellow, bg:'rgba(245,158,11,0.12)',  emoji:'⏳' },
  in_progress:{ label:'In Progress', color:blue,   bg:'rgba(96,165,250,0.12)', emoji:'🔧' },
  ready:      { label:'Ready',       color:green,  bg:'rgba(34,197,94,0.12)',  emoji:'✅' },
  completed:  { label:'Completed',   color:'#6B7280',bg:'rgba(107,114,128,0.1)',emoji:'✓' },
  on_hold:    { label:'On Hold',     color:red,    bg:'rgba(239,68,68,0.12)',  emoji:'⏸' },
};
const MECHS = ['Peter M.','John K.','David O.','Grace W.','Samuel T.'];
const NAV = [
  { id:'overview',  icon:'⬡', label:'Overview'  },
  { id:'jobs',      icon:'🔧', label:'Jobs'      },
  { id:'customers', icon:'👥', label:'Customers' },
  { id:'revenue',   icon:'📊', label:'Revenue'   },
  { id:'ai',        icon:'🧠', label:'AI Brain'  },
];

const J0 = [
  { id:'J001', plate:'KCA 078G', car:'Toyota Prius 2014',    customer:'James Kariuki', phone:'0712 345 678', problem:'Hybrid warning light — car losing power',    status:'in_progress', mechanic:'Peter M.', estKES:18000, dateIn:'2025-05-10', dateEst:'2025-05-13', notes:'HV battery cells degraded. Reconditioning underway.' },
  { id:'J002', plate:'KDB 421K', car:'Mercedes C200 2019',   customer:'Grace Wanjiku', phone:'0722 891 234', problem:"Smart key not detected — won't push start",   status:'waiting',     mechanic:'John K.',  estKES:8500,  dateIn:'2025-05-12', dateEst:'2025-05-14', notes:'Key fob antenna module suspect.' },
  { id:'J003', plate:'KBZ 999P', car:'Subaru Forester 2012', customer:'Samuel Omondi', phone:'0700 112 233', problem:'Clutch slipping badly on hills',              status:'in_progress', mechanic:'David O.', estKES:32000, dateIn:'2025-05-09', dateEst:'2025-05-14', notes:'Full clutch kit ordered. Flywheel checked OK.' },
  { id:'J004', plate:'KDG 344B', car:'Toyota Hilux 2016',    customer:'Fatuma Hassan', phone:'0733 445 566', problem:'Full service + brake check',                  status:'ready',       mechanic:'Grace W.', estKES:12000, dateIn:'2025-05-11', dateEst:'2025-05-13', notes:'Service done. Rear brake pads replaced.' },
  { id:'J005', plate:'KCF 782A', car:'Nissan X-Trail 2015',  customer:'Peter Kamau',   phone:'0745 667 788', problem:'AC not cooling — warm air only',              status:'on_hold',     mechanic:'Samuel T.',estKES:14000, dateIn:'2025-05-08', dateEst:'2025-05-15', notes:'Waiting for AC compressor from supplier.' },
  { id:'J006', plate:'KDA 133C', car:'BMW 320i 2017',        customer:'James Kariuki', phone:'0712 345 678', problem:'Engine oil leak + OBD code P0171',            status:'completed',   mechanic:'Peter M.', estKES:22000, dateIn:'2025-05-05', dateEst:'2025-05-07', notes:'Valve cover gasket done. P0171 cleared. Paid.' },
];

const CUSTS0 = [
  { id:'C001', name:'James Kariuki', phone:'0712 345 678', cars:['Toyota Prius 2014','BMW 320i 2017'],   totalKES:185000, jobs:8, location:'Westlands', clr:orange },
  { id:'C002', name:'Grace Wanjiku', phone:'0722 891 234', cars:['Mercedes C200 2019'],                  totalKES:230000, jobs:5, location:'Karen',     clr:purple },
  { id:'C003', name:'Samuel Omondi', phone:'0700 112 233', cars:['Subaru Forester 2012'],                totalKES:65000,  jobs:3, location:'Eastlands', clr:blue   },
  { id:'C004', name:'Fatuma Hassan', phone:'0733 445 566', cars:['Toyota Hilux 2016'],                   totalKES:48000,  jobs:4, location:'South C',   clr:cyan   },
  { id:'C005', name:'Peter Kamau',   phone:'0745 667 788', cars:['Nissan X-Trail 2015'],                 totalKES:92000,  jobs:6, location:'Kasarani',  clr:green  },
];

const REV_MONTHS = ['Dec','Jan','Feb','Mar','Apr','May'];
const REV_DATA   = [285000,360000,298000,445000,388000,186000];

const AI_SYS = `You are MECH SAFI's built-in AI mechanic. Expert in all vehicles in Kenya — Toyota, Nissan, Subaru, Honda, Mitsubishi, Isuzu, Mercedes, BMW, Audi, VW, Lexus, Land Rover, Kia, Hyundai. Covers: engines, gearboxes, hybrid/EV systems, smart key systems, brakes, suspension, electrical, AC, body & paint. Give realistic KES prices for Nairobi. Respond in English or Swahili based on the user. Be direct and structured.`;

function fKES(n){ return 'KES '+Number(n).toLocaleString(); }
function daysAgo(d){ return Math.max(0,Math.floor((Date.now()-new Date(d))/86400000)); }
function genID(){ return 'J'+String(Math.floor(Math.random()*9000)+1000); }

function Badge({ s }){
  const st = STATUS[s]||STATUS.waiting;
  return <span style={{ background:st.bg, color:st.color, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, whiteSpace:'nowrap' }}>{st.emoji} {st.label}</span>;
}

function Stat({ icon, label, value, sub, color=orange }){
  return (
    <div style={{ background:surf, border:`1px solid ${bd}`, borderRadius:14, padding:'16px 16px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:color }}/>
      <div style={{ fontSize:22, marginBottom:7 }}>{icon}</div>
      <div style={{ fontFamily:disp, fontSize:26, fontWeight:700, color:text, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:muted, marginTop:4 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color, marginTop:4, fontWeight:500 }}>{sub}</div>}
    </div>
  );
}

function AddModal({ onAdd, onClose }){
  const [f,setF]=useState({ plate:'',car:'',customer:'',phone:'',problem:'',mechanic:MECHS[0],estKES:'',dateEst:'' });
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const inp={ background:surf3, border:`1px solid ${bd}`, color:text, padding:'9px 12px', borderRadius:8, fontSize:12.5, fontFamily:font, width:'100%', outline:'none' };
  const submit=()=>{ if(!f.plate||!f.car||!f.customer||!f.problem)return; onAdd({...f,id:genID(),status:'waiting',dateIn:new Date().toISOString().split('T')[0],estKES:Number(f.estKES)||0,notes:''}); onClose(); };
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:surf, border:`1px solid ${bd2}`, borderRadius:18, padding:24, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div style={{ fontFamily:disp, fontSize:16, fontWeight:700 }}>🔧 Add New Job</div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'none', color:muted, width:28, height:28, borderRadius:'50%', cursor:'pointer', fontSize:14 }}>✕</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}><label style={{ fontSize:10, color:muted, fontWeight:600 }}>PLATE *</label><input style={inp} placeholder="KCA 123A" value={f.plate} onChange={e=>set('plate',e.target.value.toUpperCase())}/></div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}><label style={{ fontSize:10, color:muted, fontWeight:600 }}>CAR *</label><input style={inp} placeholder="Toyota Hilux 2016" value={f.car} onChange={e=>set('car',e.target.value)}/></div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}><label style={{ fontSize:10, color:muted, fontWeight:600 }}>CUSTOMER *</label><input style={inp} placeholder="John Kamau" value={f.customer} onChange={e=>set('customer',e.target.value)}/></div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}><label style={{ fontSize:10, color:muted, fontWeight:600 }}>PHONE</label><input style={inp} placeholder="0712 345 678" value={f.phone} onChange={e=>set('phone',e.target.value)}/></div>
          <div style={{ gridColumn:'1/-1', display:'flex', flexDirection:'column', gap:4 }}><label style={{ fontSize:10, color:muted, fontWeight:600 }}>PROBLEM *</label><textarea style={{...inp,minHeight:65,resize:'vertical'}} placeholder="What is wrong with the car?" value={f.problem} onChange={e=>set('problem',e.target.value)}/></div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}><label style={{ fontSize:10, color:muted, fontWeight:600 }}>MECHANIC</label><select style={inp} value={f.mechanic} onChange={e=>set('mechanic',e.target.value)}>{MECHS.map(m=><option key={m}>{m}</option>)}</select></div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}><label style={{ fontSize:10, color:muted, fontWeight:600 }}>ESTIMATE KES</label><input style={inp} type="number" placeholder="15000" value={f.estKES} onChange={e=>set('estKES',e.target.value)}/></div>
          <div style={{ gridColumn:'1/-1', display:'flex', flexDirection:'column', gap:4 }}><label style={{ fontSize:10, color:muted, fontWeight:600 }}>READY DATE</label><input style={inp} type="date" value={f.dateEst} onChange={e=>set('dateEst',e.target.value)}/></div>
        </div>
        <div style={{ display:'flex', gap:9, marginTop:16 }}>
          <button onClick={onClose} style={{ flex:1, background:'transparent', border:`1px solid ${bd}`, color:muted, padding:11, borderRadius:9, cursor:'pointer', fontFamily:font, fontSize:13 }}>Cancel</button>
          <button onClick={submit} style={{ flex:2, background:orange, border:'none', color:'#fff', padding:11, borderRadius:9, cursor:'pointer', fontFamily:disp, fontWeight:700, fontSize:13 }}>✓ Add Job</button>
        </div>
      </div>
    </div>
  );
}

function Overview({ jobs, setSection, setShowAdd }){
  const active = jobs.filter(j=>j.status!=='completed');
  const ready  = jobs.filter(j=>j.status==='ready');
  const recent = [...jobs].sort((a,b)=>new Date(b.dateIn)-new Date(a.dateIn)).slice(0,5);
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div><div style={{ fontFamily:disp, fontSize:20, fontWeight:700 }}>Good morning 👋</div><div style={{ fontSize:13, color:muted, marginTop:2 }}>Here's what's happening at your garage today</div></div>
        <button onClick={()=>setShowAdd(true)} style={{ background:orange, border:'none', color:'#fff', padding:'10px 18px', borderRadius:10, cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:disp }}>+ Add New Job</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        <Stat icon="🔧" label="Active Jobs"      value={active.length}  sub="In garage now"     color={orange}/>
        <Stat icon="✅" label="Ready for Pickup" value={ready.length}   sub={ready.length>0?"Call customers!":""} color={green}/>
        <Stat icon="👥" label="Total Customers"  value={CUSTS0.length}  sub="In database"       color={blue}/>
        <Stat icon="💰" label="Revenue This Mth" value="KES 186k"       sub="↑ 12% vs last month" color={purple}/>
      </div>
      <div style={{ background:surf, border:`1px solid ${bd}`, borderRadius:14, overflow:'hidden', marginBottom:18 }}>
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${bd}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:disp, fontSize:14, fontWeight:600 }}>Recent Jobs</div>
          <button onClick={()=>setSection('jobs')} style={{ background:'transparent', border:'none', color:orange, cursor:'pointer', fontSize:13, fontFamily:font }}>View all →</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'rgba(255,255,255,0.02)' }}>{['Plate','Car','Customer','Status','KES'].map(h=><th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:10.5, color:muted, fontWeight:600, whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>{recent.map((j,i)=>(
              <tr key={j.id} style={{ borderTop:`1px solid ${bd}`, background:i%2?'rgba(255,255,255,0.01)':'transparent' }}>
                <td style={{ padding:'10px 14px', fontFamily:mono, fontSize:12, color:cyan }}>{j.plate}</td>
                <td style={{ padding:'10px 14px', fontSize:12.5, whiteSpace:'nowrap' }}>{j.car}</td>
                <td style={{ padding:'10px 14px', fontSize:12.5, color:muted }}>{j.customer}</td>
                <td style={{ padding:'10px 14px' }}><Badge s={j.status}/></td>
                <td style={{ padding:'10px 14px', fontFamily:mono, fontSize:12, color:orange }}>{fKES(j.estKES)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Jobs({ jobs, setJobs, setShowAdd }){
  const [filter,setFilter]=useState('all');
  const [search,setSearch]=useState('');
  const [detail,setDetail]=useState(null);
  const filtered = jobs.filter(j=>{
    const ms = filter==='all'||j.status===filter;
    const q  = search.toLowerCase();
    const mq = !q||j.plate.toLowerCase().includes(q)||j.car.toLowerCase().includes(q)||j.customer.toLowerCase().includes(q);
    return ms&&mq;
  });
  const updateStatus=(id,s)=>{ setJobs(p=>p.map(j=>j.id===id?{...j,status:s}:j)); setDetail(p=>p?{...p,status:s}:p); };
  const sendWA=(j)=>{
    const msgs={ready:`Habari ${j.customer}! Gari yako *${j.car}* (${j.plate}) iko *tayari kuchukua* 🎉\nBei: *${fKES(j.estKES)}*\nAsante — MECH SAFI 🔧`,in_progress:`Habari ${j.customer}! Mechanic anafanya kazi kwa gari yako *${j.car}*. Tutakuarifu. — MECH SAFI`,on_hold:`Habari ${j.customer}! Tunasubiri spare part kwa gari yako. Tutakupigia. — MECH SAFI`};
    const msg=msgs[j.status]||`Habari ${j.customer}! Update kuhusu gari yako ${j.car}. Wasiliana nasi. — MECH SAFI`;
    window.open(`https://wa.me/${j.phone.replace(/\D/g,'').replace(/^0/,'254')}?text=${encodeURIComponent(msg)}`,'_blank');
  };
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ fontFamily:disp, fontSize:18, fontWeight:700 }}>All Jobs <span style={{ fontSize:13, color:muted, fontWeight:400 }}>({jobs.length})</span></div>
        <button onClick={()=>setShowAdd(true)} style={{ background:orange, border:'none', color:'#fff', padding:'9px 16px', borderRadius:9, cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:disp }}>+ Add Job</button>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search plate, car, customer..." style={{ flex:1, minWidth:160, background:surf, border:`1px solid ${bd}`, color:text, padding:'8px 13px', borderRadius:8, fontSize:13, fontFamily:font, outline:'none' }}/>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {['all','waiting','in_progress','ready','on_hold','completed'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?orange:'transparent', border:`1px solid ${filter===f?orange:bd}`, color:filter===f?'#fff':muted, padding:'7px 12px', borderRadius:7, cursor:'pointer', fontSize:11, fontFamily:font, whiteSpace:'nowrap' }}>
              {f==='all'?'All':STATUS[f]?.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {filtered.map(j=>(
          <div key={j.id} onClick={()=>setDetail(j)} style={{ background:surf, border:`1px solid ${bd}`, borderRadius:13, padding:'14px 16px', cursor:'pointer', transition:'all .2s' }}
            onMouseOver={e=>e.currentTarget.style.borderColor=bd2} onMouseOut={e=>e.currentTarget.style.borderColor=bd}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:mono, fontSize:12, color:cyan, background:'rgba(34,211,238,0.08)', padding:'2px 7px', borderRadius:5 }}>{j.plate}</span>
                  <span style={{ fontFamily:disp, fontSize:13.5, fontWeight:600 }}>{j.car}</span>
                  <Badge s={j.status}/>
                </div>
                <div style={{ fontSize:12.5, color:muted, marginBottom:3 }}>👤 {j.customer} · 🔧 {j.mechanic} · 📅 {daysAgo(j.dateIn)}d ago</div>
                <div style={{ fontSize:12.5, color:text }}>{j.problem}</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:disp, fontSize:15, fontWeight:700, color:orange }}>{fKES(j.estKES)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {detail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'flex-end' }}>
          <div style={{ background:surf, width:'100%', maxWidth:400, height:'100%', overflowY:'auto', padding:22, borderLeft:`1px solid ${bd2}`, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontFamily:disp, fontSize:15, fontWeight:700 }}>Job Details</div>
              <button onClick={()=>setDetail(null)} style={{ background:'rgba(255,255,255,0.07)', border:'none', color:muted, width:28, height:28, borderRadius:'50%', cursor:'pointer', fontSize:14 }}>✕</button>
            </div>
            <div style={{ background:surf2, borderRadius:11, padding:14 }}>
              <div style={{ fontFamily:mono, fontSize:12, color:cyan, marginBottom:5 }}>{detail.plate}</div>
              <div style={{ fontFamily:disp, fontSize:16, fontWeight:700, marginBottom:6 }}>{detail.car}</div>
              <Badge s={detail.status}/>
            </div>
            {[['👤 Customer',detail.customer],['📱 Phone',detail.phone],['🔧 Mechanic',detail.mechanic],['📅 Date In',detail.dateIn],['💰 Estimate',fKES(detail.estKES)]].map(([l,v])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${bd}`, fontSize:12.5 }}>
                <span style={{ color:muted }}>{l}</span><span style={{ color:text, fontWeight:500 }}>{v}</span>
              </div>
            ))}
            <div style={{ background:surf2, borderRadius:9, padding:11, fontSize:12.5, color:text, lineHeight:1.6 }}>{detail.problem}</div>
            <div>
              <div style={{ fontSize:10, color:muted, marginBottom:7, fontWeight:600 }}>UPDATE STATUS</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {Object.entries(STATUS).map(([k,v])=>(
                  <button key={k} onClick={()=>updateStatus(detail.id,k)} style={{ background:detail.status===k?v.bg:'transparent', border:`1px solid ${detail.status===k?v.color:bd}`, color:detail.status===k?v.color:muted, padding:'5px 11px', borderRadius:7, cursor:'pointer', fontSize:11, fontFamily:font }}>
                    {v.emoji} {v.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={()=>sendWA(detail)} style={{ background:green, border:'none', color:'#fff', padding:11, borderRadius:10, cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:disp }}>
              💬 WhatsApp Customer Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Customers({ jobs }){
  const [sel,setSel]=useState(null);
  return (
    <div>
      <div style={{ fontFamily:disp, fontSize:18, fontWeight:700, marginBottom:18 }}>Customers</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
        {CUSTS0.map(c=>(
          <div key={c.id} onClick={()=>setSel(sel?.id===c.id?null:c)} style={{ background:surf, border:`1px solid ${sel?.id===c.id?c.clr:bd}`, borderRadius:14, padding:'16px 16px', cursor:'pointer', transition:'all .2s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:42, height:42, borderRadius:'50%', background:`${c.clr}22`, border:`2px solid ${c.clr}55`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:disp, fontSize:13, fontWeight:700, color:c.clr, flexShrink:0 }}>{c.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
              <div><div style={{ fontFamily:disp, fontSize:14, fontWeight:600 }}>{c.name}</div><div style={{ fontSize:11.5, color:muted }}>{c.location} · {c.phone}</div></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, borderTop:`1px solid ${bd}`, paddingTop:11 }}>
              {[['Jobs',c.jobs],['Spent',fKES(c.totalKES)],['Cars',c.cars.length]].map(([l,v])=>(
                <div key={l} style={{ textAlign:'center' }}><div style={{ fontFamily:disp, fontSize:14, fontWeight:700, color:c.clr }}>{v}</div><div style={{ fontSize:10, color:muted, marginTop:2 }}>{l}</div></div>
              ))}
            </div>
            {sel?.id===c.id && (
              <div style={{ marginTop:12, borderTop:`1px solid ${bd}`, paddingTop:12 }}>
                {c.cars.map((car,i)=><div key={i} style={{ fontSize:12, color:text, padding:'3px 0' }}>🚗 {car}</div>)}
                <a href={`https://wa.me/${c.phone.replace(/\D/g,'').replace(/^0/,'254')}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ display:'block', marginTop:10, textAlign:'center', background:green, color:'#fff', padding:'8px', borderRadius:8, fontSize:12, fontWeight:700, fontFamily:disp, textDecoration:'none' }}>
                  💬 WhatsApp {c.name.split(' ')[0]}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Revenue(){
  const maxR = Math.max(...REV_DATA);
  const total = REV_DATA.reduce((a,b)=>a+b,0);
  return (
    <div>
      <div style={{ fontFamily:disp, fontSize:18, fontWeight:700, marginBottom:18 }}>Revenue Overview</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12, marginBottom:20 }}>
        <Stat icon="💰" label="This Month"     value={fKES(REV_DATA[REV_DATA.length-1])} color={orange}/>
        <Stat icon="📈" label="Last 6 Months"  value={fKES(total)}                        color={green}/>
        <Stat icon="⏳" label="Pending Jobs"    value="KES 54k"                            color={yellow}/>
        <Stat icon="✅" label="Jobs Completed"  value="6"                                  color={purple}/>
      </div>
      <div style={{ background:surf, border:`1px solid ${bd}`, borderRadius:14, padding:'18px 18px', marginBottom:16 }}>
        <div style={{ fontFamily:disp, fontSize:13, fontWeight:600, marginBottom:18 }}>Monthly Revenue (KES)</div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:140 }}>
          {REV_DATA.map((r,i)=>{
            const h=Math.round((r/maxR)*120);
            const isLast=i===REV_DATA.length-1;
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                <div style={{ fontSize:10, color:muted }}>{r>=100000?Math.round(r/1000)+'k':r}</div>
                <div style={{ width:'100%', height:h, background:isLast?orange:'rgba(255,107,26,0.3)', borderRadius:'5px 5px 0 0' }}/>
                <div style={{ fontSize:10, color:isLast?orange:muted, fontFamily:mono }}>{REV_MONTHS[i]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AIBrain(){
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs,loading]);
  const send=async(text)=>{
    const t=(text||input).trim();
    if(!t||loading)return;
    setInput('');
    const next=[...msgs,{role:'user',content:t}];
    setMsgs(next);
    setLoading(true);
    try {
      const r=await fetch('/api/chat',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ system:AI_SYS, messages:next, max_tokens:1000 }) });
      const d=await r.json();
      setMsgs(p=>[...p,{role:'assistant',content:d.content?.[0]?.text||'⚠️ No response.'}]);
    } catch { setMsgs(p=>[...p,{role:'assistant',content:'⚠️ Connection error.'}]); }
    setLoading(false);
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 200px)', minHeight:380 }}>
      <div style={{ fontFamily:disp, fontSize:18, fontWeight:700, marginBottom:14 }}>🧠 AI Mechanic Brain</div>
      {msgs.length===0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:14 }}>
          {['Toyota Prius hybrid battery problem','Mercedes C200 push start not working','P0300 fault code on Hilux','Cost to replace clutch — Subaru Forester'].map((q,i)=>(
            <button key={i} onClick={()=>send(q)} style={{ background:surf, border:`1px solid ${bd}`, color:muted, padding:'7px 13px', borderRadius:20, cursor:'pointer', fontSize:12, fontFamily:font, transition:'all .2s' }}
              onMouseOver={e=>e.currentTarget.style.borderColor=orange} onMouseOut={e=>e.currentTarget.style.borderColor=bd}>{q}</button>
          ))}
        </div>
      )}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:11, paddingBottom:10 }}>
        {msgs.map((m,i)=>{
          const isUser=m.role==='user';
          return (
            <div key={i} style={{ display:'flex', justifyContent:isUser?'flex-end':'flex-start' }}>
              {!isUser&&<div style={{ width:30, height:30, borderRadius:'50%', background:`${orange}22`, border:`1px solid ${orange}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, marginRight:8, flexShrink:0 }}>🔧</div>}
              <div style={{ maxWidth:'80%', padding:'10px 14px', fontSize:13, lineHeight:1.65, whiteSpace:'pre-wrap', fontFamily:font, borderRadius:isUser?'14px 14px 4px 14px':'14px 14px 14px 4px', background:isUser?orange:'rgba(255,255,255,0.05)', color:isUser?'#fff':text, border:isUser?'none':`1px solid ${bd}` }}>{m.content}</div>
            </div>
          );
        })}
        {loading&&(
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:`${orange}22`, border:`1px solid ${orange}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🔧</div>
            <div style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${bd}`, borderRadius:'14px 14px 14px 4px', padding:'11px 15px', display:'flex', gap:4 }}>
              {[0,.2,.4].map((d,i)=><span key={i} style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:orange, animation:`tdot 1.2s ease-in-out ${d}s infinite` }}/>)}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{ display:'flex', gap:8, background:surf, border:`1px solid ${bd}`, borderRadius:11, padding:'7px 7px 7px 13px' }}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} disabled={loading}
          placeholder="Ask about any car problem, OBD code, or KES repair cost..." rows={1}
          style={{ flex:1, background:'transparent', border:'none', color:text, fontSize:13, fontFamily:font, resize:'none', lineHeight:1.5, padding:'5px 0', minHeight:30, maxHeight:100, overflowY:'auto', outline:'none' }}
          onInput={e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,100)+'px';}}/>
        <button onClick={()=>send()} disabled={!input.trim()||loading} style={{ background:input.trim()&&!loading?orange:'rgba(255,255,255,0.06)', border:'none', color:input.trim()&&!loading?'#fff':muted, width:36, height:36, borderRadius:8, cursor:'pointer', fontSize:16, flexShrink:0 }}>↑</button>
      </div>
    </div>
  );
}

export default function Dashboard(){
  const [section,setSection]=useState('overview');
  const [jobs,setJobs]=useState(J0);
  const [showAdd,setShowAdd]=useState(false);
  const active=jobs.filter(j=>j.status!=='completed').length;
  const ready=jobs.filter(j=>j.status==='ready').length;
  const addJob=(job)=>{ setJobs(p=>[job,...p]); };
  return (
    <>
      <Head>
        <title>MECH SAFI — Garage Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0;}
          body{background:${bg};font-family:${font};}
          ::-webkit-scrollbar{width:3px;}
          ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px;}
          input,textarea,select{font-family:${font};color:${text};}
          input::placeholder,textarea::placeholder{color:rgba(232,240,255,.35);}
          @keyframes tdot{0%,80%,100%{transform:scale(.7);opacity:.4}40%{transform:scale(1.1);opacity:1}}
        `}</style>
      </Head>
      <div style={{ display:'flex', height:'100vh', color:text, overflow:'hidden' }}>
        <aside style={{ width:190, background:surf, borderRight:`1px solid ${bd}`, display:'flex', flexDirection:'column', flexShrink:0 }}>
          <div style={{ padding:'16px 14px', borderBottom:`1px solid ${bd}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:7, background:orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🔧</div>
              <div style={{ fontFamily:disp, fontWeight:700, fontSize:14 }}>MECH<span style={{color:orange}}>SAFI</span></div>
            </div>
          </div>
          <div style={{ padding:'10px 10px', borderBottom:`1px solid ${bd}`, display:'flex', gap:5, flexWrap:'wrap' }}>
            {active>0&&<span style={{ background:'rgba(96,165,250,0.15)', color:blue, padding:'3px 8px', borderRadius:20, fontSize:10, fontWeight:600 }}>🔧 {active} active</span>}
            {ready>0&&<span style={{ background:'rgba(34,197,94,0.15)', color:green, padding:'3px 8px', borderRadius:20, fontSize:10, fontWeight:600 }}>✅ {ready} ready</span>}
          </div>
          <nav style={{ flex:1, padding:'8px 8px' }}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setSection(n.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:9, background:section===n.id?`rgba(255,107,26,0.1)`:'transparent', border:section===n.id?`1px solid rgba(255,107,26,0.25)`:'1px solid transparent', color:section===n.id?orange:muted, padding:'9px 11px', borderRadius:8, cursor:'pointer', fontSize:13, fontFamily:font, fontWeight:section===n.id?600:400, marginBottom:3, textAlign:'left', transition:'all .18s' }}>
                <span style={{ fontSize:14 }}>{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>
          <div style={{ padding:'12px 14px', borderTop:`1px solid ${bd}`, fontSize:11, color:muted }}>
            <a href="/" style={{ color:muted, textDecoration:'none' }}>← Back to Home</a>
          </div>
        </aside>
        <main style={{ flex:1, overflowY:'auto', padding:'22px 22px' }}>
          {section==='overview'  && <Overview  jobs={jobs} setSection={setSection} setShowAdd={setShowAdd}/>}
          {section==='jobs'      && <Jobs      jobs={jobs} setJobs={setJobs} setShowAdd={setShowAdd}/>}
          {section==='customers' && <Customers jobs={jobs}/>}
          {section==='revenue'   && <Revenue/>}
          {section==='ai'        && <AIBrain/>}
        </main>
        {showAdd && <AddModal onAdd={addJob} onClose={()=>setShowAdd(false)}/>}
      </div>
    </>
  );
}
