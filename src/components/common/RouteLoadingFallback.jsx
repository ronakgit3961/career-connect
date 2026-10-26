import React from 'react';

/**
 * RouteLoadingFallback
 * Rendered by React.Suspense when lazy-loaded page chunks are being fetched.
 * Features a top-aligned linear indeterminate loading bar and shimmer skeleton.
 */
export const RouteLoadingFallback = () => {
  return (
    <div className="relative w-full min-h-[60vh] flex flex-col items-center justify-center px-4">
      {/* Top linear progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50 overflow-hidden">
        <div className="h-full bg-indigo-600 dark:bg-indigo-400 animate-pulse-subtle w-1/3 rounded-r-full" />
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 rounded-2xl border-2 border-indigo-600 border-t-transparent animate-spin dark:border-indigo-400 dark:border-t-transparent" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Loading Route View...
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Asynchronously fetching page bundle chunk via React.lazy & Suspense
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteLoadingFallback;
