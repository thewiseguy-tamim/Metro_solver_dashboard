import React, { useMemo, useState } from 'react';

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function isSameDate(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DatePicker({ value, onChange, onClose }) {
  const [view, setView] = useState(value || new Date());

  const monthDays = useMemo(() => {
    const start = startOfMonth(view);
    const end = endOfMonth(view);
    const startWeekday = (start.getDay() + 6) % 7; // Mon=0
    const total = startWeekday + end.getDate();
    const rows = Math.ceil(total / 7);
    const days = [];
    for (let r = 0; r < rows * 7; r++) {
      const dayNum = r - startWeekday + 1;
      const date = new Date(view.getFullYear(), view.getMonth(), dayNum);
      days.push({ date, inMonth: dayNum >= 1 && dayNum <= end.getDate() });
    }
    return days;
  }, [view]);

  const select = (d) => {
    onChange?.(d);
  };

  return (
    <div className="w-72 bg-white rounded-xl border border-gray-200 shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          onClick={() => setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))}
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
        <div className="text-sm font-medium">
          {view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </div>
        <button
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          onClick={() => setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))}
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
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-500">{value ? value.toDateString() : 'Select date'}</div>
          <button
            className="px-2 py-1 rounded-lg border border-gray-200 text-xs hover:bg-gray-50"
            onClick={() => select(new Date())}
          >
            Today
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((d, i) => {
            const selected = isSameDate(d.date, value);
            return (
              <button
                key={i}
                onClick={() => select(d.date)}
                className={[
                  'h-8 rounded-full text-sm',
                  d.inMonth ? 'text-[#0A0D14]' : 'text-gray-300',
                  selected ? 'bg-[#6C5DD3] text-white' : 'hover:bg-gray-50',
                ].join(' ')}
              >
                {d.date.getDate()}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-2 mt-4">
          <button
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white bg-[#6C5DD3] hover:bg-[#5a4bc7]"
            onClick={onClose}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}