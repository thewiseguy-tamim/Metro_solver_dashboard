// src/components/employee/EmployeeStatCard.jsx
import React from 'react';
import TinySparkline from './TinySparkline';

export default function EmployeeStatCard({
  icon: Icon,
  title,
  subtitle = 'Improved from last month',
  value,
  change = '+0.0%',
  changeColor = '#22C55E',
  lineColor = '#6C5DD3',
  data = [12, 19, 14, 22, 18, 25, 28],
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#F3F4F6] grid place-items-center ring-1 ring-[#E5E7EB]">
            <Icon className="w-4 h-4 text-[#6B7280]" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-medium text-[#0A0D14]">{title}</div>
            <div className="text-[12px] text-[#6B7280]">{subtitle}</div>
          </div>
        </div>
        <div className="text-[12px] font-medium" style={{ color: changeColor }}>
          {change}
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <TinySparkline className="w-28 h-9" data={data} stroke={lineColor} height={36} />
      </div>
    </div>
  );
}