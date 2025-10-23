// src/pages/PeopleDirectory.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import peopleRaw from '../data/calendar/people.json';
import {
  Download,
  UserPlus,
  Search,
  GitBranch,
  Minus,
  Plus,
  Settings2,
  X,
  CheckCircle2,
  User,
  Clock,
  Timer,
  CalendarCheck2,
  Inbox,
  CreditCard,
  FileText,
  Award,
  Activity,
} from 'lucide-react';

import TabNavigation from '../components/PeopleDirectory/TabNavigation';
import EmployeeList from '../components/PeopleDirectory/EmployeeList';
import OrgChart from '../components/PeopleDirectory/OrgChart';
import AddMemberDropdown from '../components/PeopleDirectory/AddMemberDropdown';
import CreateEmployeeModal from '../components/PeopleDirectory/CreateEmployeeModal';

const EXTRA = {
  tahsan: {
    position: 'Founder - CEO',
    department: 'Executive',
    location: 'Boston HQ',
    reportsTo: null,
    avatar: 'https://i.pravatar.cc/80?u=tahsan',
  },
  herry: {
    position: 'Engineering',
    department: 'Engineering',
    location: 'London Office',
    reportsTo: 'tahsan',
    avatar: 'https://i.pravatar.cc/80?u=herry',
  },
  herryb: {
    position: 'Commercial',
    department: 'Sales',
    location: 'London Office',
    reportsTo: 'tahsan',
    avatar: 'https://i.pravatar.cc/80?u=herryb',
  },
  james: {
    position: 'Finance',
    department: 'Finance',
    location: 'Boston HQ',
    reportsTo: 'tahsan',
    avatar: 'https://i.pravatar.cc/80?u=james',
  },
  azam: {
    position: 'Marketing',
    department: 'Marketing',
    location: 'Boston HQ',
    reportsTo: 'herry',
    avatar: 'https://i.pravatar.cc/80?u=azam',
  },
  tim: {
    position: 'HR Management',
    department: 'HR',
    location: 'Boston HQ',
    reportsTo: 'herryb',
    avatar: 'https://i.pravatar.cc/80?u=tim',
  },
  matt: {
    position: 'Account Executive',
    department: 'Sales',
    location: 'Boston HQ',
    reportsTo: 'james',
    avatar: 'https://i.pravatar.cc/80?u=matt',
  },
  alex: {
    position: 'Engineer',
    department: 'Engineering',
    location: 'London Office',
    reportsTo: 'herry',
    avatar: 'https://i.pravatar.cc/80?u=alex',
  },
  mia: {
    position: 'Engineer',
    department: 'Engineering',
    location: 'London Office',
    reportsTo: 'herry',
    avatar: 'https://i.pravatar.cc/80?u=mia',
  },
  noah: {
    position: 'Analyst',
    department: 'Finance',
    location: 'Boston HQ',
    reportsTo: 'james',
    avatar: 'https://i.pravatar.cc/80?u=noah',
  },
  olivia: {
    position: 'Designer',
    department: 'Product',
    location: 'Boston HQ',
    reportsTo: 'herryb',
    avatar: 'https://i.pravatar.cc/80?u=olivia',
  },
};

const TABS = [
  { id: 'org', label: 'ORG Chart', icon: GitBranch },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'time', label: 'Time Tracking', icon: Timer },
  { id: 'leave', label: 'Leave Management', icon: CalendarCheck2 },
  { id: 'requests', label: 'Requests', icon: Inbox },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'document', label: 'Document', icon: FileText },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'wellness', label: 'Wellness', icon: Activity },
];

function normalizePeople(raw) {
  return raw.map((p) => {
    const extra = EXTRA[p.id] || {};
    return {
      ...p,
      position: extra.position || 'Employee',
      department: extra.department || 'General',
      location: extra.location || 'Boston HQ',
      reportsTo: extra.reportsTo ?? null,
      avatar: extra.avatar || `https://i.pravatar.cc/80?u=${encodeURIComponent(p.id || p.name)}`,
    };
  });
}

function buildTree(people) {
  const byId = Object.fromEntries(people.map((p) => [p.id, p]));
  const children = {};
  people.forEach((p) => {
    const key = p.reportsTo || '__root__';
    children[key] = children[key] || [];
    children[key].push(p);
  });
  const roots = children['__root__'] || [];
  return { byId, children, roots };
}

function toCSV(rows) {
  const headers = ['id', 'name', 'handle', 'position', 'department', 'location', 'reportsTo', 'color', 'avatar'];
  const esc = (v) => `"${String(v ?? '').replaceAll('"', '""').replaceAll('\n', ' ').trim()}"`;
  return [headers.join(','), ...rows.map((r) => headers.map((h) => esc(r[h])).join(','))].join('\n');
}

export default function PeopleDirectory() {
  const [activeTab, setActiveTab] = useState('org');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [people, setPeople] = useState(() => normalizePeople(peopleRaw));
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [showAddMember, setShowAddMember] = useState({ employeeId: null });
  const [zoom, setZoom] = useState(1);

  const searchRef = useRef(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const orgChartData = useMemo(() => buildTree(people), [people]);

  const filteredPeople = useMemo(() => {
    if (!debouncedQuery) return people;
    const q = debouncedQuery.toLowerCase();
    return people.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }, [people, debouncedQuery]);

  function handleExport() {
    const csv = toCSV(people);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `people-${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleAddMember(parentId, pickedIds) {
    setPeople((prev) => prev.map((p) => (pickedIds.includes(p.id) ? { ...p, reportsTo: parentId } : p)));
    setSelectedEmployees((prev) => Array.from(new Set([...prev, ...pickedIds])));
    setShowAddMember({ employeeId: null });
  }

  function handleToggleSelect(id) {
    setSelectedEmployees((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleCreateEmployee(newEmp) {
    setPeople((prev) => [...prev, newEmp]);
    setShowCreateModal(false);
  }

  function clearSearch() {
    setSearchQuery('');
    setShowSearchDropdown(false);
  }

  useEffect(() => {
    function onDocClick(e) {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target)) setShowSearchDropdown(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="text-[#0A0D14]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">People Directory</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="h-10 px-4 rounded-full border border-[#E5E7EB] text-[#0A0D14] hover:bg-[#F3F4F6] transition flex items-center gap-2"
            aria-label="Export"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="h-10 px-4 rounded-full bg-[#7C6FDC] text-white hover:brightness-95 transition flex items-center gap-2"
            aria-label="Creating New Account"
          >
            <UserPlus className="w-4 h-4" />
            <span>Creating New Account</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <TabNavigation tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* Search + Edit */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="relative w-full max-w-[380px]" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            className="w-full h-11 pl-9 pr-9 text-sm rounded-[8px] border border-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]"
            placeholder="Search for employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
            aria-label="Search for employee"
          />
          {searchQuery ? (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#F3F4F6]"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          ) : null}

          {showSearchDropdown && (
            <div className="absolute z-20 mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white shadow-md max-h-72 overflow-auto">
              {filteredPeople.length === 0 ? (
                <div className="p-4 text-sm text-[#6B7280]">No results</div>
              ) : (
                <ul className="py-2">
                  {filteredPeople.slice(0, 20).map((p) => (
                    <li
                      key={p.id}
                      className="px-3 py-2 hover:bg-[#F3F4F6] cursor-pointer flex items-center gap-3"
                      onClick={() => {
                        handleToggleSelect(p.id);
                        setShowSearchDropdown(false);
                      }}
                    >
                      <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{p.name}</div>
                        <div className="text-xs text-[#6B7280] truncate">{p.handle}</div>
                      </div>
                      {selectedEmployees.includes(p.id) && (
                        <CheckCircle2 className="w-4 h-4 text-[#7C6FDC]" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          className="h-10 px-4 rounded-full border border-[#E5E7EB] text-[#0A0D14] hover:bg-[#F3F4F6] transition flex items-center gap-2"
          aria-label="Edit ORG Chart"
        >
          <UserPlus className="w-4 h-4" />
          <span>Edit ORG Chart</span>
        </button>
      </div>

      {/* Content */}
      {activeTab !== 'org' ? (
        <div className="mt-6 rounded-xl border border-[#E5E7EB] p-6 text-[#6B7280]">
          Content for {TABS.find((t) => t.id === activeTab)?.label} goes here.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-4">
          <EmployeeList
            employees={filteredPeople}
            selected={selectedEmployees}
            onToggleSelect={handleToggleSelect}
          />

          <div className="relative rounded-xl border border-[#E5E7EB] p-4 lg:p-6 bg-white">
            <div className="rounded-xl bg-white border border-[#E5E7EB] overflow-hidden">
              <div
                className="relative p-8 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:16px_16px] [background-position:8px_8px]"
                style={{ minHeight: 520, overflow: 'hidden' }}
              >
                <div className="origin-top-left" style={{ transform: `scale(${zoom})` }}>
                  <OrgChart
                    byId={orgChartData.byId}
                    childrenMap={orgChartData.children}
                    roots={orgChartData.roots}
                    selectedEmployees={selectedEmployees}
                    onRequestAdd={(employeeId) => setShowAddMember({ employeeId })}
                  />
                </div>

                {/* Zoom controls */}
                <div className="absolute left-4 bottom-4 flex flex-col gap-2">
                  <button
                    className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] shadow hover:bg-[#F3F4F6] flex items-center justify-center"
                    onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))}
                    aria-label="Zoom out"
                  >
                    <Minus className="w-4 h-4 text-[#0A0D14]" />
                  </button>
                  <button
                    className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] shadow hover:bg-[#F3F4F6] flex items-center justify-center"
                    onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))}
                    aria-label="Zoom in"
                  >
                    <Plus className="w-4 h-4 text-[#0A0D14]" />
                  </button>
                  <button
                    className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] shadow hover:bg[#F3F4F6] flex items-center justify-center"
                    onClick={() => setZoom(1)}
                    aria-label="Reset zoom"
                  >
                    <Settings2 className="w-4 h-4 text-[#0A0D14]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member */}
      {showAddMember.employeeId && (
        <AddMemberDropdown
          allEmployees={people}
          excludeIds={[showAddMember.employeeId]}
          selected={selectedEmployees}
          onClose={() => setShowAddMember({ employeeId: null })}
          onConfirm={(pickedIds) => handleAddMember(showAddMember.employeeId, pickedIds)}
        />
      )}

      {/* Create New Account */}
      {showCreateModal && (
        <CreateEmployeeModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateEmployee}
        />
      )}
    </div>
  );
}