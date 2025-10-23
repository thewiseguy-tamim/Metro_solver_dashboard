// src/components/dashboard/RecruitmentEngagement.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import LineChart from '../charts/LineChart';

// Small media hook to scale chart height on tablets (md+)
function useMedia(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(m.matches);
    if (m.addEventListener) m.addEventListener('change', onChange);
    else m.addListener(onChange);
    return () => {
      if (m.removeEventListener) m.removeEventListener('change', onChange);
      else m.removeListener(onChange);
    };
  }, [query]);
  return matches;
}

export default function RecruitmentEngagement({ data }) {
  // Build dataset map from JSON; if not provided, derive from base series.
  const datasets = useMemo(() => {
    if (data?.datasets?.length) {
      const map = {};
      data.datasets.forEach((d) => {
        map[d.key] = { label: d.label, values: d.values };
      });
      return map;
    }
    const base = data?.values || [];
    const clamp = (v) => Math.max(8, Math.min(100, Math.round(v)));
    const derive = (m = 1, a = 0) => base.map((v) => clamp(v * m + a));
    return {
      'job-openings': { label: 'Job Openings', values: base },
      'new-hires': { label: 'New Hires', values: derive(0.85) },
      applications: { label: 'Applications Received', values: derive(1.05) },
      interview: { label: 'Interview Stage', values: derive(0.8, 4) },
      attendance: { label: 'Attendance Rate', values: derive(0.9, 15) },
      absenteeism: { label: 'Absenteeism Rate', values: derive(0.6, 10) },
      cashflow: { label: 'Cash Flow Status', values: derive(0.95) },
      balance: { label: 'Current Balance', values: derive(0.75, 12) },
    };
  }, [data]);

  const datasetOptions = useMemo(
    () => Object.entries(datasets).map(([key, v]) => ({ key, label: v.label })),
    [datasets]
  );

  const defaultKey =
    data?.defaultKey && datasets[data.defaultKey]
      ? data.defaultKey
      : datasetOptions[0]?.key;

  // Range options (Weekly, Monthly, Yearly)
  const rangeOptions = data?.availableRanges || ['Weekly', 'Monthly', 'Yearly'];
  const defaultRange = data?.defaultRange || data?.range || 'Monthly';

  const [datasetOpen, setDatasetOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(defaultKey);
  const [selectedRange, setSelectedRange] = useState(defaultRange);

  const selectedDataset =
    datasets[selectedKey] || {
      label: datasetOptions[0]?.label ?? '',
      values: data?.values ?? [],
    };

  const datasetRef = useRef(null);
  const rangeRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (
        datasetRef.current &&
        !datasetRef.current.contains(e.target) &&
        rangeRef.current &&
        !rangeRef.current.contains(e.target)
      ) {
        setDatasetOpen(false);
        setRangeOpen(false);
      }
    };
    const onEsc = (e) =>
      e.key === 'Escape' && (setDatasetOpen(false), setRangeOpen(false));
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // Build series for chart based on selected range
  const series = useMemo(() => {
    const months = data?.months || [];
    const base = selectedDataset.values || [];

    const toWeekly = (arr) => {
      const out = [];
      for (let i = 0; i < arr.length; i++) {
        const v0 = arr[i];
        const v1 = typeof arr[i + 1] === 'number' ? arr[i + 1] : v0;
        for (let w = 1; w <= 4; w++) {
          const t = w / 4;
          out.push(Math.round(v0 + (v1 - v0) * t));
        }
      }
      return {
        labels: Array.from({ length: out.length }, (_, i) => `W${i + 1}`),
        values: out,
      };
    };

    const toMonthly = (arr) => ({ labels: months, values: arr });

    const toYearly = (arr) => {
      const q = [
        Math.round((arr[0] + arr[1] + arr[2]) / 3),
        Math.round((arr[3] + arr[4] + arr[5]) / 3),
        Math.round((arr[6] + arr[7] + arr[8]) / 3),
        Math.round((arr[9] + arr[10] + arr[11]) / 3),
      ];
      return { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: q };
    };

    if (selectedRange === 'Weekly') return toWeekly(base);
    if (selectedRange === 'Yearly') return toYearly(base);
    return toMonthly(base);
  }, [data?.months, selectedDataset.values, selectedRange]);

  if (!data) return null;

  const isMdUp = useMedia('(min-width: 768px)');

  return (
    <section className="p-4 md:p-6">
      {/* Title + CTA */}
      <div className="mb-2 pb-2 flex items-center justify-between">
        <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold">
          Recruitment & Employee Engagement
        </h2>
        <button
          className="h-9 px-3 md:px-4 rounded-full text-white text-[14px] font-medium"
          style={{ background: "linear-gradient(0deg, #41295A 0%, #2F0743 100%)" }}
        >
          View Details
        </button>
      </div>

      {/* Chart card with controls */}
      <div className="relative rounded-2xl border border-[#E5E7EB] p-3 md:p-4 overflow-visible">
        {/* Dataset dropdown (left) */}
        <div className="absolute top-3 left-3 z-20" ref={datasetRef}>
          <button
            aria-haspopup="listbox"
            aria-expanded={datasetOpen}
            onClick={() => setDatasetOpen((o) => !o)}
            className="h-9 md:h-10 px-3 md:px-4 rounded-full text-white text-[14px] flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]"
            style={{
              background:
                selectedDataset.label === 'Job Openings'
                  ? 'linear-gradient(0deg, #41295A 0%, #2F0743 100%)'
                  : 'linear-gradient(to bottom, #7C6FDC, #6C5DD3)',
            }}
          >
            {selectedDataset.label}
            <ChevronDown
              className={`w-4 h-4 text-white transition-transform ${datasetOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {datasetOpen && (
            <div
              role="listbox"
              tabIndex={-1}
              className="mt-2 w-64 md:w-72 rounded-2xl border border-[#E5E7EB] bg-white shadow-lg p-2"
            >
              {Object.entries(datasets).map(([key, val]) => {
                const active = key === selectedKey;
                return (
                  <button
                    key={key}
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedKey(key);
                      setDatasetOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-[15px] flex items-center justify-between hover:bg-[#F3F4F6] ${
                      active ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    <span>{val.label}</span>
                    {active && <Check className="w-4 h-4 text-[#6C5DD3]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Range dropdown (right) */}
        <div className="absolute top-3 right-3 z-20" ref={rangeRef}>
          <button
            aria-haspopup="listbox"
            aria-expanded={rangeOpen}
            onClick={() => setRangeOpen((o) => !o)}
            className="h-9 md:h-10 px-3 md:px-4 rounded-full text-[14px] border border-[#E5E7EB] text-[#0A0D14] flex items-center gap-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]"
          >
            {selectedRange}
            <ChevronDown
              className={`w-4 h-4 text-[#6B7280] transition-transform ${rangeOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {rangeOpen && (
            <div
              role="listbox"
              tabIndex={-1}
              className="absolute right-0 mt-2 w-44 sm:w-48 rounded-2xl border border-[#E5E7EB] bg-white shadow-lg p-2"
            >
              {(rangeOptions).map((label) => {
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
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-[15px] flex items-center justify-between hover:bg-[#F3F4F6] ${
                      active ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    <span>{label}</span>
                    {active && <Check className="w-4 h-4 text-[#6C5DD3]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Chart body - extra padding to avoid dropdown overlap on tablets */}
        <div className="pt-14 md:pt-16">
          <LineChart
            labels={series.labels}
            values={series.values}
            annotateIndex={
              selectedRange === 'Monthly' &&
              selectedKey === (data?.defaultKey || 'job-openings')
                ? data.annotation?.index
                : null
            }
            annotateLabel={
              selectedRange === 'Monthly' &&
              selectedKey === (data?.defaultKey || 'job-openings')
                ? data.annotation?.label
                : ''
            }
            height={isMdUp ? 320 : 260}
            stroke="#6C5DD3"
          />
        </div>
      </div>
    </section>
  );
}