// src/components/calendar/DayColumn.jsx
import React, { useMemo } from 'react';
import EventCard from './EventCard';
import {
  dateKey,
  hourHeight,
  dayStartHour,
  dayEndHour,
  timeToMinutes,
  minutesToTop,
  durationToHeight,
} from './utils';

export default function DayColumn({ date, events, peopleMap, shaded = false }) {
  const key = dateKey(date);

  // Filter and sort events by start time
  const dayEvents = useMemo(() => {
    return events
      .filter((e) => e.date === key)
      .sort(
        (a, b) =>
          timeToMinutes(a.start) - timeToMinutes(b.start) ||
          timeToMinutes(a.end) - timeToMinutes(b.end)
      );
  }, [events, key]);

  // Stack events vertically to avoid any overlap (full-width, no side-by-side lanes)
  const stacked = useMemo(() => {
    let lastBottom = -Infinity;
    const gap = 8; // px gap between stacked cards

    return dayEvents.map((e) => {
      const start = timeToMinutes(e.start);
      const end = timeToMinutes(e.end);
      const naturalTop = minutesToTop(start);
      const naturalHeight = durationToHeight(start, end);

      const top = Math.max(naturalTop, lastBottom + gap);
      const height = naturalHeight;
      lastBottom = top + height;

      return { event: e, top, height };
    });
  }, [dayEvents]);

  const totalH = (dayEndHour - dayStartHour) * hourHeight;

  return (
    <div className="relative border-l border-gray-100" style={{ height: totalH }}>
      {shaded && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)',
          }}
        />
      )}

      {/* hour and half-hour lines */}
      {[...Array((dayEndHour - dayStartHour) * 2 + 1)].map((_, i) => (
        <div
          key={i}
          className={`absolute inset-x-0 border-t ${
            i % 2 === 0 ? 'border-gray-200' : 'border-dashed border-gray-100'
          }`}
          style={{ top: i * (hourHeight / 2) }}
        />
      ))}

      {stacked.map(({ event, top, height }) => (
        <EventCard
          key={event.id}
          event={event}
          peopleMap={peopleMap}
          laneIndex={0}
          laneCount={1}
          topOverride={top}
          heightOverride={height}
        />
      ))}
    </div>
  );
}