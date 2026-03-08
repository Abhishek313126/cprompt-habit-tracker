export default function MiniBarChart({ data = [], height = 60 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'4px', height:`${height}px` }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' }}>
          <div style={{
            width:'100%', borderRadius:'4px 4px 0 0', background: d.active ? '#2563eb' : '#bfdbfe',
            height:`${Math.max((d.value/max)*height*0.85, 2)}px`, transition:'height 0.4s ease',
          }} title={`${d.label}: ${d.value}`} />
          <div style={{ fontSize:'9px', color:'#94a3b8', textAlign:'center', whiteSpace:'nowrap', overflow:'hidden', maxWidth:'32px', textOverflow:'ellipsis' }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}
