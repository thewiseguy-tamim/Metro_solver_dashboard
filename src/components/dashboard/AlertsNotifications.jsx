import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, AlertTriangle, CheckCircle2, AlertCircle, Check } from 'lucide-react';

const SEVERITY_STYLE = {
  Critical: 'bg-fuchsia-100 text-fuchsia-700',
  Warning: 'bg-orange-100 text-orange-700',
  Approved: 'bg-green-100 text-green-700',
  Alert: 'bg-yellow-100 text-yellow-700',
};

const ICON = {
  Critical: AlertTriangle,
  Warning: AlertTriangle,
  Approved: CheckCircle2,
  Alert: AlertCircle,
};

export default function AlertsNotifications({ items }) {
  // items can be an array or an object like { weekly: [], monthly: [], yearly: [] }
  const [open, setOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Monthly');
  const ranges = ['Weekly', 'Monthly', 'Yearly'];
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const data = useMemo(() => {
    if (Array.isArray(items)) return items;
    const key = selectedRange.toLowerCase();
    return items?.[key] || [];
  }, [items, selectedRange]);

  if (!items || (Array.isArray(data) && data.length === 0)) return (
    <section className="rounded-2xl border border-[#E5E7EB] p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">Alerts & Notifications</h2>
        <div className="flex items-center gap-3">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="h-9 px-3 rounded-full border border-[#E5E7EB] text-[14px] flex items-center gap-2"
            >
              {selectedRange} <ChevronDown className="w-4 h-4 text-[#6B7280]" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[#E5E7EB] bg-white shadow-lg p-2">
                {ranges.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setSelectedRange(r); setOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-[15px] flex items-center justify-between hover:bg-[#F3F4F6] ${selectedRange === r ? 'font-semibold' : 'font-medium'}`}
                  >
                    <span>{r}</span>
                    {selectedRange === r && <Check className="w-4 h-4 text-[#6C5DD3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="h-9 px-4 rounded-full text-white text-[14px] font-medium bg-gradient-to-b from-[#7C6FDC] to-[#6C5DD3]">
            View Details
          </button>
        </div>
      </div>
      <div className="text-[#6B7280] text-sm mt-4">No alerts available.</div>
    </section>
  );

  return (
    <section className="rounded-2xl border border-[#E5E7EB] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">Alerts & Notifications</h2>
        <div className="flex items-center gap-3">
          <div className="relative" ref={ref}>
            <button
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="h-9 px-3 rounded-full border border-[#E5E7EB] text-[14px] flex items-center gap-2"
            >
              {selectedRange} <ChevronDown className="w-4 h-4 text-[#6B7280]" />
            </button>
            {open && (
              <div role="listbox" tabIndex={-1} className="absolute right-0 mt-2 w-44 rounded-2xl border border-[#E5E7EB] bg-white shadow-lg p-2">
                {ranges.map((r) => {
                  const active = r === selectedRange;
                  return (
                    <button
                      key={r}
                      role="option"
                      aria-selected={active}
                      onClick={() => { setSelectedRange(r); setOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-[15px] flex items-center justify-between hover:bg-[#F3F4F6] ${active ? 'font-semibold' : 'font-medium'}`}
                    >
                      <span>{r}</span>
                      {active && <Check className="w-4 h-4 text-[#6C5DD3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button className="h-9 px-4 rounded-full text-white text-[14px] font-medium bg-gradient-to-b from-[#7C6FDC] to-[#6C5DD3]">
            View Details
          </button>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        {data.map((a, idx) => {
          const Icon = ICON[a.severity] || AlertCircle;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#E5E7EB] p-4 flex items-start justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full border border-[#E5E7EB] grid place-items-center">
                  <Icon className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-[15px] font-semibold">{a.title}</h4>
                    <span className={`text-[12px] px-2 py-0.5 rounded-full ${SEVERITY_STYLE[a.severity] || 'bg-gray-100 text-gray-700'}`}>
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#6B7280]">{a.message}</p>
                </div>
              </div>
              <div className="text-[12px] text-[#6B7280]">{a.timeAgo}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}