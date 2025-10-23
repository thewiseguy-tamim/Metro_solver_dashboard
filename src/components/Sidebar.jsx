// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Clock, Video, Users, Building2, UserPlus, MessageSquare,
  CheckSquare, Calendar, FolderKanban, Shield, Newspaper, GraduationCap,
  FileText, HelpCircle, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import Lottie from 'lottie-react';
import logoAnim from '../Materiel/Lottie Files/Logo.json';

const MENU = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Time Tracking', to: '/time-tracking', icon: Clock },
  { label: 'Meeting', to: '/meeting', icon: Video },
  { label: 'Employees', to: '/employees', icon: Users },
  { label: 'Company Statistic', to: '/company-statistic', icon: Building2 },
  { label: 'Recruitment', to: '/recruitment', icon: UserPlus },
  { label: 'Messages', to: '/messages', icon: MessageSquare },
  { label: 'Task', to: '/task', icon: CheckSquare },
  { label: 'Calendar', to: '/calendar', icon: Calendar },
  { label: 'Project Collaboration', to: '/project-collaboration', icon: FolderKanban },
  { label: 'HMRC', to: '/hmrc', icon: Shield },
  { label: 'NewsFeed', to: '/newsfeed', icon: Newspaper },
  { label: 'Course', to: '/course', icon: GraduationCap },
  { label: 'Policies', to: '/policies', icon: FileText },
  { label: 'Metro Assistant', to: '/metro-assistant', icon: HelpCircle },
  { label: 'Setting', to: '/setting', icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, isMobile }) {
  const location = useLocation();
  const widthClass = collapsed ? 'w-20 px-3' : 'w-60 px-4';

  const IconWrap = ({ Icon, active }) => (
    <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-[#6B7280]'}`} strokeWidth={2} aria-hidden="true" />
  );

  return (
    <aside
      aria-label="Sidebar"
      className={[
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-[#E5E7EB]',
        'shadow-lg transition-all duration-300 ease-in-out', widthClass,
      ].join(' ')}
    >
      {/* Logo + Toggle */}
      <div className="relative pt-6" style={{ height: 60 }}>
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <Lottie animationData={logoAnim} loop autoplay />
            </div>
            {!collapsed && (
              <div className="leading-none">
                <div className="text-[16px] font-bold tracking-wide">METRO SOLVER</div>
                <div className="text-[9px] opacity-70 -mt-0.5">SMART HR SOLUTION</div>
              </div>
            )}
          </div>
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto rounded-full p-1.5 hover:bg-[#F3F4F6] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]"
          >
            {collapsed ? <ChevronRight size={18} className="text-[#6B7280]" /> : <ChevronLeft size={18} className="text-[#6B7280]" />}
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav role="menu" aria-label="Primary" className="mt-4 relative h-[calc(100%-60px)]">
        <ul className="space-y-1 pb-24 overflow-y-auto">
          {MENU.map((item) => {
            const isActive = location.pathname === item.to || (item.to === '/' && location.pathname === '');
            const ItemIcon = item.icon;

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'group flex items-center gap-3 h-11 px-4 py-2.5',
                    'transition-colors duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC] rounded-[8px]',
                    isActive
                      ? 'bg-[#7C6FDC] text-white shadow-inner'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:rounded-[6px]',
                  ].join(' ')}
                >
                  <IconWrap Icon={ItemIcon} active={isActive} />
                  {!collapsed && (
                    <span className={`text-[14px] font-medium leading-5 truncate ${isActive ? 'text-white' : 'text-[#6B7280]'}`}>
                      {item.label}
                    </span>
                  )}
                  {collapsed && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 rounded-md bg-[#0A0D14] text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Log out */}
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Link
            to="/logout"
            className="group flex items-center gap-3 h-11 px-4 py-2.5 rounded-[6px] text-[#6B7280] hover:bg-[#F3F4F6] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]"
          >
            <LogOut className="w-5 h-5 text-[#6B7280]" />
            {!collapsed && <span className="text-[14px] font-medium leading-5">Log Out</span>}
            {collapsed && (
              <span
                role="tooltip"
                className="pointer-events-none absolute left-full top-[calc(100%-2.25rem)] -translate-y-1/2 ml-2 rounded-md bg-[#0A0D14] text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
              >
                Log Out
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobile && !collapsed && <div aria-hidden className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setCollapsed(true)} />}
    </aside>
  );
}