import React, { useState } from 'react';
import DatePicker from './DatePicker';
import labelsJson from '../../data/calendar/labels.json';
import groupsJson from '../../data/calendar/groups.json';
import prioritiesJson from '../../data/calendar/priorities.json';

const initials = (name) => name.split(' ').map(p => p[0]).slice(0, 2).join('');

export default function ModalCreateTask({ onClose, people, onCreate }) {
  const [title, setTitle] = useState('Meeting Client for Dashboard UI');
  const [description, setDescription] = useState('Meeting with a client for a Dashboard UI project...');
  const [assigneeId, setAssigneeId] = useState(people[0]?.id);
  const [date, setDate] = useState(new Date());
  const [timeStart, setTimeStart] = useState('10:00');
  const [timeEnd, setTimeEnd] = useState('10:30');
  const [members, setMembers] = useState([people[0]]);
  const [labelId, setLabelId] = useState(labelsJson[0]?.id);
  const [groupId, setGroupId] = useState(groupsJson[0]?.id);
  const [priorityId, setPriorityId] = useState(prioritiesJson[0]?.id);
  const [theme, setTheme] = useState('indigo');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-gray-200">
          <h3 className="text-lg font-semibold">Create New Task</h3>
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
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Write Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Add Member</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 bg-white"
              >
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500">Due Date</label>
              <div className="mt-1">
                <DateInput value={date} onChange={setDate} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Add Group</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {groupsJson.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGroupId(g.id)}
                    className={`px-3 py-2 rounded-lg border ${
                      groupId === g.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Right column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Add Labels</label>
              <select
                value={labelId}
                onChange={(e) => setLabelId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 bg-white"
              >
                {labelsJson.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500">Add Time</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2"
                  placeholder="Start (HH:MM)"
                />
                <input
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2"
                  placeholder="End (HH:MM)"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Set Priority</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {prioritiesJson.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPriorityId(p.id)}
                    className={`px-3 py-2 rounded-lg border flex items-center justify-between ${
                      priorityId === p.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Attachment</label>
              <div className="mt-1 rounded-xl border border-gray-200 text-center py-10 text-sm text-gray-500">
                Click to upload or drag and drop
                <div className="text-xs text-gray-400 mt-2">SVG, PNG, JPG or GIF (max, 800x400px)</div>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Card Color</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { key: 'purple', classes: 'bg-purple-500' },
                  { key: 'magenta', classes: 'bg-fuchsia-500' },
                  { key: 'orange', classes: 'bg-amber-500' },
                  { key: 'indigo', classes: 'bg-indigo-500' },
                  { key: 'green', classes: 'bg-emerald-500' },
                  { key: 'teal', classes: 'bg-teal-500' },
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setTheme(c.key)}
                    className={`h-3 rounded-full w-16 ${c.classes} ${theme === c.key ? 'ring-2 ring-purple-300' : ''}`}
                  />
                ))}
              </div>
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
                  description,
                  assigneeId,
                  members,
                  date,
                  timeStart,
                  timeEnd,
                  platform: '',
                  theme,
                })
              }
              className="px-4 py-2 rounded-lg text-white bg-[#6C5DD3] hover:bg-[#5a4bc7]"
            >
              Save
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