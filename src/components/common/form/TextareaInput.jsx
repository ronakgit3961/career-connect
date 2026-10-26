import React from 'react';
import FormField from './FormField';

export const TextareaInput = ({
  label,
  name,
  value = '',
  onChange,
  onBlur,
  placeholder = '',
  required = false,
  error = '',
  touched = false,
  hint = '',
  tooltip = '',
  rows = 4,
  maxLength,
  disabled = false,
  className = '',
  ...props
}) => {
  const hasError = Boolean(touched && error);
  const currentLength = typeof value === 'string' ? value.length : 0;

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
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          aria-required={required}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
            hasError
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500'
              : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:hover:border-slate-600'
          } ${disabled ? 'cursor-not-allowed opacity-60 bg-slate-100 dark:bg-slate-800' : ''}`}
          {...props}
        />
        {maxLength && (
          <div className="mt-1 flex justify-end text-[11px] text-slate-400">
            <span>
              {currentLength} / {maxLength}
            </span>
          </div>
        )}
      </div>
    </FormField>
  );
};

export default TextareaInput;
