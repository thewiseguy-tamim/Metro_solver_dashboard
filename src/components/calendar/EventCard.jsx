// src/components/calendar/EventCard.jsx
import React from 'react';
import { themeClasses, timeToMinutes, minutesToTop, durationToHeight, laneGap } from './utils';

const toHumanTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

export default function EventCard({ event, peopleMap, laneIndex = 0, laneCount = 1 }) {
  const startMin = timeToMinutes(event.start);
  const endMin = timeToMinutes(event.end);
  const top = minutesToTop(startMin);
  const height = durationToHeight(startMin, endMin);
  const theme = themeClasses[event.theme] || themeClasses.purple;
  const organizer = event.organizerId ? peopleMap.get(event.organizerId) : undefined;

  // Lanes: 10px side margins, 8px gap between lanes
  const gap = laneGap;
  const width = `calc((100% - 20px - ${(laneCount - 1) * gap}px) / ${laneCount})`;
  const left = `calc(10px + ${laneIndex} * ((100% - 20px - ${(laneCount - 1) * gap}px) / ${laneCount} + ${gap}px))`;

  return (
    <div className="absolute z-10" style={{ top, height, width, left }}>
      <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm relative overflow-hidden">
        <div className="p-3 h-full flex flex-col">
          {/* Header/content */}
          <div className="flex items-start gap-2.5">
            <span className={`w-6 h-6 rounded-full ${theme.dot} shrink-0`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#0A0D14] leading-tight">
                {organizer?.name || event.title}
              </p>
              {(event.title || event.subtitle) && (
                <p className="text-xs text-[#6B7280] leading-tight mt-1 truncate">
                  {event.title || event.subtitle}
                </p>
              )}
              {event.subtitle && event.title && (
                <p className="text-xs text-[#9CA3AF] leading-tight truncate">{event.subtitle}</p>
              )}
              <p className="text-[11px] text-[#9CA3AF] mt-1.5">
                {toHumanTime(event.start)} - {toHumanTime(event.end)}
              </p>
            </div>
          </div>

          {/* Platform badge at bottom-left (only if exists) */}
          {event.platform && (
            <div className="mt-auto pt-2">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium text-[#6B7280] bg-gray-50 border border-gray-200">
                {event.platform}
              </span>
            </div>
          )}
        </div>

        {/* Bottom colored stripe: 4px height, 8px inset */}
        <div className={`absolute left-2 right-2 bottom-2 h-1 rounded-full ${theme.stripe}`} />
      </div>
    </div>
  );
}