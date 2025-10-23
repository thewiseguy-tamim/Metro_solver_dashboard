import React from 'react';

export default function Toolbar({ selectedDate, onToday, onPrevWeek, onNextWeek }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          Today
        </button>
        <div className="flex items-center">
          <button
            onClick={onPrevWeek}
            className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6L9 12L15 18"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={onNextWeek}
            className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6L15 12L9 18"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
          Weekly
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 8L10 12L14 8"
              stroke="#6B7280"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="1.6" />
            <circle cx="8" cy="12" r="1.2" fill="#6B7280" />
            <circle cx="12" cy="12" r="1.2" fill="#6B7280" />
            <circle cx="16" cy="12" r="1.2" fill="#6B7280" />
          </svg>
          Filter
        </button>
        <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#6B7280" strokeWidth="1.6" />
            <path d="M7 10l5-5l5 5" stroke="#6B7280" strokeWidth="1.6" />
            <path d="M12 5v12" stroke="#6B7280" strokeWidth="1.6" />
          </svg>
          Export
        </button>
      </div>
    </div>
  );
}