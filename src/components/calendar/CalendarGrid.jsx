import React, { useMemo } from 'react';
import DayColumn from './DayColumn';
import { getWeekDays, hourHeight, dayStartHour, dayEndHour, formatHourLabel, sameDay } from './utils';

export default function CalendarGrid({ selectedDate, events, peopleMap }) {
  const days = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const totalH = (dayEndHour - dayStartHour) * hourHeight;
  const cols = '80px repeat(7, minmax(0, 1fr))';

  return (
    <div className="w-full">
      {/* header row with weekdays */}
      <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: cols }}>
        <div className="h-12" />
        {days.map((d, idx) => {
          const isToday = sameDay(d, new Date());
          return (
            <div key={idx} className="px-4 py-3">
              <div className={`text-sm font-medium ${isToday ? 'text-[#6C5DD3]' : 'text-[#0A0D14]'}`}>
                {d.toLocaleDateString(undefined, { weekday: 'short' })} {String(d.getDate()).padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>

      {/* grid body */}
      <div className="grid" style={{ gridTemplateColumns: cols }}>
        {/* time rail */}
        <div className="relative" style={{ height: totalH }}>
          {[...Array(dayEndHour - dayStartHour + 1)].map((_, i) => {
            const h = dayStartHour + i;
            // Show 06–10 labels only (hide 05 and 11 like the reference)
            if (h === dayStartHour || h === dayEndHour) {
              return (
                <div key={h} className="absolute left-0 right-0" style={{ top: i * hourHeight }} />
              );
            }
            return (
              <div
                key={h}
                className="absolute left-0 right-0 text-xs text-gray-500"
                style={{ top: i * hourHeight - 8 }}
              >
                <div className="pl-4">{formatHourLabel(h)}</div>
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
            shaded={idx === 0 || idx === 6}
          />
        ))}
      </div>
    </div>
  );
}