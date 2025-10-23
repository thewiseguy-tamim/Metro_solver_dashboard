import React, { useMemo } from 'react';
import DayColumn from './DayColumn';
import { getWeekDays, hourHeight, dayStartHour, dayEndHour, formatHourLabel, sameDay } from './utils';

export default function CalendarGrid({ selectedDate, events, peopleMap }) {
  // Start visible range from the selected date (matches the reference)
  const days = useMemo(() => getWeekDays(selectedDate, { startFromSelected: true }), [selectedDate]);
  const totalH = (dayEndHour - dayStartHour) * hourHeight;
  const cols = '88px repeat(7, minmax(0, 1fr))';

  return (
    <div className="w-full">
      {/* header row */}
      <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: cols }}>
        <div className="h-12" />
        {days.map((d, idx) => {
          const isToday = sameDay(d, new Date());
          const dow = d.toLocaleDateString(undefined, { weekday: 'short' });
          const dd = String(d.getDate()).padStart(2, '0');
          return (
            <div key={idx} className="px-4 py-3">
              <div className="flex items-baseline gap-2">
                <div className={`text-sm font-medium ${isToday ? 'text-[#6C5DD3]' : 'text-[#0A0D14]'}`}>
                  {dow}
                </div>
                <div className={`text-sm ${isToday ? 'text-[#6C5DD3]' : 'text-gray-500'}`}>{dd}</div>
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
            if (h === dayStartHour || h === dayEndHour) {
              return <div key={h} className="absolute left-0 right-0" style={{ top: i * hourHeight }} />;
            }
            return (
              <div
                key={h}
                className="absolute left-0 right-0 text-xs text-gray-500"
                style={{ top: i * hourHeight - 8 }}
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
            shaded={idx === 0 || idx === 6}
          />
        ))}
      </div>
    </div>
  );
}