import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, setSearchFilter, selectFilteredJobs } from '../store/slices/jobsSlice';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import ApplyModal from '../components/jobs/ApplyModal';
import { JobCardSkeleton } from '../components/common/LoadingSkeleton';
import ErrorBanner from '../components/common/ErrorBanner';
import { LayoutGrid, List, SearchX, Sparkles, Filter } from 'lucide-react';

export const JobsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items, status, error } = useSelector((state) => state.jobs);
  const filteredJobs = useSelector(selectFilteredJobs);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeModalJob, setActiveModalJob] = useState(null);

  // Sync url param ?search=
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery) {
      dispatch(setSearchFilter(urlQuery));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchJobs());
    }
  }, [status, dispatch]);

  const handleRetry = () => {
    dispatch(fetchJobs());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-2">
            <Sparkles size={13} />
            <span>Multi-Page SPA Job Repository</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Open Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Search, filter, and batch apply to high-growth tech positions
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 self-start sm:self-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-1.5 text-xs font-semibold transition ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-lg p-1.5 text-xs font-semibold transition ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Filter Module */}
      <JobFilters totalCount={items.length} filteredCount={filteredJobs.length} />

      {/* Asynchronous States: Loading, Error, Content */}
      {status === 'loading' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === 'failed' && (
        <ErrorBanner
          title="Asynchronous Fetch Error"
          message={error || 'Failed to retrieve jobs from the mock API server.'}
          onRetry={handleRetry}
        />
      )}

      {status === 'succeeded' && filteredJobs.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <SearchX size={26} />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            No matching vacancies found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing the minimum salary floor, or switching category pills.
          </p>
        </div>
      )}

      {status === 'succeeded' && filteredJobs.length > 0 && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onQuickApply={(j) => setActiveModalJob(j)}
            />
          ))}
        </div>
      )}

      {/* Quick Apply Modal */}
      {activeModalJob && (
        <ApplyModal
          isOpen={Boolean(activeModalJob)}
          onClose={() => setActiveModalJob(null)}
          job={activeModalJob}
        />
      )}
    </div>
  );
};

export default JobsPage;
