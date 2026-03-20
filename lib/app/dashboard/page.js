'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HABITS, FREQUENCY_META, STATUS_CONFIG, STATUS_OPTIONS, DEPT_COLORS } from '../../lib/habitData';
import { getCurrentUser, logout, getToday, saveCheckin, getCheckinsByUserDate, getHabitDueStatus } from '../../lib/storage';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [habits, setHabits]   = useState([]);
  const [checkins, setCheckins] = useState({});
  const [notes, setNotes]     = useState({});
  const [flash, setFlash]     = useState({});
  const [filter, setFilter]   = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [sopFilter, setSopFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [dueStatus, setDueStatus] = useState({}); // habitId → Done|DueSoon|Overdue|Pending|NotDue
  const today = getToday();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    const h = HABITS[u.role] || [];
    setHabits(h);
    const dc = getCheckinsByUserDate(u.uid, today);
    const sm = {}, nm = {};
    Object.values(dc).forEach(c => { sm[c.habitId]=c.status; nm[c.habitId]=c.note||''; });
    setCheckins(sm); setNotes(nm);
    // Calculate due status for non-daily habits
    const ds = {};
    h.forEach(habit => {
      if (habit.frequency !== 'Daily') {
        ds[habit.id] = getHabitDueStatus(u.uid, habit.id, habit.frequency);
      }
    });
    setDueStatus(ds);
  }, []);

  const doSave = useCallback((hId, status, note) => {
    if (!user) return;
    saveCheckin(user.uid, today, hId, status, note);
    setFlash(p => ({ ...p, [hId]: true }));
    setTimeout(() => setFlash(p => ({ ...p, [hId]: false })), 1600);
  }, [user, today]);

  function setStatus(hId, status) {
    setCheckins(p => ({ ...p, [hId]: status }));
    doSave(hId, status, notes[hId]||'');
  }
  function setNote(hId, val) {
    setNotes(p => ({ ...p, [hId]: val }));
    if (checkins[hId]) doSave(hId, checkins[hId], val);
  }

  const done    = Object.values(checkins).filter(s=>s==='Done ✅').length;
  const partial = Object.values(checkins).filter(s=>s==='Partial 🔶').length;
  const pending = Object.values(checkins).filter(s=>s==='Pending ⏳').length;
  const marked  = Object.keys(checkins).length;
  const pct = habits.length > 0 ? Math.round((done/habits.length)*100) : 0;
  const progColor = pct>=80?'green':pct>=50?'yellow':'blue';

  // Unique depts, freqs, sops for filters
  const depts = ['All', ...new Set(habits.map(h=>h.dept).filter(Boolean))];
  const freqs = ['All', ...new Set(habits.map(h=>h.frequency))];
  const sops  = ['All', ...new Set(habits.map(h=>h.sop))];

  const filtered = habits.filter(h => {
    if (filter !== 'All' && h.frequency !== filter) return false;
    if (deptFilter !== 'All' && h.dept !== deptFilter) return false;
    if (sopFilter !== 'All' && h.sop !== sopFilter) return false;
    if (search && !h.habit.toLowerCase().includes(search.toLowerCase()) && !h.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Group by dept + sop
  const grouped = {};
  filtered.forEach(h => {
    const grpKey = h.dept ? `${h.dept} — ${h.sop}` : h.sop;
    (grouped[grpKey] = grouped[grpKey]||[]).push(h);
  });

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  if (!user) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4f8' }}>
      <div style={{ width:32, height:32, border:'3px solid #2563eb', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8' }}>
      {/* NAV */}
      <nav className="nav-shadow" style={{ background:'white', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1300, margin:'0 auto', padding:'0 16px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, background:'#1e3a8a', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'white', fontWeight:900, fontSize:15 }}>C</span>
            </div>
            <div>
              <div style={{ fontSize:13.5, fontWeight:700, color:'#0f172a' }}>C Prompt Solutions</div>
              <div style={{ fontSize:10.5, color:'#94a3b8' }}>{user.dept} · Habit Tracker</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
            <button onClick={()=>router.push('/reports')} style={{ fontSize:12, padding:'5px 12px', background:'#eff6ff', color:'#2563eb', border:'none', borderRadius:9, cursor:'pointer', fontWeight:700 }}>📊 Reports</button>
            <button onClick={()=>router.push('/tasks')} style={{ fontSize:12, padding:'5px 12px', background:'#fdf4ff', color:'#7c3aed', border:'none', borderRadius:9, cursor:'pointer', fontWeight:700 }}>✅ Tasks</button>
            <button onClick={()=>router.push('/billing-calendar')} style={{ fontSize:12, padding:'5px 12px', background:'#ecfdf5', color:'#059669', border:'none', borderRadius:9, cursor:'pointer', fontWeight:700 }}>📅 Billing</button>
            {(isSuperAdmin || user.role==='INVENTORY_HEAD') && (
              <button onClick={()=>router.push('/admin')} style={{ fontSize:12, padding:'5px 12px', background:'#f5f3ff', color:'#7c3aed', border:'none', borderRadius:9, cursor:'pointer', fontWeight:700 }}>⚙️ Admin</button>
            )}
            <span style={{ fontSize:11, fontFamily:"'JetBrains Mono',monospace", background:'#dbeafe', color:'#1d4ed8', padding:'4px 10px', borderRadius:8, fontWeight:700, letterSpacing:1 }}>{user.uid}</span>
            {isSuperAdmin && <span style={{ fontSize:10, background:'#fef9c3', color:'#92400e', padding:'3px 8px', borderRadius:99, fontWeight:700 }}>👑 ADMIN</span>}
            <button onClick={()=>{ logout(); router.push('/'); }} style={{ fontSize:12, padding:'5px 9px', background:'#fff1f2', color:'#e11d48', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>Exit</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:1300, margin:'0 auto', padding:'20px 16px' }}>

        {/* HEADER */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:18 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.5px' }}>
              Good {new Date().getHours()<12?'morning':new Date().getHours()<17?'afternoon':'evening'}, {user.name.split(' ')[0]} 👋
            </h1>
            <p style={{ color:'#64748b', fontSize:12.5, margin:'4px 0 0' }}>
              {new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})} · {user.dept}
              {isSuperAdmin && <span style={{ marginLeft:6, background:'#dbeafe', color:'#1d4ed8', padding:'1px 7px', borderRadius:99, fontSize:10.5, fontWeight:700 }}>All Departments Access</span>}
            </p>
          </div>
        </div>

        {/* OVERDUE / DUE SOON ALERT BANNER */}
        {(() => {
          const overdueHabits = habits.filter(h => dueStatus[h.id] === 'Overdue');
          const dueSoonHabits = habits.filter(h => dueStatus[h.id] === 'DueSoon');
          if (!overdueHabits.length && !dueSoonHabits.length) return null;
          return (
            <div style={{ marginBottom:16, display:'flex', flexDirection:'column', gap:8 }}>
              {overdueHabits.length > 0 && (
                <div style={{ background:'#fee2e2', border:'1.5px solid #fca5a5', borderRadius:12, padding:'10px 16px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                  <span style={{ fontSize:18 }}>🔴</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#dc2626' }}>Overdue Habits ({overdueHabits.length})</div>
                    <div style={{ fontSize:11.5, color:'#991b1b', marginTop:2 }}>
                      {overdueHabits.map(h => `${h.frequency}: ${h.habit.substring(0,45)}...`).join(' · ')}
                    </div>
                  </div>
                </div>
              )}
              {dueSoonHabits.length > 0 && (
                <div style={{ background:'#fef9c3', border:'1.5px solid #fde047', borderRadius:12, padding:'10px 16px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                  <span style={{ fontSize:18 }}>⚠️</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#ca8a04' }}>Due Soon ({dueSoonHabits.length})</div>
                    <div style={{ fontSize:11.5, color:'#92400e', marginTop:2 }}>
                      {dueSoonHabits.map(h => `${h.frequency}: ${h.habit.substring(0,45)}...`).join(' · ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* STAT CARDS */}
        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12, marginBottom:18 }}>
          {[
            { cls:'stat-blue',   icon:'📋', val:habits.length, lbl:'Total Habits' },
            { cls:'stat-purple', icon:'✏️', val:marked,        lbl:'Marked Today' },
            { cls:'stat-green',  icon:'✅', val:done,          lbl:'Done' },
            { cls:'stat-yellow', icon:'🔶', val:partial,       lbl:'Partial' },
            { cls:'stat-red',    icon:'⏳', val:pending,       lbl:'Pending' },
          ].map(s=>(
            <div key={s.lbl} className={`stat-card ${s.cls} animate-in`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value animate-countUp">{s.val}</div>
              <div className="stat-label">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* PROGRESS */}
        <div className="card animate-in" style={{ padding:'16px 20px', marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div>
              <span style={{ fontSize:14, fontWeight:700, color:'#0f172a' }}>Today's Progress</span>
              <span style={{ fontSize:12, color:'#64748b', marginLeft:8 }}>{done} / {habits.length} done</span>
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:pct>=80?'#16a34a':pct>=50?'#ca8a04':'#2563eb' }}>{pct}%</div>
          </div>
          <div className="prog-track">
            <div className={`prog-fill ${progColor}`} style={{ width:`${pct}%` }}/>
          </div>
          <div style={{ display:'flex', gap:16, marginTop:10, flexWrap:'wrap' }}>
            {[['Done','#16a34a',done],['Partial','#ca8a04',partial],['Pending','#dc2626',pending],['Unmarked','#94a3b8',habits.length-marked]].map(([l,c,v])=>(
              <div key={l} style={{ fontSize:11.5, color:c, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:8, height:8, background:c, borderRadius:'50%', display:'inline-block' }}/>{l}: {v}
              </div>
            ))}
          </div>
        </div>

        {/* FILTERS */}
        <div className="card no-print animate-in" style={{ padding:'12px 16px', marginBottom:14 }}>
          <div style={{ position:'relative', marginBottom:10 }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:13 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search habits..."
              style={{ width:'100%', padding:'8px 12px 8px 32px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, outline:'none', background:'#f8fafc', fontFamily:'inherit', boxSizing:'border-box' }}
              onFocus={e=>e.target.style.borderColor='#3b82f6'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
          </div>
          {/* Dept filter (only for super admin) */}
          {isSuperAdmin && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:6 }}>
              <span style={{ fontSize:10.5, color:'#94a3b8', fontWeight:700, alignSelf:'center', marginRight:2 }}>DEPT:</span>
              {depts.map(d=>{
                const dc = DEPT_COLORS[d]||{};
                return (
                  <button key={d} onClick={()=>setDeptFilter(d)} style={{
                    padding:'3px 10px', borderRadius:99, border:'1.5px solid', fontSize:11, fontWeight:700, cursor:'pointer',
                    background:deptFilter===d?(dc.dot||'#2563eb'):'white',
                    borderColor:deptFilter===d?(dc.dot||'#2563eb'):'#e2e8f0',
                    color:deptFilter===d?'white':'#64748b', transition:'all 0.12s',
                  }}>{dc.icon} {d}</button>
                );
              })}
            </div>
          )}
          {/* Freq filter */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:6 }}>
            <span style={{ fontSize:10.5, color:'#94a3b8', fontWeight:700, alignSelf:'center', marginRight:2 }}>FREQ:</span>
            {freqs.map(f=>{
              const fm = FREQUENCY_META[f]||{};
              return (
                <button key={f} onClick={()=>setFilter(f)} style={{
                  padding:'3px 10px', borderRadius:99, border:'1.5px solid', fontSize:11, fontWeight:600, cursor:'pointer',
                  background:filter===f?(fm.color||'#2563eb'):'white',
                  borderColor:filter===f?(fm.color||'#2563eb'):'#e2e8f0',
                  color:filter===f?'white':'#64748b', transition:'all 0.12s',
                }}>{fm.icon} {f} {f!=='All'&&<span style={{opacity:0.7}}>({habits.filter(h=>h.frequency===f).length})</span>}</button>
              );
            })}
          </div>
          {/* SOP filter */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            <span style={{ fontSize:10.5, color:'#94a3b8', fontWeight:700, alignSelf:'center', marginRight:2 }}>SOP:</span>
            {sops.map(s=>(
              <button key={s} onClick={()=>setSopFilter(s)} style={{
                padding:'3px 10px', borderRadius:99, border:'1.5px solid', fontSize:11, fontWeight:600, cursor:'pointer',
                background:sopFilter===s?'#2563eb':'white', borderColor:sopFilter===s?'#2563eb':'#e2e8f0',
                color:sopFilter===s?'white':'#64748b', transition:'all 0.12s',
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* HABIT LIST grouped by dept+sop */}
        {Object.entries(grouped).map(([grp, grpHabits]) => {
          const [deptName] = grp.split(' — ');
          const dc = DEPT_COLORS[deptName] || {};
          return (
            <div key={grp} style={{ marginBottom:20 }}>
              <div className="section-header">
                {dc.dot && <span style={{ width:10, height:10, borderRadius:'50%', background:dc.dot, display:'inline-block', flexShrink:0 }}/>}
                <span className="label" style={{ color:dc.text||'#475569' }}>{grp}</span>
                <div className="line" style={{ background:`linear-gradient(90deg,${dc.dot||'#e2e8f0'},transparent)` }}/>
                <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>
                  {grpHabits.filter(h=>checkins[h.id]==='Done ✅').length}/{grpHabits.length} done
                </span>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {grpHabits.map((habit, idx) => {
                  const st = checkins[habit.id];
                  const fm = FREQUENCY_META[habit.frequency] || {};
                  const sc = STATUS_CONFIG[st] || {};
                  const deptC = DEPT_COLORS[habit.dept] || {};

                  // Due status for non-daily
                  const ds = habit.frequency === 'Daily' ? null : dueStatus[habit.id];
                  const isOverdue  = ds === 'Overdue';
                  const isDueSoon  = ds === 'DueSoon';
                  const isDone     = ds === 'Done' || st === 'Done ✅';

                  // Border color: overdue=red, due soon=yellow, else dept color
                  const borderColor = isOverdue ? '#ef4444' : isDueSoon ? '#f59e0b' : (deptC.dot||'#e2e8f0');
                  const cardBg      = isOverdue ? '#fff5f5' : isDueSoon ? '#fffbeb' : (st==='Done ✅'?'#f0fdf4': st==='Partial 🔶'?'#fffbeb': st==='Pending ⏳'?'#fff1f2': 'white');

                  return (
                    <div key={habit.id} className="card habit-row"
                      style={{ padding:'13px 15px', position:'relative', borderLeft:`3px solid ${borderColor}`, background:cardBg, border:`1px solid ${isOverdue?'#fca5a5':isDueSoon?'#fde68a':'#e2e8f0'}`, borderLeftWidth:3 }}>
                      {flash[habit.id] && <span style={{ position:'absolute', top:8, right:8, fontSize:10.5, color:'#16a34a', fontWeight:700 }}>Saved ✓</span>}
                      <div style={{ display:'flex', alignItems:'flex-start', gap:11 }}>
                        <div style={{ width:24, height:24, background:'#f1f5f9', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#94a3b8', flexShrink:0 }}>{idx+1}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:5 }}>
                            <span className="freq-pill" style={{ background:fm.bg||'#f1f5f9', color:fm.color||'#475569' }}>{fm.icon} {habit.frequency}</span>
                            <span className="sop-pill">{habit.uom}</span>
                            {habit.priority==='high' && <span style={{ fontSize:9.5, color:'#ef4444', fontWeight:700 }}>● HIGH</span>}
                            {/* Due status badge for non-daily */}
                            {isOverdue  && <span style={{ fontSize:10, padding:'2px 8px', borderRadius:99, background:'#fee2e2', color:'#dc2626', fontWeight:700, border:'1px solid #fca5a5' }}>🔴 OVERDUE</span>}
                            {isDueSoon  && !isOverdue && <span style={{ fontSize:10, padding:'2px 8px', borderRadius:99, background:'#fef9c3', color:'#ca8a04', fontWeight:700, border:'1px solid #fde047' }}>⚠️ DUE SOON</span>}
                            <span style={{ fontSize:9.5, fontFamily:"'JetBrains Mono',monospace", color:'#c4b5fd' }}>#{habit.id}</span>
                          </div>
                          <p style={{ fontSize:13, fontWeight:500, color:'#1e293b', lineHeight:1.55, marginBottom:7 }}>{habit.habit}</p>
                          <input value={notes[habit.id]||''} onChange={e=>setNote(habit.id,e.target.value)} placeholder="Add note / count..."
                            style={{ width:'100%', fontSize:12, padding:'5px 10px', border:'1px solid #e2e8f0', borderRadius:8, background:'rgba(255,255,255,0.8)', color:'#475569', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                            onFocus={e=>e.target.style.borderColor='#93c5fd'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
                        </div>
                        <div style={{ flexShrink:0, display:'flex', flexDirection:'column', gap:4 }}>
                          {STATUS_OPTIONS.map(opt=>{
                            const cfg = STATUS_CONFIG[opt];
                            const active = st===opt;
                            return (
                              <button key={opt} onClick={()=>setStatus(habit.id,opt)} className="status-btn"
                                style={{ padding:'4px 10px', borderRadius:8, border:'1.5px solid', fontSize:10.5, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap',
                                  background:active?cfg.color:'white', borderColor:active?cfg.color:'#e2e8f0',
                                  color:active?'white':'#64748b', boxShadow:active?`0 2px 8px ${cfg.color}40`:'none' }}>
                                {cfg.emoji} {cfg.short}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filtered.length===0 && (
          <div className="card" style={{ padding:48, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🔍</div>
            <p style={{ color:'#64748b', fontWeight:500 }}>No habits match your search</p>
          </div>
        )}

        <div style={{ marginTop:24, textAlign:'center', fontSize:11, color:'#cbd5e1' }}>
          C Prompt Solutions Pvt Ltd · Habit Tracker · Data auto-saved locally
        </div>
      </div>
    </div>
  );
}
