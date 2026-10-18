import React from 'react';
import { INITIAL_CANDIDATE_PROFILE } from '../../services/mockData';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const PortfolioExperience = () => {
  const { experience } = INITIAL_CANDIDATE_PROFILE;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Professional Experience</h2>
        <p className="text-xs text-slate-500">Track record of engineering excellence and product impact</p>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 dark:border-indigo-900/60 space-y-10">
        {experience.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline bullet icon */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white ring-4 ring-indigo-100 dark:bg-slate-900 dark:ring-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-sm transition group-hover:scale-110">
              <Briefcase size={14} />
            </div>

            {/* Content card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {item.role}
                  </h3>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {item.company}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {item.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <ul className="mt-4 space-y-2.5">
                {item.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioExperience;
