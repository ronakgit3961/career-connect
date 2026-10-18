import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { addToCart, removeFromCart, selectIsInCart } from '../../store/slices/cartSlice';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  ShoppingBag,
  Check,
  Send,
  Users,
  Flame,
  ArrowRight
} from 'lucide-react';

export const JobCard = ({ job, onQuickApply, featured = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob } = useAuth();
  const { addToast } = useToast();

  const saved = isJobSaved(job.id);
  const inCart = useSelector(selectIsInCart(job.id));

  const handleCartToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
        message: `${job.title} is ready for batch application!`
      });
    }
  };

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(job.id);
    addToast({
      type: 'info',
      title: saved ? 'Removed from Bookmarks' : 'Job Bookmarked',
      message: saved ? `${job.title} unbookmarked` : `Saved ${job.title} to your bookmarks`
    });
  };

  const formatSalary = (val) => {
    if (!val) return 'Negotiable';
    return `$${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 ${
        featured
          ? 'border-indigo-300 shadow-md shadow-indigo-500/5 dark:border-indigo-800'
          : 'border-slate-200/80 hover:border-indigo-200 dark:border-slate-800 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl shadow-inner dark:bg-slate-800">
              {job.logo || '🏢'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition dark:text-white dark:group-hover:text-indigo-400">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {job.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Bookmark button */}
            <button
              onClick={handleBookmarkToggle}
              className={`rounded-xl p-2 transition ${
                saved
                  ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
              title={saved ? 'Remove bookmark' : 'Bookmark job'}
            >
              <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
            </button>

            {/* Cart toggle button */}
            <button
              onClick={handleCartToggle}
              className={`rounded-xl p-2 transition ${
                inCart
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400'
              }`}
              title={inCart ? 'In your Job Cart (click to remove)' : 'Add to Job Basket'}
            >
              {inCart ? <Check size={16} strokeWidth={2.5} /> : <ShoppingBag size={16} />}
            </button>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium dark:bg-slate-800">
            <MapPin size={12} className="text-slate-400" />
            {job.location} ({job.workplaceType})
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium dark:bg-slate-800">
            <Briefcase size={12} className="text-slate-400" />
            {job.type}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <DollarSign size={12} />
            {formatSalary(job.minSalary)} - {formatSalary(job.maxSalary)}
          </span>
          {job.urgent && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <Flame size={12} />
              Urgent Hire
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="mt-3.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills pill tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
            >
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 4 && (
            <span className="rounded-lg bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-400 dark:bg-slate-800/60">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer info & CTA */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <Users size={12} />
          <span>{job.applicantsCount || 0} applied</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job.id}`}
            className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Details
          </Link>
          <button
            onClick={() => onQuickApply ? onQuickApply(job) : navigate(`/jobs/${job.id}`)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-95"
          >
            <Send size={12} />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
