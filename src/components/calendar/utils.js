export const hourHeight = 64; // px per hour
export const dayStartHour = 5;
export const dayEndHour = 11; // keep grid to 11 so 10:30 is visible

export function startOfWeek(date, weekStartsOn = 1) {
  const d = new Date(date);
  const day = (d.getDay() + 7 - weekStartsOn) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(selectedDate) {
  const start = startOfWeek(selectedDate, 1);
  return [...Array(7)].map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// LOCAL date key (no UTC). Matches JSON dates.
export function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTop(min) {
  return ((min - dayStartHour * 60) / 60) * hourHeight;
}

export function durationToHeight(startMin, endMin) {
  return Math.max(36, ((endMin - startMin) / 60) * hourHeight);
}

export function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatHourLabel(h) {
  const label = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${String(label).padStart(2, '0')} ${ampm}`;
}

// Tailwind gradient classes for the colored bottom stripe
export const themeClasses = {
  purple: { dot: 'bg-purple-500', stripe: 'bg-gradient-to-r from-purple-200 to-purple-500' },
  indigo: { dot: 'bg-indigo-500', stripe: 'bg-gradient-to-r from-indigo-200 to-indigo-500' },
  lavender: { dot: 'bg-violet-400', stripe: 'bg-gradient-to-r from-violet-200 to-violet-500' },
  teal: { dot: 'bg-teal-500', stripe: 'bg-gradient-to-r from-teal-200 to-teal-500' },
  green: { dot: 'bg-emerald-500', stripe: 'bg-gradient-to-r from-emerald-200 to-emerald-500' },
  blue: { dot: 'bg-blue-500', stripe: 'bg-gradient-to-r from-blue-200 to-blue-500' },
  orange: { dot: 'bg-amber-500', stripe: 'bg-gradient-to-r from-amber-200 to-amber-500' },
  magenta: { dot: 'bg-fuchsia-500', stripe: 'bg-gradient-to-r from-fuchsia-200 to-fuchsia-500' },
  slate: { dot: 'bg-slate-500', stripe: 'bg-gradient-to-r from-slate-200 to-slate-500' },
};