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
  StretchHorizontal, // If not available in your lucide version, use Maximize2
  X,
  User,
  Clock,
  Timer,
  CalendarCheck2,
  Inbox,
  CreditCard,
  FileText,
  Award,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import TabNavigation from '../components/PeopleDirectory/TabNavigation';
import EmployeeList from '../components/PeopleDirectory/EmployeeList';
import OrgChart from '../components/PeopleDirectory/OrgChart';
import AddMemberDropdown from '../components/PeopleDirectory/AddMemberDropdown';
import CreateEmployeeModal from '../components/PeopleDirectory/CreateEmployeeModal';

// Enrich base data for demo
const EXTRA = {
  tahsan: { position: 'Founder - CEO', department: 'Executive', location: 'Boston HQ', reportsTo: null, avatar: 'https://i.pravatar.cc/80?u=matt' },
  herry: { position: 'Engineering', department: 'Engineering', location: 'London Office', reportsTo: 'tahsan', avatar: 'https://i.pravatar.cc/80?u=herry' },
  herryb: { position: 'Commercial', department: 'Sales', location: 'London Office', reportsTo: 'tahsan', avatar: 'https://i.pravatar.cc/80?u=herryb' },
  james: { position: 'Finance', department: 'Finance', location: 'Boston HQ', reportsTo: 'tahsan', avatar: 'https://i.pravatar.cc/80?u=james' },
  azam: { position: 'Marketing', department: 'Marketing', location: 'Boston HQ', reportsTo: 'herry', avatar: 'https://i.pravatar.cc/80?u=azam' },
  tim: { position: 'HR Management', department: 'HR', location: 'Boston HQ', reportsTo: 'herryb', avatar: 'https://i.pravatar.cc/80?u=tim' },
  matt: { position: 'Account Executive', department: 'Sales', location: 'Boston HQ', reportsTo: 'james', avatar: 'https://i.pravatar.cc/80?u=tahsan' },
  alex: { position: 'Engineer', department: 'Engineering', location: 'London Office', reportsTo: 'herry', avatar: 'https://i.pravatar.cc/80?u=alex' },
  mia:  { position: 'Engineer', department: 'Engineering', location: 'London Office', reportsTo: 'herry', avatar: 'https://i.pravatar.cc/80?u=mia' },
  noah: { position: 'Analyst', department: 'Finance', location: 'Boston HQ', reportsTo: 'james', avatar: 'https://i.pravatar.cc/80?u=noah' },
  olivia: { position: 'Designer', department: 'Product', location: 'Boston HQ', reportsTo: 'herryb', avatar: 'https://i.pravatar.cc/80?u=olivia' },
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

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const DROPDOWN_MAX_HEIGHT = 400; // change to 300 if you prefer

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
  // Tabs
  const [activeTab, setActiveTab] = useState('org');

  // People data
  const [people, setPeople] = useState(() => normalizePeople(peopleRaw));
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Search + employee list dropdown (hidden by default)
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showEmployeeList, setShowEmployeeList] = useState(false); // hidden on load
  const [employeeListMaxH, setEmployeeListMaxH] = useState(DROPDOWN_MAX_HEIGHT);

  const searchInputRef = useRef(null);
  const employeeListRef = useRef(null);

  // Add member popup anchored to +
  const [addMemberPopup, setAddMemberPopup] = useState({
    show: false,
    employeeId: null,
    position: { top: 0, left: 0 },
    placedAbove: true,
  });

  // Org chart zoom + drag-to-pan
  const [zoomLevel, setZoomLevel] = useState(1);
  const orgChartRef = useRef(null);
  const contentRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ left: 0, top: 0 });

  // Menus + delete
  const [activeMenu, setActiveMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, employeeId: null, employeeName: '' });

  // Modal + toasts + loading
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const orgChartData = useMemo(() => buildTree(people), [people]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

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

  // Export
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

  // Selection
  function handleToggleSelect(id) {
    setSelectedEmployees((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setShowEmployeeList(false); // close after pick
  }

  // Create modal
  function handleCreateEmployee(newEmp) {
    setPeople((prev) => [...prev, newEmp]);
    setShowCreateModal(false);
    showToast('Employee created successfully', 'success');
  }

  // Open the list when clicking the search input (or typing)
  const openEmployeeList = () => {
    setShowEmployeeList(true);
    const rect = searchInputRef.current?.getBoundingClientRect();
    if (rect) {
      // keep within viewport but clamp to DROPDOWN_MAX_HEIGHT
      const dynamicMax = Math.max(window.innerHeight - rect.bottom - 100, 240);
      setEmployeeListMaxH(Math.min(DROPDOWN_MAX_HEIGHT, dynamicMax));
    } else {
      setEmployeeListMaxH(DROPDOWN_MAX_HEIGHT);
    }
  };

  // Close on outside click / ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        employeeListRef.current &&
        !employeeListRef.current.contains(event.target)
      ) {
        setShowEmployeeList(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setShowEmployeeList(false);
    };
    if (showEmployeeList) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showEmployeeList]);

  // Add Member popup positioning
  const handleAddMemberClick = (employeeId, event) => {
    const btnRect = event.currentTarget.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const popupHeight = 320;
    const popupWidth = 280;

    let top = btnRect.top + scrollTop - popupHeight - 8;
    let left = btnRect.left + scrollLeft - popupWidth / 2 + btnRect.width / 2;
    let placedAbove = true;

    const vw = window.innerWidth;
    if (top < scrollTop + 8) {
      top = btnRect.bottom + scrollTop + 8;
      placedAbove = false;
    }
    if (left + popupWidth > scrollLeft + vw) left = scrollLeft + vw - popupWidth - 16;
    if (left < scrollLeft) left = scrollLeft + 16;

    setAddMemberPopup({ show: true, employeeId, position: { top, left }, placedAbove });
  };

  const handleConfirmAddMember = (parentId, pickedIds) => {
    setPeople((prev) => prev.map((p) => (pickedIds.includes(p.id) ? { ...p, reportsTo: parentId } : p)));
    setSelectedEmployees((prev) => Array.from(new Set([...prev, ...pickedIds])));
    setAddMemberPopup({ show: false, employeeId: null, position: { top: 0, left: 0 }, placedAbove: true });
    showToast('Member assigned successfully', 'success');
  };

  // Menu outside click
  useEffect(() => {
    const closeOnOutside = (e) => {
      if (activeMenu && !e.target.closest('.employee-card-menu')) setActiveMenu(null);
    };
    document.addEventListener('mousedown', closeOnOutside);
    return () => document.removeEventListener('mousedown', closeOnOutside);
  }, [activeMenu]);

  // Delete
  const handleDeleteEmployee = (employeeId) => {
    const emp = people.find((e) => e.id === employeeId);
    setDeleteConfirm({ show: true, employeeId, employeeName: emp?.name || 'this employee' });
    setActiveMenu(null);
  };
  const confirmDelete = () => {
    const employeeId = deleteConfirm.employeeId;
    setPeople((prev) =>
      prev
        .filter((p) => p.id !== employeeId)
        .map((p) => (p.reportsTo === employeeId ? { ...p, reportsTo: null } : p))
    );
    setDeleteConfirm({ show: false, employeeId: null, employeeName: '' });
    showToast('Employee deleted successfully', 'success');
  };

  // Toast
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 2500);
  };

  // Zoom + drag
  const handleZoomIn = () => setZoomLevel((z) => Math.min(+((z + 0.1).toFixed(2)), MAX_ZOOM));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(+((z - 0.1).toFixed(2)), MIN_ZOOM));

  // Fit to view (third button)
  const handleFitView = () => {
    const container = orgChartRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const sw = content.scrollWidth;
    const sh = content.scrollHeight;

    const scaleX = cw / sw;
    const scaleY = ch / sh;
    const scale = Math.min(scaleX, scaleY, 1) * 0.9;

    setZoomLevel(scale || 1);

    setTimeout(() => {
      container.scrollLeft = Math.max((sw * scale - cw) / 2, 0);
      container.scrollTop = 0;
    }, 50);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setScrollStart({
      left: orgChartRef.current.scrollLeft,
      top: orgChartRef.current.scrollTop,
    });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    orgChartRef.current.scrollLeft = scrollStart.left - dx;
    orgChartRef.current.scrollTop = scrollStart.top - dy;
  };
  const handleMouseUp = () => setIsDragging(false);

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
            className="h-10 px-4 rounded-full text-white hover:brightness-95 transition flex items-center gap-2"
            style={{ background: "linear-gradient(0deg, #41295A 0%, #2F0743 100%)" }}
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
        <div className="relative w-full max-w-[380px]" ref={searchInputRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            className="w-full h-11 pl-9 pr-9 text-sm rounded-[8px] border border-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]"
            placeholder="Search for employee..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!showEmployeeList) openEmployeeList(); // show on typing
            }}
            onFocus={openEmployeeList} // show on click/focus
            aria-label="Search for employee"
          />
          {searchQuery ? (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#F3F4F6]"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          ) : null}

          {/* Dropdown list: hidden by default, visible only on interaction */}
          <div
            ref={employeeListRef}
            className={[
              'absolute z-50 left-0 top-[calc(100%+8px)] w-[320px]',
              'transition-all duration-150',
              showEmployeeList ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none',
            ].join(' ')}
          >
            <EmployeeList
              floating
              maxHeight={employeeListMaxH}     // <= SCROLL LIMIT
              employees={filteredPeople}
              selected={selectedEmployees}
              onToggleSelect={(id) => {
                handleToggleSelect(id);
                setShowEmployeeList(false);
              }}
              onClosePanel={() => setShowEmployeeList(false)}
            />
          </div>
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
        <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white relative">
          {/* Org Chart container */}
          <div className="relative w-full h-[calc(100vh-280px)] overflow-hidden rounded-lg">
            <div
              ref={orgChartRef}
              className={`w-full h-full overflow-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="min-w-max p-8">
                <div
                  ref={contentRef}
                  className="org-chart-content bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:16px_16px] [background-position:8px_8px] rounded-xl p-8 origin-top-left transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64 text-[#7C6FDC]">
                      <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    </div>
                  ) : orgChartData.roots.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-300 mx-auto mb-3">
                        <User className="w-12 h-12" />
                      </div>
                      <p className="text-gray-600">No employees found</p>
                    </div>
                  ) : (
                    <OrgChart
                      byId={orgChartData.byId}
                      childrenMap={orgChartData.children}
                      roots={orgChartData.roots}
                      selectedEmployees={selectedEmployees}
                      activeMenu={activeMenu}
                      onToggleMenu={(id) => setActiveMenu((m) => (m === id ? null : id))}
                      onViewProfile={() => {}}
                      onEditEmployee={() => {}}
                      onDeleteEmployee={handleDeleteEmployee}
                      onRequestAdd={(id, e) => handleAddMemberClick(id, e)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom-left controls: − / + / Fit */}
            <div className="absolute left-4 bottom-4 flex flex-col gap-2">
              <button
                className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] shadow hover:bg-[#F3F4F6] flex items-center justify-center"
                onClick={handleZoomOut}
                aria-label="Zoom out"
              >
                <Minus className="w-4 h-4 text-[#0A0D14]" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] shadow hover:bg-[#F3F4F6] flex items-center justify-center"
                onClick={handleZoomIn}
                aria-label="Zoom in"
              >
                <Plus className="w-4 h-4 text-[#0A0D14]" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] shadow hover:bg-[#F3F4F6] flex items-center justify-center"
                onClick={handleFitView}
                aria-label="Fit to view"
                title="Fit to view"
              >
                <StretchHorizontal className="w-4 h-4 text-[#0A0D14]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Popup */}
      {addMemberPopup.show && (
        <AddMemberDropdown
          id="add-member-popup"
          position={addMemberPopup.position}
          placedAbove={addMemberPopup.placedAbove}
          allEmployees={people}
          excludeIds={[addMemberPopup.employeeId]}
          selected={selectedEmployees}
          onClose={() =>
            setAddMemberPopup({ show: false, employeeId: null, position: { top: 0, left: 0 }, placedAbove: true })
          }
          onImmediateSelect={(pickedId) => handleConfirmAddMember(addMemberPopup.employeeId, [pickedId])}
          onConfirm={(pickedIds) => handleConfirmAddMember(addMemberPopup.employeeId, pickedIds)}
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

      {/* Delete confirmation */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Delete Employee</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteConfirm.employeeName}</span>? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, employeeId: null, employeeName: '' })}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-[110]">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white ${
              toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            <span className="text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}