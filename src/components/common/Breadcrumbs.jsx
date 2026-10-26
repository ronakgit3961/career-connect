import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  jobs: 'Explore Jobs',
  portfolio: 'Candidate Portfolio',
  projects: 'Featured Projects',
  experience: 'Experience & Timeline',
  skills: 'Skills & Proficiencies',
  resume: 'ATS Resume View',
  contact: 'Hire & Inquire',
  cart: 'Application Basket',
  dashboard: 'Analytics Dashboard',
  'post-job': 'Post a Vacancy'
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const jobs = useSelector((state) => state.jobs.items);

  // Do not render breadcrumbs on landing/home page
  if (location.pathname === '/') {
    return null;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-2"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        {/* Home Root Item */}
        <li className="flex items-center gap-1.5">
          <Link
            to="/"
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
          >
            <Home size={13} />
            <span className="font-medium">Home</span>
          </Link>
        </li>

        {pathnames.map((segment, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          // Check if this segment is a job ID under /jobs/:id
          let label = ROUTE_LABELS[segment] || segment;
          if (index > 0 && pathnames[index - 1] === 'jobs') {
            const matchedJob = jobs.find((j) => j.id === segment);
            if (matchedJob) {
              label = matchedJob.title;
            } else {
              label = `Vacancy Details (${segment})`;
            }
          }

          return (
            <li key={routeTo} className="flex items-center gap-1.5">
              <ChevronRight size={12} className="text-slate-400 shrink-0" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px] sm:max-w-xs"
                >
                  {label}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition truncate max-w-[150px]"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
