// src/components/PeopleDirectory/OrgChart.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import EmployeeCard from './EmployeeCard';

function ParentToChildrenConnector({ hasChildren }) {
  if (!hasChildren) return null;
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-0 pointer-events-none"
      style={{ top: '100%', height: 24 }}
      aria-hidden
    >
      <div className="mx-auto w-px h-full bg-[#E5E7EB]" />
    </div>
  );
}

function OrgChildrenRow({ nodes, renderNode }) {
  if (!nodes?.length) return null;

  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [hLine, setHLine] = useState({ left: 0, width: 0 });

  const measure = () => {
    const container = containerRef.current;
    if (!container || itemRefs.current.length === 0) return;

    const rect = container.getBoundingClientRect();
    const first = itemRefs.current[0];
    const last = itemRefs.current[itemRefs.current.length - 1];
    if (!first || !last) return;

    const fr = first.getBoundingClientRect();
    const lr = last.getBoundingClientRect();

    const firstCenter = fr.left - rect.left + fr.width / 2;
    const lastCenter = lr.left - rect.left + lr.width / 2;

    const left = Math.min(firstCenter, lastCenter);
    const width = Math.abs(lastCenter - firstCenter);

    setHLine({ left, width });
  };

  useLayoutEffect(() => {
    measure();
  }, [nodes.length]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div ref={containerRef} className="mt-12 relative">
      {/* Horizontal bar only when 2+ children */}
      {nodes.length > 1 && (
        <div
          className="absolute top-[12px] z-0 pointer-events-none border-t border-[#E5E7EB]"
          style={{ left: hLine.left, width: hLine.width }}
          aria-hidden
        />
      )}

      <div className="flex justify-center items-start gap-10 relative z-10">
        {nodes.map((n, idx) => (
          <div key={n.id} ref={(el) => (itemRefs.current[idx] = el)} className="relative">
            {/* vertical from child up to horizontal bar */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-12 w-px h-12 bg-[#E5E7EB] z-0 pointer-events-none"
              aria-hidden
            />
            {renderNode(n)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrgChart({
  byId,
  childrenMap,
  roots,
  selectedEmployees,
  activeMenu,
  onToggleMenu,
  onViewProfile,
  onEditEmployee,
  onDeleteEmployee,
  onRequestAdd, // (employeeId, event)
}) {
  const render = (emp) => {
    const children = childrenMap[emp.id] || [];
    const isHighlighted = selectedEmployees.includes(emp.id);

    return (
      <div key={emp.id} className="relative flex flex-col items-center">
        <div className="relative z-10">
          <EmployeeCard
            employee={emp}
            accent={emp.id === 'tahsan' ? '#F59E0B' : undefined}
            onAddClick={(e) => onRequestAdd(emp.id, e)}
            onToggleMenu={() => onToggleMenu(emp.id)}
            isMenuOpen={activeMenu === emp.id}
            onViewProfile={onViewProfile}
            onEditEmployee={onEditEmployee}
            onDeleteEmployee={onDeleteEmployee}
            isHighlighted={isHighlighted}
          />
          <ParentToChildrenConnector hasChildren={children.length > 0} />
        </div>
        {children.length > 0 && <OrgChildrenRow nodes={children} renderNode={(n) => render(n)} />}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {(roots || []).length === 0 ? <div className="text-[#6B7280] text-sm">No data</div> : roots.map((r) => render(r))}
    </div>
  );
}