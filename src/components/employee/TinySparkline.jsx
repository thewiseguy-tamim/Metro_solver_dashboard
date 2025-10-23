// src/components/employee/TinySparkline.jsx
import React, { useId } from 'react';

export default function TinySparkline({
  data = [10, 20, 14, 30, 24, 28, 36],
  stroke = '#6C5DD3',
  height = 36,
  strokeWidth = 2,
  fillOpacity = 0.12,
  className = '',
}) {
  const id = useId();

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const toX = (i) => (i / (data.length - 1)) * 100;
  const toY = (v) => ((1 - (v - min) / range) * (height - 2)) + 1;

  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)},${toY(v)}`).join(' ');
  const area = `${path} L 100,${height} L 0,${height} Z`;

  return (
    <svg className={className} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${id})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}