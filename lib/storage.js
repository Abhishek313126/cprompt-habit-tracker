// Storage utility – localStorage based with streak + analytics

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('cp_user') || 'null'); } catch { return null; }
}
export function setCurrentUser(user) {
  localStorage.setItem('cp_user', JSON.stringify(user));
}
export function logout() {
  localStorage.removeItem('cp_user');
}

// date helpers
export function getToday() {
  return new Date().toISOString().split('T')[0];
}
export function getDateNDaysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}
export function dateRange(startDate, endDate) {
  const dates = []; const cur = new Date(startDate);
  const end = new Date(endDate);
  while (cur <= end) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}
export function formatDate(dateStr, opts = {}) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', ...opts });
}

// checkin CRUD
export function getAllCheckins() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem('cp_checkins') || '{}'); } catch { return {}; }
}
export function saveCheckin(uid, date, habitId, status, note = '') {
  const all = getAllCheckins();
  const key = `${uid}__${date}__${habitId}`;
  all[key] = { uid, date, habitId, status, note, ts: Date.now() };
  localStorage.setItem('cp_checkins', JSON.stringify(all));
}
export function getCheckinsByUserDate(uid, date) {
  const all = getAllCheckins();
  const res = {};
  Object.values(all).forEach(v => { if (v.uid === uid && v.date === date) res[v.habitId] = v; });
  return res;
}
export function getCheckinsInRange(uid, start, end) {
  return Object.values(getAllCheckins()).filter(v => v.uid === uid && v.date >= start && v.date <= end);
}
export function getAllCheckinsInRange(start, end) {
  return Object.values(getAllCheckins()).filter(v => v.date >= start && v.date <= end);
}

// streak calculation
export function calcStreak(uid, dailyHabits) {
  if (!dailyHabits.length) return { current: 0, longest: 0, activeDays: [] };
  const all = getAllCheckins();
  const activeDays = new Set();
  Object.values(all).forEach(v => {
    if (v.uid !== uid) return;
    const dayCheckins = Object.values(all).filter(c => c.uid === uid && c.date === v.date);
    const done = dayCheckins.filter(c => c.status === 'Done ✅').length;
    const dailyCount = dailyHabits.length;
    if (dailyCount > 0 && done >= Math.ceil(dailyCount * 0.5)) activeDays.add(v.date);
  });
  const sortedDays = [...activeDays].sort().reverse();
  // current streak
  let current = 0;
  let check = getToday();
  for (let i = 0; i < 365; i++) {
    if (activeDays.has(check)) { current++; const d = new Date(check); d.setDate(d.getDate()-1); check = d.toISOString().split('T')[0]; }
    else break;
  }
  // longest streak
  let longest = 0; let run = 0;
  const all7 = [...activeDays].sort();
  for (let i = 0; i < all7.length; i++) {
    if (i === 0) { run = 1; }
    else {
      const prev = new Date(all7[i-1]); prev.setDate(prev.getDate()+1);
      if (prev.toISOString().split('T')[0] === all7[i]) run++;
      else run = 1;
    }
    longest = Math.max(longest, run);
  }
  return { current, longest, activeDays: [...activeDays] };
}

// heatmap data – last 90 days
export function getHeatmapData(uid, habits) {
  const end = getToday();
  const start = getDateNDaysAgo(89);
  const days = dateRange(start, end);
  const all = getAllCheckins();
  return days.map(date => {
    const dayCheckins = Object.values(all).filter(c => c.uid === uid && c.date === date);
    const done = dayCheckins.filter(c => c.status === 'Done ✅').length;
    const total = dayCheckins.length;
    const pct = total > 0 ? done / total : 0;
    return { date, done, total, pct };
  });
}

// analytics
export function getWeeklyTrend(uid) {
  const weeks = [];
  for (let w = 3; w >= 0; w--) {
    const end = getDateNDaysAgo(w * 7);
    const start = getDateNDaysAgo(w * 7 + 6);
    const checkins = getCheckinsInRange(uid, start, end);
    const done = checkins.filter(c => c.status === 'Done ✅').length;
    const total = checkins.length;
    weeks.push({ label: w === 0 ? 'This Week' : `${w}W ago`, done, total, score: total > 0 ? Math.round(done/total*100) : 0 });
  }
  return weeks;
}

export function exportJSON() {
  return JSON.stringify(getAllCheckins(), null, 2);
}
export function importJSON(str) {
  try {
    const d = JSON.parse(str);
    const merged = { ...getAllCheckins(), ...d };
    localStorage.setItem('cp_checkins', JSON.stringify(merged));
    return { ok: true, count: Object.keys(d).length };
  } catch(e) { return { ok: false }; }
}

// CSV export for a user's report
export function exportCSV(uid, habits, start, end) {
  const checkins = getCheckinsInRange(uid, start, end);
  const rows = [['Habit ID','Habit','SOP','Frequency','Date','Status','Note']];
  habits.forEach(h => {
    const related = checkins.filter(c => c.habitId === h.id);
    if (related.length) {
      related.forEach(c => rows.push([h.id, `"${h.habit.replace(/"/g,'""')}"`, h.sop, h.frequency, c.date, c.status, `"${(c.note||'').replace(/"/g,'""')}"`]));
    } else {
      rows.push([h.id, `"${h.habit.replace(/"/g,'""')}"`, h.sop, h.frequency, '', 'Not Marked', '']);
    }
  });
  return rows.map(r => r.join(',')).join('\n');
}
