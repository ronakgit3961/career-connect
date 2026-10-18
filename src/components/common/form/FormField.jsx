import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

export const FormField = ({
  label,
  name,
  required = false,
  error = '',
  touched = false,
  hint = '',
  tooltip = '',
  className = '',
  children
}) => {
  const hasError = Boolean(touched && error);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
            {required && <span className="text-rose-500 font-bold">*</span>}
            {tooltip && (
              <span className="group relative inline-flex cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <HelpCircle size={13} />
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden w-48 rounded bg-slate-900 px-2 py-1 text-[11px] font-normal normal-case text-slate-100 shadow-lg group-hover:block z-20">
                  {tooltip}
                </span>
              </span>
            )}
          </label>
        </div>
      )}

      {children}

      {hasError ? (
        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500 animate-fade-in">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
};

export default FormField;
