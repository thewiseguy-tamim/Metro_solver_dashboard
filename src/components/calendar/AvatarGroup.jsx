import React from 'react';

const initials = (name) => {
  const parts = name.trim().split(' ');
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
};

export default function AvatarGroup({ ids = [], peopleMap, max = 4 }) {
  const users = ids.map((id) => peopleMap.get(id)).filter(Boolean);
  const extra = Math.max(users.length - max, 0);

  return (
    <div className="flex -space-x-1">
      {users.slice(0, max).map((u) => (
        <div
          key={u.id}
          className="w-5 h-5 rounded-full border border-white text-[10px] font-semibold flex items-center justify-center"
          style={{ backgroundColor: u.color, color: 'white' }}
          title={u.name}
        >
          {initials(u.name)}
        </div>
      ))}
      {extra > 0 && (
        <div className="w-5 h-5 rounded-full border border-white bg-gray-100 text-[10px] text-gray-600 font-semibold flex items-center justify-center">
          +{extra}
        </div>
      )}
    </div>
  );
}