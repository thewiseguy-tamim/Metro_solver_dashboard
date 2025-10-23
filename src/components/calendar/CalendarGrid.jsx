// src/components/calendar/CalendarGrid.jsx
import React, { useMemo } from 'react';
import DayColumn from './DayColumn';
import {
  getWeekDays,
  hourHeight,
  dayStartHour,
  dayEndHour,
  formatHourLabel,
  sameDay,
  isWeekend,
} from './utils';

export default function CalendarGrid({ selectedDate, events, peopleMap }) {
  const days = useMemo(
    () => getWeekDays(selectedDate, { startFromSelected: true }),
    [selectedDate]
  );
  const totalH = (dayEndHour - dayStartHour) * hourHeight;
  const cols = '88px repeat(7, minmax(0, 1fr))';

  return (
    <div className="w-full">
      {/* header row */}
      <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: cols }}>
        <div className="h-16" />
        {days.map((d, idx) => {
          const isToday = sameDay(d, new Date());
          const dow = d.toLocaleDateString(undefined, { weekday: 'short' }); // "Wed"
          const dd = String(d.getDate()).padStart(2, '0'); // "06"
          return (
            <div
              key={idx}
              className="h-16 px-4 flex items-center border-r border-gray-100 last:border-r-0"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-sm font-medium ${
                    isToday ? 'text-[#6C5DD3]' : 'text-[#0A0D14]'
                  }`}
                >
                  {dow}
                </span>
                <span
                  className={`text-sm font-normal ${
                    isToday ? 'text-[#6C5DD3]' : 'text-[#6B7280]'
                  }`}
                >
                  {dd}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* body */}
      <div className="grid" style={{ gridTemplateColumns: cols }}>
        {/* time rail */}
        <div className="relative" style={{ height: totalH }}>
          {[...Array(dayEndHour - dayStartHour + 1)].map((_, i) => {
            const h = dayStartHour + i;
            // Show labels at the hour line, skip the very first and last
            if (h === dayStartHour || h === dayEndHour) {
              return (
                <div
                  key={h}
                  className="absolute left-0 right-0"
                  style={{ top: i * hourHeight }}
                />
              );
            }
            return (
              <div
                key={h}
                className="absolute left-0 right-0 text-xs text-[#6B7280]"
                style={{ top: i * hourHeight, marginTop: -8 }}
              >
                <div className="pl-5">{formatHourLabel(h)}</div>
              </div>
            );
          })}
        </div>

        {/* day columns */}
        {days.map((d, idx) => (
          <DayColumn
            key={idx}
            date={d}
            events={events}
            peopleMap={peopleMap}
            shaded={isWeekend(d)}
          />
        ))}
      </div>
    </div>
  );
}