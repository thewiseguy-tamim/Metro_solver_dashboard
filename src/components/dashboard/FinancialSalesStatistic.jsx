// src/components/dashboard/FinancialSalesStatistic.jsx
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function FinancialSalesStatistic({ data }) {
  if (!data) return null;

  const currencyCode = data.currency || 'GBP';
  const fmt = (v) => {
    try {
      return v.toLocaleString('en-GB', { style: 'currency', currency: currencyCode, maximumFractionDigits: 2 });
    } catch {
      return `£${Number(v).toLocaleString()}`;
    }
  };

  // Range dropdown (Weekly, Monthly, Yearly) with dynamic values if provided
  const rangesFromData = Array.isArray(data.availableRanges) ? data.availableRanges : ['Weekly', 'Monthly', 'Yearly'];
  const [rangeOpen, setRangeOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(data.defaultRange || 'Monthly');
  const rangeRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (rangeRef.current && !rangeRef.current.contains(e.target)) setRangeOpen(false); };
    const onEsc = (e) => e.key === 'Escape' && setRangeOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // Get dataset for selected range if provided in JSON: data.ranges[rangeKey]
  const rangeKey = selectedRange?.toLowerCase();
  const ranged = data?.ranges?.[rangeKey] || data;

  // Build KPI array dynamically (supports both new and legacy structure)
  const kpis = useMemo(() => {
    if (Array.isArray(ranged.kpis) && ranged.kpis.length) return ranged.kpis;
    const arr = [];
    if (typeof ranged.totalEarning === 'number') arr.push({ label: 'Total Earning', value: ranged.totalEarning });
    if (typeof ranged.totalExpenses === 'number') arr.push({ label: 'Total Expenses', value: ranged.totalExpenses });
    return arr;
  }, [ranged]);

  const progress = Math.max(0, Math.min(100, ranged?.totalSales?.progress ?? 0));
  const isPositive = (ranged?.totalSales?.deltaText || '').trim().startsWith('+');
  const deltaClasses = isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <section className="space-y-4 mt-5 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">Financial & Sales Statistic</h2>

        {/* Range dropdown */}
        <div className="relative" ref={rangeRef}>
          <button
            aria-haspopup="listbox"
            aria-expanded={rangeOpen}
            onClick={() => setRangeOpen((o) => !o)}
            className="h-9 px-3 rounded-full text-[14px] border border-[#E5E7EB] flex items-center gap-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]"
            style={{ background: "linear-gradient(0deg, #41295A 0%, #2F0743 100%)" }}
          >
            {selectedRange}
            <ChevronDown className={`w-4 h-4 text-white transition-transform ${rangeOpen ? 'rotate-180' : ''}`} />
          </button>

          {rangeOpen && (
            <div role="listbox" tabIndex={-1} className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#E5E7EB] bg-white shadow-lg p-2">
              {rangesFromData.map((label) => {
                const active = label === selectedRange;
                return (
                  <button
                    key={label}
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedRange(label);
                      setRangeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-[15px] flex items-center justify-between hover:bg-[#F3F4F6] ${active ? 'font-semibold' : 'font-medium'}`}
                  >
                    <span>{label}</span>
                    {active && <Check className="w-4 h-4 text-[#6C5DD3]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards (height increased ~50%) */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-[#E5E7EB] p-5 md:p-6 min-h-[132px] md:min-h-[150px] flex flex-col justify-center">
            <div className="text-[14px] text-[#6B7280] mb-1">{kpi.label}</div>
            <div className="text-2xl md:text-3xl font-semibold">{fmt(kpi.value)}</div>
          </div>
        ))}
      </div>

      {/* Total Sales Card (height increased) */}
      <div className="rounded-2xl border border-[#E5E7EB] p-6 min-h-[260px] md:min-h-[220px] flex flex-col">
        <div className="mb-3">
          <div className="text-[18px] font-semibold">Total Sales</div>
          <div className="text-[14px] text-[#6B7280]">
            {ranged?.totalSales?.subtitle || 'Improved from last month'}
          </div>
        </div>

        {/* Progress with floating percentage pill */}
        <div className="mt-2">
          <div className="relative h-2.5 w-full rounded-full bg-[#E5E7EB]">
            <div
              className="absolute left-0 top-0 h-2.5 rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(105.32deg, #361A67 11.27%, #1B1B31 20.43%, #251F40 57.77%, #412178 87.6%)'
              }}
            />
            <span
              className="absolute -top-5 px-2 py-0.5 text-[12px] font-semibold text-white rounded-full bg-[#6C5DD3] transform -translate-x-1/2"
              style={{ left: `${progress}%` }}
            >
              {progress}%
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-2xl md:text-3xl font-semibold">{fmt(ranged?.totalSales?.value || 0)}</div>
          <div className={`text-[12px] px-2 py-1 rounded-full font-medium ${deltaClasses}`}>
            {ranged?.totalSales?.deltaText || ''}
          </div>
        </div>
      </div>
    </section>
  );
}