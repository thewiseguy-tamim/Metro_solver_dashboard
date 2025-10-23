import React from 'react';
import AvatarGroup from './AvatarGroup';
import { themeClasses, timeToMinutes, minutesToTop, durationToHeight } from './utils';

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

  // Horizontal lane positioning
  const gap = 8; // px between lanes
  const width = `calc((100% - 20px - ${(laneCount - 1) * gap}px) / ${laneCount})`;
  const left = `calc(10px + ${laneIndex} * ((100% - 20px - ${(laneCount - 1) * gap}px) / ${laneCount} + ${gap}px))`;

  return (
    <div className="absolute z-10" style={{ top, height, width, left }}>
      <div className="h-full rounded-xl border border-gray-200 bg-white shadow-[0_8px_24px_rgba(10,13,20,0.06)] relative overflow-hidden">
        <div className="p-3 h-full flex flex-col justify-between">
          {/* header / title */}
          <div className="flex items-start gap-2">
            <span className={`w-5 h-5 rounded-full ${theme.dot} shrink-0 mt-0.5`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-gray-900">
                {organizer?.name || event.title}
              </p>
              {!!event.title && organizer?.name && (
                <p className="text-xs text-gray-600 truncate">{event.title}</p>
              )}
              {!!event.subtitle && (
                <p className="text-xs text-gray-500 truncate">{event.subtitle}</p>
              )}
              <p className="text-[11px] text-gray-500 mt-1">
                {toHumanTime(event.start)} - {toHumanTime(event.end)}
              </p>
            </div>
          </div>

          {/* footer: avatars + platform */}
          <div className="flex items-center justify-between mt-2">
            <AvatarGroup ids={event.participants} peopleMap={peopleMap} size={24} />
            {event.platform && (
              <span className="px-2 py-0.5 rounded-md text-[11px] text-gray-700 bg-gray-50 border border-gray-200">
                {event.platform}
              </span>
            )}
          </div>
        </div>
        {/* bottom stripe */}
        <div className={`absolute left-3 right-3 bottom-1.5 h-1.5 rounded-full ${theme.stripe}`} />
      </div>
    </div>
  );
}