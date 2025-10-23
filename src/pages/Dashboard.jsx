// src/pages/Dashboard.jsx
import React from 'react';
import EmployeeManagementSection from '../components/employee/EmployeeManagementSection';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Employee Management section pulled into the dashboard */}
      <EmployeeManagementSection showHeader />
      {/* Placeholders for other dashboard areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] font-semibold">Recruitment & Employee Engagement</h3>
            <button className="h-9 px-3 text-[14px] rounded-[8px] border border-[#E5E7EB]">Monthly</button>
          </div>
          <div className="text-[#6B7280]">Chart placeholder</div>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-6">
          <h3 className="text-[16px] font-semibold mb-4">Financial & Sales Statistic</h3>
          <div className="text-[#6B7280]">Cards placeholder</div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold">Alerts & Notifications</h3>
          <button className="h-9 px-3 text-[14px] rounded-[8px] border border-[#E5E7EB]">View Details</button>
        </div>
        <div className="text-[#6B7280]">Notifications list placeholder</div>
      </div>
    </div>
  );
}