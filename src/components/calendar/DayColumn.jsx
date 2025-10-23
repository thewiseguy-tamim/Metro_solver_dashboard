// src/components/calendar/DayColumn.jsx
import React, { useMemo } from 'react';
import EventCard from './EventCard';
import { dateKey, hourHeight, dayStartHour, dayEndHour, timeToMinutes } from './utils';

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

  // Assign lanes to overlapping events
  const laidOut = useMemo(() => {
    const items = dayEvents.map((e) => ({
      e,
      start: timeToMinutes(e.start),
      end: timeToMinutes(e.end),
      lane: 0,
      group: 0,
    }));

    let active = [];
    let group = -1;
    const groupLaneMax = [];

    for (const item of items) {
      active = active.filter((it) => it.end > item.start);
      if (active.length === 0) group += 1;

      const used = new Set(active.map((a) => a.lane));
      let lane = 0;
      while (used.has(lane)) lane += 1;

      item.lane = lane;
      item.group = group;
      active.push(item);
      groupLaneMax[group] = Math.max(groupLaneMax[group] || 0, lane + 1);
    }

    return items.map((it) => ({
      event: it.e,
      laneIndex: it.lane,
      laneCount: groupLaneMax[it.group],
    }));
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

      {laidOut.map(({ event, laneIndex, laneCount }) => (
        <EventCard
          key={event.id}
          event={event}
          peopleMap={peopleMap}
          laneIndex={laneIndex}
          laneCount={laneCount}
        />
      ))}
    </div>
  );
}