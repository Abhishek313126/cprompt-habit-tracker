'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TEAM_MEMBERS } from '../lib/habitData';
import { setCurrentUser, getCurrentUser } from '../lib/storage';

export default function LoginPage() {
  const [uid, setUid] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (getCurrentUser()) router.push('/dashboard');
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const member = TEAM_MEMBERS.find(m => m.uid.toLowerCase() === uid.trim().toLowerCase());
    if (member) { setCurrentUser(member); router.push('/dashboard'); }
    else { setError('Invalid UID. Please check and try again.'); setLoading(false); }
  }

  return (
    <div className="login-bg" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', position:'relative', overflow:'hidden' }}>
      {/* bg orbs */}
      <div style={{ position:'absolute', top:-120, right:-120, width:400, height:400, background:'rgba(96,165,250,0.10)', borderRadius:'50%', filter:'blur(70px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:-120, left:-120, width:440, height:440, background:'rgba(99,102,241,0.08)', borderRadius:'50%', filter:'blur(90px)', pointerEvents:'none' }}/>
      {/* grid pattern */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize:'44px 44px', pointerEvents:'none' }}/>

      <div style={{ position:'relative', width:'100%', maxWidth:440 }}>
        <div style={{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(24px)', borderRadius:24, border:'1px solid rgba(255,255,255,0.12)', padding:36, boxShadow:'0 30px 60px rgba(0,0,0,0.35)' }}>

          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ width:64, height:64, background:'white', borderRadius:18, display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:14, boxShadow:'0 8px 24px rgba(0,0,0,0.18)' }}>
              <span style={{ fontSize:28, fontWeight:900, color:'#1d4ed8', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>C</span>
            </div>
            <h1 style={{ color:'white', fontSize:21, fontWeight:800, margin:0, letterSpacing:'-0.3px' }}>C Prompt Solutions</h1>
            <p style={{ color:'rgba(147,197,253,0.75)', fontSize:12.5, margin:'5px 0 0' }}>Pvt Ltd &nbsp;·&nbsp; Finance Team Habit Tracker</p>
          </div>

          <div style={{ borderTop:'1px solid rgba(255,255,255,0.10)', margin:'0 0 22px' }}/>

          {/* Stat pills — teaser */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:24 }}>
            {[
              { label:'Daily Tasks', val:'10+', bg:'rgba(219,234,254,0.12)', c:'#93c5fd' },
              { label:'Weekly',      val:'3+',  bg:'rgba(209,250,229,0.10)', c:'#6ee7b7' },
              { label:'Reports',     val:'4',   bg:'rgba(233,213,255,0.10)', c:'#c4b5fd' },
              { label:'Team UIDs',   val:'10',  bg:'rgba(254,240,138,0.10)', c:'#fde68a' },
            ].map(s => (
              <div key={s.label} style={{ background:s.bg, borderRadius:10, padding:'8px 6px', textAlign:'center' }}>
                <div style={{ fontSize:17, fontWeight:900, color:s.c }}>{s.val}</div>
                <div style={{ fontSize:9.5, color:'rgba(147,197,253,0.6)', fontWeight:600, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <h2 style={{ color:'white', fontSize:16, fontWeight:700, margin:'0 0 4px' }}>Welcome back 👋</h2>
          <p style={{ color:'rgba(147,197,253,0.65)', fontSize:12.5, margin:'0 0 18px' }}>Enter your UID to access your dashboard</p>

          <form onSubmit={handleLogin}>
            <label style={{ display:'block', color:'rgba(191,219,254,0.85)', fontSize:12, fontWeight:700, marginBottom:7, letterSpacing:'0.04em', textTransform:'uppercase' }}>Your UID</label>
            <input
              type="text" value={uid} onChange={e => setUid(e.target.value)} placeholder="e.g. CP-FA01" required
              style={{ width:'100%', background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:12, padding:'12px 16px', color:'white', fontSize:16, fontFamily:"'JetBrains Mono',monospace", letterSpacing:3, outline:'none', textTransform:'uppercase', boxSizing:'border-box' }}
            />
            {error && (
              <div style={{ background:'rgba(239,68,68,0.18)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:10, padding:'9px 14px', color:'#fca5a5', fontSize:12.5, marginTop:10 }}>
                ⚠️ {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width:'100%', background:'white', color:'#1e3a8a', fontWeight:800, fontSize:15, padding:'13px', borderRadius:13, border:'none', cursor:'pointer', marginTop:14, letterSpacing:'-0.2px', transition:'all 0.15s', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Logging in...' : 'Login to Dashboard →'}
            </button>
          </form>

          {/* UID reference */}
          <div style={{ marginTop:22, background:'rgba(255,255,255,0.05)', borderRadius:12, padding:14, border:'1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color:'rgba(147,197,253,0.55)', fontSize:10.5, fontWeight:700, margin:'0 0 10px', textTransform:'uppercase', letterSpacing:1 }}>📋 Team UIDs — click to fill</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 12px' }}>
              {TEAM_MEMBERS.map(m => (
                <div key={m.uid} onClick={() => { setUid(m.uid); setError(''); }}
                  style={{ display:'flex', justifyContent:'space-between', padding:'4px 6px', borderRadius:7, cursor:'pointer', transition:'background 0.1s' }}
                  onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                  onMouseOut={e => e.currentTarget.style.background='transparent'}>
                  <span style={{ color:'#93c5fd', fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:600 }}>{m.uid}</span>
                  <span style={{ color:'rgba(147,197,253,0.55)', fontSize:11 }}>{m.name.split(' ').slice(0,2).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p style={{ textAlign:'center', color:'rgba(147,197,253,0.25)', fontSize:10.5, marginTop:14 }}>
          © 2025 C Prompt Solutions Pvt Ltd &nbsp;·&nbsp; Internal Use Only
        </p>
      </div>
    </div>
  );
}
