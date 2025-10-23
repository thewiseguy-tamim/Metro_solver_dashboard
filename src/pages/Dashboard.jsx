// src/pages/Dashboard.jsx
import React from 'react';
import EmployeeManagementSection from '../components/employee/EmployeeManagementSection';
import RecruitmentEngagement from '../components/dashboard/RecruitmentEngagement';
import FinancialSalesStatistic from '../components/dashboard/FinancialSalesStatistic';
import AlertsNotifications from '../components/dashboard/AlertsNotifications';
import data from '../data/dashboard.json';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <EmployeeManagementSection showHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecruitmentEngagement data={data.recruitmentEngagement} />
        </div>
        <div className="lg:col-span-1">
          <FinancialSalesStatistic data={data.financial} />
        </div>
      </div>

      <AlertsNotifications items={data.alerts} />
    </div>
  );
}