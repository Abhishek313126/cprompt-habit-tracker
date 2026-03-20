// C Prompt Solutions – Storage & Auth

export function setCurrentUser(u) {
  localStorage.setItem('cprompt_user', JSON.stringify(u));
}
export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('cprompt_user') || 'null'); } catch { return null; }
}
export function logout() {
  localStorage.removeItem('cprompt_user');
}

export function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function getDateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function saveCheckin(uid, date, habitId, status, note) {
  const key = `cprompt_ci_${uid}_${date}`;
  const existing = JSON.parse(localStorage.getItem(key) || '{}');
  existing[habitId] = { habitId, status, note: note||'', ts: Date.now() };
  localStorage.setItem(key, JSON.stringify(existing));
}
export function getCheckinsByUserDate(uid, date) {
  try { return JSON.parse(localStorage.getItem(`cprompt_ci_${uid}_${date}`) || '{}'); } catch { return {}; }
}
export function getCheckinsInRange(uid, from, to) {
  const result = [];
  const start = new Date(from), end = new Date(to);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const ci = getCheckinsByUserDate(uid, ds);
    Object.values(ci).forEach(c => result.push({ ...c, date: ds, uid }));
  }
  return result;
}
export function getAllCheckinsInRange(from, to) {
  const result = [];
  const start = new Date(from), end = new Date(to);
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith('cprompt_ci_')) continue;
    const parts = k.split('_');
    const date = parts[parts.length - 1];
    if (date >= from && date <= to) {
      try {
        const uid = parts.slice(2, parts.length-1).join('_');
        const ci = JSON.parse(localStorage.getItem(k) || '{}');
        Object.values(ci).forEach(c => result.push({ ...c, date, uid }));
      } catch {}
    }
  }
  return result;
}
export function calcStreak(uid, dailyHabits) {
  if (!dailyHabits.length) return { current:0, longest:0 };
  let current = 0, longest = 0, streak = 0;
  const today = getToday();
  for (let i = 0; i < 60; i++) {
    const d = getDateNDaysAgo(i);
    const ci = getCheckinsByUserDate(uid, d);
    const done = dailyHabits.filter(h => ci[h.id]?.status === 'Done ✅').length;
    if (done === dailyHabits.length && dailyHabits.length > 0) {
      streak++;
      if (i === 0 || current > 0) current = streak;
      longest = Math.max(longest, streak);
    } else { if (i === 0) current = 0; streak = 0; }
  }
  return { current, longest };
}
// ── HABIT DUE STATUS (for non-daily habits) ────────────────────────────────────
// Returns: 'Done' | 'DueSoon' | 'Overdue' | 'Pending' | 'NotDue'
export function getHabitDueStatus(uid, habitId, frequency) {
  // How many days back to check for each frequency
  const windows = {
    'Daily':       { period: 1,  warnAt: 1,  overdueAt: 1  },
    'Weekly':      { period: 7,  warnAt: 5,  overdueAt: 7  },
    'Fortnightly': { period: 15, warnAt: 12, overdueAt: 15 },
    'Monthly':     { period: 30, warnAt: 25, overdueAt: 30 },
    'Monthly ':    { period: 30, warnAt: 25, overdueAt: 30 },
    'Quarterly':   { period: 90, warnAt: 80, overdueAt: 90 },
    'Yearly':      { period: 365,warnAt:355, overdueAt:365 },
  };
  const cfg = windows[frequency];
  if (!cfg) return 'NotDue'; // As Required, When Delayed — skip

  // Check if done in the last `period` days
  let lastDoneAgo = cfg.period + 1; // assume never done
  for (let i = 0; i < cfg.period; i++) {
    const d = getDateNDaysAgo(i);
    const ci = getCheckinsByUserDate(uid, d);
    if (ci[habitId]?.status === 'Done ✅') {
      lastDoneAgo = i;
      break;
    }
  }

  if (lastDoneAgo === 0) return 'Done';                          // done today
  if (lastDoneAgo <= cfg.period && lastDoneAgo < cfg.warnAt) return 'Pending'; // done recently, not yet due
  if (lastDoneAgo < cfg.overdueAt) return 'DueSoon';            // approaching deadline
  return 'Overdue';                                              // past deadline
}

export function exportData() { return JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([k]) => k.startsWith('cprompt_')))); }
export function importData(json) {
  try {
    const d = JSON.parse(json);
    Object.entries(d).forEach(([k,v]) => { if (k.startsWith('cprompt_')) localStorage.setItem(k,v); });
    return true;
  } catch { return false; }
}
