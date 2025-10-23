// src/components/PeopleDirectory/OrgChartControls.jsx
import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export default function OrgChartControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onFitView,
  onPanLeft,
  onPanRight,
  onPanUp,
  onPanDown,
}) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <div className="flex gap-2 bg-white rounded-lg shadow-md border border-[#E5E7EB] p-2">
        <button onClick={onZoomIn} className="p-2 hover:bg-gray-100 rounded transition-colors" aria-label="Zoom in">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={onZoomOut} className="p-2 hover:bg-gray-100 rounded transition-colors" aria-label="Zoom out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px bg-gray-200" />
        <button onClick={onFitView} className="p-2 hover:bg-gray-100 rounded transition-colors" aria-label="Fit to view">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button onClick={onReset} className="px-2 py-1 hover:bg-gray-100 rounded transition-colors text-xs" aria-label="Reset view">
          100%
        </button>
      </div>

      <div className="flex flex-col items-center bg-white rounded-lg shadow-md border border-[#E5E7EB] p-2">
        <button onClick={onPanUp} className="p-2 hover:bg-gray-100 rounded" aria-label="Pan up">
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex gap-2">
          <button onClick={onPanLeft} className="p-2 hover:bg-gray-100 rounded" aria-label="Pan left">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={onPanRight} className="p-2 hover:bg-gray-100 rounded" aria-label="Pan right">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onPanDown} className="p-2 hover:bg-gray-100 rounded" aria-label="Pan down">
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}