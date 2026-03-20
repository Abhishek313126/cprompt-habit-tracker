'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/storage';

const BILLING_KEY = 'cprompt_billing_events';
function loadEvents() { try { return JSON.parse(localStorage.getItem(BILLING_KEY)||'[]'); } catch { return []; } }
function saveEvents(evs) { localStorage.setItem(BILLING_KEY, JSON.stringify(evs)); }

const STATUS_OPTS = [
  { key:'pending', label:'Invoice Pending', color:'#dc2626', bg:'#fee2e2', icon:'⏳' },
  { key:'sent',    label:'Invoice Sent',    color:'#d97706', bg:'#fef3c7', icon:'📤' },
  { key:'paid',    label:'Payment Received',color:'#16a34a', bg:'#dcfce7', icon:'✅' },
  { key:'overdue', label:'Overdue',         color:'#7c3aed', bg:'#ede9fe', icon:'🚨' },
];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getStatusCfg(key) { return STATUS_OPTS.find(s=>s.key===key)||STATUS_OPTS[0]; }
function getDaysInMonth(y,m) { return new Date(y,m+1,0).getDate(); }
function getFirstDay(y,m)    { return new Date(y,m,1).getDay(); }
function toDateStr(y,m,d)    { return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
const today = new Date().toISOString().split('T')[0];

const blankForm = { customer:'', amount:'', invoiceNo:'', dueDate:'', invoiceDate:'', status:'pending', remarks:'' };

export default function BillingCalendarPage() {
  const router = useRouter();
  const [user, setUser]   = useState(null);
  const [events, setEvents] = useState([]);
  const [view, setView]   = useState('calendar');
  const [curYear, setCurYear]   = useState(new Date().getFullYear());
  const [curMonth, setCurMonth] = useState(new Date().getMonth());
  const [modal, setModal] = useState(null);
  const [selEvent, setSelEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm]   = useState(blankForm);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    setEvents(loadEvents());
  }, []);

  function openAddModal(dateStr) {
    setForm({ ...blankForm, dueDate:dateStr, invoiceDate:dateStr });
    setModal('add');
  }
  function openViewModal(ev) { setSelEvent(ev); setModal('view'); }

  function saveNewEvent() {
    if (!form.customer||!form.dueDate) return;
    const ev = { ...form, id:Date.now().toString() };
    const updated = [...events, ev];
    setEvents(updated); saveEvents(updated); setModal(null); setForm(blankForm);
  }
  function updateStatus(id, status) {
    const updated = events.map(e=>e.id===id?{...e,status}:e);
    setEvents(updated); saveEvents(updated);
    setSelEvent(p=>p?.id===id?{...p,status}:p);
  }
  function deleteEvent(id) {
    const updated = events.filter(e=>e.id!==id);
    setEvents(updated); saveEvents(updated); setModal(null);
  }

  function prevMonth() { if(curMonth===0){setCurYear(y=>y-1);setCurMonth(11);}else setCurMonth(m=>m-1); }
  function nextMonth() { if(curMonth===11){setCurYear(y=>y+1);setCurMonth(0);}else setCurMonth(m=>m+1); }

  const daysInMonth = getDaysInMonth(curYear, curMonth);
  const firstDay    = getFirstDay(curYear, curMonth);

  function eventsForDay(day) {
    const ds = toDateStr(curYear,curMonth,day);
    return events.filter(e=>e.dueDate===ds);
  }

  const totalAmt = events.reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const paidAmt  = events.filter(e=>e.status==='paid').reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const overdue  = events.filter(e=>e.status!=='paid'&&e.dueDate<today);
  const upcoming = events.filter(e=>e.status==='pending'&&e.dueDate>=today);
  const monthEvs = events.filter(e=>e.dueDate?.startsWith(`${curYear}-${String(curMonth+1).padStart(2,'0')}`));

  const filteredList = filterStatus==='all'?events:events.filter(e=>e.status===filterStatus);
  const sortedList   = [...filteredList].sort((a,b)=>a.dueDate?.localeCompare(b.dueDate));

  if (!user) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f4f8'}}>
      <div style={{width:32,height:32,border:'3px solid #2563eb',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8'}}>

      {/* NAV */}
      <nav className="nav-shadow" style={{background:'white',position:'sticky',top:0,zIndex:100}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 16px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button onClick={()=>router.push('/dashboard')} style={{background:'none',border:'none',cursor:'pointer',color:'#64748b',fontSize:18,padding:'4px 6px'}}>←</button>
            <div style={{width:36,height:36,background:'#1e3a8a',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'white',fontSize:16}}>📅</span>
            </div>
            <div>
              <div style={{fontSize:13.5,fontWeight:700,color:'#0f172a'}}>Billing Calendar</div>
              <div style={{fontSize:10.5,color:'#94a3b8'}}>Invoice & Payment Tracker</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            {['calendar','list'].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{fontSize:12.5,padding:'6px 14px',border:'none',borderRadius:10,cursor:'pointer',fontWeight:700,
                background:view===v?'#1e3a8a':'#f1f5f9',color:view===v?'white':'#64748b',transition:'all 0.15s'}}>
                {v==='calendar'?'📅 Calendar':'📋 List'}
              </button>
            ))}
            <button onClick={()=>openAddModal(today)} style={{fontSize:12.5,padding:'6px 14px',background:'#2563eb',color:'white',border:'none',borderRadius:10,cursor:'pointer',fontWeight:700}}>
              + New Entry
            </button>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'22px 16px'}}>

        {/* STAT CARDS */}
        <div className="stagger" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:20}}>
          {[
            {cls:'stat-blue',   icon:'📋',val:events.length,                      lbl:'Total Entries'},
            {cls:'stat-yellow', icon:'📤',val:upcoming.length,                    lbl:'Upcoming'},
            {cls:'stat-red',    icon:'🚨',val:overdue.length,                      lbl:'Overdue'},
            {cls:'stat-green',  icon:'💰',val:`₹${(paidAmt/1000).toFixed(1)}K`,   lbl:'Collected'},
            {cls:'stat-purple', icon:'🎯',val:`₹${(totalAmt/1000).toFixed(1)}K`,  lbl:'Total Billed'},
          ].map(s=>(
            <div key={s.lbl} className={`stat-card ${s.cls} animate-in`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value animate-countUp">{s.val}</div>
              <div className="stat-label">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* CALENDAR VIEW */}
        {view==='calendar'&&(
          <div className="card animate-in" style={{overflow:'hidden'}}>
            <div style={{padding:'14px 20px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <button onClick={prevMonth} style={{width:36,height:36,borderRadius:10,border:'1.5px solid #e2e8f0',background:'white',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:17,fontWeight:800,color:'#0f172a'}}>{MONTHS[curMonth]} {curYear}</div>
                <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{monthEvs.length} billing event{monthEvs.length!==1?'s':''} this month</div>
              </div>
              <button onClick={nextMonth} style={{width:36,height:36,borderRadius:10,border:'1.5px solid #e2e8f0',background:'white',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
            </div>
            {/* Day headers */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',background:'#f8fafc',borderBottom:'1px solid #f1f5f9'}}>
              {DAYS.map(d=>(
                <div key={d} style={{padding:'10px 0',textAlign:'center',fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>{d}</div>
              ))}
            </div>
            {/* Grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)'}}>
              {Array.from({length:firstDay}).map((_,i)=>(
                <div key={`e${i}`} style={{minHeight:80,borderRight:'1px solid #f8fafc',borderBottom:'1px solid #f8fafc',background:'#fafafa'}}/>
              ))}
              {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
                const ds = toDateStr(curYear,curMonth,day);
                const dayEvs = eventsForDay(day);
                const isToday = ds===today;
                const isPast  = ds<today;
                return (
                  <div key={day} onClick={()=>openAddModal(ds)}
                    style={{minHeight:80,borderRight:'1px solid #f1f5f9',borderBottom:'1px solid #f1f5f9',padding:6,cursor:'pointer',background:isToday?'#eff6ff':'white',transition:'background 0.1s'}}
                    onMouseOver={e=>{if(!isToday)e.currentTarget.style.background='#f8fafc';}}
                    onMouseOut={e=>{if(!isToday)e.currentTarget.style.background='white';}}>
                    <div style={{fontSize:12,fontWeight:isToday?800:500,
                      width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                      background:isToday?'#2563eb':'transparent',color:isToday?'white':isPast?'#94a3b8':'#1e293b'}}>
                      {day}
                    </div>
                    <div style={{marginTop:3,display:'flex',flexDirection:'column',gap:2}}>
                      {dayEvs.slice(0,3).map(ev=>{
                        const cfg=getStatusCfg(ev.status);
                        return (
                          <div key={ev.id} onClick={e=>{e.stopPropagation();openViewModal(ev);}}
                            style={{fontSize:9.5,fontWeight:600,padding:'2px 5px',borderRadius:4,background:cfg.bg,color:cfg.color,
                              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer'}}>
                            {cfg.icon} {ev.customer}
                          </div>
                        );
                      })}
                      {dayEvs.length>3&&<div style={{fontSize:9,color:'#94a3b8',fontWeight:600}}>+{dayEvs.length-3} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{padding:'12px 20px',borderTop:'1px solid #f1f5f9',display:'flex',gap:16,flexWrap:'wrap'}}>
              {STATUS_OPTS.map(s=>(
                <div key={s.key} style={{display:'flex',alignItems:'center',gap:5}}>
                  <div style={{width:10,height:10,background:s.color,borderRadius:3}}/>
                  <span style={{fontSize:11,color:'#64748b',fontWeight:600}}>{s.icon} {s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view==='list'&&(
          <div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}}>
              <button onClick={()=>setFilterStatus('all')} style={{padding:'5px 14px',borderRadius:99,border:'1.5px solid',fontSize:12,fontWeight:700,cursor:'pointer',
                background:filterStatus==='all'?'#1e3a8a':'white',borderColor:filterStatus==='all'?'#1e3a8a':'#e2e8f0',color:filterStatus==='all'?'white':'#64748b'}}>
                All ({events.length})
              </button>
              {STATUS_OPTS.map(s=>(
                <button key={s.key} onClick={()=>setFilterStatus(s.key)} style={{padding:'5px 14px',borderRadius:99,border:'1.5px solid',fontSize:12,fontWeight:700,cursor:'pointer',transition:'all 0.12s',
                  background:filterStatus===s.key?s.color:'white',borderColor:filterStatus===s.key?s.color:'#e2e8f0',color:filterStatus===s.key?'white':'#64748b'}}>
                  {s.icon} {s.label} ({events.filter(e=>e.status===s.key).length})
                </button>
              ))}
            </div>
            <div className="card animate-in" style={{overflow:'hidden'}}>
              {sortedList.length===0?(
                <div style={{padding:48,textAlign:'center'}}>
                  <div style={{fontSize:40,marginBottom:8}}>📭</div>
                  <p style={{color:'#64748b',fontWeight:600}}>No billing entries yet</p>
                  <button onClick={()=>openAddModal(today)} style={{marginTop:12,padding:'8px 20px',background:'#2563eb',color:'white',border:'none',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>
                    + Add First Entry
                  </button>
                </div>
              ):(
                <div style={{overflowX:'auto'}}>
                  <table className="data-table">
                    <thead><tr>
                      {['Customer','Invoice No.','Invoice Date','Due Date','Amount (₹)','Status','Actions'].map(h=>(
                        <th key={h}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {sortedList.map(ev=>{
                        const cfg=getStatusCfg(ev.status);
                        const isOvr=ev.status!=='paid'&&ev.dueDate<today;
                        return (
                          <tr key={ev.id} style={{cursor:'pointer'}} onClick={()=>openViewModal(ev)}>
                            <td style={{fontWeight:700,color:'#1e293b'}}>{ev.customer}</td>
                            <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,color:'#94a3b8'}}>{ev.invoiceNo||'—'}</td>
                            <td style={{fontSize:12.5,color:'#64748b'}}>{ev.invoiceDate||'—'}</td>
                            <td style={{fontSize:12.5,color:isOvr?'#dc2626':'#64748b',fontWeight:isOvr?700:500}}>{ev.dueDate} {isOvr&&'⚠️'}</td>
                            <td style={{fontWeight:700,color:'#0f172a'}}>{ev.amount?`₹${parseFloat(ev.amount).toLocaleString('en-IN')}':'—'}</td>
                            <td><span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11.5,fontWeight:700,padding:'3px 10px',borderRadius:99,background:cfg.bg,color:cfg.color}}>{cfg.icon} {cfg.label}</span></td>
                            <td onClick={e=>e.stopPropagation()}>
                              <div style={{display:'flex',gap:4}}>
                                {STATUS_OPTS.filter(s=>s.key!==ev.status).map(s=>(
                                  <button key={s.key} onClick={()=>updateStatus(ev.id,s.key)} title={s.label}
                                    style={{padding:'3px 7px',borderRadius:7,border:'1px solid',fontSize:13,cursor:'pointer',background:s.bg,borderColor:s.color}}>
                                    {s.icon}
                                  </button>
                                ))}
                                <button onClick={()=>deleteEvent(ev.id)}
                                  style={{padding:'3px 7px',borderRadius:7,border:'1px solid #fecaca',fontSize:12,cursor:'pointer',background:'#fff1f2',color:'#dc2626'}}>
                                  🗑
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {modal==='add'&&(
        <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.55)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}
          onClick={()=>setModal(null)}>
          <div style={{background:'white',borderRadius:20,padding:24,width:'100%',maxWidth:480,boxShadow:'0 24px 60px rgba(0,0,0,0.25)',maxHeight:'90vh',overflowY:'auto'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <h2 style={{fontSize:17,fontWeight:800,color:'#0f172a',margin:0}}>📅 Add Billing Entry</h2>
              <button onClick={()=>setModal(null)} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:'#94a3b8'}}>×</button>
            </div>
            {[
              {key:'customer',    label:'Customer Name *', placeholder:'e.g. ABC Pvt Ltd',   type:'text'},
              {key:'invoiceNo',   label:'Invoice No.',     placeholder:'e.g. INV-2024-001',  type:'text'},
              {key:'amount',      label:'Amount (₹)',      placeholder:'e.g. 50000',          type:'number'},
              {key:'invoiceDate', label:'Invoice Date',    placeholder:'',                    type:'date'},
              {key:'dueDate',     label:'Due Date *',      placeholder:'',                    type:'date'},
            ].map(f=>(
              <div key={f.key} style={{marginBottom:11}}>
                <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.04em'}}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                  style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13.5,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}
                  onFocus={e=>e.target.style.borderColor='#2563eb'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
              </div>
            ))}
            <div style={{marginBottom:11}}>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.04em'}}>Status</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {STATUS_OPTS.map(s=>(
                  <button key={s.key} onClick={()=>setForm(p=>({...p,status:s.key}))}
                    style={{padding:'8px',borderRadius:10,border:`1.5px solid ${form.status===s.key?s.color:'#e2e8f0'}`,
                      background:form.status===s.key?s.bg:'white',color:form.status===s.key?s.color:'#64748b',
                      fontSize:12,fontWeight:700,cursor:'pointer',textAlign:'left',transition:'all 0.12s'}}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:700,color:'#475569',display:'block',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.04em'}}>Remarks</label>
              <textarea value={form.remarks} onChange={e=>setForm(p=>({...p,remarks:e.target.value}))} placeholder="Optional notes..."
                style={{width:'100%',height:60,padding:'8px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,resize:'none',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}
                onFocus={e=>e.target.style.borderColor='#2563eb'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={saveNewEvent} disabled={!form.customer||!form.dueDate}
                style={{flex:1,padding:11,background:'#2563eb',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:800,cursor:'pointer',opacity:!form.customer||!form.dueDate?0.4:1}}>
                Save Entry
              </button>
              <button onClick={()=>setModal(null)}
                style={{padding:'11px 18px',background:'#f1f5f9',color:'#64748b',border:'none',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer'}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {modal==='view'&&selEvent&&(()=>{
        const cfg=getStatusCfg(selEvent.status);
        return (
          <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.55)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}
            onClick={()=>setModal(null)}>
            <div style={{background:'white',borderRadius:20,padding:24,width:'100%',maxWidth:440,boxShadow:'0 24px 60px rgba(0,0,0,0.25)'}}
              onClick={e=>e.stopPropagation()}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:44,height:44,background:cfg.bg,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{cfg.icon}</div>
                  <div>
                    <div style={{fontSize:16,fontWeight:800,color:'#0f172a'}}>{selEvent.customer}</div>
                    <div style={{fontSize:11,color:'#94a3b8',fontFamily:"'JetBrains Mono',monospace"}}>{selEvent.invoiceNo||'No invoice no.'}</div>
                  </div>
                </div>
                <button onClick={()=>setModal(null)} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:'#94a3b8'}}>×</button>
              </div>
              <div style={{background:'#f8fafc',borderRadius:12,padding:14,marginBottom:14}}>
                {[['Invoice Date',selEvent.invoiceDate||'—'],['Due Date',selEvent.dueDate||'—'],
                  ['Amount',selEvent.amount?`₹${parseFloat(selEvent.amount).toLocaleString('en-IN')}`:'—'],
                  ['Remarks',selEvent.remarks||'—']].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f1f5f9',fontSize:13}}>
                    <span style={{color:'#64748b',fontWeight:600}}>{k}</span>
                    <span style={{color:'#1e293b',fontWeight:700}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:700,color:'#475569',marginBottom:7,textTransform:'uppercase',letterSpacing:'0.04em'}}>Update Status</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                  {STATUS_OPTS.map(s=>(
                    <button key={s.key} onClick={()=>updateStatus(selEvent.id,s.key)}
                      style={{padding:'8px',borderRadius:10,border:`1.5px solid ${selEvent.status===s.key?s.color:'#e2e8f0'}`,
                        background:selEvent.status===s.key?s.color:'white',color:selEvent.status===s.key?'white':'#64748b',
                        fontSize:12,fontWeight:700,cursor:'pointer',transition:'all 0.12s'}}>
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setModal(null)} style={{flex:1,padding:10,background:'#eff6ff',color:'#2563eb',border:'none',borderRadius:12,fontSize:13,fontWeight:700,cursor:'pointer'}}>Close</button>
                <button onClick={()=>deleteEvent(selEvent.id)} style={{padding:'10px 16px',background:'#fff1f2',color:'#dc2626',border:'none',borderRadius:12,fontSize:13,fontWeight:700,cursor:'pointer'}}>🗑 Delete</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
