// src/components/calendar/utils.js

export const hourHeight = 100; // taller calendar
export const dayStartHour = 5;
export const dayEndHour = 11;

export const minEventHeight = 100; // min card height
export const laneGap = 8; // gap between overlapping lanes

export function startOfWeek(date, weekStartsOn = 1) {
  const d = new Date(date);
  const day = (d.getDay() + 7 - weekStartsOn) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(selectedDate, opts = {}) {
  if (opts.startFromSelected) {
    const base = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    return [...Array(7)].map((_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }
  const start = startOfWeek(selectedDate, 1);
  return [...Array(7)].map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// LOCAL date key (no UTC)
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
  return Math.max(minEventHeight, ((endMin - startMin) / 60) * hourHeight);
}

export function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// "06 AM"
export function formatHourLabel(h) {
  const label = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${String(label).padStart(2, '0')} ${ampm}`;
}

export function isWeekend(d) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

// Tailwind classes for dot (kept for reuse elsewhere)
export const themeClasses = {
  purple: { dot: 'bg-purple-500', stripe: 'bg-gradient-to-r from-purple-300 to-purple-500' },
  indigo: { dot: 'bg-indigo-500', stripe: 'bg-gradient-to-r from-indigo-300 to-indigo-500' },
  lavender: { dot: 'bg-violet-500', stripe: 'bg-gradient-to-r from-violet-300 to-violet-500' },
  teal: { dot: 'bg-teal-500', stripe: 'bg-gradient-to-r from-teal-300 to-teal-500' },
  green: { dot: 'bg-emerald-500', stripe: 'bg-gradient-to-r from-emerald-300 to-emerald-500' },
  blue: { dot: 'bg-blue-500', stripe: 'bg-gradient-to-r from-blue-300 to-blue-500' },
  orange: { dot: 'bg-amber-500', stripe: 'bg-gradient-to-r from-amber-300 to-amber-500' },
  magenta: { dot: 'bg-fuchsia-500', stripe: 'bg-gradient-to-r from-fuchsia-300 to-fuchsia-500' },
  slate: { dot: 'bg-slate-500', stripe: 'bg-gradient-to-r from-slate-300 to-slate-500' },
};

// Exact hex for stripes (solid diagonal lines)
export const themeHex = {
  purple: '#6C5DD3',
  indigo: '#6366F1',
  lavender: '#8B5CF6',
  teal: '#14B8A6',
  green: '#10B981',
  blue: '#3B82F6',
  orange: '#F59E0B',
  magenta: '#EC4899',
  slate: '#64748B',
};