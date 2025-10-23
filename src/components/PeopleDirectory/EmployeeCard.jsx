// src/components/PeopleDirectory/EmployeeCard.jsx
import React from 'react';
import { MoreVertical, Plus, Edit2, Eye, Trash2 } from 'lucide-react';

export default function EmployeeCard({
  employee,
  accent,
  onAddClick,          // (event) => void  (we'll pass the click event up)
  onToggleMenu,        // () => void
  isMenuOpen,          // boolean
  onViewProfile,       // () => void
  onEditEmployee,      // () => void
  onDeleteEmployee,    // () => void
  isHighlighted,
}) {
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
        {/* menu */}
        <button
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 employee-card-menu"
          aria-label="Employee actions"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu?.();
          }}
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {isMenuOpen && (
          <div
            className="absolute top-10 right-3 z-20 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 w-40 employee-card-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEditEmployee?.(employee.id)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onViewProfile?.(employee.id)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Profile
            </button>
            <div className="border-t border-[#E5E7EB] my-1" />
            <button
              onClick={() => onDeleteEmployee?.(employee.id)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}

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

      {/* + Add under card */}
      <button
        onClick={(e) => onAddClick?.(e)}
        className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-6 h-6 rounded-full bg-[#7C6FDC] text-white flex items-center justify-center shadow hover:brightness-95"
        aria-label="Add Employee under this manager"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}