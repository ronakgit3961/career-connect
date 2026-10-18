import React from 'react';
import FormField from './FormField';

export const RangeSlider = ({
  label,
  name,
  value = 0,
  min = 0,
  max = 250000,
  step = 5000,
  onChange,
  onBlur,
  formatter = (v) => `$${Number(v).toLocaleString()}`,
  unit = '',
  hint = '',
  className = ''
}) => {
  return (
    <FormField label={label} name={name} hint={hint} className={className}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>{formatter(value)} {unit}</span>
          <span className="text-slate-400 font-normal">Max: {formatter(max)}</span>
        </div>
        <input
          id={name}
          name={name}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 transition dark:bg-slate-700"
        />
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>{formatter(min)}</span>
          <span>{formatter(max / 2)}</span>
          <span>{formatter(max)}</span>
        </div>
      </div>
    </FormField>
  );
};

export default RangeSlider;
