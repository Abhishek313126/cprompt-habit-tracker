// Task Management Storage — C Prompt Solutions Finance Team

const TASKS_KEY        = 'cprompt_tasks';
const CUSTOM_TASKS_KEY = 'cprompt_custom_habits';

// ── DATE HELPERS ───────────────────────────────────────────────────────────────

export function getToday() {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// ── RECURRENCE CONFIG ──────────────────────────────────────────────────────────
// recurrence: 'none' | 'daily' | 'weekly' | 'monthly'
// For recurring tasks, dueDate is the NEXT due date (auto-advanced after Done)

export const RECURRENCE_OPTIONS = [
  { value: 'none',    label: 'One-time',  icon: '1️⃣' },
  { value: 'daily',   label: 'Daily',     icon: '🔁' },
  { value: 'weekly',  label: 'Weekly',    icon: '📅' },
  { value: 'monthly', label: 'Monthly',   icon: '📆' },
];

function nextDueDate(recurrence, fromDate) {
  if (recurrence === 'daily')   return addDays(fromDate, 1);
  if (recurrence === 'weekly')  return addDays(fromDate, 7);
  if (recurrence === 'monthly') {
    const d = new Date(fromDate + 'T00:00:00');
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  }
  return fromDate;
}

// ── TASKS ──────────────────────────────────────────────────────────────────────

export function getAllTasks() {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'); } catch { return []; }
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function addTask(task) {
  const tasks = getAllTasks();
  const today = getToday();
  const newTask = {
    ...task,
    id:          Date.now().toString(),
    createdAt:   new Date().toISOString(),
    recurrence:  task.recurrence || 'none',
    status:      'Pending',
    lastDoneDate: null,
    comments:    [],
    // if daily recurring and no dueDate set, default to today
    dueDate: task.dueDate || (task.recurrence && task.recurrence !== 'none' ? today : ''),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function updateTask(taskId, updates) {
  const tasks  = getAllTasks();
  const idx    = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...updates };
  saveTasks(tasks);
  return tasks[idx];
}

// Mark a recurring task Done → auto-advance dueDate, reset to Pending for next cycle
export function markTaskDone(taskId) {
  const tasks = getAllTasks();
  const idx   = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return;

  const task = tasks[idx];
  const today = getToday();

  if (task.recurrence && task.recurrence !== 'none') {
    // Recurring: record completion history, advance next due date, keep Pending
    const history = task.completionHistory || [];
    history.push({ date: today, doneAt: new Date().toISOString() });

    const baseDue  = task.dueDate || today;
    const newDue   = nextDueDate(task.recurrence, baseDue);

    tasks[idx] = {
      ...task,
      status:            'Done',      // shows Done today
      lastDoneDate:      today,
      completionHistory: history,
      nextDueDate:       newDue,      // stored for display
    };
  } else {
    // One-time: just mark done
    tasks[idx] = { ...task, status: 'Done', lastDoneDate: today };
  }

  saveTasks(tasks);
}

// Daily auto-reset: call this on app load — resets recurring tasks whose dueDate has passed
export function autoResetRecurringTasks() {
  const tasks   = getAllTasks();
  const today   = getToday();
  let changed   = false;

  tasks.forEach((task, idx) => {
    if (!task.recurrence || task.recurrence === 'none') return;
    if (task.status !== 'Done') return;

    // If today >= nextDueDate (or dueDate if no nextDueDate), reset to Pending
    const nextDue = task.nextDueDate || nextDueDate(task.recurrence, task.dueDate || today);
    if (today >= nextDue) {
      tasks[idx] = {
        ...task,
        status:   'Pending',
        dueDate:  nextDue,
        nextDueDate: null,
      };
      changed = true;
    }
  });

  if (changed) saveTasks(tasks);
}

export function addComment(taskId, comment, commentBy) {
  const tasks = getAllTasks();
  const idx   = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return;
  tasks[idx].comments = tasks[idx].comments || [];
  tasks[idx].comments.push({ text: comment, by: commentBy, at: new Date().toISOString() });
  saveTasks(tasks);
}

export function deleteTask(taskId) {
  saveTasks(getAllTasks().filter(t => t.id !== taskId));
}

// ── TASK STATUS LOGIC ──────────────────────────────────────────────────────────

export function getTaskStatus(task) {
  // For recurring tasks done today → show Done
  if (task.status === 'Done' && task.lastDoneDate === getToday()) return 'Done';
  // For recurring tasks done before → auto-reset logic handles it, but show pending
  if (task.status === 'Done' && task.recurrence && task.recurrence !== 'none') return 'Pending';
  if (task.status === 'Done')   return 'Done';
  if (task.status === 'Undone') return 'Undone';

  if (!task.dueDate) return 'Pending';

  const now    = new Date();
  const due    = new Date(task.dueDate + (task.dueTime ? 'T' + task.dueTime : 'T23:59:00'));
  const diffMs = due - now;
  const diffHr = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) return 'Overdue';
  if (diffHr <= 24) return 'DueSoon';
  return 'Pending';
}

// ── COMPLETION STREAK (for recurring tasks) ────────────────────────────────────

export function getTaskStreak(task) {
  if (!task.completionHistory || task.completionHistory.length === 0) return 0;
  const sorted = [...task.completionHistory].sort((a,b) => b.date.localeCompare(a.date));
  let streak = 0;
  let expected = getToday();

  // Allow today OR yesterday as start (if not yet done today)
  if (sorted[0].date !== expected) {
    expected = addDays(expected, -1);
  }

  for (const entry of sorted) {
    if (entry.date === expected) {
      streak++;
      expected = addDays(expected, -1);
    } else break;
  }
  return streak;
}

// ── MY TASKS FOR A USER ────────────────────────────────────────────────────────

export function getMyTasks(uid) {
  return getAllTasks().filter(t => t.assignedTo === uid);
}

export function getAssignedByMe(uid) {
  return getAllTasks().filter(t => t.assignedBy === uid && t.assignedTo !== uid);
}

// ── CUSTOM HABITS ─────────────────────────────────────────────────────────────

export function getCustomHabits(uid) {
  try {
    const all = JSON.parse(localStorage.getItem(CUSTOM_TASKS_KEY) || '{}');
    return all[uid] || [];
  } catch { return []; }
}

export function addCustomHabit(uid, habit) {
  try {
    const all = JSON.parse(localStorage.getItem(CUSTOM_TASKS_KEY) || '{}');
    if (!all[uid]) all[uid] = [];
    all[uid].push({ ...habit, id: 'CH' + Date.now(), custom: true });
    localStorage.setItem(CUSTOM_TASKS_KEY, JSON.stringify(all));
  } catch {}
}

export function deleteCustomHabit(uid, habitId) {
  try {
    const all = JSON.parse(localStorage.getItem(CUSTOM_TASKS_KEY) || '{}');
    if (all[uid]) all[uid] = all[uid].filter(h => h.id !== habitId);
    localStorage.setItem(CUSTOM_TASKS_KEY, JSON.stringify(all));
  } catch {}
}
