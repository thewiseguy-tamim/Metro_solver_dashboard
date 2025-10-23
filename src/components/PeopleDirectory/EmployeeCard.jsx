// src/components/PeopleDirectory/EmployeeCard.jsx
import React from 'react';
import { MoreVertical, Plus } from 'lucide-react';

export default function EmployeeCard({ employee, accent, onAddClick, onMenuClick, isHighlighted }) {
  return (
    <div className="relative">
      <article
        className={[
          'relative w-[260px] bg-white rounded-xl border border-[#E5E7EB] shadow-sm',
          'px-4 py-4',
          isHighlighted ? 'ring-2 ring-[#7C6FDC]' : '',
        ].join(' ')}
        aria-label={`${employee.name} card`}
      >
        <button className="absolute top-2 right-2 p-1 rounded hover:bg-[#F3F4F6]" aria-label="Card menu" onClick={onMenuClick}>
          <MoreVertical className="w-4 h-4 text-[#6B7280]" />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={employee.avatar}
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover ring-1 ring-[#E5E7EB]"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white"
              style={{ backgroundColor: accent || employee.color || '#E5E7EB' }}
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#0A0D14] truncate">{employee.name}</div>
            <div className="text-xs text-[#6B7280] truncate">{employee.position}</div>
            <div className="text-xs text-[#9CA3AF] truncate">{employee.location}</div>
          </div>
        </div>
      </article>

      <button
        onClick={onAddClick}
        className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-6 h-6 rounded-full bg-[#7C6FDC] text-white flex items-center justify-center shadow hover:brightness-95"
        aria-label="Add Employee under this manager"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}