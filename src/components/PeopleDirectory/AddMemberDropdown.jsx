// src/components/PeopleDirectory/AddMemberDropdown.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Check } from 'lucide-react';

export default function AddMemberDropdown({
  allEmployees,
  excludeIds = [],
  selected = [],
  onClose,
  onConfirm,
}) {
  const [query, setQuery] = useState('Olivia');
  const [picked, setPicked] = useState([]);
  const ref = useRef(null);

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEmployees
      .filter((p) => !excludeIds.includes(p.id))
      .filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.handle.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q)
        );
      });
  }, [allEmployees, excludeIds, query]);

  function togglePick(id) {
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onClose?.();
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end p-6 pointer-events-none">
      <div ref={ref} className="pointer-events-auto w-[360px] rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              className="w-full h-10 pl-9 pr-9 rounded-[8px] border border-[#E5E7EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC] text-sm"
              value={query}
              placeholder="Olivia"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#F3F4F6]"
              aria-label="Close add member"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </div>

        <div className="max-h-64 overflow-auto">
          {candidates.length === 0 ? (
            <div className="p-4 text-sm text-[#6B7280]">No results</div>
          ) : (
            <ul className="py-1">
              {candidates.map((p) => {
                const isActive = selected.includes(p.id) || picked.includes(p.id);
                return (
                  <li
                    key={p.id}
                    onClick={() => togglePick(p.id)}
                    className="px-3 py-2 hover:bg-[#F3F4F6] cursor-pointer flex items-center gap-3"
                  >
                    <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-[#6B7280] truncate">{p.handle}</div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-[#7C6FDC]" />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-3 flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-9 px-4 rounded-full border border-[#E5E7EB] text-[#0A0D14] hover:bg-[#F3F4F6]">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(picked)}
            className="h-9 px-4 rounded-full bg-[#7C6FDC] text-white hover:brightness-95"
          >
            Add {picked.length ? `(${picked.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}