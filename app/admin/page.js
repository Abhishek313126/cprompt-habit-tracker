'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TEAM_MEMBERS } from '../../lib/habitData';
import { getCurrentUser, logout, getToday, getDateNDaysAgo, getAllCheckinsInRange, exportData, importData } from '../../lib/storage';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser]   = useState(null);
  const [period, setPeriod] = useState(7);
  const [all, setAll]     = useState([]);
  const [importTxt, setImportTxt] = useState('');
  const [msg, setMsg]     = useState('');

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/'); return; }
    if (u.role !== 'ADMIN') { router.push('/dashboard'); return; }
    setUser(u);
  }, []);

  useEffect(() => {
    if (!user) return;
    setAll(getAllCheckinsInRange(getDateNDaysAgo(period-1), getToday()));
  }, [user, period]);

  function stats(uid) {
    const mc = all.filter(c=>c.uid===uid);
    const done=mc.filter(c=>c.status==='Done ✅').length;
    const partial=mc.filter(c=>c.status==='Partial 🔶').length;
    const pending=mc.filter(c=>c.status==='Pending ⏳').length;
    const total=mc.length;
    const score=total>0?Math.round((done/total)*100):0;
    return {done,partial,pending,total,score};
  }

  function doExport() {
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([exportData()],{type:'application/json'}));
    a.download=`CPrompt_AllData_${getToday()}.json`;
    a.click();
  }

  function doImport() {
    if (importData(importTxt)) { setMsg('✅ Imported!'); setImportTxt(''); setAll(getAllCheckinsInRange(getDateNDaysAgo(period-1),getToday())); }
    else setMsg('❌ Invalid JSON');
    setTimeout(()=>setMsg(''),3000);
  }

  if (!user) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4f8' }}>
      <div style={{ width:32, height:32, border:'3px solid #7c3aed', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
    </div>
  );

  const totalDone=all.filter(c=>c.status==='Done ✅').length;
  const teamScore=all.length>0?Math.round((totalDone/all.length)*100):0;

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8' }}>
      <nav className="nav-shadow" style={{ background:'white', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 16px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={()=>router.push('/dashboard')} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', fontSize:18, padding:'4px 6px' }}>←</button>
            <div style={{ width:36, height:36, background:'#7c3aed', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'white', fontWeight:900, fontSize:14 }}>⚙</span>
            </div>
            <div>
              <div style={{ fontSize:13.5, fontWeight:700, color:'#0f172a' }}>Admin Panel</div>
              <div style={{ fontSize:10.5, color:'#94a3b8' }}>Team Overview</div>
            </div>
          </div>
          <button onClick={doExport}
            style={{ fontSize:13, padding:'7px 16px', background:'#16a34a', color:'white', border:'none', borderRadius:11, cursor:'pointer', fontWeight:700 }}>
            📤 Export All Data
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'22px 16px' }}>

        {/* PERIOD */}
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {[1,7,15,30].map(d=>(
            <button key={d} onClick={()=>setPeriod(d)}
              style={{ padding:'7px 18px', borderRadius:12, fontSize:13, fontWeight:600, border:'none', cursor:'pointer',
                background: period===d?'#7c3aed':'#e2e8f0', color: period===d?'white':'#475569', transition:'all 0.12s' }}>
              {d===1?'Today':`Last ${d} Days`}
            </button>
          ))}
        </div>

        {/* STAT CARDS */}
        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:22 }}>
          {[
            { cls:'stat-purple', icon:'🏆', val:`${teamScore}%`, lbl:'Team Score' },
            { cls:'stat-green',  icon:'✅', val:totalDone,       lbl:'Total Done' },
            { cls:'stat-blue',   icon:'📊', val:all.length,      lbl:'Total Check-ins' },
          ].map(s=>(
            <div key={s.lbl} className={`stat-card ${s.cls} animate-in`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value animate-countUp">{s.val}</div>
              <div className="stat-label">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* TEAM LIST */}
        <div className="card animate-in" style={{ overflow:'hidden', marginBottom:20 }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, color:'#0f172a', fontSize:14 }}>Team Performance</span>
            <span style={{ fontSize:11.5, color:'#94a3b8' }}>Last {period} day{period>1?'s':''}</span>
          </div>
          <div style={{ padding:12, display:'flex', flexDirection:'column', gap:8 }}>
            {TEAM_MEMBERS.filter(m=>m.role!=='ADMIN').map(m=>{
              const s=stats(m.uid);
              const scoreColor=s.score>=80?'#16a34a':s.score>=50?'#ca8a04':'#dc2626';
              const fillClass=s.score>=80?'green':s.score>=50?'yellow':'red';
              return (
                <div key={m.uid} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, background:'#f8fafc', border:'1px solid #f1f5f9' }}>
                  <div style={{ width:40, height:40, background: m.color ? `${m.color}20` : '#dbeafe', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:m.color||'#1d4ed8', fontWeight:800, fontSize:16, flexShrink:0 }}>
                    {m.name.charAt(0)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{m.name}</div>
                    <div style={{ fontSize:10.5, color:'#94a3b8', fontFamily:"'JetBrains Mono',monospace" }}>{m.uid} · {m.dept}</div>
                    <div style={{ marginTop:6 }}>
                      <div className="prog-track" style={{ height:6 }}>
                        <div className={`prog-fill ${fillClass}`} style={{ width:`${s.score}%` }}/>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:14, flexShrink:0 }}>
                    {[{v:s.done,c:'#16a34a',l:'Done'},{v:s.partial,c:'#ca8a04',l:'Partial'},{v:s.pending,c:'#dc2626',l:'Pending'}].map(x=>(
                      <div key={x.l} style={{ textAlign:'center' }}>
                        <div style={{ fontSize:16, fontWeight:800, color:x.c }}>{x.v}</div>
                        <div style={{ fontSize:10, color:'#94a3b8' }}>{x.l}</div>
                      </div>
                    ))}
                    <div style={{ textAlign:'center', minWidth:48 }}>
                      <div style={{ fontSize:20, fontWeight:900, color: s.total>0?scoreColor:'#cbd5e1' }}>
                        {s.total>0?`${s.score}%`:'—'}
                      </div>
                      <div style={{ fontSize:10, color:'#94a3b8' }}>Score</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* IMPORT */}
        <div className="card animate-in" style={{ overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9' }}>
            <div style={{ fontWeight:700, color:'#0f172a', fontSize:14 }}>Import Team Data</div>
            <div style={{ fontSize:11.5, color:'#94a3b8', marginTop:3 }}>
              Ask team members to export their data → paste JSON here to merge
            </div>
          </div>
          <div style={{ padding:18 }}>
            <textarea value={importTxt} onChange={e=>setImportTxt(e.target.value)} placeholder='Paste exported JSON here...'
              style={{ width:'100%', height:110, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:12, fontFamily:"'JetBrains Mono',monospace", color:'#475569', outline:'none', resize:'none', boxSizing:'border-box' }}/>
            {msg && <div style={{ fontSize:13, fontWeight:600, color:msg.includes('✅')?'#16a34a':'#dc2626', marginTop:6 }}>{msg}</div>}
            <div style={{ display:'flex', gap:10, marginTop:12 }}>
              <button onClick={doImport} disabled={!importTxt}
                style={{ padding:'8px 18px', background:'#2563eb', color:'white', border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', opacity:importTxt?1:0.4 }}>
                Import & Merge
              </button>
              <button onClick={doExport}
                style={{ padding:'8px 18px', background:'#f1f5f9', color:'#475569', border:'none', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                Export All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
