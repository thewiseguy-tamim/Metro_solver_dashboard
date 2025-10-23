// src/components/PeopleDirectory/CreateEmployeeModal.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, X } from 'lucide-react';

function validate(form) {
  const errors = {};
  if (!form.firstName?.trim()) errors.firstName = 'First name is required';
  if (!form.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!form.email?.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.phone?.trim() || !/^[0-9+\s()-]{7,}$/.test(form.phone)) errors.phone = 'Enter a valid phone number';
  if (!form.password || form.password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (form.password !== form.confirm) errors.confirm = 'Passwords do not match';
  return errors;
}

export default function CreateEmployeeModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
      setErrors({});
      setShowPw(false);
      setShowPw2(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  const canSubmit = useMemo(() => Object.keys(validate(form)).length === 0, [form]);

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    setTimeout(() => {
      const idBase = (form.firstName + form.lastName).toLowerCase().replace(/\s+/g, '');
      const id = `${idBase}-${Date.now().toString(36)}`;
      const newEmp = {
        id,
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        handle: `@${form.firstName.trim().toLowerCase()}`,
        color: '#6B7280',
        position: 'Employee',
        department: 'General',
        location: 'Boston HQ',
        reportsTo: null,
        avatar: `https://i.pravatar.cc/80?u=${encodeURIComponent(id)}`,
        email: form.email,
        phone: form.phone,
      };
      onSave(newEmp);
      setSubmitting(false);
    }, 500);
  }

  if (!isOpen) return null;

  const Input = ({ label, icon: Icon, error, right, ...props }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />}
        <input
          {...props}
          className={[
            'w-full h-11 pl-9 pr-10 rounded-[8px] border placeholder-[#6B7280] text-sm',
            error ? 'border-red-500' : 'border-[#E5E7EB]',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]',
          ].join(' ')}
        />
        {right}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative mx-auto max-w-[720px] mt-24 bg-white rounded-xl shadow-lg border border-[#E5E7EB]">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold">Creating Employee New Account</h2>
          <button onClick={onClose} aria-label="Close modal" className="p-1 rounded hover:bg-[#F3F4F6]">
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>
        <div className="border-t border-dashed border-[#E5E7EB]" />

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter name..."
              icon={User}
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              error={errors.firstName}
              required
            />
            <Input
              label="Last Name"
              placeholder="Enter name..."
              icon={User}
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              error={errors.lastName}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              placeholder="Enter email..."
              icon={Mail}
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={errors.email}
              required
            />
            <Input
              label="Phone Number"
              placeholder="Enter number..."
              icon={Phone}
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              error={errors.phone}
              required
            />
          </div>

          <Input
            label="Password"
            placeholder="Enter Password..."
            icon={Lock}
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
            right={
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#F3F4F6]"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="w-4 h-4 text-[#6B7280]" /> : <Eye className="w-4 h-4 text-[#6B7280]" />}
              </button>
            }
            required
          />

          <Input
            label="Confirm Password"
            placeholder="Enter Password..."
            icon={Lock}
            type={showPw2 ? 'text' : 'password'}
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            error={errors.confirm}
            right={
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#F3F4F6]"
                onClick={() => setShowPw2((s) => !s)}
                aria-label={showPw2 ? 'Hide password' : 'Show password'}
              >
                {showPw2 ? <EyeOff className="w-4 h-4 text-[#6B7280]" /> : <Eye className="w-4 h-4 text-[#6B7280]" />}
              </button>
            }
            required
          />

          <div className="flex items-center justify-between mt-2">
            <button type="button" className="h-11 px-6 rounded-full border border-[#E5E7EB] hover:bg-[#F3F4F6]" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className={[
                'h-11 px-8 rounded-full text-white bg-[#7C6FDC] hover:brightness-95',
                submitting || !canSubmit ? 'opacity-70 cursor-not-allowed' : '',
              ].join(' ')}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}