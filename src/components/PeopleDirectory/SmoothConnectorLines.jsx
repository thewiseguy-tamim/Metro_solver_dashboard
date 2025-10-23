// src/components/PeopleDirectory/SmoothConnectorLines.jsx
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

/**
 * SmoothConnectorLines
 * - Draws curved SVG connectors between parent and child cards.
 * - Expects each employee card to have data-emp-id="<id>".
 * - Works under transform: scale() because it measures layout coordinates (offsets),
 *   and the overlay lives in the same container.
 *
 * Props:
 * - containerRef: ref to the chart container that wraps all nodes (position: relative)
 * - childrenMap: { [parentId: string]: Employee[] } (skip "__root__")
 * - stroke: line color (default: '#E5E7EB')
 * - thickness: stroke width in px (default: 2)
 * - radius: preferred corner radius in px (default: 10)
 */
export default function SmoothConnectorLines({
  containerRef,
  childrenMap,
  stroke = '#E5E7EB',
  thickness = 2,
  radius = 10,
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const positionsRef = useRef(new Map()); // id -> { x, y, w, h } in layout coords (not transformed)
  const [rev, setRev] = useState(0); // bump to recompute paths

  // Get element's offset relative to the container using the offsetParent chain.
  const getOffsetRelative = (el, ancestor) => {
    let x = 0;
    let y = 0;
    let node = el;

    while (node && node !== ancestor && node instanceof HTMLElement) {
      x += node.offsetLeft - node.scrollLeft + node.clientLeft;
      y += node.offsetTop - node.scrollTop + node.clientTop;
      node = node.offsetParent;
    }

    return {
      x,
      y,
      w: el.offsetWidth,
      h: el.offsetHeight,
    };
  };

  const measure = () => {
    const container = containerRef?.current;
    if (!container) return;

    const map = new Map();
    const els = container.querySelectorAll('[data-emp-id]');
    els.forEach((el) => {
      const id = el.getAttribute('data-emp-id');
      if (!id) return;
      map.set(id, getOffsetRelative(el, container));
    });

    // Use scrollWidth/scrollHeight to match layout coordinate space (not transformed).
    const width = Math.max(container.scrollWidth, container.offsetWidth);
    const height = Math.max(container.scrollHeight, container.offsetHeight);

    positionsRef.current = map;
    setSize({ width, height });
    setRev((v) => v + 1);
  };

  // Re-measure on mount and on relevant changes
  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenMap]);

  // Observe layout and dom changes to keep connectors aligned
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    let raf = null;
    const request = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    const ro = new ResizeObserver(request);
    ro.observe(container);

    // Also observe children for changes
    const mo = new MutationObserver(request);
    mo.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: false,
    });

    // Images/fonts may change sizes after load
    window.addEventListener('load', request);
    window.addEventListener('resize', request);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('load', request);
      window.removeEventListener('resize', request);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paths = useMemo(() => {
    const positions = positionsRef.current;
    const out = [];

    const fmt = (n) => Number(n.toFixed(1));
    const move = (x, y) => `M ${fmt(x)} ${fmt(y)}`;
    const line = (x, y) => `L ${fmt(x)} ${fmt(y)}`;
    const quad = (cx, cy, x, y) => `Q ${fmt(cx)} ${fmt(cy)} ${fmt(x)} ${fmt(y)}`;

    // Iterate over each parent -> children
    Object.entries(childrenMap || {}).forEach(([parentId, kids]) => {
      if (parentId === '__root__') return;
      if (!kids || kids.length === 0) return;

      const p = positions.get(parentId);
      if (!p) return;

      // Collect child anchors that exist in DOM
      const childAnchors = [];
      for (const kid of kids) {
        const c = positions.get(kid.id);
        if (!c) continue;
        childAnchors.push({
          id: kid.id,
          x: c.x + c.w / 2, // top center x
          top: c.y,         // top y
        });
      }
      if (childAnchors.length === 0) return;

      const pX = p.x + p.w / 2;
      const pBottom = p.y + p.h;

      const minChildTop = Math.min(...childAnchors.map((c) => c.top));
      const leftMostX = Math.min(...childAnchors.map((c) => c.x));
      const rightMostX = Math.max(...childAnchors.map((c) => c.x));

      // Pick a horizontal distribution line between parent and children
      const gapPC = Math.max(0, minChildTop - pBottom);
      // Place the distribution line somewhere between, with sane clamps
      const baseGap = Math.max(16, Math.min(40, Math.round(gapPC * 0.4)));
      let yLine = pBottom + baseGap;
      if (yLine > minChildTop - 6) yLine = Math.max(pBottom + 6, minChildTop - 6);

      // Corner radius: try to keep 8-12, but fit available space
      let r = radius;
      const roomBelowLine = Math.max(0, minChildTop - yLine);
      if (roomBelowLine < r * 2 + 4) {
        r = Math.max(4, Math.min(radius, Math.floor((roomBelowLine - 4) / 2)));
      }
      r = Math.max(4, Math.min(12, r));

      // 1) Parent vertical down to just above the line
      if (yLine - r > pBottom) {
        out.push(`${move(pX, pBottom)} ${line(pX, yLine - r)}`);
      }

      // 2) Horizontal distribution line(s) with rounded corner from the parent
      if (childAnchors.length === 1) {
        // Single child: only draw the side we need
        const cx = childAnchors[0].x;
        const dir = cx >= pX ? 1 : -1; // 1 -> right, -1 -> left
        const startX = pX + dir * r;
        const endX = cx - dir * r;

        // Parent turn into horizontal
        out.push(`${move(pX, yLine - r)} ${quad(pX, yLine, startX, yLine)} ${line(endX, yLine)}`);
      } else {
        // Multiple children: draw both sides from parent
        // Left side
        out.push(`${move(pX, yLine - r)} ${quad(pX, yLine, pX - r, yLine)} ${line(leftMostX, yLine)}`);
        // Right side
        out.push(`${move(pX, yLine - r)} ${quad(pX, yLine, pX + r, yLine)} ${line(rightMostX, yLine)}`);
      }

      // 3) For each child: rounded corner from horizontal into child's vertical line, then down to child's top
      for (const c of childAnchors) {
        // Turn downward toward the child
        out.push(`${move(c.x - r, yLine)} ${quad(c.x, yLine, c.x, yLine + r)} ${line(c.x, c.top)}`);
      }
    });

    return out;
  }, [rev, childrenMap, radius]);

  if (!size.width || !size.height) return null;

  return (
    <svg
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {paths.map((d, i) => (
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
  );
}