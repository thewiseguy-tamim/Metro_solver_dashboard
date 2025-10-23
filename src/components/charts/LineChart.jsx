// src/components/charts/LineChart.jsx
import React, { useMemo } from 'react';

export default function LineChart({
  labels = [],
  values = [],
  height = 300,
  stroke = '#6C5DD3',
  gridColor = '#E5E7EB',
  fill = true,
  annotateIndex = null,
  annotateLabel = '',
}) {
  const padding = { top: 16, right: 16, bottom: 40, left: 48 };
  const width = 800; // viewBox width; SVG scales responsively

  const points = useMemo(() => {
    if (!values.length) return [];
    const max = 100; // percentage scale
    const min = 0;
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    return values.map((v, i) => {
      const x = padding.left + (i / (values.length - 1)) * innerW;
      const y = padding.top + innerH - ((v - min) / (max - min)) * innerH;
      return [x, y];
    });
  }, [values, height]);

  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const area = `${path} L ${padding.left + (points.length ? (points.length - 1) / (points.length - 1) : 0) * (width - padding.left - padding.right) + padding.left},${height - padding.bottom} L ${padding.left},${height - padding.bottom} Z`;

  const yTicks = [10, 30, 50, 70, 90, 100];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[300px]" preserveAspectRatio="none">
      {/* Grid */}
      {yTicks.map((t) => {
        const y = padding.top + (1 - t / 100) * (height - padding.top - padding.bottom);
        return (
          <g key={t}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke={gridColor} strokeDasharray="0" opacity="0.8" />
            <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#6B7280">{`${t}%`}</text>
          </g>
        );
      })}

      {/* Vertical gridlines at month steps */}
      {labels.map((_, i) => {
        const innerW = width - padding.left - padding.right;
        const x = padding.left + (i / (labels.length - 1)) * innerW;
        return (
          <line key={i} x1={x} x2={x} y1={padding.top} y2={height - padding.bottom} stroke={gridColor} opacity={i % 3 === 0 ? 0.4 : 0.15} />
        );
      })}

      {/* Area fill */}
      {fill && <path d={area} fill={stroke} opacity="0.1" />}

      {/* Line */}
      <path d={path} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Points */}
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={stroke} />
      ))}

      {/* X labels */}
      {labels.map((l, i) => {
        const innerW = width - padding.left - padding.right;
        const x = padding.left + (i / (labels.length - 1)) * innerW;
        return (
          <text key={l} x={x} y={height - 12} textAnchor="middle" fontSize="12" fill="#6B7280">{l}</text>
        );
      })}

      {/* Annotation */}
      {annotateIndex != null && points[annotateIndex] && (
        <>
          <circle cx={points[annotateIndex][0]} cy={points[annotateIndex][1]} r={5} fill="white" stroke={stroke} strokeWidth="3" />
          <rect
            x={points[annotateIndex][0] - 55}
            y={points[annotateIndex][1] - 36}
            rx="10"
            ry="10"
            width="110"
            height="28"
            fill="#F3F4F6"
            stroke="#E5E7EB"
          />
          <text
            x={points[annotateIndex][0]}
            y={points[annotateIndex][1] - 18}
            textAnchor="middle"
            fontSize="12"
            fill="#0A0D14"
          >
            {annotateLabel}
          </text>
        </>
      )}
    </svg>
  );
}