// src/components/Layout.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const getIsMobile = () => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [collapsed, setCollapsed] = useState(getIsMobile());

  useEffect(() => {
    const onResize = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarWidth = useMemo(() => (collapsed ? 80 : 240), [collapsed]);

  return (
    <div className="relative min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />
      <Navbar sidebarWidth={sidebarWidth} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="pt-[88px] px-6" style={{ marginLeft: sidebarWidth }}>
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}