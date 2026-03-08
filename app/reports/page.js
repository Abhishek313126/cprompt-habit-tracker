'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HABITS, FREQUENCY_META } from '../../lib/habitData';
import { getCurrentUser, getToday, getDateNDaysAgo, getCheckinsInRange } from '../../lib/storage';

const REPORT_TYPES = [
  { key:'daily',       label:'Daily',    days:1,  icon:'📅' },
  { key:'weekly',      label:'Weekly',   days:7,  icon:'📆' },
  { key:'fortnightly', label:'15-Day',   days:15, icon:'🗓️' },
  { key:'monthly',     label:'Monthly',  days:30, icon:'📊' },
];

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [report, setReport]   = useState('weekly');
  const [checkins, setCheckins] = useState([]);
  const [habits, setHabits]   = useState([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    setHabits(HABITS[u.role] || []);
  }, []);

  useEffect(() => {
    if (!user) return;
    const sel = REPORT_TYPES.find(r => r.key === report);
    setCheckins(getCheckinsInRange(user.uid, getDateNDaysAgo(sel.days-1), getToday()));
  }, [user, report]);

  function habitStats(hId) {
    const rel = checkins.filter(c => c.habitId === hId);
    const done = rel.filter(c => c.status==='Done ✅').length;
    const partial = rel.filter(c => c.status==='Partial 🔶').length;
    const pending = rel.filter(c => c.status==='Pending ⏳').length;
    const total = rel.length;
    const pct = total > 0 ? Math.round((done/total)*100) : 0;
    return { done, partial, pending, total, pct };
  }

  const totalDone = checkins.filter(c=>c.status==='Done ✅').length;
  const totalPartial = checkins.filter(c=>c.status==='Partial 🔶').length;
  const totalPending = checkins.filter(c=>c.status==='Pending ⏳').length;
  const overallPct = checkins.length > 0 ? Math.round((totalDone/checkins.length)*100) : 0;

  const byDate = {};
  checkins.forEach(c => { (byDate[c.date]=byDate[c.date]||[]).push(c); });
  const dates = Object.keys(byDate).sort().reverse();

  function download() {
    const sel = REPORT_TYPES.find(r=>r.key===report);
    const lines = [
      `C Prompt Solutions Pvt Ltd - Habit Tracker Report`,
      `Employee: ${user.name} (${user.uid}) | Period: ${sel.label}`,
      `From: ${getDateNDaysAgo(sel.days-1)} To: ${getToday()}`,
      `Overall Score: ${overallPct}% | Done: ${totalDone} | Partial: ${totalPartial} | Pending: ${totalPending}`,
      ``,
      ...habits.map(h => {
        const r = habitStats(h.id);
        return `[${h.id}] ${h.habit}\n  Done:${r.done} Partial:${r.partial} Pending:${r.pending} Score:${r.pct}%`;
      }),
    ];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], {type:'text/plain'}));
    a.download = `CPrompt_${user.uid}_${report}_${getToday()}.txt`;
    a.click();
  }

  if (!user) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4f8' }}>
      <div style={{ width:32, height:32, border:'3px solid #2563eb', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8' }}>
      {/* NAV */}
      <nav className="nav-shadow" style={{ background:'white', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 16px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={()=>router.push('/dashboard')} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', fontSize:18, padding:'4px 6px' }}>←</button>
            <div style={{ width:36, height:36, background:'#1e3a8a', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'white', fontWeight:900, fontSize:15 }}>C</span>
            </div>
            <div>
              <div style={{ fontSize:13.5, fontWeight:700, color:'#0f172a' }}>Reports</div>
              <div style={{ fontSize:10.5, color:'#94a3b8' }}>{user.name} · {user.uid}</div>
            </div>
          </div>
          <button onClick={download}
            style={{ fontSize:13, padding:'7px 16px', background:'#2563eb', color:'white', border:'none', borderRadius:11, cursor:'pointer', fontWeight:700 }}>
            ⬇️ Download Report
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'22px 16px' }}>

        {/* REPORT TYPE SELECTOR */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:22 }}>
          {REPORT_TYPES.map(r => (
            <button key={r.key} onClick={()=>setReport(r.key)}
              style={{ padding:'16px 12px', borderRadius:16, border:`2px solid ${report===r.key?'#2563eb':'#e2e8f0'}`,
                background: report===r.key ? '#eff6ff' : 'white', cursor:'pointer', textAlign:'left', transition:'all 0.15s',
                boxShadow: report===r.key ? '0 4px 14px rgba(37,99,235,0.15)' : '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{r.icon}</div>
              <div style={{ fontSize:13.5, fontWeight:700, color: report===r.key?'#1d4ed8':'#1e293b' }}>{r.label}</div>
              <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Last {r.days} day{r.days>1?'s':''}</div>
            </button>
          ))}
        </div>

        {/* SUMMARY STAT CARDS */}
        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:22 }}>
          {[
            { cls:'stat-blue',   icon:'🎯', val:`${overallPct}%`, lbl:'Overall Score' },
            { cls:'stat-green',  icon:'✅', val:totalDone,        lbl:'Done' },
            { cls:'stat-yellow', icon:'🔶', val:totalPartial,     lbl:'Partial' },
            { cls:'stat-red',    icon:'⏳', val:totalPending,     lbl:'Pending' },
          ].map(s => (
            <div key={s.lbl} className={`stat-card ${s.cls} animate-in`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value animate-countUp">{s.val}</div>
              <div className="stat-label">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* HABIT TABLE */}
        <div className="card animate-in" style={{ overflow:'hidden', marginBottom:20 }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <span style={{ fontWeight:700, color:'#0f172a', fontSize:14 }}>Habit-wise Breakdown</span>
              <span style={{ fontSize:11.5, color:'#94a3b8', marginLeft:8 }}>
                {getDateNDaysAgo(REPORT_TYPES.find(r=>r.key===report).days-1)} → {getToday()}
              </span>
            </div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {['ID','Habit','Freq','✅ Done','🔶 Partial','⏳ Pending','Score'].map(h=>(
                    <th key={h} style={{ textAlign: h==='Habit'?'left':'center' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map(h => {
                  const r = habitStats(h.id);
                  const fm = FREQUENCY_META[h.frequency] || {};
                  const fillColor = r.pct>=70?'#22c55e': r.pct>=40?'#f59e0b':'#ef4444';
                  return (
                    <tr key={h.id}>
                      <td style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:'#94a3b8' }}>{h.id}</td>
                      <td>
                        <div style={{ fontWeight:600, color:'#334155', maxWidth:320, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={h.habit}>{h.habit}</div>
                        <div style={{ fontSize:11, color:'#94a3b8' }}>{h.sop}</div>
                      </td>
                      <td style={{ textAlign:'center' }}>
                        <span className="freq-pill" style={{ background:fm.bg||'#f1f5f9', color:fm.color||'#475569' }}>
                          {fm.icon} {h.frequency}
                        </span>
                      </td>
                      <td style={{ textAlign:'center', fontWeight:700, color:'#16a34a', fontSize:15 }}>{r.done}</td>
                      <td style={{ textAlign:'center', fontWeight:700, color:'#ca8a04', fontSize:15 }}>{r.partial}</td>
                      <td style={{ textAlign:'center', fontWeight:700, color:'#dc2626', fontSize:15 }}>{r.pending}</td>
                      <td style={{ minWidth:120 }}>
                        {r.total > 0 ? (
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div className="mini-prog-track">
                              <div className="mini-prog-fill" style={{ width:`${r.pct}%`, background:fillColor }}/>
                            </div>
                            <span style={{ fontSize:12, fontWeight:700, color:fillColor, minWidth:32, textAlign:'right' }}>{r.pct}%</span>
                          </div>
                        ) : <span style={{ color:'#cbd5e1', fontSize:12 }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* DAILY LOG */}
        {dates.length > 0 && (
          <div className="card animate-in" style={{ overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9' }}>
              <span style={{ fontWeight:700, color:'#0f172a', fontSize:14 }}>Daily Activity Log</span>
            </div>
            <div style={{ padding:14, display:'flex', flexDirection:'column', gap:8 }}>
              {dates.map(date => {
                const dc = byDate[date];
                const done = dc.filter(c=>c.status==='Done ✅').length;
                const pct = Math.round((done/dc.length)*100);
                const fill = pct>=70?'green':pct>=40?'yellow':'red';
                return (
                  <div key={date} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:12, background:'#f8fafc' }}>
                    <div style={{ fontSize:12.5, fontWeight:600, color:'#475569', width:90, flexShrink:0 }}>
                      {new Date(date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',weekday:'short'})}
                    </div>
                    <div className="prog-track" style={{ flex:1, height:8 }}>
                      <div className={`prog-fill ${fill}`} style={{ width:`${pct}%` }}/>
                    </div>
                    <div style={{ display:'flex', gap:10, fontSize:12, fontWeight:600, flexShrink:0 }}>
                      <span style={{ color:'#16a34a' }}>✅ {done}</span>
                      <span style={{ color:'#ca8a04' }}>🔶 {dc.filter(c=>c.status==='Partial 🔶').length}</span>
                      <span style={{ color:'#dc2626' }}>⏳ {dc.filter(c=>c.status==='Pending ⏳').length}</span>
                      <span style={{ color:'#2563eb', fontWeight:800 }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {checkins.length === 0 && (
          <div className="card" style={{ padding:48, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>📭</div>
            <p style={{ color:'#64748b', fontWeight:600, fontSize:15 }}>No data for this period</p>
            <p style={{ color:'#94a3b8', fontSize:13, marginTop:4 }}>Start tracking habits from the dashboard!</p>
            <button onClick={()=>router.push('/dashboard')}
              style={{ marginTop:16, padding:'9px 20px', background:'#2563eb', color:'white', border:'none', borderRadius:11, fontSize:13, fontWeight:700, cursor:'pointer' }}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
