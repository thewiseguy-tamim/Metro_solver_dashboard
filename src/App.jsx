// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeeManagementPage from './pages/EmployeeManagement';
import Calendar from './pages/Calendar';
import PeopleDirectory from './pages/PeopleDirectory';

// Generic placeholder for remaining routes
const Page = ({ title }) => (
  <div className="text-[#0A0D14]">
    <h1 className="text-2xl font-semibold mb-4">{title}</h1>
    <div className="rounded-xl border border-[#E5E7EB] p-6">
      <p className="text-[#6B7280]">Content for {title} goes here.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/employee-management" element={<EmployeeManagementPage />} />
          <Route path="/calendar" element={<Calendar />} />

          {/* Other routes from your spec */}
          <Route path="/employees" element={<PeopleDirectory />} />
          <Route path="/time-tracking" element={<Page title="Time Tracking" />} />
          <Route path="/meeting" element={<Page title="Meeting" />} />
          <Route path="/employees" element={<Page title="Employees" />} />
          <Route path="/company-statistic" element={<Page title="Company Statistic" />} />
          <Route path="/recruitment" element={<Page title="Recruitment" />} />
          <Route path="/messages" element={<Page title="Messages" />} />
          <Route path="/task" element={<Page title="Task" />} />
          <Route path="/project-collaboration" element={<Page title="Project Collaboration" />} />
          <Route path="/hmrc" element={<Page title="HMRC" />} />
          <Route path="/newsfeed" element={<Page title="NewsFeed" />} />
          <Route path="/course" element={<Page title="Course" />} />
          <Route path="/policies" element={<Page title="Policies" />} />
          <Route path="/metro-assistant" element={<Page title="Metro Assistant" />} />
          <Route path="/setting" element={<Page title="Setting" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
