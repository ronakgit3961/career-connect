import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorBanner = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching data.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-rose-900 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="text-base font-bold text-rose-950 dark:text-rose-100">{title}</h4>
            <p className="mt-1 text-sm text-rose-800/90 dark:text-rose-300 leading-relaxed max-w-xl">
              {message}
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-95 shrink-0"
          >
            <RefreshCw size={14} />
            <span>Retry Request</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;
