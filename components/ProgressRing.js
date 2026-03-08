export default function ProgressRing({ pct=0, size=80, stroke=7, label='', sublabel='', color='#2563eb' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          className="progress-ring-circle" />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontSize: size > 60 ? '16px' : '12px', fontWeight:800, color:'#0f172a', lineHeight:1 }}>{label || `${pct}%`}</div>
        {sublabel && <div style={{ fontSize:'9px', color:'#94a3b8', marginTop:'2px' }}>{sublabel}</div>}
      </div>
    </div>
  );
}
