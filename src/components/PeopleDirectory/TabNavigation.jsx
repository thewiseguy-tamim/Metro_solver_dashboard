// src/components/PeopleDirectory/TabNavigation.jsx
import React from 'react';

export default function TabNavigation({ tabs, activeTab, onChange }) {
  return (
    <nav className="w-full rounded-xl border border-[#E5E7EB] bg-white" aria-label="People tabs">
      <ul className="flex items-center gap-2 px-3 py-2 overflow-x-auto">
        {tabs.map((t) => {
          const isActive = t.id === activeTab;
          const Icon = t.icon || (() => null);
          return (
            <li key={t.id}>
              <button
                onClick={() => onChange(t.id)}
                className={[
                  'h-11 px-4 rounded-[8px] inline-flex items-center gap-2 border-transparent border-b-2',
                  isActive ? 'text-[#7C6FDC] border-b-[#7C6FDC]' : 'text-[#6B7280] hover:bg-[#F3F4F6]',
                ].join(' ')}
                role="tab"
                aria-selected={isActive}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}