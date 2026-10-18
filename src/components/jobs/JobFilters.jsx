import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchFilter,
  setCategoryFilter,
  setWorkplaceFilter,
  setExperienceFilter,
  setJobTypeFilter,
  setMinSalaryFilter,
  resetFilters,
  setSortBy
} from '../../store/slices/jobsSlice';
import {
  JOB_CATEGORIES,
  WORKPLACE_TYPES,
  EXPERIENCE_LEVELS,
  JOB_TYPES
} from '../../services/mockData';
import { Search, RotateCcw, Filter, SlidersHorizontal, DollarSign } from 'lucide-react';
import { TextInput, SelectInput, RangeSlider } from '../common/form';

export const JobFilters = ({ totalCount, filteredCount }) => {
  const dispatch = useDispatch();
  const { filters, sortBy } = useSelector((state) => state.jobs);

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'All' ||
    filters.workplaceType !== 'All' ||
    filters.experienceLevel !== 'All' ||
    filters.jobType !== 'All' ||
    filters.minSalary > 0 ||
    sortBy !== 'newest';

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
      {/* Top Search & Reset Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex-1">
          <TextInput
            name="job-search"
            value={filters.search}
            onChange={(e) => dispatch(setSearchFilter(e.target.value))}
            placeholder="Search by job title, company, or tech stack (e.g. React, Python)..."
            icon={Search}
            clearable
            onClear={() => dispatch(setSearchFilter(''))}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{filteredCount}</strong> of {totalCount} jobs
          </span>

          {hasActiveFilters && (
            <button
              onClick={() => dispatch(resetFilters())}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Categories quick filter pills */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {JOB_CATEGORIES.map((cat) => {
          const isActive = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => dispatch(setCategoryFilter(cat))}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Workplace Type */}
        <SelectInput
          label="Workplace Mode"
          name="workplace"
          value={filters.workplaceType}
          onChange={(e) => dispatch(setWorkplaceFilter(e.target.value))}
          options={WORKPLACE_TYPES}
          placeholder=""
        />

        {/* Experience Level */}
        <SelectInput
          label="Experience Level"
          name="experience"
          value={filters.experienceLevel}
          onChange={(e) => dispatch(setExperienceFilter(e.target.value))}
          options={EXPERIENCE_LEVELS}
          placeholder=""
        />

        {/* Job Type */}
        <SelectInput
          label="Job Type"
          name="jobType"
          value={filters.jobType}
          onChange={(e) => dispatch(setJobTypeFilter(e.target.value))}
          options={JOB_TYPES}
          placeholder=""
        />

        {/* Sort By */}
        <SelectInput
          label="Sort By"
          name="sortBy"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          options={[
            { value: 'newest', label: 'Newest Posted' },
            { value: 'salary-high', label: 'Highest Salary' },
            { value: 'salary-low', label: 'Lowest Salary' },
            { value: 'applicants', label: 'Most Popular' }
          ]}
          placeholder=""
        />
      </div>

      {/* Salary Slider Filter */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <RangeSlider
          label="Minimum Salary Floor"
          name="minSalary"
          value={filters.minSalary}
          min={0}
          max={200000}
          step={10000}
          onChange={(e) => dispatch(setMinSalaryFilter(Number(e.target.value)))}
          formatter={(v) => (v === 0 ? 'Any Salary' : `$${Number(v).toLocaleString()}/yr`)}
          hint="Filters jobs offering at least this compensation"
        />
      </div>
    </div>
  );
};

export default JobFilters;
