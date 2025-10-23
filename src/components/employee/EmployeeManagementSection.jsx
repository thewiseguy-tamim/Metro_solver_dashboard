import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, UserCheck, CalendarDays, FileSpreadsheet, MessageSquare, GraduationCap, TrendingUp, ChevronDown, Check } from 'lucide-react';
import EmployeeStatCard from './EmployeeStatCard';

export default function EmployeeManagementSection({ showHeader = true }) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState('Monthly');
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

  const cards = [
    { title: 'Current Employees', value: '6941', change: '+2.5%', changeColor: '#22C55E', lineColor: '#22C55E', icon: Users, subtitle: 'Improved from last month', data: [10, 18, 14, 26, 22, 28, 34] },
    { title: 'New Employees', value: '640', change: '+2.5%', changeColor: '#6C5DD3', lineColor: '#6C5DD3', icon: UserPlus, subtitle: 'Increased from last month', data: [8, 14, 10, 18, 16, 20, 22] },
    { title: 'Present Today', value: '580', change: '+5.0%', changeColor: '#F59E0B', lineColor: '#F59E0B', icon: CalendarDays, subtitle: 'Increased from last month', data: [6, 12, 9, 17, 14, 18, 19] },
    { title: 'Absent Today', value: '-78', change: '-0.8%', changeColor: '#EF4444', lineColor: '#F97316', icon: MessageSquare, subtitle: 'Decreased from last month', data: [16, 14, 18, 12, 10, 9, 8] },
    { title: 'New CVs', value: '6941', change: '+2.5%', changeColor: '#22C55E', lineColor: '#22C55E', icon: FileSpreadsheet, subtitle: 'Improved from last month', data: [12, 10, 15, 13, 18, 19, 24] },
    { title: 'Intern Requests', value: '106', change: '+2.5%', changeColor: '#6C5DD3', lineColor: '#6C5DD3', icon: TrendingUp, subtitle: 'Decreased from last month', data: [4, 5, 7, 6, 8, 10, 11] },
    { title: 'Running Interns', value: '580', change: '+5.0%', changeColor: '#F59E0B', lineColor: '#F59E0B', icon: GraduationCap, subtitle: 'Increased from last month', data: [7, 8, 10, 12, 11, 13, 14] },
    { title: 'Intern to Employee', value: '640', change: '+2.5%', changeColor: '#6C5DD3', lineColor: '#6C5DD3', icon: UserCheck, subtitle: 'Increased from last month', data: [5, 7, 6, 10, 9, 12, 14] }
  ];

  // Range change currently keeps same values (no per-range JSON provided).
  const ranges = ['Weekly', 'Monthly', 'Yearly'];

  return (
    <section aria-labelledby="employee-management">
      {showHeader && (
        <div className="mb-4 flex items-center justify-between">
          <h2 id="employee-management" className="text-[18px] font-semibold">Employee Management</h2>
          <div className="flex items-center gap-3">
            <div className="relative" ref={ref}>
              <button
                className="h-10 px-3 text-[14px] rounded-[8px] border border-[#E5E7EB] flex items-center gap-2"
                aria-label="Change range"
                onClick={() => setOpen((o) => !o)}
              >
                {range} <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[#E5E7EB] bg-white shadow-lg p-2">
                  {ranges.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setRange(r); setOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-[15px] flex items-center justify-between hover:bg-[#F3F4F6] ${r === range ? 'font-semibold' : 'font-medium'}`}
                    >
                      <span>{r}</span>
                      {r === range && <Check className="w-4 h-4 text-[#6C5DD3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/employee-management"
              className="h-10 px-4 rounded-[8px] text-white text-[14px] font-medium bg-gradient-to-b from-[#7C6FDC] to-[#6C5DD3]"
            >
              View Details
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <EmployeeStatCard
            key={c.title}
            icon={c.icon}
            title={c.title}
            subtitle={c.subtitle}
            value={c.value}
            change={c.change}
            changeColor={c.changeColor}
            lineColor={c.lineColor}
            data={c.data}
          />
        ))}
      </div>
    </section>
  );
}