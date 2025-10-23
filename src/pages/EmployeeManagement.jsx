// src/pages/EmployeeManagement.jsx
import React from 'react';
import EmployeeManagementSection from '../components/employee/EmployeeManagementSection';

export default function EmployeeManagementPage() {
  return (
    <div className="space-y-6">
      <EmployeeManagementSection showHeader />
      <div className="rounded-2xl border border-[#E5E7EB] p-6">
        <h3 className="text-[16px] font-semibold mb-2">Breakdown</h3>
        <p className="text-[#6B7280] text-[14px]">
          This page reuses the same components as the dashboard section, so styles and spacing stay perfectly consistent with the design.
        </p>
      </div>
    </div>
  );
}