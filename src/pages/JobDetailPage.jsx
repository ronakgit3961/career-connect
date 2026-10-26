import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addToCart, removeFromCart, selectIsInCart } from '../store/slices/cartSlice';
import ApplyModal from '../components/jobs/ApplyModal';
import { JobDetailSkeleton } from '../components/common/LoadingSkeleton';
import ErrorBanner from '../components/common/ErrorBanner';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  ShoppingBag,
  Send,
  Building,
  CheckCircle2,
  Gift,
  Share2,
  Users,
  ExternalLink,
  Globe,
  Trash2
} from 'lucide-react';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isJobSaved, toggleSaveJob, isRecruiter } = useAuth();
  const { addToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const inCart = useSelector(selectIsInCart(id));
  const isSaved = isJobSaved(id);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    mockApi
      .fetchJobById(id)
      .then((data) => {
        if (mounted) {
          setJob(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Job vacancy not found.');
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleCartToggle = () => {
    if (!job) return;
    if (inCart) {
      dispatch(removeFromCart(job.id));
      addToast({
        type: 'info',
        title: 'Removed from Basket',
        message: `${job.title} removed from your Job Cart.`
      });
    } else {
      dispatch(addToCart(job));
      addToast({
        type: 'success',
        title: 'Added to Job Basket',
        message: `${job.title} added! You can batch apply from the Cart page.`
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Job posting URL copied to clipboard.'
    });
  };

  const handleDeleteJob = async () => {
    if (!job) return;
    if (!window.confirm(`Are you sure you want to delete the vacancy "${job.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await mockApi.deleteJob(job.id);
      addToast({
        type: 'success',
        title: 'Vacancy Deleted',
        message: `"${job.title}" has been deleted.`
      });
      navigate('/dashboard');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete job.'
      });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <JobDetailSkeleton />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <ErrorBanner
          title="Vacancy Not Found"
          message={error || `Could not find job posting #${id}`}
          onRetry={() => navigate('/jobs')}
        />
        <div className="mt-6 text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Back to all vacancies</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 transition"
        >
          <ArrowLeft size={14} />
          <span>Back to all jobs</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl shadow-inner dark:bg-slate-800">
                  {job.logo || '💼'}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {job.title}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {job.company}
                  </p>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                title="Share job"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Meta Tags */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <MapPin size={13} className="text-slate-400" />
                {job.location} ({job.workplaceType})
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Briefcase size={13} className="text-slate-400" />
                {job.type} • {job.experienceLevel}
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/20">
                <DollarSign size={13} />
                ${job.minSalary?.toLocaleString()} - ${job.maxSalary?.toLocaleString()} / year
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Clock size={13} />
                Posted {new Date(job.postedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Role Overview</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Key Responsibilities
                </h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Skills & Candidate Requirements
                </h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills tags */}
            {job.skills && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Required Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Perks */}
            {job.perks && (
              <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <Gift size={16} className="text-violet-500" />
                  Benefits & Perks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {job.perks.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Compensation</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                ${(job.minSalary / 1000).toFixed(0)}k - ${(job.maxSalary / 1000).toFixed(0)}k
                <span className="text-xs font-normal text-slate-400"> / year</span>
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setIsApplyOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95"
              >
                <Send size={16} />
                <span>Apply with CareerConnect</span>
              </button>

              {job.externalUrl && (
                <a
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-300 bg-sky-50 py-2.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300 transition"
                >
                  <ExternalLink size={14} />
                  <span>View Original Board Posting</span>
                </a>
              )}

              <button
                onClick={handleCartToggle}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-semibold transition ${
                  inCart
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <ShoppingBag size={14} />
                <span>{inCart ? 'In Your Job Basket (Remove)' : 'Add to Application Basket'}</span>
              </button>

              <button
                onClick={() => {
                  toggleSaveJob(job.id);
                  addToast({
                    type: 'info',
                    title: isSaved ? 'Removed' : 'Bookmarked',
                    message: isSaved ? 'Removed from bookmarks' : 'Added to your saved bookmarks'
                  });
                }}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-semibold transition ${
                  isSaved
                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                <span>{isSaved ? 'Saved to Bookmarks' : 'Bookmark this Job'}</span>
              </button>

              {isRecruiter && (
                <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <span>Recruiter Action</span>
                    <span className="rounded bg-indigo-200/60 px-1.5 py-0.5 text-[10px] text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">Admin</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/edit-job/${job.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                      <Briefcase size={14} />
                      <span>Edit Vacancy</span>
                    </Link>
                    <button
                      onClick={handleDeleteJob}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Applicants</span>
                <span className="font-bold text-slate-900 dark:text-white">{job.applicantsCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hiring Speed</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">High Velocity</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Match Score</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">92% ATS Fit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyOpen && (
        <ApplyModal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          job={job}
        />
      )}
    </div>
  );
};

export default JobDetailPage;
