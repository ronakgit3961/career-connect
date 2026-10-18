import React from 'react';
import { Check } from 'lucide-react';

export const Checkbox = ({
  id,
  name,
  checked = false,
  onChange,
  label,
  description = '',
  disabled = false,
  className = ''
}) => {
  return (
    <label
      htmlFor={id || name}
      className={`group flex items-start gap-3 cursor-pointer select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center pt-0.5">
        <input
          type="checkbox"
          id={id || name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
            checked
              ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'border-slate-300 bg-white group-hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900'
          }`}
        >
          {checked && <Check size={13} strokeWidth={3} />}
        </div>
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
          )}
        </div>
      )}
    </label>
  );
};

export const ToggleSwitch = ({
  id,
  name,
  checked = false,
  onChange,
  label = '',
  description = '',
  disabled = false,
  className = ''
}) => {
  return (
    <label
      htmlFor={id || name}
      className={`flex items-center justify-between cursor-pointer select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
    >
      {(label || description) && (
        <div className="flex flex-col pr-4">
          {label && (
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="checkbox"
          id={id || name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`h-6 w-11 rounded-full transition-colors ${
            checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        />
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
};

export default Checkbox;
