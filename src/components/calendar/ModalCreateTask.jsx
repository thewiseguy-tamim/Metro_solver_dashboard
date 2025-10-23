// src/components/calendar/ModalCreateTask.jsx
import React, { useMemo, useState } from 'react';
import {
  XMarkIcon,
  UserIcon,
  TagIcon,
  CalendarDaysIcon,
  ClockIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';
import DatePicker from './DatePicker';
import labelsJson from '../../data/calendar/labels.json';
import groupsJson from '../../data/calendar/groups.json';
import prioritiesJson from '../../data/calendar/priorities.json';

export default function ModalCreateTask({ onClose, people = [], onCreate }) {
  // State
  const [title, setTitle] = useState('Meeting Client for Dashboard UI');
  const [description, setDescription] = useState('Meeting with a client for a Dashboard UI project...');
  const [assigneeId, setAssigneeId] = useState(String(people[0]?.id ?? ''));
  const [date, setDate] = useState(new Date());
  const [timeStart, setTimeStart] = useState('10:00');
  const [timeEnd, setTimeEnd] = useState('10:30');
  const [labelId, setLabelId] = useState(String(labelsJson[0]?.id ?? ''));
  const [groupId, setGroupId] = useState(String(groupsJson[0]?.id ?? ''));
  const [priorityId, setPriorityId] = useState(String(prioritiesJson[0]?.id ?? ''));
  const [theme, setTheme] = useState('indigo');
  const [errors, setErrors] = useState({});
  const [attachment, setAttachment] = useState(null);

  // Helpers
  const isTime = (t) => /^([01]?\d|2[0-3]):[0-5]\d$/.test(t);
  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!date) e.date = 'Date is required';
    if (!isTime(timeStart)) e.timeStart = 'Use HH:MM (24h)';
    if (!isTime(timeEnd)) e.timeEnd = 'Use HH:MM (24h)';
    if (isTime(timeStart) && isTime(timeEnd) && toMin(timeEnd) <= toMin(timeStart)) {
      e.timeEnd = 'End must be after start';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const assignee = useMemo(
    () => people.find((p) => String(p.id) === String(assigneeId)),
    [people, assigneeId]
  );

  // Status dot for groups
  const groupDotClass = (name = '') => {
    if (name === 'In Progress') return 'bg-amber-500';
    if (name === 'Done') return 'bg-emerald-500';
    return '';
  };

  // Priority palette mapping by name (icon color + right-side dot when unselected)
  const priorityMap = {
    Urgent: { color: '#EF4444', dot: '#EF4444' }, // red
    High: { color: '#F59E0B', dot: '#F59E0B' }, // amber
    Normal: { color: '#3B82F6', dot: '#64748B' }, // blue flag, slate-ish dot
    Low: { color: '#6B7280', dot: '#10B981' }, // gray flag, green dot
  };

  const handleFile = (file) => {
    if (!file) return;
    setAttachment(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 mx-4">

        {/* Header with dashed border bottom */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-gray-200">
          <h3 id="create-task-title" className="text-[20px] font-semibold text-gray-900">
            Create New Task
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Two-column grid on desktop, single column on mobile; 24px gap */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full-width: Task Title */}
          <div className="md:col-span-2">
            <Field label="Task Title" error={errors.title}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Meeting with Acme Inc."
                className="w-full rounded-lg border border-gray-200 px-3 py-[10px] text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
            </Field>
          </div>

          {/* Full-width: Write Description */}
          <div className="md:col-span-2">
            <Field label="Write Description">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short description..."
                className="w-full rounded-lg border border-gray-200 px-3 py-[10px] text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
            </Field>
          </div>

          {/* Left column (compact vertical spacing) */}
          <div className="space-y-4">
            {/* Add Member with user icon prefix */}
            <Field label="Add Member">
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-[10px] bg-white text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </Field>

            {/* Due Date with calendar icon */}
            <Field label="Due Date" error={errors.date}>
              <DateInput value={date} onChange={setDate} />
            </Field>

            {/* Add Group: 2x2 grid, radio-style with right status dot */}
            <Field label="Add Group">
              <div className="grid grid-cols-2 gap-2">
                {groupsJson.map((g) => {
                  const selected = String(groupId) === String(g.id);
                  const dotClass = groupDotClass(g.name);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGroupId(String(g.id))}
                      aria-pressed={selected}
                      className={[
                        'px-3 py-2.5 rounded-lg border text-left flex items-center justify-between gap-2',
                        selected ? 'border-2 border-violet-500 bg-violet-50' : 'border-gray-200 hover:bg-gray-50',
                        'focus:outline-none focus:ring-2 focus:ring-violet-300',
                      ].join(' ')}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={[
                            'inline-flex h-4 w-4 items-center justify-center rounded-full border',
                            selected ? 'border-violet-500' : 'border-gray-300',
                          ].join(' ')}
                        >
                          {selected && <span className="h-2 w-2 rounded-full bg-violet-500" />}
                        </span>
                        <span className="text-gray-900 text-[14px]">{g.name}</span>
                      </span>
                      {dotClass ? <span className={`h-2 w-2 rounded-full ${dotClass}`} /> : <span className="h-2 w-2" />}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* Right column (compact spacing) */}
          <div className="space-y-4">
            {/* Add Labels with tag icon prefix */}
            <Field label="Add Labels">
              <div className="relative">
                <TagIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={labelId}
                  onChange={(e) => setLabelId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-[10px] bg-white text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                >
                  {labelsJson.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </Field>

            {/* Add Time with clock icons in both inputs */}
            <Field label="Add Time" error={errors.timeStart || errors.timeEnd}>
              <div className="grid grid-cols-2 gap-2">
                <InputWithIcon
                  icon={<ClockIcon className="w-4 h-4 text-gray-500" />}
                  value={timeStart}
                  onChange={setTimeStart}
                  placeholder="HH:MM"
                />
                <InputWithIcon
                  icon={<ClockIcon className="w-4 h-4 text-gray-500" />}
                  value={timeEnd}
                  onChange={setTimeEnd}
                  placeholder="HH:MM"
                />
              </div>
              {(errors.timeStart || errors.timeEnd) && (
                <p className="text-xs text-red-500 mt-1">{errors.timeStart || errors.timeEnd}</p>
              )}
            </Field>

            {/* Set Priority: 2x2 grid, compact padding */}
            <Field label="Set Priority">
              <div className="grid grid-cols-2 gap-2">
                {prioritiesJson.map((p) => {
                  const selected = String(priorityId) === String(p.id);
                  const palette =
                    priorityMap[p.name] || { color: p.color || '#6B7280', dot: p.color || '#6B7280' };
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPriorityId(String(p.id))}
                      aria-pressed={selected}
                      className={[
                        'px-3 py-2.5 rounded-lg border flex items-center justify-between gap-2',
                        selected ? 'border-2 border-violet-500 bg-violet-50' : 'border-gray-200 hover:bg-gray-50',
                        'focus:outline-none focus:ring-2 focus:ring-violet-300',
                      ].join(' ')}
                    >
                      <span className="flex items-center gap-2">
                        <FlagIcon className="w-5 h-5" style={{ color: palette.color }} />
                        <span className="text-gray-900 text-[14px]">{p.name}</span>
                      </span>
                      {selected ? (
                        <CheckCircleIcon className="w-5 h-5 text-violet-500" />
                      ) : (
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.dot }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* FULL-WIDTH: Attachment (second last) - reduced padding to keep height */}
          <div className="md:col-span-2">
            <Field label="Attachment">
              <label
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="block rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center py-10 px-6 cursor-pointer hover:border-violet-300 hover:bg-violet-50"
              >
                <input
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <div className="flex flex-col items-center gap-2">
                  <CloudArrowUpIcon className="w-8 h-8 text-violet-500" />
                  {attachment ? (
                    <span className="text-gray-900 font-medium">{attachment.name}</span>
                  ) : (
                    <>
                      <div className="text-sm">
                        <span className="text-violet-600 font-medium">Click to upload</span>{' '}
                        <span className="text-gray-600">or drag and drop</span>
                      </div>
                      <span className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max, 800x400px)</span>
                    </>
                  )}
                </div>
              </label>
            </Field>
          </div>

          {/* FULL-WIDTH: Card Color (last) - centered pills */}
          <div className="md:col-span-2">
            <Field label="">
              <div className="flex flex-wrap justify-center gap-[10px]">
                {[
                  { key: 'purple', className: 'bg-violet-500' },
                  { key: 'magenta', className: 'bg-fuchsia-500' },
                  { key: 'orange', className: 'bg-orange-500' },
                  { key: 'indigo', className: 'bg-indigo-500' },
                  { key: 'teal', className: 'bg-teal-500' },
                  { key: 'green', className: 'bg-emerald-500' },
                  { key: 'red', className: 'bg-rose-500' },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setTheme(c.key)}
                    className={[
                      'h-3 w-[68px] rounded-full',
                      c.className,
                      theme === c.key ? 'ring-2 ring-purple-400 ring-offset-2' : '',
                    ].join(' ')}
                    aria-label={`Select ${c.key} card color`}
                    aria-pressed={theme === c.key}
                  />
                ))}
              </div>
            </Field>
          </div>
        </div>

        {/* Footer: space-between, compact button heights */}
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <button
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                if (!validate()) return;
                onCreate({
                  title,
                  description,
                  assigneeId,
                  members: assignee ? [assignee] : [],
                  date,
                  timeStart,
                  timeEnd,
                  labelId,
                  groupId,
                  priorityId,
                  platform: '',
                  theme,
                  attachment,
                });
              }}
              className="px-8 py-2.5 rounded-lg text-white bg-[linear-gradient(180deg,#2F0743_0%,#41295A_100%)] hover:brightness-95 hover:shadow focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper components */

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block mb-2 text-[13px] text-gray-500 font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function InputWithIcon({ icon, value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-[10px] text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
      />
    </div>
  );
}

function DateInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-lg border border-gray-200 px-3 py-[10px] text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 flex items-center gap-2"
      >
        <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
        <span className={value ? 'text-gray-900 text-[14px]' : 'text-gray-400 text-[14px]'}>
          {value ? value.toLocaleDateString() : 'Select date'}
        </span>
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