// src/components/Navbar.jsx
import React from 'react';
import { Bell, Search, PanelLeftOpen } from 'lucide-react';

export default function Navbar({ sidebarWidth, collapsed, setCollapsed }) {
  return (
    <header
      className="fixed top-0 right-0 h-[72px] bg-white border-b border-[#E5E7EB] shadow-sm z-30 flex items-center"
      style={{ left: sidebarWidth, width: `calc(100% - ${sidebarWidth}px)` }}
      role="banner"
    >
      <div className="w-full px-6 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: mobile toggle + search */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle sidebar"
            className="lg:hidden p-2 rounded-md hover:bg-[#F3F4F6] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]"
            onClick={() => setCollapsed(!collapsed)}
          >
            <PanelLeftOpen className="w-5 h-5 text-[#6B7280]" />
          </button>

          <div role="search" aria-label="Search" className="relative w-[260px] sm:w-[320px] md:w-[360px] lg:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search something here..."
              className="w-full h-11 pl-9 pr-3 text-[14px] rounded-[8px] border border-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]"
            />
          </div>
        </div>

        {/* Right: notifications + user */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Bell className="w-5 h-5 text-[#6B7280]" aria-label="Notifications" />
            <span aria-hidden className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full" style={{ width: 6, height: 6 }} />
          </div>

          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/80?img=5"
              alt="User avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E5E7EB]"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-[14px] font-semibold leading-4">Shorab Hossen</span>
              <span className="text-[12px] font-normal text-[#6B7280] leading-4">UI Ux Designer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}