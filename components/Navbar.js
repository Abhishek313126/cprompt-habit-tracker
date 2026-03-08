'use client';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '../lib/storage';

export default function Navbar({ user }) {
  const router = useRouter();
  const path = usePathname();

  const navItems = [
    { href:'/dashboard', label:'Dashboard', icon:'🏠' },
    { href:'/reports', label:'Reports', icon:'📊' },
    { href:'/profile', label:'Profile', icon:'👤' },
    ...(user?.role === 'ADMIN' ? [{ href:'/admin', label:'Admin', icon:'⚙️' }] : []),
  ];

  return (
    <nav style={{ background:'white', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:50, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 16px', height:'58px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'white', fontWeight:900, fontSize:'16px' }}>C</span>
          </div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:700, color:'#0f172a', lineHeight:1.2 }}>C Prompt Solutions</div>
            <div style={{ fontSize:'10px', color:'#94a3b8', lineHeight:1 }}>Finance Tracker</div>
          </div>
        </div>

        {/* Nav links (desktop) */}
        <div style={{ display:'flex', alignItems:'center', gap:'2px' }}>
          {navItems.map(item => (
            <button key={item.href} onClick={() => router.push(item.href)} style={{
              display:'flex', alignItems:'center', gap:'6px', padding:'7px 12px', borderRadius:'9px', border:'none',
              background: path === item.href ? '#eff6ff' : 'transparent',
              color: path === item.href ? '#2563eb' : '#475569',
              fontWeight: path === item.href ? 600 : 500,
              fontSize:'13px', cursor:'pointer', transition:'all 0.15s',
            }}>
              <span style={{ fontSize:'14px' }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ fontSize:'11px', fontFamily:"'JetBrains Mono', monospace", background:'#eff6ff', color:'#2563eb', padding:'5px 10px', borderRadius:'8px', fontWeight:600, border:'1px solid #bfdbfe' }}>
            {user?.uid}
          </div>
          <div style={{ fontSize:'12px', fontWeight:500, color:'#475569', maxWidth:'100px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {user?.name?.split(' ')[0]}
          </div>
          <button onClick={() => { logout(); router.push('/'); }} style={{
            fontSize:'12px', padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'transparent',
            color:'#94a3b8', cursor:'pointer', fontWeight:500, transition:'all 0.15s',
          }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
