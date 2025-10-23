// src/components/PeopleDirectory/CreateEmployeeModal.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, X } from 'lucide-react';

// Full-form validation
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

// Per-field validation on blur
function validateField(name, value, form) {
  switch (name) {
    case 'firstName':
      return !value.trim() ? 'First name is required' : '';
    case 'lastName':
      return !value.trim() ? 'Last name is required' : '';
    case 'email':
      return !value.trim() || !/\S+@\S+\.\S+/.test(value) ? 'Enter a valid email' : '';
    case 'phone':
      return !value.trim() || !/^[0-9+\s()-]{7,}$/.test(value) ? 'Enter a valid phone number' : '';
    case 'password':
      return !value || value.length < 6 ? 'Password must be at least 6 characters' : '';
    case 'confirm':
      return value !== form.password ? 'Passwords do not match' : '';
    default:
      return '';
  }
}

// Input component moved outside to prevent recreation on every render
const Input = React.forwardRef(({ label, icon: Icon, error, right, onChange, onBlur, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />}
      <input
        ref={ref}
        {...props}
        className={[
          'w-full h-11 pl-9 pr-10 rounded-[8px] border placeholder-[#6B7280] text-sm',
          error ? 'border-red-500' : 'border-[#E5E7EB]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FDC]',
        ].join(' ')}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="off"
      />
      {right}
    </div>
    {error ? <p className="text-xs text-red-600">{error}</p> : null}
  </div>
));

Input.displayName = 'Input';

export default function CreateEmployeeModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Compute once per change (lightweight) — does not alter focus
  const canSubmit = useMemo(() => Object.keys(validate(form)).length === 0, [form]);

  // Open/close effects: focus, scroll lock, esc, focus trap
  useEffect(() => {
    if (!isOpen) {
      // Reset only when closing
      setForm({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
      setErrors({});
      setShowPw(false);
      setShowPw2(false);
      setSubmitting(false);
      return;
    }

    // Lock background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first input once
    const t = setTimeout(() => firstInputRef.current?.focus(), 0);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();

      // Basic focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Keep typing smooth: change state only; do not re-validate whole form per key
  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.currentTarget;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, form) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate once on submit
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    // Simulated async save for demo purposes
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
      onSave?.(newEmp);
      setSubmitting(false);
    }, 350);
  };

  // Overlay (click to close). Use mouse down to avoid any focus flicker.
  const Overlay = (
    <div
      className="fixed inset-0 bg-black/40"
      onMouseDown={onClose}
      aria-hidden="true"
    />
  );

  const Card = (
    <div
      ref={modalRef}
      className="relative mx-auto max-w-[720px] w-[clamp(320px,92vw,720px)] mt-24 bg-white rounded-xl shadow-lg border border-[#E5E7EB]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-employee-title"
      onMouseDown={(e) => e.stopPropagation()}  // prevent overlay from stealing focus
    >
      <div className="flex items-center justify-between px-6 py-4">
        <h2 id="create-employee-title" className="text-xl font-semibold">
          Creating Employee New Account
        </h2>
        <button onClick={onClose} aria-label="Close modal" className="p-1 rounded hover:bg-[#F3F4F6]">
          <X className="w-5 h-5 text-[#6B7280]" />
        </button>
      </div>
      <div className="border-t border-dashed border-[#E5E7EB]" />

      <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            ref={firstInputRef}
            name="firstName"
            label="First Name"
            placeholder="Enter name..."
            icon={User}
            value={form.firstName}
            error={errors.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="lastName"
            label="Last Name"
            placeholder="Enter name..."
            icon={User}
            value={form.lastName}
            error={errors.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="email"
            label="Email Address"
            placeholder="Enter email..."
            icon={Mail}
            type="email"
            value={form.email}
            error={errors.email}
            autoComplete="email"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="phone"
            label="Phone Number"
            placeholder="Enter number..."
            icon={Phone}
            value={form.phone}
            error={errors.phone}
            inputMode="tel"
            autoComplete="tel"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* Passwords */}
        <Input
          name="password"
          label="Password"
          placeholder="Enter Password..."
          icon={Lock}
          type={showPw ? 'text' : 'password'}
          value={form.password}
          error={errors.password}
          autoComplete="new-password"
          onChange={handleChange}
          onBlur={handleBlur}
          right={
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#F3F4F6]"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPw ? <EyeOff className="w-4 h-4 text-[#6B7280]" /> : <Eye className="w-4 h-4 text-[#6B7280]" />}
            </button>
          }
        />

        <Input
          name="confirm"
          label="Confirm Password"
          placeholder="Enter Password..."
          icon={Lock}
          type={showPw2 ? 'text' : 'password'}
          value={form.confirm}
          error={errors.confirm}
          autoComplete="new-password"
          onChange={handleChange}
          onBlur={handleBlur}
          right={
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#F3F4F6]"
              onClick={() => setShowPw2((s) => !s)}
              aria-label={showPw2 ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPw2 ? <EyeOff className="w-4 h-4 text-[#6B7280]" /> : <Eye className="w-4 h-4 text-[#6B7280]" />}
            </button>
          }
        />

        {/* Actions */}
        <div className="grid grid-cols-2 items-center gap-4 mt-2">
        <button
            type="button"
            className="w-full h-11 px-6 rounded-full border border-[#E5E7EB] hover:bg-[#F3F4F6]"
            onClick={onClose}
        >
            Cancel
        </button>
        <button
            type="submit"
            disabled={submitting || !canSubmit}
            className={[
            'w-full h-11 px-8 rounded-full text-white hover:brightness-95 bg-[#7C6FDC] bg-[linear-gradient(0deg,_#41295A_0%,_#2F0743_100%)]',
            submitting || !canSubmit ? 'opacity-70 cursor-not-allowed' : '',
            ].join(' ')}
        >
            Save
        </button>
        </div>
      </form>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {Overlay}
      {Card}
    </div>,
    document.body
  );
}