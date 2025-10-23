// src/components/calendar/EmployeeCard.jsx
import React from 'react';
import AvatarGroup from './AvatarGroup';
import { themeClasses, themeHex } from './utils';

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

export default function EmployeeCard({
  title,
  name,
  time,
  participants = [],
  platform = '',
  theme = 'purple',
  peopleMap,
  organizerId,
}) {
  const t = themeClasses[theme] || themeClasses.purple;
  const color = themeHex[theme] || themeHex.purple;

  const person = organizerId ? peopleMap?.get(organizerId) : undefined;
  const avatarUrl =
    person?.avatar ||
    person?.photo ||
    person?.image ||
    (organizerId && EXTRA[organizerId]?.avatar) ||
    '';

  const stripeStyle = {
    backgroundImage: `repeating-linear-gradient(45deg, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px)`,
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm relative overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || person?.name || 'Person'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#0A0D14] leading-tight">{name || person?.name}</p>
            <p className="text-xs font-normal text-[#6B7280] truncate leading-tight mt-1">{title}</p>
            <p className="text-[11px] font-normal text-[#9CA3AF] mt-1.5">{time}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <AvatarGroup ids={participants} peopleMap={peopleMap} />
          {platform && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium text-[#6B7280] bg-gray-50 border border-gray-200">
              {platform}
            </span>
          )}
        </div>
      </div>

      {/* Full-width diagonal stripe */}
      <div className="absolute left-0 right-0 bottom-0 h-2" style={stripeStyle} />
    </div>
  );
}