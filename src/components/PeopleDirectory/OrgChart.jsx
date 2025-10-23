// src/components/PeopleDirectory/OrgChart.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import EmployeeCard from './EmployeeCard';

function ParentToChildrenConnector({ hasChildren }) {
  // We now draw the parent vertical and curves via SVG in OrgChildrenRow
  // so we don’t need to render any HTML line here.
  return null;
}

function OrgChildrenRow({ nodes, renderNode }) {
  if (!nodes?.length) return null;

  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [layout, setLayout] = useState(null);

  const measure = () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const parentWrap = container.previousElementSibling; // the wrapper containing the parent card
    if (!parentWrap) return;

    const pr = parentWrap.getBoundingClientRect();
    const parentX = pr.left - rect.left + pr.width / 2;
    const parentBottom = pr.bottom - rect.top;

    const children = itemRefs.current
      .filter(Boolean)
      .map((el) => {
        const cr = el.getBoundingClientRect();
        return {
          x: cr.left - rect.left + cr.width / 2,
          top: cr.top - rect.top,
        };
      });

    if (children.length === 0) return;

    const leftMostX = Math.min(...children.map((c) => c.x));
    const rightMostX = Math.max(...children.map((c) => c.x));
    const minChildTop = Math.min(...children.map((c) => c.top));

    // Pick a horizontal distribution line Y between parent bottom and children top
    const gapPC = Math.max(0, minChildTop - parentBottom);
    const baseGap = Math.max(16, Math.min(40, Math.round(gapPC * 0.45)));
    let yLine = parentBottom + baseGap;
    if (yLine > minChildTop - 6) yLine = Math.max(parentBottom + 6, minChildTop - 6);

    setLayout({
      parentX,
      parentBottom,
      yLine,
      leftMostX,
      rightMostX,
      children,
      width: rect.width,
      height: rect.height,
    });
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const r = 10; // curve radius
  const stroke = '#E5E7EB';
  const thickness = 2;

  // Build SVG paths
  const paths = () => {
    if (!layout) return [];

    const { parentX, parentBottom, yLine, leftMostX, rightMostX, children } = layout;

    const fmt = (n) => Number(n.toFixed(1));
    const move = (x, y) => `M ${fmt(x)} ${fmt(y)}`;
    const line = (x, y) => `L ${fmt(x)} ${fmt(y)}`;
    const quad = (cx, cy, x, y) => `Q ${fmt(cx)} ${fmt(cy)} ${fmt(x)} ${fmt(y)}`;

    const out = [];

    // 1) Parent vertical down to just above the distribution line
    if (yLine - r > parentBottom) {
      out.push(`${move(parentX, parentBottom)} ${line(parentX, yLine - r)}`);
    }

    // 2) Horizontal distribution line with smooth turn from the parent
    if (children.length === 1) {
      const cx = children[0].x;
      const dir = cx >= parentX ? 1 : -1;
      const startX = parentX + dir * r;
      const endX = cx - dir * r;

      out.push(`${move(parentX, yLine - r)} ${quad(parentX, yLine, startX, yLine)} ${line(endX, yLine)}`);
    } else if (children.length > 1) {
      // Left arm
      out.push(`${move(parentX, yLine - r)} ${quad(parentX, yLine, parentX - r, yLine)} ${line(leftMostX, yLine)}`);
      // Right arm
      out.push(`${move(parentX, yLine - r)} ${quad(parentX, yLine, parentX + r, yLine)} ${line(rightMostX, yLine)}`);
    }

    // 3) For each child: rounded elbow from horizontal down to child's top
    for (const c of children) {
      const available = c.top - yLine - 4;
      const rChild = Math.max(4, Math.min(r, Math.floor(available / 2)));
      if (rChild > 4) {
        out.push(`${move(c.x - rChild, yLine)} ${quad(c.x, yLine, c.x, yLine + rChild)} ${line(c.x, c.top)}`);
      } else {
        // Not enough room for a curve; draw straight down
        out.push(`${move(c.x, yLine)} ${line(c.x, c.top)}`);
      }
    }

    return out;
  };

  const dList = paths();

  return (
    <div ref={containerRef} className="mt-12 relative">
      {/* SVG overlay for smooth connectors (behind cards) */}
      {layout && (
        <svg
          className="absolute inset-0 z-0 pointer-events-none"
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          style={{ overflow: 'visible' }} // allow content slightly outside if needed
          aria-hidden
        >
          {dList.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeLinejoin="round"
              shapeRendering="geometricPrecision"
            />
          ))}
        </svg>
      )}

      {/* Children row (cards) */}
      <div className="flex justify-center items-start gap-10 relative z-10">
        {nodes.map((n, idx) => (
          <div key={n.id} ref={(el) => (itemRefs.current[idx] = el)} className="relative">
            {/* vertical-from-child html line removed; it’s now drawn by the SVG overlay */}
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