import React from 'react';
import AvatarGroup from './AvatarGroup';
import { themeClasses } from './utils';

export default function EmployeeCard({ title, name, time, participants = [], platform = '', theme = 'purple', peopleMap }) {
  const t = themeClasses[theme] || themeClasses.purple;
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm relative overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-2">
          <span className={`w-5 h-5 rounded-full ${t.dot}`} />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">{name}</p>
            <p className="text-xs text-gray-500 truncate">{title}</p>
            <p className="text-[11px] text-gray-500 mt-1">{time}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <AvatarGroup ids={participants} peopleMap={peopleMap} />
          {platform && (
            <span className="px-2 py-0.5 rounded-md text-[11px] text-gray-600 bg-gray-50 border border-gray-200">
              {platform}
            </span>
          )}
        </div>
      </div>
      <div className={`absolute left-3 right-3 bottom-1.5 h-1.5 rounded-full ${t.stripe}`} />
    </div>
  );
}
