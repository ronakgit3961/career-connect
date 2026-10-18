import React from 'react';

export const ShimmerBox = ({ className = '' }) => (
  <div className={`shimmer-effect rounded-xl bg-slate-200/80 dark:bg-slate-800/80 ${className}`} />
);

export const JobCardSkeleton = () => {
  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <ShimmerBox className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <ShimmerBox className="h-4 w-40" />
            <ShimmerBox className="h-3 w-24" />
          </div>
        </div>
        <ShimmerBox className="h-8 w-8 rounded-xl" />
      </div>

      <div className="mt-5 space-y-2">
        <ShimmerBox className="h-3 w-full" />
        <ShimmerBox className="h-3 w-4/5" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <ShimmerBox className="h-6 w-16 rounded-lg" />
        <ShimmerBox className="h-6 w-20 rounded-lg" />
        <ShimmerBox className="h-6 w-14 rounded-lg" />
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <ShimmerBox className="h-5 w-28" />
        <ShimmerBox className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
};

export const JobDetailSkeleton = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start gap-5">
        <ShimmerBox className="h-20 w-20 rounded-3xl" />
        <div className="flex-1 space-y-3">
          <ShimmerBox className="h-7 w-2/3" />
          <ShimmerBox className="h-4 w-1/3" />
          <div className="flex gap-2">
            <ShimmerBox className="h-6 w-20 rounded-lg" />
            <ShimmerBox className="h-6 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ShimmerBox className="h-5 w-40" />
        <ShimmerBox className="h-24 w-full rounded-2xl" />
      </div>

      <div className="space-y-4">
        <ShimmerBox className="h-5 w-32" />
        <div className="space-y-2">
          <ShimmerBox className="h-4 w-full" />
          <ShimmerBox className="h-4 w-11/12" />
          <ShimmerBox className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <ShimmerBox className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <ShimmerBox className="h-4 w-36" />
              <ShimmerBox className="h-3 w-24" />
            </div>
          </div>
          <ShimmerBox className="h-6 w-20 rounded-full" />
          <ShimmerBox className="h-8 w-24 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default JobCardSkeleton;
