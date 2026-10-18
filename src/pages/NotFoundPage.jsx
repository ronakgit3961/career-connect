import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Briefcase, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center animate-fade-in space-y-6">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        <Compass size={40} />
      </div>

      <div>
        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The page or job vacancy you are looking for doesn't exist, has been archived, or moved to another URL.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition"
        >
          <Home size={14} />
          <span>Return Home</span>
        </Link>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
        >
          <Briefcase size={14} />
          <span>Browse All Jobs</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
