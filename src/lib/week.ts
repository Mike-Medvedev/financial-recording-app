/**
 * Week helpers: weeks are Monday–Sunday.
 * Week key = ISO date string of the Monday (e.g. "2026-03-02").
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getWeekKey(date: Date): string {
  const d = new Date(date.getTime());
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const mondayMs = d.getTime() - diff * MS_PER_DAY;
  return formatDateKey(mondayMs);
}

export function getWeekKeyFromString(dateStr: string): string {
  return getWeekKey(new Date(dateStr + "Z"));
}

/** Parse YYYY-MM-DD as noon UTC to avoid timezone/DST issues. */
function parseDateKey(key: string): number {
  return new Date(key + "T12:00:00.000Z").getTime();
}

/** Format timestamp to YYYY-MM-DD (UTC). */
function formatDateKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Returns [mondayDate, sundayDate] as ISO date strings. */
export function getWeekRange(weekKey: string): [string, string] {
  const mondayMs = parseDateKey(weekKey);
  const sundayMs = mondayMs + 6 * MS_PER_DAY;
  return [weekKey, formatDateKey(sundayMs)];
}

/** Returns the 7 dates (Mon–Sun) as ISO date strings for the given week. */
export function getDaysInWeek(weekKey: string): string[] {
  const mondayMs = parseDateKey(weekKey);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(formatDateKey(mondayMs + i * MS_PER_DAY));
  }
  return dates;
}

/** Format week key for display e.g. "Mar 2 – Mar 8, 2026". */
export function formatWeekLabel(weekKey: string): string {
  const [mon, sun] = getWeekRange(weekKey);
  const m = new Date(parseDateKey(mon));
  const s = new Date(parseDateKey(sun));
  const monStr = m.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const sunStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${monStr} – ${sunStr}`;
}
