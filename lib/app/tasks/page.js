'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TEAM_MEMBERS } from '../../lib/habitData';
import { getCurrentUser } from '../../lib/storage';

// ── Task storage helpers (inline — no separate file needed) ──────────────────
function getAllTasks() {
  try { return JSON.parse(localStorage.getItem('cprompt_tasks') || '[]'); } catch { return []; }
}
function saveTasks(t) { localStorage.setItem('cprompt_tasks', JSON.stringify(t)); }
function addTask(task) {
  const tasks = getAllTasks();
  const t = { ...task, id: Date.now().toString(), createdAt: new Date().toISOString(), status:'Pending', comments:[] };
  tasks.push(t); saveTasks(tasks); return t;
}
function updateTaskById(id, updates) {
  const tasks = getAllTasks();
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return;
  tasks[i] = { ...tasks[i], ...updates }; saveTasks(tasks);
}
function deleteTaskById(id) { saveTasks(getAllTasks().filter(t => t.id !== id)); }
function addCommentToTask(id, text, by) {
  const tasks = getAllTasks();
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return;
  tasks[i].comments = [...(tasks[i].comments||[]), { text, by, at: new Date().toISOString() }];
  saveTasks(tasks);
}
function getCustomHabits(uid) {
  try { const a = JSON.parse(localStorage.getItem('cprompt_custom') || '{}'); return a[uid]||[]; } catch { return []; }
}
function addCustomHabit(uid, habit) {
  try {
    const a = JSON.parse(localStorage.getItem('cprompt_custom') || '{}');
    if (!a[uid]) a[uid] = [];
    a[uid].push({ ...habit, id:'CH'+Date.now(), custom:true });
    localStorage.setItem('cprompt_custom', JSON.stringify(a));
  } catch {}
}
function deleteCustomHabit(uid, hid) {
  try {
    const a = JSON.parse(localStorage.getItem('cprompt_custom') || '{}');
    if (a[uid]) { a[uid] = a[uid].filter(h => h.id !== hid); localStorage.setItem('cprompt_custom', JSON.stringify(a)); }
  } catch {}
}
function getTaskStatus(task) {
  if (task.status === 'Done') return 'Done';
  if (task.status === 'Undone') return 'Undone';
  if (!task.dueDate) return 'Pending';
  const due = new Date(task.dueDate + (task.dueTime ? 'T'+task.dueTime : 'T23:59'));
  const diff = due - new Date();
  if (diff < 0) return 'Overdue';
  if (diff < 86400000) return 'DueSoon';
  return 'Pending';
}

// ── Config ────────────────────────────────────────────────────────────────────
const STATUS_CFG = {
  Done:    { color:'#16a34a', bg:'#dcfce7', icon:'✅', label:'Done' },
  Pending: { color:'#2563eb', bg:'#dbeafe', icon:'🔵', label:'Pending' },
  DueSoon: { color:'#ca8a04', bg:'#fef9c3', icon:'⚠️', label:'Due Soon' },
  Overdue: { color:'#dc2626', bg:'#fee2e2', icon:'🔴', label:'Overdue' },
  Undone:  { color:'#7c3aed', bg:'#ede9fe', icon:'↩️', label:'Undone' },
};
const PRI_CFG = {
  high:   { color:'#dc2626', bg:'#fee2e2', label:'High' },
  medium: { color:'#ca8a04', bg:'#fef9c3', label:'Medium' },
  low:    { color:'#64748b', bg:'#f1f5f9', label:'Low' },
};
const EF = { title:'', assignedTo:'', dueDate:'', dueTime:'', priority:'medium', notes:'' };
const EH = { habit:'', frequency:'Daily', sop:'General' };

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser]           = useState(null);
  const [tasks, setTasks]         = useState([]);
  const [tab, setTab]             = useState('my');
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EF);
  const [editId, setEditId]       = useState(null);
  const [commentTask, setCommentTask] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [customs, setCustoms]     = useState([]);
  const [showHabit, setShowHabit] = useState(false);
  const [habitForm, setHabitForm] = useState(EH);
  const [statusFilter, setStatusFilter] = useState('All');

  // Load user on mount
  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/'); return; }
    // Merge with latest TEAM_MEMBERS data to get canAssign/assignTo
    const member = TEAM_MEMBERS.find(m => m.uid === u.uid);
    const merged = member ? { ...u, ...member } : u;
    setUser(merged);
    setTasks(getAllTasks());
    setCustoms(getCustomHabits(merged.uid));
  }, []);

  const refresh = useCallback(() => {
    if (!user) return;
    setTasks(getAllTasks());
    setCustoms(getCustomHabits(user.uid));
  }, [user]);

  useEffect(() => { const t = setInterval(refresh, 60000); return () => clearInterval(t); }, [refresh]);

  if (!user) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f4f8',flexDirection:'column',gap:12}}>
      <div style={{width:36,height:36,border:'3px solid #2563eb',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
      <p style={{color:'#64748b',fontSize:13}}>Loading tasks...</p>
    </div>
  );

  const canAssign  = !!user.canAssign;
  const isHead     = user.role === 'FINANCE_HEAD';
  const assignable = TEAM_MEMBERS.filter(m =>
    isHead ? m.dept === 'F&A' : (user.assignTo||[]).includes(m.uid)
  );

  const myTasks     = tasks.filter(t => t.assignedTo === user.uid);
  const assignedOut = tasks.filter(t => t.assignedBy === user.uid && t.assignedTo !== user.uid);
  const allFA       = tasks.filter(t => TEAM_MEMBERS.find(m => m.uid === t.assignedTo && m.dept === 'F&A'));

  const base = tab === 'my' ? myTasks : tab === 'assigned' ? assignedOut : allFA;
  const shown = base.filter(t => statusFilter === 'All' || getTaskStatus(t) === statusFilter)
    .sort((a,b) => { const o={Overdue:0,DueSoon:1,Undone:2,Pending:3,Done:4}; return (o[getTaskStatus(a)]||3)-(o[getTaskStatus(b)]||3); });

  const overdueN = myTasks.filter(t => getTaskStatus(t) === 'Overdue').length;
  const dueSoonN = myTasks.filter(t => getTaskStatus(t) === 'DueSoon').length;
  const doneN    = myTasks.filter(t => t.status === 'Done').length;

  function name(uid) { return TEAM_MEMBERS.find(m => m.uid === uid)?.name || uid; }

  function submitTask() {
    if (!form.title) return;
    const payload = { title:form.title, assignedTo:form.assignedTo||user.uid, assignedBy:user.uid, assignedByName:user.name, dueDate:form.dueDate, dueTime:form.dueTime, priority:form.priority, notes:form.notes };
    if (editId) updateTaskById(editId, payload); else addTask(payload);
    setForm(EF); setShowForm(false); setEditId(null); refresh();
  }

  function submitComment(markUndone) {
    if (!commentText || !commentTask) return;
    addCommentToTask(commentTask.id, commentText, user.name);
    if (markUndone) updateTaskById(commentTask.id, { status:'Undone' });
    setCommentTask(null); setCommentText(''); refresh();
  }

  function submitHabit() {
    if (!habitForm.habit) return;
    addCustomHabit(user.uid, habitForm);
    setHabitForm(EH); setShowHabit(false); refresh();
  }

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8'}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* NAV */}
      <nav style={{background:'white',borderBottom:'1px solid #f1f5f9',position:'sticky',top:0,zIndex:100,boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 16px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button onClick={()=>router.push('/dashboard')} style={{background:'#f1f5f9',border:'none',cursor:'pointer',color:'#475569',fontSize:14,padding:'6px 10px',borderRadius:8,fontWeight:700}}>← Back</button>
            <div style={{width:34,height:34,background:'#1e3a8a',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'white',fontWeight:900,fontSize:14}}>C</span>
            </div>
            <div>
              <div style={{fontSize:13.5,fontWeight:700,color:'#0f172a'}}>Task Manager</div>
              <div style={{fontSize:10.5,color:'#94a3b8'}}>{user.name} · {user.uid}</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            {overdueN > 0 && <span style={{background:'#fee2e2',color:'#dc2626',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:99}}>🔴 {overdueN} Overdue</span>}
            {dueSoonN > 0 && <span style={{background:'#fef9c3',color:'#ca8a04',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:99}}>⚠️ {dueSoonN} Due Soon</span>}
            <button onClick={()=>{setForm(EF);setEditId(null);setShowForm(true);}}
              style={{fontSize:13,padding:'7px 16px',background:'#2563eb',color:'white',border:'none',borderRadius:10,cursor:'pointer',fontWeight:700}}>
              + Add Task
            </button>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'18px 16px',display:'grid',gridTemplateColumns:'1fr 270px',gap:16,alignItems:'start'}}>

        {/* MAIN */}
        <div>
          {/* Stat cards */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
            {[['📋','#eff6ff','#2563eb',myTasks.length,'My Tasks'],['✅','#dcfce7','#16a34a',doneN,'Done'],['⚠️','#fef9c3','#ca8a04',dueSoonN,'Due Soon'],['🔴','#fee2e2','#dc2626',overdueN,'Overdue']]
              .map(([icon,bg,col,val,lbl])=>(
              <div key={lbl} style={{background:bg,borderRadius:14,padding:'14px 12px',textAlign:'center',border:`1px solid ${col}20`}}>
                <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:24,fontWeight:800,color:col}}>{val}</div>
                <div style={{fontSize:11,color:col,fontWeight:600}}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Tabs + filter */}
          <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
            {[['my',`My Tasks (${myTasks.length})`],...((canAssign||isHead)?[['assigned',`Assigned by Me (${assignedOut.length})`]]:[]),...(isHead?[['all',`All F&A (${allFA.length})`]]:[])].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)}
                style={{padding:'7px 14px',borderRadius:10,border:'none',cursor:'pointer',fontSize:12.5,fontWeight:700,
                  background:tab===k?'#1e3a8a':'white',color:tab===k?'white':'#475569',
                  boxShadow:tab===k?'0 2px 8px rgba(30,58,138,0.2)':'none'}}>
                {l}
              </button>
            ))}
            <div style={{flex:1}}/>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
              style={{padding:'6px 10px',borderRadius:9,border:'1.5px solid #e2e8f0',fontSize:12,fontWeight:600,color:'#475569',background:'white',cursor:'pointer'}}>
              <option value="All">All Status</option>
              {Object.entries(STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>

          {/* Task list */}
          {shown.length === 0 ? (
            <div style={{background:'white',borderRadius:16,padding:48,textAlign:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:40,marginBottom:8}}>📭</div>
              <p style={{color:'#64748b',fontWeight:600,marginBottom:12}}>No tasks here</p>
              <button onClick={()=>{setForm(EF);setShowForm(true);}}
                style={{padding:'8px 20px',background:'#2563eb',color:'white',border:'none',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>
                + Add Task
              </button>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {shown.map(task => {
                const st = getTaskStatus(task);
                const sc = STATUS_CFG[st] || STATUS_CFG.Pending;
                const pc = PRI_CFG[task.priority] || PRI_CFG.medium;
                const isOwner    = task.assignedBy === user.uid;
                const isAssignee = task.assignedTo === user.uid;
                return (
                  <div key={task.id} style={{background:st==='Overdue'?'#fff5f5':st==='DueSoon'?'#fffbeb':'white',borderRadius:14,padding:'13px 15px',
                    borderLeft:`4px solid ${sc.color}`,boxShadow:'0 1px 3px rgba(0,0,0,0.06)',border:`1px solid ${st==='Overdue'?'#fca5a5':st==='DueSoon'?'#fde68a':'#f1f5f9'}`,borderLeftWidth:4}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:5}}>
                          <span style={{fontSize:13.5,fontWeight:700,color:'#1e293b',textDecoration:task.status==='Done'?'line-through':'none'}}>{task.title}</span>
                          <span style={{fontSize:10,padding:'2px 7px',borderRadius:99,background:sc.bg,color:sc.color,fontWeight:700}}>{sc.icon} {sc.label}</span>
                          <span style={{fontSize:10,padding:'2px 7px',borderRadius:99,background:pc.bg,color:pc.color,fontWeight:600}}>{pc.label}</span>
                        </div>
                        <div style={{display:'flex',gap:12,flexWrap:'wrap',fontSize:11.5,color:'#64748b',marginBottom:task.notes?6:0}}>
                          {task.assignedTo && <span>👤 <strong style={{color:'#334155'}}>{name(task.assignedTo)}</strong></span>}
                          {task.assignedBy && task.assignedBy !== task.assignedTo && <span>📌 from <strong style={{color:'#334155'}}>{name(task.assignedBy)}</strong></span>}
                          {task.dueDate && <span style={{color:st==='Overdue'?'#dc2626':st==='DueSoon'?'#ca8a04':'#64748b',fontWeight:st==='Overdue'||st==='DueSoon'?700:400}}>
                            📅 {task.dueDate}{task.dueTime?' '+task.dueTime:''}
                          </span>}
                        </div>
                        {task.notes && <div style={{fontSize:11.5,color:'#64748b',background:'#f8fafc',padding:'4px 8px',borderRadius:7,marginBottom:4}}>{task.notes}</div>}
                        {task.comments?.length > 0 && (
                          <div style={{display:'flex',flexDirection:'column',gap:3,marginTop:5}}>
                            {task.comments.map((c,i)=>(
                              <div key={i} style={{fontSize:11,background:'#f1f5f9',borderRadius:7,padding:'4px 10px',color:'#475569'}}>
                                <strong style={{color:'#334155'}}>{c.by}</strong>: {c.text}
                                <span style={{marginLeft:6,color:'#94a3b8',fontSize:10}}>{new Date(c.at).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Action buttons */}
                      <div style={{display:'flex',flexDirection:'column',gap:4,flexShrink:0}}>
                        {isAssignee && task.status !== 'Done' && (
                          <button onClick={()=>{updateTaskById(task.id,{status:'Done'});refresh();}}
                            style={{padding:'5px 10px',background:'#dcfce7',color:'#16a34a',border:'none',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer'}}>✅ Done</button>
                        )}
                        {(isOwner||isHead) && task.status === 'Done' && (
                          <button onClick={()=>setCommentTask(task)}
                            style={{padding:'5px 10px',background:'#ede9fe',color:'#7c3aed',border:'none',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer'}}>↩️ Undone</button>
                        )}
                        {(isOwner||isHead) && (
                          <button onClick={()=>{setForm({title:task.title,assignedTo:task.assignedTo,dueDate:task.dueDate||'',dueTime:task.dueTime||'',priority:task.priority,notes:task.notes||''});setEditId(task.id);setShowForm(true);}}
                            style={{padding:'5px 10px',background:'#f1f5f9',color:'#475569',border:'none',borderRadius:8,fontSize:11,fontWeight:600,cursor:'pointer'}}>✏️ Edit</button>
                        )}
                        <button onClick={()=>setCommentTask(task)}
                          style={{padding:'5px 10px',background:'#f8fafc',color:'#64748b',border:'1px solid #e2e8f0',borderRadius:8,fontSize:11,fontWeight:600,cursor:'pointer'}}>💬</button>
                        {(isOwner||isHead) && (
                          <button onClick={()=>{if(confirm('Delete this task?')){deleteTaskById(task.id);refresh();}}}
                            style={{padding:'5px 10px',background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:8,fontSize:11,fontWeight:600,cursor:'pointer'}}>🗑️</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{display:'flex',flexDirection:'column',gap:12,position:'sticky',top:70}}>

          {/* Alerts */}
          {(overdueN > 0 || dueSoonN > 0) && (
            <div style={{background:'white',borderRadius:14,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.06)',border:'1.5px solid #fca5a5'}}>
              <div style={{padding:'10px 14px',background:'#fee2e2'}}>
                <div style={{fontSize:13,fontWeight:700,color:'#dc2626'}}>🔔 Alerts</div>
              </div>
              <div style={{padding:10,display:'flex',flexDirection:'column',gap:5,maxHeight:180,overflowY:'auto'}}>
                {myTasks.filter(t=>getTaskStatus(t)==='Overdue'||getTaskStatus(t)==='DueSoon').map(t=>{
                  const st=getTaskStatus(t); const sc=STATUS_CFG[st];
                  return (
                    <div key={t.id} style={{padding:'7px 10px',borderRadius:9,background:sc.bg}}>
                      <div style={{fontSize:12,fontWeight:700,color:sc.color}}>{sc.icon} {t.title}</div>
                      {t.dueDate&&<div style={{fontSize:10.5,color:'#64748b'}}>Due: {t.dueDate} {t.dueTime}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Assign */}
          {(canAssign||isHead) && (
            <div style={{background:'white',borderRadius:14,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
              <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',background:'#f8fafc'}}>
                <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>⚡ Quick Assign</div>
              </div>
              <div style={{padding:12,display:'flex',flexDirection:'column',gap:7}}>
                {assignable.map(m=>{
                  const p = tasks.filter(t=>t.assignedTo===m.uid&&getTaskStatus(t)!=='Done').length;
                  const ov= tasks.filter(t=>t.assignedTo===m.uid&&getTaskStatus(t)==='Overdue').length;
                  return (
                    <div key={m.uid} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 8px',borderRadius:9,background:'#f8fafc'}}>
                      <div style={{width:28,height:28,borderRadius:8,background:`${m.color}20`,display:'flex',alignItems:'center',justifyContent:'center',color:m.color,fontSize:11,fontWeight:800,flexShrink:0}}>
                        {m.name.split(' ').map(x=>x[0]).join('').slice(0,2)}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,color:'#334155'}}>{m.name}</div>
                        <div style={{fontSize:10.5,color:'#94a3b8'}}>{p} pending {ov>0&&<span style={{color:'#dc2626',fontWeight:700}}>· {ov} overdue</span>}</div>
                      </div>
                      <button onClick={()=>{setForm({...EF,assignedTo:m.uid});setShowForm(true);}}
                        style={{fontSize:11,padding:'3px 9px',background:'#dbeafe',color:'#1d4ed8',border:'none',borderRadius:7,cursor:'pointer',fontWeight:700}}>
                        Assign
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Habits */}
          <div style={{background:'white',borderRadius:14,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
            <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',background:'#f8fafc',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>➕ My Custom Habits</div>
              <button onClick={()=>setShowHabit(true)} style={{fontSize:11,padding:'3px 9px',background:'#2563eb',color:'white',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700}}>+ Add</button>
            </div>
            {customs.length===0 ? (
              <div style={{padding:18,textAlign:'center',color:'#94a3b8',fontSize:12}}>No custom habits yet</div>
            ) : (
              <div style={{padding:10,display:'flex',flexDirection:'column',gap:5,maxHeight:250,overflowY:'auto'}}>
                {customs.map(h=>(
                  <div key={h.id} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:9,background:'#f8fafc'}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:'#334155'}}>{h.habit}</div>
                      <div style={{fontSize:10.5,color:'#94a3b8'}}>{h.frequency} · {h.sop}</div>
                    </div>
                    <button onClick={()=>{deleteCustomHabit(user.uid,h.id);refresh();}} style={{fontSize:12,padding:'2px 7px',background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:6,cursor:'pointer'}}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ADD/EDIT MODAL ── */}
      {showForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.55)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{background:'white',borderRadius:20,width:'100%',maxWidth:440,boxShadow:'0 24px 60px rgba(0,0,0,0.25)',overflow:'hidden'}}>
            <div style={{padding:'14px 20px',background:'linear-gradient(135deg,#1e3a8a,#2563eb)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{color:'white',fontWeight:700,fontSize:15}}>{editId?'Edit':'New'} Task</div>
              <button onClick={()=>{setShowForm(false);setEditId(null);setForm(EF);}} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,width:28,height:28,cursor:'pointer',color:'white',fontSize:16}}>×</button>
            </div>
            <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:12}}>
              <div>
                <label style={{display:'block',fontSize:11,fontWeight:700,color:'#475569',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Task *</label>
                <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Task description..."
                  style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13.5,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
              </div>
              {(canAssign||isHead) && (
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:700,color:'#475569',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Assign To</label>
                  <select value={form.assignedTo} onChange={e=>setForm(p=>({...p,assignedTo:e.target.value}))}
                    style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none',background:'white',fontFamily:'inherit',cursor:'pointer',boxSizing:'border-box'}}>
                    <option value="">— Assign to myself —</option>
                    {assignable.map(m=><option key={m.uid} value={m.uid}>{m.name}</option>)}
                  </select>
                </div>
              )}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:700,color:'#475569',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}
                    style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:700,color:'#475569',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Due Time</label>
                  <input type="time" value={form.dueTime} onChange={e=>setForm(p=>({...p,dueTime:e.target.value}))}
                    style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:11,fontWeight:700,color:'#475569',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Priority</label>
                <div style={{display:'flex',gap:7}}>
                  {Object.entries(PRI_CFG).map(([k,v])=>(
                    <button key={k} onClick={()=>setForm(p=>({...p,priority:k}))}
                      style={{flex:1,padding:'7px',borderRadius:9,border:'1.5px solid',cursor:'pointer',fontSize:12,fontWeight:700,
                        background:form.priority===k?v.bg:'white',borderColor:form.priority===k?v.color:'#e2e8f0',color:form.priority===k?v.color:'#94a3b8'}}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{display:'block',fontSize:11,fontWeight:700,color:'#475569',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Notes</label>
                <input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Optional..."
                  style={{width:'100%',padding:'8px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
              </div>
              <div style={{display:'flex',gap:8,paddingTop:4}}>
                <button onClick={submitTask} disabled={!form.title}
                  style={{flex:1,padding:'11px',background:'#2563eb',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',opacity:!form.title?0.5:1}}>
                  {editId?'Update':'Add Task'}
                </button>
                <button onClick={()=>{setShowForm(false);setEditId(null);setForm(EF);}}
                  style={{padding:'11px 16px',background:'#f1f5f9',color:'#475569',border:'none',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer'}}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COMMENT MODAL ── */}
      {commentTask && (
        <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.55)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{background:'white',borderRadius:20,width:'100%',maxWidth:400,boxShadow:'0 24px 60px rgba(0,0,0,0.25)',overflow:'hidden'}}>
            <div style={{padding:'14px 20px',background:'linear-gradient(135deg,#7c3aed,#a855f7)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{color:'white',fontWeight:700,fontSize:15}}>💬 Comment</div>
              <button onClick={()=>{setCommentTask(null);setCommentText('');}} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,width:28,height:28,cursor:'pointer',color:'white',fontSize:16}}>×</button>
            </div>
            <div style={{padding:'16px 20px'}}>
              <div style={{fontSize:13,color:'#334155',fontWeight:600,marginBottom:10,padding:'8px 12px',background:'#f8fafc',borderRadius:10}}>
                📋 {commentTask.title}
              </div>
              <textarea value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Write your comment..." rows={3}
                style={{width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13,outline:'none',fontFamily:'inherit',resize:'none',boxSizing:'border-box'}}/>
              <div style={{display:'flex',gap:8,marginTop:10}}>
                {(isHead||(user.canAssign&&commentTask.assignedBy===user.uid)) && commentTask.status==='Done' && (
                  <button onClick={()=>submitComment(true)} disabled={!commentText}
                    style={{flex:1,padding:'10px',background:'#ede9fe',color:'#7c3aed',border:'none',borderRadius:11,fontSize:12.5,fontWeight:700,cursor:'pointer',opacity:!commentText?0.5:1}}>
                    ↩️ Undone + Comment
                  </button>
                )}
                <button onClick={()=>submitComment(false)} disabled={!commentText}
                  style={{flex:1,padding:'10px',background:'#2563eb',color:'white',border:'none',borderRadius:11,fontSize:12.5,fontWeight:700,cursor:'pointer',opacity:!commentText?0.5:1}}>
                  💬 Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM HABIT MODAL ── */}
      {showHabit && (
        <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.55)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{background:'white',borderRadius:20,width:'100%',maxWidth:400,boxShadow:'0 24px 60px rgba(0,0,0,0.25)',overflow:'hidden'}}>
            <div style={{padding:'14px 20px',background:'linear-gradient(135deg,#059669,#10b981)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{color:'white',fontWeight:700,fontSize:15}}>➕ Custom Habit</div>
              <button onClick={()=>setShowHabit(false)} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,width:28,height:28,cursor:'pointer',color:'white',fontSize:16}}>×</button>
            </div>
            <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:12}}>
              <input value={habitForm.habit} onChange={e=>setHabitForm(p=>({...p,habit:e.target.value}))} placeholder="Habit name *"
                style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e2e8f0',borderRadius:10,fontSize:13.5,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <select value={habitForm.frequency} onChange={e=>setHabitForm(p=>({...p,frequency:e.target.value}))}
                  style={{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:9,fontSize:12.5,outline:'none',background:'white',cursor:'pointer',boxSizing:'border-box'}}>
                  {['Daily','Weekly','Fortnightly','Monthly','Quarterly','As Required'].map(f=><option key={f}>{f}</option>)}
                </select>
                <input value={habitForm.sop} onChange={e=>setHabitForm(p=>({...p,sop:e.target.value}))} placeholder="Category"
                  style={{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:9,fontSize:12.5,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={submitHabit} disabled={!habitForm.habit}
                  style={{flex:1,padding:'10px',background:'#10b981',color:'white',border:'none',borderRadius:11,fontSize:13,fontWeight:700,cursor:'pointer',opacity:!habitForm.habit?0.5:1}}>
                  Add Habit
                </button>
                <button onClick={()=>setShowHabit(false)}
                  style={{padding:'10px 16px',background:'#f1f5f9',color:'#475569',border:'none',borderRadius:11,fontSize:13,fontWeight:600,cursor:'pointer'}}>
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
