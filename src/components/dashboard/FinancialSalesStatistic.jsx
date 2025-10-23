// src/components/dashboard/FinancialSalesStatistic.jsx
import React from 'react';

export default function FinancialSalesStatistic({ data }) {
  if (!data) return null;

  const currency = (v) =>
    v.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 });

  return (
    <section className="space-y-4 md:space-y-6">
      <h2 className="text-[18px] font-semibold">Financial & Sales Statistic</h2>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <div className="text-[14px] text-[#6B7280] mb-1">Total Earning</div>
          <div className="text-2xl md:text-3xl font-semibold">{currency(data.totalEarning)}</div>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <div className="text-[14px] text-[#6B7280] mb-1">Total Expenses</div>
          <div className="text-2xl md:text-3xl font-semibold">{currency(data.totalExpenses)}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] p-5">
        <div className="mb-3">
          <div className="text-[18px] font-semibold">Total Sales</div>
          <div className="text-[14px] text-[#6B7280]">Improved from last month</div>
        </div>

        {/* Progress */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="ml-auto text-[12px] font-semibold bg-[#6C5DD3] text-white px-2 py-0.5 rounded-full">
              {data.totalSales.progress}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#E5E7EB]">
            <div
              className="h-2.5 rounded-full bg-[#6C5DD3]"
              style={{ width: `${data.totalSales.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-2xl md:text-3xl font-semibold">
            {currency(data.totalSales.value)}
          </div>
          <div className="text-[12px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            {data.totalSales.deltaText}
          </div>
        </div>
      </div>
    </section>
  );
}