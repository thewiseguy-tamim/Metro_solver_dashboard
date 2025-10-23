// src/components/dashboard/RecruitmentEngagement.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import LineChart from '../charts/LineChart';
import { Link } from 'react-router-dom';

export default function RecruitmentEngagement({ data }) {
  if (!data) return null;

  return (
    <section className="rounded-2xl border border-[#E5E7EB] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">Recruitment & Employee Engagement</h2>
        <div className="flex items-center gap-3">
          <button className="h-9 px-3 rounded-full text-white text-[14px] bg-gradient-to-b from-[#7C6FDC] to-[#6C5DD3]">
            View Details
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button className="h-9 px-3 rounded-full bg-[#0A0D14] text-white text-[14px] flex items-center gap-2">
          {data.datasetLabel} <ChevronDown className="w-4 h-4 text-white" />
        </button>
        <button className="h-9 px-3 rounded-full text-[14px] border border-[#E5E7EB] text-[#0A0D14] flex items-center gap-2">
          {data.range} <ChevronDown className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] p-2 md:p-4">
        <LineChart
          labels={data.months}
          values={data.values}
          annotateIndex={data.annotation?.index}
          annotateLabel={data.annotation?.label}
          height={300}
          stroke="#6C5DD3"
        />
      </div>
    </section>
  );
}