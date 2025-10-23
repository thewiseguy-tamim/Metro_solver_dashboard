// src/components/PeopleDirectory/OrgChart.jsx
import React from 'react';
import EmployeeCard from './EmployeeCard';

function NodeConnector({ hasChildren }) {
  if (!hasChildren) return null;
  return (
    <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '100%', height: 24 }} aria-hidden>
      <div className="mx-auto w-px h-full bg-[#E5E7EB]" />
    </div>
  );
}

function ChildrenConnector() {
  return <div className="absolute left-0 right-0 top-[12px] border-t border-[#E5E7EB]" aria-hidden />;
}

function OrgChildrenRow({ nodes, renderNode }) {
  if (!nodes?.length) return null;
  return (
    <div className="mt-10 relative">
      <ChildrenConnector />
      <div className="flex justify-center items-start gap-10">
        {nodes.map((n) => (
          <div key={n.id} className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-px h-10 bg-[#E5E7EB]" aria-hidden />
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
  onRequestAdd,
}) {
  const render = (emp) => {
    const children = childrenMap[emp.id] || [];
    const isHighlighted = selectedEmployees.includes(emp.id);

    return (
      <div key={emp.id} className="relative flex flex-col items-center">
        <div className="relative">
          <EmployeeCard
            employee={emp}
            accent={emp.id === 'tahsan' ? '#F59E0B' : undefined}
            onAddClick={() => onRequestAdd(emp.id)}
            onMenuClick={() => {}}
            isHighlighted={isHighlighted}
          />
          <NodeConnector hasChildren={children.length > 0} />
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