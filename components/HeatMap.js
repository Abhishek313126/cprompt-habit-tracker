import { formatDate } from '../lib/storage';

export default function HeatMap({ data = [] }) {
  function heatClass(pct, total) {
    if (total === 0) return '#f1f5f9';
    if (pct >= 0.9) return '#1d4ed8';
    if (pct >= 0.7) return '#2563eb';
    if (pct >= 0.4) return '#60a5fa';
    if (pct > 0) return '#bfdbfe';
    return '#f1f5f9';
  }
  // Group by week columns
  const weeks = [];
  let week = [];
  data.forEach((d, i) => {
    week.push(d);
    if (week.length === 7 || i === data.length - 1) { weeks.push(week); week = []; }
  });

  return (
    <div>
      <div style={{ display:'flex', gap:'3px', flexWrap:'wrap' }}>
        {weeks.map((w, wi) => (
          <div key={wi} style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
            {w.map((d, di) => (
              <div key={di} title={`${d.date}: ${d.done}/${d.total} done`} style={{
                width:'12px', height:'12px', borderRadius:'2px',
                background: heatClass(d.pct, d.total),
                cursor:'default',
              }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'8px' }}>
        <span style={{ fontSize:'10px', color:'#94a3b8' }}>Less</span>
        {['#f1f5f9','#bfdbfe','#60a5fa','#2563eb','#1d4ed8'].map((c,i) => (
          <div key={i} style={{ width:'10px', height:'10px', background:c, borderRadius:'2px' }} />
        ))}
        <span style={{ fontSize:'10px', color:'#94a3b8' }}>More</span>
      </div>
    </div>
  );
}
