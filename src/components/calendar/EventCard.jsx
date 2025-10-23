// src/components/calendar/EventCard.jsx
import React from 'react';
import AvatarGroup from './AvatarGroup';
import {
  timeToMinutes,
  minutesToTop,
  durationToHeight,
  laneGap,
  themeHex,
} from './utils';

const toHumanTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

// Optional fallbacks if peopleMap has no avatar
const EXTRA = {
  tahsan: { avatar: 'https://i.pravatar.cc/80?u=tahsan' },
  herry: { avatar: 'https://i.pravatar.cc/80?u=herry' },
  herryb: { avatar: 'https://i.pravatar.cc/80?u=herryb' },
  james: { avatar: 'https://i.pravatar.cc/80?u=james' },
  azam: { avatar: 'https://i.pravatar.cc/80?u=azam' },
  tim: { avatar: 'https://i.pravatar.cc/80?u=tim' },
  matt: { avatar: 'https://i.pravatar.cc/80?u=matt' },
  alex: { avatar: 'https://i.pravatar.cc/80?u=alex' },
  mia: { avatar: 'https://i.pravatar.cc/80?u=mia' },
  noah: { avatar: 'https://i.pravatar.cc/80?u=noah' },
  olivia: { avatar: 'https://i.pravatar.cc/80?u=olivia' },
};

export default function EventCard({
  event,
  peopleMap,
  laneIndex = 0,
  laneCount = 1,
  topOverride,
  heightOverride,
}) {
  const startMin = timeToMinutes(event.start);
  const endMin = timeToMinutes(event.end);

  // Use overrides (stacked layout); fall back to time-based positions if not provided
  const top = topOverride ?? minutesToTop(startMin);
  const height = heightOverride ?? durationToHeight(startMin, endMin);

  const themeColor = themeHex[event.theme] || themeHex.purple;
  const organizer = event.organizerId ? peopleMap.get(event.organizerId) : undefined;
  const avatarUrl =
    organizer?.avatar ||
    organizer?.photo ||
    organizer?.image ||
    (event.organizerId && EXTRA[event.organizerId]?.avatar) ||
    '';

  // Full-width card inside the column: 10px gutters, no lanes
  const gap = laneGap;
  const width = `calc((100% - 20px - ${(laneCount - 1) * gap}px) / ${laneCount})`;
  const left = `calc(10px + ${laneIndex} * ((100% - 20px - ${(laneCount - 1) * gap}px) / ${laneCount} + ${gap}px))`;

  // Full-width solid diagonal stripe
  const stripeStyle = {
    backgroundImage: `repeating-linear-gradient(45deg, ${themeColor} 0px, ${themeColor} 4px, transparent 4px, transparent 8px)`,
  };

  return (
    <div className="absolute z-10" style={{ top, height, width, left }}>
      <div className="h-full rounded-xl border border-[#E5E7EB] bg-white shadow-sm relative overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          {/* Header: avatar + texts */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={organizer?.name || 'Organizer'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#0A0D14] leading-tight">
                {organizer?.name || event.title}
              </p>
              {(event.title || event.subtitle) && (
                <p className="text-xs font-normal text-[#6B7280] leading-tight mt-1 truncate">
                  {event.title || event.subtitle}
                </p>
              )}
              {event.subtitle && event.title && (
                <p className="text-xs font-normal text-[#9CA3AF] leading-tight truncate">
                  {event.subtitle}
                </p>
              )}
              <p className="text-[11px] font-normal text-[#9CA3AF] mt-1.5">
                {toHumanTime(event.start)} - {toHumanTime(event.end)}
              </p>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <AvatarGroup ids={event.participants} peopleMap={peopleMap} size={24} />
            {event.platform && (
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium text-[#6B7280] bg-gray-50 border border-gray-200">
                {event.platform}
              </span>
            )}
          </div>
        </div>

        {/* Full-width bottom stripe */}
        <div className="absolute left-0 right-0 bottom-0 h-2" style={stripeStyle} />
      </div>
    </div>
  );
}