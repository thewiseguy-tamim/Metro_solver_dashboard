import React from 'react';

const initials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || '').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
};

export default function AvatarGroup({ ids = [], peopleMap, max = 4, size = 24 }) {
  const users = ids.map((id) => peopleMap.get(id)).filter(Boolean);
  const extra = Math.max(users.length - max, 0);
  const dim = `${size}px`;

  return (
    <div className={`flex items-center ${users.length ? '-space-x-1.5' : ''}`}>
      {users.slice(0, max).map((u) => {
        const src = u.avatar || u.photo || u.image || '';
        if (src) {
          return (
            <img
              key={u.id}
              src={src}
              alt={u.name}
              title={u.name}
              className="rounded-full object-cover border-2 border-white shadow-sm"
              style={{ width: dim, height: dim }}
            />
          );
        }
        return (
          <div
            key={u.id}
            title={u.name}
            className="rounded-full border-2 border-white text-[10px] font-semibold flex items-center justify-center shadow-sm"
            style={{
              width: dim,
              height: dim,
              backgroundColor: u.color || '#9CA3AF',
              color: 'white',
            }}
          >
            {initials(u.name)}
          </div>
        );
      })}
      {extra > 0 && (
        <div
          className="rounded-full border-2 border-white bg-gray-100 text-[10px] text-gray-700 font-semibold flex items-center justify-center shadow-sm"
          style={{ width: dim, height: dim }}
          title={`+${extra} more`}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}