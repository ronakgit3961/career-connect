import React from 'react';
import { ChevronDown } from 'lucide-react';
import FormField from './FormField';

export const SelectInput = ({
  label,
  name,
  value = '',
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  required = false,
  error = '',
  touched = false,
  hint = '',
  tooltip = '',
  disabled = false,
  className = '',
  ...props
}) => {
  const hasError = Boolean(touched && error);

  return (
    <FormField
      label={label}
      name={name}
      required={required}
      error={error}
      touched={touched}
      hint={hint}
      tooltip={tooltip}
      className={className}
    >
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          aria-required={required}
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm font-normal text-slate-900 transition-all focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
            hasError
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500'
              : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:hover:border-slate-600'
          } ${disabled ? 'cursor-not-allowed opacity-60 bg-slate-100 dark:bg-slate-800' : ''}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>
    </FormField>
  );
};

export default SelectInput;
