import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import FormField from './FormField';

export const BadgeSelector = ({
  label,
  name,
  selected = [],
  onChange,
  options = [],
  allowCustom = true,
  placeholder = 'Add custom skill/tag...',
  required = false,
  error = '',
  touched = false,
  hint = '',
  className = ''
}) => {
  const [customInput, setCustomInput] = useState('');

  const handleToggle = (item) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setCustomInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom(e);
    }
  };

  return (
    <FormField
      label={label}
      name={name}
      required={required}
      error={error}
      touched={touched}
      hint={hint}
      className={className}
    >
      <div className="flex flex-col gap-2.5">
        {/* Preset badges */}
        {options.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleToggle(opt)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={2.5} />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected custom badges */}
        {selected.filter((s) => !options.includes(s)).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selected
              .filter((s) => !options.includes(s))
              .map((customTag) => (
                <span
                  key={customTag}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                >
                  <span>{customTag}</span>
                  <button
                    type="button"
                    onClick={() => handleToggle(customTag)}
                    className="hover:text-emerald-900 dark:hover:text-emerald-100"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
          </div>
        )}

        {/* Custom input bar */}
        {allowCustom && (
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              disabled={!customInput.trim()}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Plus size={13} />
              Add
            </button>
          </div>
        )}
      </div>
    </FormField>
  );
};

export default BadgeSelector;
