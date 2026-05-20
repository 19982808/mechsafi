import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>MECH SAFI — AI Platform for Kenyan Garages</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight:'100vh', background:'#060A14', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',sans-serif", padding:24 }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:40 }}>
          <div style={{ width:52, height:52, borderRadius:12, background:'#FF6B1A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:'0 0 30px rgba(255,107,26,0.5)' }}>🔧</div>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:32, fontWeight:700, letterSpacing:2, color:'#fff' }}>MECH<span style={{color:'#FF6B1A'}}>SAFI</span></div>
            <div style={{ fontSize:12, color:'rgba(232,240,255,0.5)', letterSpacing:2 }}>AI PLATFORM FOR KENYAN GARAGES</div>
          </div>
        </div>

        {/* Tagline */}
        <p style={{ fontSize:18, color:'rgba(232,240,255,0.6)', textAlign:'center', maxWidth:500, lineHeight:1.7, marginBottom:48 }}>
          The complete AI system for your garage — WhatsApp AI, job tracking, customer quotes, and more.
        </p>

        {/* Navigation Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, width:'100%', maxWidth:700 }}>

          <a href="/whatsapp" style={{ textDecoration:'none' }}>
            <div style={{ background:'#0D1628', border:'1px solid rgba(37,211,102,0.3)', borderRadius:18, padding:'28px 24px', cursor:'pointer', transition:'all .2s', textAlign:'center' }}
              onMouseOver={e=>e.currentTarget.style.borderColor='#25D366'}
              onMouseOut={e=>e.currentTarget.style.borderColor='rgba(37,211,102,0.3)'}>
              <div style={{ fontSize:42, marginBottom:14 }}>💬</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:'#fff', marginBottom:8 }}>WhatsApp AI Assistant</div>
              <div style={{ fontSize:13, color:'rgba(232,240,255,0.5)', lineHeight:1.6 }}>Show garage owners what their customers will experience. Live AI in Swahili & English.</div>
              <div style={{ marginTop:16, color:'#25D366', fontSize:13, fontWeight:600 }}>Open Demo →</div>
            </div>
          </a>

          <a href="/dashboard" style={{ textDecoration:'none' }}>
            <div style={{ background:'#0D1628', border:'1px solid rgba(255,107,26,0.3)', borderRadius:18, padding:'28px 24px', cursor:'pointer', transition:'all .2s', textAlign:'center' }}
              onMouseOver={e=>e.currentTarget.style.borderColor='#FF6B1A'}
              onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,107,26,0.3)'}>
              <div style={{ fontSize:42, marginBottom:14 }}>🖥️</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:'#fff', marginBottom:8 }}>Garage Dashboard</div>
              <div style={{ fontSize:13, color:'rgba(232,240,255,0.5)', lineHeight:1.6 }}>Track jobs, customers, revenue. Send WhatsApp updates. Built for Kenyan garages.</div>
              <div style={{ marginTop:16, color:'#FF6B1A', fontSize:13, fontWeight:600 }}>Open Dashboard →</div>
            </div>
          </a>

        </div>

        {/* Footer */}
        <div style={{ marginTop:56, fontSize:12, color:'rgba(232,240,255,0.25)', textAlign:'center' }}>
          🇰🇪 MECH SAFI · Proudly Kenyan-Built · Powered by Claude AI
        </div>
      </div>
    </>
  );
}
