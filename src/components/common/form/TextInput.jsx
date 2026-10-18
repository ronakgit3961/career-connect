import React from 'react';
import { X } from 'lucide-react';
import FormField from './FormField';

export const TextInput = ({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  placeholder = '',
  required = false,
  error = '',
  touched = false,
  hint = '',
  tooltip = '',
  disabled = false,
  icon: Icon,
  clearable = false,
  onClear,
  prefix = '',
  suffix = '',
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
      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
            <Icon size={16} />
          </div>
        )}

        {prefix && (
          <span className="pointer-events-none absolute left-3 text-sm font-medium text-slate-400">
            {prefix}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
            Icon ? 'pl-9' : prefix ? 'pl-8' : ''
          } ${suffix || clearable ? 'pr-9' : ''} ${
            hasError
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500'
              : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:hover:border-slate-600'
          } ${disabled ? 'cursor-not-allowed opacity-60 bg-slate-100 dark:bg-slate-800' : ''}`}
          {...props}
        />

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={onClear || (() => onChange({ target: { name, value: '' } }))}
            className="absolute right-3 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X size={14} />
          </button>
        )}

        {suffix && !clearable && (
          <span className="pointer-events-none absolute right-3 text-xs font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </FormField>
  );
};

export default TextInput;
