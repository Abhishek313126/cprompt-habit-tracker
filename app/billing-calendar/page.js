'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/storage';

// ── Billing Calendar Storage ──────────────────────────────────────────────────
function getBillingEvents() {
  try { return JSON.parse(localStorage.getItem('cprompt_billing') || '[]'); } catch { return []; }
}
function saveBillingEvents(events) {
  localStorage.setItem('cprompt_billing', JSON.stringify(events));
}

const CYCLE_CONFIG = {
  Monthly:     { color: '#2563eb', bg: '#dbeafe', label: 'Monthly',    icon: '🔵' },
  Quarterly:   { color: '#7c3aed', bg: '#ede9fe', label: 'Quarterly',  icon: '🟣' },
  Annual:      { color: '#0891b2', bg: '#cffafe', label: 'Annual',     icon: '🩵' },
  'One-time':  { color: '#64748b', bg: '#f1f5f9', label: 'One-time',   icon: '⚪' },
};

const STATUS_CFG = {
  Pending:  { color: '#dc2626', bg: '#fee2e2', icon: '⏳' },
  Invoiced: { color: '#ca8a04', bg: '#fef9c3', icon: '📄' },
  Paid:     { color: '#16a34a', bg: '#dcfce7', icon: '✅' },
};

const TEAM_NAMES = [
  'Laxman Ambati', 'Aaryan Sharma', 'Laxman Sharma', 'Prashanth', 'Manoj', 'Satish', 'Kiran'
];

const EMPTY_FORM = {
  customer: '', amount: '', billingDate: '', cycle: 'Monthly', owner: '', status: 'Pending', notes: ''
};

export default function BillingCalendarPage() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [events, setEvents]   = useState([]);
  const [month, setMonth]     = useState(new Date().getMonth());
  const [year, setYear]       = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [editId, setEditId]   = useState(null);
  const [selDay, setSelDay]   = useState(null);
  const [filterOwner, setFilterOwner] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCycle, setFilterCycle]   = useState('All');

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    setEvents(getBillingEvents());
  }, []);

  function saveEvent() {
    if (!form.customer || !form.billingDate) return;
    let updated;
    if (editId) {
      updated = events.map(e => e.id === editId ? { ...form, id: editId } : e);
    } else {
      updated = [...events, { ...form, id: Date.now().toString() }];
    }
    saveBillingEvents(updated);
    setEvents(updated);
    setForm(EMPTY_FORM);
    setShowForm(false);
    setEditId(null);
  }

  function deleteEvent(id) {
    const updated = events.filter(e => e.id !== id);
    saveBillingEvents(updated);
    setEvents(updated);
  }

  function startEdit(ev) {
    setForm({ customer:ev.customer, amount:ev.amount, billingDate:ev.billingDate, cycle:ev.cycle, owner:ev.owner, status:ev.status, notes:ev.notes||'' });
    setEditId(ev.id);
    setShowForm(true);
  }

  function updateStatus(id, status) {
    const updated = events.map(e => e.id === id ? { ...e, status } : e);
    saveBillingEvents(updated);
    setEvents(updated);
  }

  // Calendar logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay(); // 0=Sun
  const today       = new Date();

  const filteredEvents = events.filter(e => {
    if (filterOwner !== 'All' && e.owner !== filterOwner) return false;
    if (filterStatus !== 'All' && e.status !== filterStatus) return false;
    if (filterCycle  !== 'All' && e.cycle  !== filterCycle)  return false;
    return true;
  });

  function eventsOnDay(d) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return filteredEvents.filter(e => e.billingDate === dateStr);
  }

  function eventsThisMonth() {
    const prefix = `${year}-${String(month+1).padStart(2,'0')}`;
    return filteredEvents.filter(e => e.billingDate.startsWith(prefix));
  }

  const thisMonthEvents = eventsThisMonth();
  const totalAmt  = thisMonthEvents.reduce((s, e) => s + (parseFloat(e.amount)||0), 0);
  const paidAmt   = thisMonthEvents.filter(e=>e.status==='Paid').reduce((s,e) => s + (parseFloat(e.amount)||0), 0);
  const pendingCount = thisMonthEvents.filter(e=>e.status==='Pending').length;
  const invoicedCount = thisMonthEvents.filter(e=>e.status==='Invoiced').length;

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function prevMonth() { if (month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); setSelDay(null); }
  function nextMonth() { if (month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); setSelDay(null); }

  const selEvents = selDay ? eventsOnDay(selDay) : [];
  const selDateStr = selDay ? `${year}-${String(month+1).padStart(2,'0')}-${String(selDay).padStart(2,'0')}` : '';

  if (!user) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f4f8'}}>
      <div style={{width:32,height:32,border:'3px solid #2563eb',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8'}}>

      {/* NAV */}
      <nav className="nav-shadow" style={{background:'white',position:'sticky',top:0,zIndex:100}}>
        <div style={{maxWidth:1300,margin:'0 auto',padding:'0 16px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button onClick={()=>router.push('/dashboard')} style={{background:'none',border:'none',cursor:'pointer',color:'#64748b',fontSize:18,padding:'4px 6px'}}>←</button>
            <div style={{width:36,height:36,background:'#1e3a8a',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'white',fontWeight:900,fontSize:15}}>C</span>
            </div>
            <div>
              <div style={{fontSize:13.5,fontWeight:700,color:'#0f172a'}}>Billing Calendar</div>
              <div style={{fontSize:10.5,color:'#94a3b8'}}>C Prompt Solutions · Invoice Tracker</div>
            </div>
          </div>
          <button onClick={()=>{setForm(selDay?{...EMPTY_FORM,billingDate:selDateStr}:EMPTY_FORM);setEditId(null);setShowForm(true);}}
            style={{fontSize:13,padding:'7px 16px',background:'#2563eb',color:'white',border:'none',borderRadius:11,cursor:'pointer',fontWeight:700}}>
            + Add Billing Event
          </button>
        </div>
      </nav>

      <div style={{maxWidth:1300,margin:'0 auto',padding:'20px 16px',display:'grid',gridTemplateColumns:'1fr 340px',gap:18,alignItems:'start'}}>

        {/* LEFT: Calendar */}
        <div>

          {/* Stat cards */}
          <div className="stagger" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:18}}>
            {[
              {cls:'stat-blue',   icon:'📋', val:thisMonthEvents.length, lbl:'This Month'},
              {cls:'stat-yellow', icon:'⏳', val:pendingCount,           lbl:'Pending'},
              {cls:'stat-purple', icon:'📄', val:invoicedCount,          lbl:'Invoiced'},
              {cls:'stat-green',  icon:'✅', val:thisMonthEvents.filter(e=>e.status==='Paid').length, lbl:'Paid'},
            ].map(s=>(
              <div key={s.lbl} className={`stat-card ${s.cls} animate-in`}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value animate-countUp">{s.val}</div>
                <div className="stat-label">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Amount summary */}
          <div className="card animate-in" style={{padding:'14px 18px',marginBottom:16,display:'flex',gap:24,alignItems:'center',flexWrap:'wrap'}}>
            <div>
              <div style={{fontSize:10.5,color:'#94a3b8',fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>Total Billing ({MONTHS[month]})</div>
              <div style={{fontSize:22,fontWeight:900,color:'#1d4ed8'}}>₹{totalAmt.toLocaleString('en-IN')}</div>
            </div>
            <div style={{width:1,height:36,background:'#e2e8f0'}}/>
            <div>
              <div style={{fontSize:10.5,color:'#94a3b8',fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>Collected</div>
              <div style={{fontSize:18,fontWeight:800,color:'#16a34a'}}>₹{paidAmt.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div style={{fontSize:10.5,color:'#94a3b8',fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>Outstanding</div>
              <div style={{fontSize:18,fontWeight:800,color:'#dc2626'}}>₹{(totalAmt-paidAmt).toLocaleString('en-IN')}</div>
            </div>
            <div style={{flex:1,minWidth:140}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:4}}>
                <span style={{color:'#64748b',fontWeight:600}}>Collection Rate</span>
                <span style={{color:'#16a34a',fontWeight:700}}>{totalAmt>0?Math.round((paidAmt/totalAmt)*100):0}%</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill green" style={{width:`${totalAmt>0?Math.round((paidAmt/totalAmt)*100):0}%`}}/>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card no-print animate-in" style={{padding:'12px 16px',marginBottom:14,display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
            <select value={filterOwner} onChange={e=>setFilterOwner(e.target.value)}
              style={{padding:'5px 10px',borderRadius:9,border:'1.5px solid #e2e8f0',fontSize:12.5,fontWeight:600,color:'#475569',outline:'none',background:'white',cursor:'pointer'}}>
              <option value="All">👤 All Owners</option>
              {TEAM_NAMES.map(n=><option key={n} value={n}>{n}</option>)}
            </select>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
              style={{padding:'5px 10px',borderRadius:9,border:'1.5px solid #e2e8f0',fontSize:12.5,fontWeight:600,color:'#475569',outline:'none',background:'white',cursor:'pointer'}}>
              <option value="All">📊 All Status</option>
              {Object.keys(STATUS_CFG).map(s=><option key={s} value={s}>{STATUS_CFG[s].icon} {s}</option>)}
            </select>
            <select value={filterCycle} onChange={e=>setFilterCycle(e.target.value)}
              style={{padding:'5px 10px',borderRadius:9,border:'1.5px solid #e2e8f0',fontSize:12.5,fontWeight:600,color:'#475569',outline:'none',background:'white',cursor:'pointer'}}>
              <option value="All">🔄 All Cycles</option>
              {Object.keys(CYCLE_CONFIG).map(c=><option key={c} value={c}>{CYCLE_CONFIG[c].icon} {c}</option>)}
            </select>
          </div>

          {/* Calendar card */}
          <div className="card animate-in" style={{overflow:'hidden'}}>
            {/* Month nav */}
            <div style={{padding:'14px 18px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(135deg,#1e3a8a,#2563eb)',borderRadius:'16px 16px 0 0'}}>
              <button onClick={prevMonth} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:9,width:34,height:34,cursor:'pointer',color:'white',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:18,fontWeight:800,color:'white',letterSpacing:'-0.3px'}}>{MONTHS[month]}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.65)'}}>{year}</div>
              </div>
              <button onClick={nextMonth} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:9,width:34,height:34,cursor:'pointer',color:'white',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
            </div>

            {/* Day headers */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',background:'#f8fafc',borderBottom:'1px solid #f1f5f9'}}>
              {DAYS.map(d=>(
                <div key={d} style={{padding:'8px 4px',textAlign:'center',fontSize:11,fontWeight:700,color:d==='Sun'?'#ef4444':d==='Sat'?'#3b82f6':'#64748b',textTransform:'uppercase',letterSpacing:'0.04em'}}>
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)'}}>
              {/* Empty cells */}
              {Array.from({length:firstDay}).map((_,i)=>(
                <div key={`e${i}`} style={{minHeight:90,padding:6,borderBottom:'1px solid #f8fafc',borderRight:'1px solid #f8fafc',background:'#fafafa'}}/>
              ))}
              {/* Day cells */}
              {Array.from({length:daysInMonth}).map((_,i)=>{
                const d = i+1;
                const dayEvents = eventsOnDay(d);
                const isToday = today.getDate()===d && today.getMonth()===month && today.getFullYear()===year;
                const isSel   = selDay===d;
                const dayOfWeek = (firstDay + i) % 7;
                const isWeekend = dayOfWeek===0||dayOfWeek===6;
                return (
                  <div key={d} onClick={()=>setSelDay(isSel?null:d)}
                    style={{minHeight:90,padding:'6px 5px',borderBottom:'1px solid #f8fafc',borderRight:'1px solid #f8fafc',cursor:'pointer',
                      background: isSel?'#eff6ff': isToday?'#fefce8': isWeekend?'#fafafa':'white',
                      transition:'background 0.1s',
                    }}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                      <span style={{
                        width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:12.5,fontWeight: isToday?900:600,
                        background: isToday?'#2563eb':'transparent',
                        color: isToday?'white': isWeekend?'#94a3b8':'#334155',
                      }}>{d}</span>
                      {dayEvents.length>0&&<span style={{fontSize:9,fontWeight:700,background:'#2563eb',color:'white',padding:'1px 5px',borderRadius:99}}>{dayEvents.length}</span>}
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:2}}>
                      {dayEvents.slice(0,3).map(ev=>{
                        const cc = CYCLE_CONFIG[ev.cycle]||CYCLE_CONFIG.Monthly;
                        const sc = STATUS_CFG[ev.status]||STATUS_CFG.Pending;
                        return (
                          <div key={ev.id} style={{fontSize:10,padding:'2px 5px',borderRadius:5,background:sc.bg,color:sc.color,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',border:`1px solid ${cc.color}30`}}>
                            {sc.icon} {ev.customer}
                          </div>
                        );
                      })}
                      {dayEvents.length>3&&<div style={{fontSize:9,color:'#94a3b8',fontWeight:600,paddingLeft:5}}>+{dayEvents.length-3} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="card animate-in" style={{padding:'12px 16px',marginTop:14,display:'flex',gap:16,flexWrap:'wrap',alignItems:'center'}}>
            <span style={{fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:1}}>Status:</span>
            {Object.entries(STATUS_CFG).map(([k,v])=>(
              <span key={k} style={{fontSize:11.5,fontWeight:600,color:v.color,display:'flex',alignItems:'center',gap:4}}>
                <span style={{width:10,height:10,borderRadius:'50%',background:v.bg,border:`1.5px solid ${v.color}`,display:'inline-block'}}/>
                {v.icon} {k}
              </span>
            ))}
            <span style={{width:1,height:16,background:'#e2e8f0'}}/>
            {Object.entries(CYCLE_CONFIG).map(([k,v])=>(
              <span key={k} style={{fontSize:11.5,fontWeight:600,color:v.color,display:'flex',alignItems:'center',gap:4}}>
                <span style={{width:10,height:10,borderRadius:3,background:v.bg,border:`1.5px solid ${v.color}`,display:'inline-block'}}/>
                {v.icon} {k}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: Side panel */}
        <div style={{display:'flex',flexDirection:'column',gap:14,position:'sticky',top:72}}>

          {/* Selected day panel */}
          {selDay ? (
            <div className="card animate-in" style={{overflow:'hidden'}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid #f1f5f9',background:'#eff6ff',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:13.5,fontWeight:700,color:'#1d4ed8'}}>
                    {selDay} {MONTHS[month]} {year}
                  </div>
                  <div style={{fontSize:11,color:'#64748b'}}>{selEvents.length} billing event{selEvents.length!==1?'s':''}</div>
                </div>
                <button onClick={()=>{setForm({...EMPTY_FORM,billingDate:selDateStr});setEditId(null);setShowForm(true);}}
                  style={{fontSize:11,padding:'5px 11px',background:'#2563eb',color:'white',border:'none',borderRadius:9,cursor:'pointer',fontWeight:700}}>
                  + Add
                </button>
              </div>
              {selEvents.length===0 ? (
                <div style={{padding:28,textAlign:'center',color:'#94a3b8',fontSize:13}}>No events on this day</div>
              ) : (
                <div style={{padding:10,display:'flex',flexDirection:'column',gap:8,maxHeight:400,overflowY:'auto'}}>
                  {selEvents.map(ev=>{
                    const cc = CYCLE_CONFIG[ev.cycle]||CYCLE_CONFIG.Monthly;
                    const sc = STATUS_CFG[ev.status]||STATUS_CFG.Pending;
                    return (
                      <div key={ev.id} style={{borderRadius:12,border:`1.5px solid ${cc.color}30`,background:'white',padding:'10px 12px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:700,color:'#1e293b'}}>{ev.customer}</div>
                            {ev.amount&&<div style={{fontSize:13.5,fontWeight:800,color:'#1d4ed8',marginTop:2}}>₹{parseFloat(ev.amount).toLocaleString('en-IN')}</div>}
                            <div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>
                              <span style={{fontSize:10,padding:'2px 7px',borderRadius:99,background:sc.bg,color:sc.color,fontWeight:700}}>{sc.icon} {ev.status}</span>
                              <span style={{fontSize:10,padding:'2px 7px',borderRadius:99,background:cc.bg,color:cc.color,fontWeight:600}}>{cc.icon} {ev.cycle}</span>
                            </div>
                            {ev.owner&&<div style={{fontSize:11,color:'#64748b',marginTop:4}}>👤 {ev.owner}</div>}
                          </div>
                          <div style={{display:'flex',flexDirection:'column',gap:4}}>
                            <button onClick={()=>startEdit(ev)} style={{fontSize:11,padding:'3px 9px',background:'#f1f5f9',color:'#475569',border:'none',borderRadius:7,cursor:'pointer',fontWeight:600}}>Edit</button>
                            <button onClick={()=>deleteEvent(ev.id)} style={{fontSize:11,padding:'3px 9px',background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:7,cursor:'pointer',fontWeight:600}}>Del</button>
                          </div>
                        </div>
                        {/* Quick status update */}
                        <div style={{display:'flex',gap:4,marginTop:8}}>
                          {Object.keys(STATUS_CFG).map(s=>(
                            <button key={s} onClick={()=>updateStatus(ev.id,s)}
                              style={{flex:1,fontSize:10,padding:'4px 0',borderRadius:7,border:'1px solid',fontWeight:700,cursor:'pointer',
                                background:ev.status===s?STATUS_CFG[s].bg:'white',
                                borderColor:ev.status===s?STATUS_CFG[s].color:'#e2e8f0',
                                color:ev.status===s?STATUS_CFG[s].color:'#94a3b8',
                              }}>{STATUS_CFG[s].icon}</button>
                          ))}
                        </div>
                        {ev.notes&&<div style={{fontSize:11,color:'#64748b',marginTop:6,background:'#f8fafc',padding:'5px 8px',borderRadius:7}}>{ev.notes}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Upcoming events list */
            <div className="card animate-in" style={{overflow:'hidden'}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid #f1f5f9'}}>
                <div style={{fontSize:13.5,fontWeight:700,color:'#0f172a'}}>Upcoming Billing</div>
                <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{MONTHS[month]} {year}</div>
              </div>
              {thisMonthEvents.length===0 ? (
                <div style={{padding:32,textAlign:'center',color:'#94a3b8',fontSize:13}}>
                  <div style={{fontSize:36,marginBottom:8}}>📅</div>
                  No billing events this month
                </div>
              ) : (
                <div style={{maxHeight:500,overflowY:'auto'}}>
                  {thisMonthEvents
                    .sort((a,b)=>a.billingDate.localeCompare(b.billingDate))
                    .map(ev=>{
                      const cc = CYCLE_CONFIG[ev.cycle]||CYCLE_CONFIG.Monthly;
                      const sc = STATUS_CFG[ev.status]||STATUS_CFG.Pending;
                      const d  = parseInt(ev.billingDate.split('-')[2]);
                      return (
                        <div key={ev.id} onClick={()=>setSelDay(d)}
                          style={{padding:'11px 16px',borderBottom:'1px solid #f8fafc',cursor:'pointer',display:'flex',gap:12,alignItems:'center',transition:'background 0.1s'}}
                          onMouseOver={e=>e.currentTarget.style.background='#f8fafc'}
                          onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                          <div style={{width:38,height:38,borderRadius:10,background:cc.bg,border:`1.5px solid ${cc.color}30`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <div style={{fontSize:16,fontWeight:900,color:cc.color,lineHeight:1}}>{d}</div>
                            <div style={{fontSize:8,color:cc.color,fontWeight:600,opacity:0.7}}>{MONTHS[month].slice(0,3).toUpperCase()}</div>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:12.5,fontWeight:700,color:'#1e293b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ev.customer}</div>
                            {ev.amount&&<div style={{fontSize:12,fontWeight:700,color:'#1d4ed8'}}>₹{parseFloat(ev.amount).toLocaleString('en-IN')}</div>}
                            <div style={{fontSize:10.5,color:'#94a3b8'}}>{ev.owner||'Unassigned'} · {cc.icon}{ev.cycle}</div>
                          </div>
                          <span style={{fontSize:10,padding:'3px 8px',borderRadius:99,background:sc.bg,color:sc.color,fontWeight:700,flexShrink:0}}>{sc.icon}</span>
                        </div>
                      );
                    })
                  }
                </div>
              )}
            </div>
          )}

          {/* Mini team summary */}
          <div className="card animate-in" style={{overflow:'hidden'}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid #f1f5f9'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Team — {MONTHS[month]}</div>
            </div>
            <div style={{padding:10,display:'flex',flexDirection:'column',gap:6}}>
              {TEAM_NAMES.map(name=>{
                const myEvents = thisMonthEvents.filter(e=>e.owner===name);
                const myPaid   = myEvents.filter(e=>e.status==='Paid').length;
                const pct      = myEvents.length>0?Math.round((myPaid/myEvents.length)*100):0;
                return (
                  <div key={name} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 8px',borderRadius:10,background:'#f8fafc'}}>
                    <div style={{width:28,height:28,borderRadius:8,background:'#dbeafe',display:'flex',alignItems:'center',justifyContent:'center',color:'#1d4ed8',fontSize:11,fontWeight:800,flexShrink:0}}>
                      {name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11.5,fontWeight:600,color:'#334155',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{name}</div>
                      <div className="prog-track" style={{height:4,marginTop:4}}>
                        <div className={`prog-fill ${pct>=70?'green':pct>=40?'yellow':'red'}`} style={{width:`${pct}%`}}/>
                      </div>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:'#64748b',flexShrink:0}}>
                      {myEvents.length>0?`${myPaid}/${myEvents.length}`:'—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.55)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{background:'white',borderRadius:20,width:'100%',maxWidth:480,boxShadow:'0 24px 60px rgba(0,0,0,0.25)',overflow:'hidden'}}>
            <div style={{padding:'16px 20px',background:'linear-gradient(135deg,#1e3a8a,#2563eb)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{color:'white',fontWeight:700,fontSize:15}}>{editId?'Edit':'Add'} Billing Event</div>
              <button onClick={()=>{setShowForm(false);setEditId(null);setForm(EMPTY_FORM);}} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,width:28,height:28,cursor:'pointer',color:'white',fontSize:16}}>×</button>
            </div>
            <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',gap:13}}>
              {[
                {label:'Customer Name *', key:'customer', type:'text', placeholder:'e.g. Acme Corp'},
                {label:'Billing Amount (₹)', key:'amount', type:'number', placeholder:'e.g. 50000'},
                {label:'Billing Date *', key:'billingDate', type:'date'},
              ].map(f=>(
                <div key={f.key}>
                  <label style={{display:'block',fontSize:11.5,fontWeight:700,color:'#475569',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                    style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13.5,outline:'none',fontFamily:'inherit',boxSizing:'border-box',transition:'border-color 0.15s'}}
                    onFocus={e=>e.target.style.borderColor='#3b82f6'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>
                  <label style={{display:'block',fontSize:11.5,fontWeight:700,color:'#475569',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Billing Cycle</label>
                  <select value={form.cycle} onChange={e=>setForm(p=>({...p,cycle:e.target.value}))}
                    style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none',background:'white',fontFamily:'inherit',cursor:'pointer'}}>
                    {Object.keys(CYCLE_CONFIG).map(c=><option key={c} value={c}>{CYCLE_CONFIG[c].icon} {c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:'block',fontSize:11.5,fontWeight:700,color:'#475569',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Status</label>
                  <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}
                    style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none',background:'white',fontFamily:'inherit',cursor:'pointer'}}>
                    {Object.keys(STATUS_CFG).map(s=><option key={s} value={s}>{STATUS_CFG[s].icon} {s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:11.5,fontWeight:700,color:'#475569',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Assigned To</label>
                <select value={form.owner} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}
                  style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none',background:'white',fontFamily:'inherit',cursor:'pointer'}}>
                  <option value="">— Select Team Member —</option>
                  {TEAM_NAMES.map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:'block',fontSize:11.5,fontWeight:700,color:'#475569',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em'}}>Notes</label>
                <input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Optional note..."
                  style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
              </div>
              <div style={{display:'flex',gap:10,paddingTop:4}}>
                <button onClick={saveEvent} disabled={!form.customer||!form.billingDate}
                  style={{flex:1,padding:'11px',background:'#2563eb',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',opacity:(!form.customer||!form.billingDate)?0.5:1}}>
                  {editId?'Update Event':'Add Event'}
                </button>
                <button onClick={()=>{setShowForm(false);setEditId(null);setForm(EMPTY_FORM);}}
                  style={{padding:'11px 18px',background:'#f1f5f9',color:'#475569',border:'none',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer'}}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
