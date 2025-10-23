// src/components/PeopleDirectory/EmployeeList.jsx
import React from 'react';
import { Check } from 'lucide-react';

export default function EmployeeList({ employees, selected, onToggleSelect }) {
  return (
    <aside className="rounded-xl border border-[#E5E7EB] bg-white p-3" aria-label="Employees list">
      <div className="text-sm font-medium text-[#0A0D14] px-2 py-1.5">Employees</div>
      <ul className="mt-2 max-h-[560px] overflow-auto pr-1">
        {employees.map((p) => {
          const isSel = selected.includes(p.id);
          return (
            <li key={p.id} className="px-1">
              <button
                onClick={() => onToggleSelect(p.id)}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-left',
                  isSel ? 'bg-[#7C6FDC] text-white' : 'hover:bg-[#F3F4F6]',
                ].join(' ')}
              >
                <img
                  src={p.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                />
                <div className="flex-1 min-w-0">
                  <div className={['text-sm font-medium truncate', isSel ? 'text-white' : 'text-[#0A0D14]'].join(' ')}>
                    {p.name}
                  </div>
                  <div className={['text-xs truncate', isSel ? 'text-white/90' : 'text-[#6B7280]'].join(' ')}>
                    {p.handle}
                  </div>
                </div>
                {isSel && <Check className="w-4 h-4" />}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}