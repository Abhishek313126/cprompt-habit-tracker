'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HABITS, DEPT_COLORS } from '../../lib/habitData';
import { getCurrentUser, getToday, getDateNDaysAgo, calcStreak, getHeatmapData, getCheckinsInRange } from '../../lib/storage';
import Navbar from '../../components/Navbar';
import HeatMap from '../../components/HeatMap';
import ProgressRing from '../../components/ProgressRing';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState({ current:0, longest:0, activeDays:[] });
  const [heatmap, setHeatmap] = useState([]);
  const [habits, setHabits] = useState([]);
  const [monthStats, setMonthStats] = useState({ done:0, total:0, score:0 });
  const [sopBreakdown, setSopBreakdown] = useState([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    const h = HABITS[u.role] || [];
    setHabits(h);
    const daily = h.filter(x => x.frequency === 'Daily');
    setStreak(calcStreak(u.uid, daily));
    setHeatmap(getHeatmapData(u.uid, h));
    // 30-day stats
    const c30 = getCheckinsInRange(u.uid, getDateNDaysAgo(29), getToday());
    const done = c30.filter(c => c.status === 'Done ✅').length;
    const total = c30.length;
    setMonthStats({ done, total, score: total>0 ? Math.round(done/total*100) : 0 });
    // SOP breakdown
    const sopMap = {};
    h.forEach(hab => { if (!sopMap[hab.sop]) sopMap[hab.sop] = { habits:0, done:0, total:0 }; sopMap[hab.sop].habits++; });
    c30.forEach(c => {
      const hab = h.find(x => x.id === c.habitId);
      if (!hab) return;
      if (!sopMap[hab.sop]) sopMap[hab.sop] = { habits:0, done:0, total:0 };
      sopMap[hab.sop].total++;
      if (c.status === 'Done ✅') sopMap[hab.sop].done++;
    });
    setSopBreakdown(Object.entries(sopMap).map(([sop, s]) => ({ sop, ...s, score: s.total>0 ? Math.round(s.done/s.total*100) : 0 })));
  }, []);

  const dc = DEPT_COLORS[user?.dept] || DEPT_COLORS['F&A'];
  const medals = [
    ...(streak.current >= 7 ? ['🏅 7-Day Streak'] : []),
    ...(streak.current >= 14 ? ['🥇 14-Day Streak'] : []),
    ...(streak.longest >= 30 ? ['🏆 30-Day Champ'] : []),
    ...(monthStats.score >= 90 ? ['⭐ 90% Score'] : []),
    ...(monthStats.score >= 80 ? ['🌟 80%+ Month'] : []),
    ...(habits.length >= 15 ? ['💪 Power User'] : []),
  ];

  if (!user) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width:'32px', height:'32px', border:'3px solid #2563eb', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /></div>;

  return (
    <div style={{ minHeight:'100vh', background:'#f1f5f9' }}>
      <Navbar user={user} />
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'24px 16px' }}>

        {/* Profile card */}
        <div className="card" style={{ padding:'28px', marginBottom:'20px', background:`linear-gradient(135deg, ${dc.bg}, white)`, borderColor:dc.border }}>
          <div style={{ display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap' }}>
            <div style={{ width:'72px', height:'72px', borderRadius:'20px', background:`linear-gradient(135deg, ${dc.dot}, ${dc.dot}99)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:900, color:'white', flexShrink:0, boxShadow:`0 8px 24px ${dc.dot}40` }}>
              {user.name.charAt(0)}
            </div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontSize:'20px', fontWeight:800, color:'#0f172a', marginBottom:'4px' }}>{user.name}</h1>
              <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
                <span style={{ fontSize:'12px', fontFamily:"'JetBrains Mono', monospace", fontWeight:700, background:dc.bg, color:dc.text, padding:'3px 10px', borderRadius:'8px', border:`1px solid ${dc.border}` }}>{user.uid}</span>
                <span style={{ fontSize:'12px', color:dc.text, fontWeight:600, background:dc.bg, padding:'3px 10px', borderRadius:'8px', border:`1px solid ${dc.border}` }}>📂 {user.dept}</span>
                <span style={{ fontSize:'12px', color:'#64748b', background:'#f8fafc', padding:'3px 10px', borderRadius:'8px', border:'1px solid #e2e8f0' }}>🗓️ Joined: 2025</span>
              </div>
            </div>
            {/* Quick stats */}
            <div style={{ display:'flex', gap:'16px', flexShrink:0 }}>
              <ProgressRing pct={monthStats.score} size={72} stroke={7} color={monthStats.score>=80?'#16a34a':'#2563eb'} sublabel="30-Day" />
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', justifyContent:'center' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'24px', fontWeight:900, color:'#f59e0b' }} className={streak.current>=3?'streak-fire':''}>{streak.current}🔥</div>
                  <div style={{ fontSize:'10px', color:'#92400e', fontWeight:600 }}>Current Streak</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'20px', fontWeight:900, color:'#7c3aed' }}>🏆{streak.longest}</div>
                  <div style={{ fontSize:'10px', color:'#4c1d95', fontWeight:600 }}>Best Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Medals */}
          {medals.length > 0 && (
            <div style={{ marginTop:'16px', display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {medals.map(m => (
                <span key={m} style={{ fontSize:'12px', background:'white', border:'1px solid #fde68a', color:'#b45309', padding:'4px 10px', borderRadius:'99px', fontWeight:600 }}>{m}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
          {/* Heatmap */}
          <div className="card" style={{ padding:'20px', gridColumn:'1 / -1' }}>
            <div style={{ fontSize:'14px', fontWeight:700, color:'#0f172a', marginBottom:'4px' }}>📅 Activity Heatmap (Last 90 Days)</div>
            <div style={{ fontSize:'12px', color:'#94a3b8', marginBottom:'14px' }}>Each cell = 1 day. Blue = more done.</div>
            <HeatMap data={heatmap} />
          </div>

          {/* SOP Breakdown */}
          <div className="card" style={{ padding:'20px' }}>
            <div style={{ fontSize:'14px', fontWeight:700, color:'#0f172a', marginBottom:'14px' }}>📂 Score by Category (30 days)</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {sopBreakdown.sort((a,b) => b.score-a.score).map(s => (
                <div key={s.sop}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontSize:'12px', fontWeight:600, color:'#374151' }}>{s.sop}</span>
                    <span style={{ fontSize:'12px', fontWeight:700, color: s.score>=80?'#16a34a':s.score>=50?'#ca8a04':'#64748b' }}>
                      {s.total > 0 ? `${s.score}%` : '—'}
                    </span>
                  </div>
                  <div style={{ height:'6px', background:'#f1f5f9', borderRadius:'99px', overflow:'hidden' }}>
                    <div style={{ width:`${s.score}%`, height:'100%', background: s.score>=80?'#16a34a':s.score>=50?'#f59e0b':'#ef4444', borderRadius:'99px', transition:'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 30-day summary */}
          <div className="card" style={{ padding:'20px' }}>
            <div style={{ fontSize:'14px', fontWeight:700, color:'#0f172a', marginBottom:'14px' }}>📈 30-Day Summary</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { label:'Total Tasks', value:habits.length, icon:'📋', color:'#2563eb' },
                { label:'Total Check-ins', value:monthStats.total, icon:'📝', color:'#7c3aed' },
                { label:'Done', value:monthStats.done, icon:'✅', color:'#16a34a' },
                { label:'Active Days', value:streak.activeDays.length, icon:'📅', color:'#f59e0b' },
                { label:'Daily Habits', value:habits.filter(h=>h.frequency==='Daily').length, icon:'🔁', color:'#3b82f6' },
                { label:'Weekly Habits', value:habits.filter(h=>h.frequency==='Weekly').length, icon:'📆', color:'#10b981' },
              ].map(s => (
                <div key={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'14px' }}>{s.icon}</span>
                    <span style={{ fontSize:'13px', color:'#475569', fontWeight:500 }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize:'16px', fontWeight:800, color:s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All habits list */}
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9' }}>
            <span style={{ fontWeight:700, color:'#0f172a', fontSize:'14px' }}>📋 All My Habits ({habits.length})</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {habits.map((h, i) => {
              const fm = FREQUENCY_META?.[h.frequency] || {};
              return (
                <div key={h.id} style={{ padding:'12px 20px', borderBottom: i<habits.length-1 ? '1px solid #f8fafc' : 'none', display:'flex', alignItems:'center', gap:'12px', background: i%2===0?'white':'#fafafa' }}>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'10px', color:'#a78bfa', minWidth:'52px' }}>{h.id}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'13px', fontWeight:500, color:'#1e293b' }}>{h.habit}</div>
                    <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'2px' }}>{h.sop} · {h.uom}</div>
                  </div>
                  <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                    <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'99px', background:fm.bg||'#f1f5f9', color:fm.color||'#475569', fontWeight:600 }}>{fm.icon} {h.frequency}</span>
                    {h.priority === 'high' && <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'99px', background:'#fff1f2', color:'#dc2626', fontWeight:600, border:'1px solid #fecaca' }}>High</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
