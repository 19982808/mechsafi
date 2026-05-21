import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const S = {
  bg:'#060A14', surf:'#0D1628', surf2:'#111F3A',
  bd:'rgba(255,255,255,0.08)', orange:'#FF6B1A',
  text:'#E8F0FF', muted:'rgba(232,240,255,0.45)', red:'#EF4444',
  font:"'DM Sans',sans-serif", disp:"'Space Grotesk',sans-serif",
};

export default function Login() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const inp = {
    width:'100%', background:S.surf2, border:`1px solid ${S.bd}`,
    color:S.text, padding:'12px 14px', borderRadius:10, fontSize:14,
    fontFamily:S.font, outline:'none', transition:'border-color .2s',
  };

  const submit = async () => {
    if (!email || !password) { setError('Enter your email and password.'); return; }
    setError(''); setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Login failed.'); setLoading(false); return; }
      router.push('/dashboard');
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>MECH SAFI — Sign In</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          body{background:${S.bg};font-family:${S.font};color:${S.text};min-height:100dvh;}
          input{font-family:${S.font};color:${S.text};}
          input::placeholder{color:rgba(232,240,255,0.3);}
          input:focus{border-color:${S.orange}!important;}
          .grid-bg{position:fixed;inset:0;z-index:0;pointer-events:none;
            background-image:linear-gradient(rgba(255,107,26,0.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,107,26,0.03) 1px,transparent 1px);
            background-size:48px 48px;}
          @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          .card{animation:fadeUp .4s ease;}
        `}</style>
      </Head>

      <div className="grid-bg"/>

      <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 16px', position:'relative', zIndex:1 }}>

        <a href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', marginBottom:32 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:S.orange, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:`0 0 20px rgba(255,107,26,0.4)` }}>🔧</div>
          <span style={{ fontFamily:S.disp, fontWeight:800, fontSize:20, color:'#fff' }}>MECH<span style={{color:S.orange}}>SAFI</span></span>
        </a>

        <div className="card" style={{ background:S.surf, border:`1px solid ${S.bd}`, borderRadius:20, padding:'32px 28px', width:'100%', maxWidth:400 }}>

          <div style={{ fontFamily:S.disp, fontSize:22, fontWeight:700, marginBottom:6 }}>Welcome back 👋</div>
          <div style={{ fontSize:13, color:S.muted, marginBottom:26 }}>Sign in to your garage dashboard.</div>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:`1px solid rgba(239,68,68,0.3)`, color:S.red, padding:'10px 14px', borderRadius:9, fontSize:13, marginBottom:16 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>EMAIL ADDRESS</label>
              <input style={inp} type="email" placeholder="you@email.com" value={email}
                onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&submit()}/>
            </div>
            <div>
              <label style={{ fontSize:11, color:S.muted, fontWeight:600, display:'block', marginBottom:5 }}>PASSWORD</label>
              <input style={inp} type="password" placeholder="Your password" value={password}
                onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&submit()}/>
            </div>

            <button onClick={submit} disabled={loading} style={{ width:'100%', background:loading?'rgba(255,107,26,0.5)':S.orange, border:'none', color:'#fff', padding:'13px', borderRadius:10, fontFamily:S.disp, fontWeight:700, fontSize:14, cursor:loading?'default':'pointer', marginTop:6, boxShadow:`0 4px 20px rgba(255,107,26,0.3)`, transition:'all .2s' }}>
              {loading ? 'Signing in...' : '→ Sign In'}
            </button>
          </div>

          <div style={{ textAlign:'center', marginTop:22, fontSize:13, color:S.muted }}>
            No account? <a href="/register" style={{ color:S.orange, textDecoration:'none', fontWeight:600 }}>Register your garage →</a>
          </div>
        </div>

        <div style={{ marginTop:20, fontSize:12, color:'rgba(232,240,255,0.2)' }}>
          🇰🇪 MECH SAFI · Nairobi-built
        </div>
      </div>
    </>
  );
}
