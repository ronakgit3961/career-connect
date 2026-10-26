import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchJobs,
  setSearchFilter,
  setCategoryFilter,
  setWorkplaceFilter,
  setExperienceFilter,
  setJobTypeFilter,
  setMinSalaryFilter,
  setSortBy,
  selectFilteredJobs
} from '../store/slices/jobsSlice';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import ApplyModal from '../components/jobs/ApplyModal';
import { JobCardSkeleton } from '../components/common/LoadingSkeleton';
import ErrorBanner from '../components/common/ErrorBanner';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  LayoutGrid,
  List,
  SearchX,
  Sparkles,
  Compass,
  Globe,
  Database,
  RefreshCw
} from 'lucide-react';

export const JobsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();
  const { items, status, error, filters, sortBy } = useSelector((state) => state.jobs);
  const filteredJobs = useSelector(selectFilteredJobs);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeModalJob, setActiveModalJob] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const isInitialMount = useRef(true);

  const externalCount = items.filter((j) => j.source === 'external').length;
  const localCount = items.filter((j) => j.source !== 'external').length;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await api.syncLiveJobs();
      await dispatch(fetchJobs()).unwrap();
      addToast({
        type: 'success',
        title: 'Job Boards Synchronized',
        message: `Synced with Arbeitnow & Remotive APIs. (${res.totalSynced || 0} jobs refreshed)`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Sync Error',
        message: err.message || 'Could not fetch live job board feeds.'
      });
    } finally {
      setSyncing(false);
    }
  };

  // 1. Initial Mount: Hydrate Redux filter state from URL Search Params (Deep Linking)
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    const urlWorkplace = searchParams.get('workplace');
    const urlExperience = searchParams.get('experience');
    const urlType = searchParams.get('type');
    const urlMinSalary = searchParams.get('minSalary');
    const urlSort = searchParams.get('sort');

    if (urlSearch !== null) dispatch(setSearchFilter(urlSearch));
    if (urlCategory !== null) dispatch(setCategoryFilter(urlCategory));
    if (urlWorkplace !== null) dispatch(setWorkplaceFilter(urlWorkplace));
    if (urlExperience !== null) dispatch(setExperienceFilter(urlExperience));
    if (urlType !== null) dispatch(setJobTypeFilter(urlType));
    if (urlMinSalary !== null) dispatch(setMinSalaryFilter(Number(urlMinSalary)));
    if (urlSort !== null) dispatch(setSortBy(urlSort));

    if (status === 'idle') {
      dispatch(fetchJobs());
    }
  }, []);

  // 2. Two-Way Sync: Update URL Search Parameters whenever Redux filter state changes
  useEffect(() => {
    // Skip on first initial render to avoid overriding URL params before hydration
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.workplaceType && filters.workplaceType !== 'All') params.set('workplace', filters.workplaceType);
    if (filters.experienceLevel && filters.experienceLevel !== 'All') params.set('experience', filters.experienceLevel);
    if (filters.jobType && filters.jobType !== 'All') params.set('type', filters.jobType);
    if (filters.minSalary > 0) params.set('minSalary', filters.minSalary.toString());
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);

    setSearchParams(params, { replace: true });
  }, [filters, sortBy, setSearchParams]);

  const handleRetry = () => {
    dispatch(fetchJobs());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Compass size={13} />
              <span>Two-Way URL Query Param Synchronized</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
              <Globe size={13} />
              <span>Live API & DB Connected ({externalCount} Live External • {localCount} Direct)</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Open Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real jobs from live APIs (Arbeitnow & Remotive) alongside local recruiter postings, stored in SQLite database
          </p>
        </div>

        {/* Sync & View Mode Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition disabled:opacity-50"
            title="Fetch latest job listings from live external API feeds"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin text-indigo-600' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Live Jobs'}</span>
          </button>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 text-xs font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
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
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
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
