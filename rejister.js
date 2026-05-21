import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const S = {
  bg:'#060A14', surf:'#0D1628', surf2:'#111F3A',
  bd:'rgba(255,255,255,0.08)', bd2:'rgba(255,255,255,0.18)',
  orange:'#FF6B1A', text:'#E8F0FF', muted:'rgba(232,240,255,0.45)',
  green:'#22C55E', red:'#EF4444',
  font:"'DM Sans',sans-serif", disp:"'Space Grotesk',sans-serif",
};

const LOCATIONS = ['Westlands','Industrial Area','Ngong Road','South C','Karen','Kasarani','Thika Road','Mombasa Road','Langata','Ruiru','Kikuyu','Other'];

export default function Register() {
  const router = useRouter();
  const [step, setStep]     = useState(1); // 1 = garage info, 2 = account info
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [form, setForm]     = useState({
    garageName: '', location: '', phone: '', address: '',
    ownerName: '', email: '', password: '', confirm: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inp = {
    width: '100%', background: S.surf2, border: `1px solid ${S.bd}`,
    color: S.text, padding: '12px 14px', borderRadius: 10, fontSize: 14,
    fontFamily: S.font, outline: 'none', transition: 'border-color .2s',
  };

  const nextStep = () => {
    if (!form.garageName || !form.location || !form.phone) {
      setError('Please fill in all garage details.'); return;
    }
    setError('');
    setStep(2);
  };

  const submit = async () => {
    if (!form.ownerName || !form.email || !form.password) {
      setError('Please fill in all account details.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Registration failed.'); setLoading(false); return; }
      router.push('/dashboard');
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>MECH SAFI — Register Your Garage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
          body { background:${S.bg}; font-family:${S.font}; color:${S.text}; min-height:100dvh; }
          input, select { font-family:${S.font}; color:${S.text}; }
          input::placeholder { color:rgba(232,240,255,0.3); }
          input:focus, select:focus { border-color:${S.orange} !important; }
          .grid-bg {
            position:fixed; inset:0; z-index:0; pointer-events:none;
            background-image: linear-gradient(rgba(255,107,26,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,107,26,0.03) 1px, transparent 1px);
            background-size:48px 48px;
          }
          @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          .card { animation: fadeUp .4s ease; }
          @media(max-width:500px) { .card { margin: 12px !important; padding: 24px 18px !important; } }
        `}</style>
      </Head>

      <div className="grid-bg"/>

      <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 16px', position:'relative', zIndex:1 }}>

        {/* Logo */}
        <a href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', marginBottom:32 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:S.orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:`0 0 20px rgba(255,107,26,0.4)` }}>🔧</div>
          <span style={{ fontFamily:S.disp, fontWeight:800, fontSize:20, color:'#fff' }}>MECH<span style={{color:S.orange}}>SAFI</span></span>
        </a>

        {/* Card */}
        <div className="card" style={{ background:S.surf, border:`1px solid ${S.bd}`, borderRadius:20, padding:'32px 28px', width:'100%', maxWidth:460 }}>

          {/* Step indicator */}
          <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:28 }}>
            {[1,2].map((s,i) => (
              <div key={s} style={{ display:'flex', alignItems:'center', flex:1 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:step>=s?S.orange:'rgba(255,255,255,0.07)', border:`2px solid ${step>=s?S.orange:S.bd}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, fontFamily:S.disp, color:step>=s?'#fff':S.muted, flexShrink:0, transition:'all .3s' }}>
                  {step>s?'✓':s}
                </div>
                {i===0 && <div style={{ flex:1, height:2, background:step>1?S.orange:'rgba(255,255,255,0.08)', margin:'0 8px', transition:'background .3s' }}/>}
              </div>
            ))}
          </div>

          <div style={{ fontFamily:S.disp, fontSize:22, fontWeight:700, marginBottom:6 }}>
            {step===1 ? '🔧 Your Garage' : '🔑 Your Account'}
          </div>
          <div style={{ fontSize:13, color:S.muted, marginBottom:24 }}>
            {step===1 ? 'Tell us about your garage.' : 'Create your login credentials.'}
          </div>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:`1px solid rgba(239,68,68,0.3)`, color:S.red, padding:'10px 14px', borderRadius:9, fontSize:13, marginBottom:18 }}>
              ⚠️ {error}
            </div>
          )}

          {step === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>GARAGE NAME *</label>
                <input style={inp} placeholder="e.g. Prestige Auto Centre" value={form.garageName} onChange={e=>set('garageName',e.target.value)}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>LOCATION *</label>
                <select style={{...inp}} value={form.location} onChange={e=>set('location',e.target.value)}>
                  <option value="">Select area in Nairobi...</option>
                  {LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>PHONE NUMBER *</label>
                <input style={inp} placeholder="0712 345 678" value={form.phone} onChange={e=>set('phone',e.target.value)}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>STREET ADDRESS (optional)</label>
                <input style={inp} placeholder="e.g. Ngong Road, near Shell" value={form.address} onChange={e=>set('address',e.target.value)}/>
              </div>
              <button onClick={nextStep} style={{ width:'100%', background:S.orange, border:'none', color:'#fff', padding:'13px', borderRadius:10, fontFamily:S.disp, fontWeight:700, fontSize:14, cursor:'pointer', marginTop:6, boxShadow:`0 4px 20px rgba(255,107,26,0.3)` }}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>YOUR NAME *</label>
                <input style={inp} placeholder="e.g. James Kamau" value={form.ownerName} onChange={e=>set('ownerName',e.target.value)}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>EMAIL ADDRESS *</label>
                <input style={inp} type="email" placeholder="you@email.com" value={form.email} onChange={e=>set('email',e.target.value)}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>PASSWORD *</label>
                <input style={inp} type="password" placeholder="Min. 6 characters" value={form.password} onChange={e=>set('password',e.target.value)}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>CONFIRM PASSWORD *</label>
                <input style={inp} type="password" placeholder="Repeat password" value={form.confirm} onChange={e=>set('confirm',e.target.value)}/>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:6 }}>
                <button onClick={()=>{setStep(1);setError('');}} style={{ flex:1, background:'transparent', border:`1px solid ${S.bd}`, color:S.muted, padding:'13px', borderRadius:10, fontFamily:S.font, fontSize:14, cursor:'pointer' }}>
                  ← Back
                </button>
                <button onClick={submit} disabled={loading} style={{ flex:2, background:loading?'rgba(255,107,26,0.5)':S.orange, border:'none', color:'#fff', padding:'13px', borderRadius:10, fontFamily:S.disp, fontWeight:700, fontSize:14, cursor:loading?'default':'pointer', boxShadow:`0 4px 20px rgba(255,107,26,0.3)` }}>
                  {loading ? 'Creating account...' : '✓ Register Garage'}
                </button>
              </div>
            </div>
          )}

          <div style={{ textAlign:'center', marginTop:22, fontSize:13, color:S.muted }}>
            Already registered? <a href="/login" style={{ color:S.orange, textDecoration:'none', fontWeight:600 }}>Sign in →</a>
          </div>
        </div>

        <div style={{ marginTop:20, fontSize:12, color:'rgba(232,240,255,0.2)', textAlign:'center' }}>
          🇰🇪 MECH SAFI · Your data stays private · Kenyan-built
        </div>
      </div>
    </>
  );
}
