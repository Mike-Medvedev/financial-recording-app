function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getWeekKey(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toISODate(d);
}

export function getWeekRange(weekKey: string): { start: string; end: string } {
  const monday = parseDate(weekKey);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: toISODate(monday), end: toISODate(sunday) };
}

export function getDaysInWeek(weekKey: string): string[] {
  const monday = parseDate(weekKey);
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(toISODate(d));
  }
  return days;
}

export function shiftWeek(weekKey: string, offset: number): string {
  const d = parseDate(weekKey);
  d.setDate(d.getDate() + offset * 7);
  return toISODate(d);
}

export function formatWeekLabel(weekKey: string): string {
  const { start, end } = getWeekRange(weekKey);
  const s = parseDate(start);
  const e = parseDate(end);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const sameMonth = s.getMonth() === e.getMonth();
  const startStr = `${months[s.getMonth()]} ${s.getDate()}`;
  const endStr = sameMonth
    ? `${e.getDate()}`
    : `${months[e.getMonth()]} ${e.getDate()}`;

  return `${startStr} – ${endStr}, ${s.getFullYear()}`;
}

export function formatDayShort(iso: string): string {
  const d = parseDate(iso);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
}

export function formatDayNumber(iso: string): string {
  return String(parseDate(iso).getDate());
}

export function isToday(iso: string): boolean {
  return iso === toISODate(new Date());
}
