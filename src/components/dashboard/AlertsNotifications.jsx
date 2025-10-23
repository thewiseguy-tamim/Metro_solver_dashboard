// src/components/dashboard/AlertsNotifications.jsx
import React from 'react';
import { ChevronDown, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

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
  if (!items?.length) return null;

  return (
    <section className="rounded-2xl border border-[#E5E7EB] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">Alerts & Notifications</h2>
        <div className="flex items-center gap-3">
          <button className="h-9 px-3 rounded-full border border-[#E5E7EB] text-[14px] flex items-center gap-2">
            Monthly <ChevronDown className="w-4 h-4 text-[#6B7280]" />
          </button>
          <button className="h-9 px-4 rounded-full text-white text-[14px] font-medium bg-gradient-to-b from-[#7C6FDC] to-[#6C5DD3]">
            View Details
          </button>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        {items.map((a, idx) => {
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