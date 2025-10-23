// src/components/calendar/ModalSchedule.jsx
import React, { useMemo, useState } from 'react';
import DatePicker from './DatePicker';

const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');

export default function ModalSchedule({ onClose, people, onCreate }) {
  const [title, setTitle] = useState('Meeting Client for Dashboard UI');
  const [organizerId, setOrganizerId] = useState(people[0]?.id);
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [members, setMembers] = useState([people[10]]); // Olivia as default
  const [platforms, setPlatforms] = useState({ zoom: true, meet: false, slack: false, own: false });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return people.filter((p) => p.name.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q));
  }, [people, search]);

  const toggleMember = (p) => {
    setMembers((prev) => {
      const found = prev.find((m) => m.id === p.id);
      if (found) return prev.filter((m) => m.id !== p.id);
      return [...prev, p];
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-gray-200">
          <h3 className="text-lg font-semibold">Project Meeting Schedule</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Task Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <div className="mt-1 relative">
                <select
                  value={organizerId}
                  onChange={(e) => setOrganizerId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Due Date</label>
              <div className="mt-1 relative">
                <DateInput value={date} onChange={setDate} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">What type of conversation?</p>
              <div className="flex gap-3">
                <button className="flex-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                    💬
                  </span>
                  Message
                </button>
                <button className="flex-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                    🎧
                  </span>
                  Audio
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">What type of app conversation you want?</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'zoom', label: 'On Zoom' },
                  { key: 'meet', label: 'On Meet' },
                  { key: 'slack', label: 'On Slack' },
                  { key: 'own', label: 'On Own' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setPlatforms((s) => ({ ...s, [opt.key]: !s[opt.key] }))}
                    className={`px-3 py-2 rounded-lg border ${
                      platforms[opt.key] ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                    } flex items-center justify-between`}
                  >
                    <span>{opt.label}</span>
                    {platforms[opt.key] && <span className="text-purple-600">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Right column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Add Member</label>
              <div className="mt-1 relative">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Search something here..."
                    className="flex-1 outline-none"
                  />
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center"
                  >
                    ▾
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                    {filtered.map((p) => {
                      const active = !!members.find((m) => m.id === p.id);
                      return (
                        <button
                          key={p.id}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                          onClick={() => toggleMember(p)}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: p.color }}
                          >
                            {initials(p.name)}
                          </div>
                          <div className="text-left">
                            <div className="text-sm">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.handle}</div>
                          </div>
                          <div className="ml-auto">{active ? <span className="text-purple-600">✓</span> : null}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* Selected members */}
              {members.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {members.map((m) => (
                    <span
                      key={m.id}
                      className="px-2 py-1 rounded-full bg-gray-100 text-xs flex items-center gap-2"
                    >
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: m.color }} />
                      {m.name}
                      <button
                        aria-label={`Remove ${m.name}`}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => setMembers((prev) => prev.filter((x) => x.id !== m.id))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onCreate({
                  title,
                  subtitle: '',
                  organizerId,
                  date,
                  members,
                  platform: ['zoom', 'meet', 'slack', 'own'].find((k) => platforms[k]) ? 'on Zoom' : '',
                  timeStart: '07:00',
                  timeEnd: '07:30',
                  theme: 'purple',
                })
              }
              className="px-4 py-2 rounded-lg text-white bg-[#6C5DD3] hover:bg-[#5a4bc7]"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left hover:bg-gray-50"
      >
        {value ? value.toLocaleDateString() : 'Select date'}
      </button>
      {open && (
        <div className="absolute z-20 mt-2">
          <DatePicker
            value={value}
            onChange={(d) => {
              onChange(d);
              setOpen(false);
            }}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}