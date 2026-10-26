import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle2, Heart, Github, Linkedin, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white">
                <Briefcase size={18} strokeWidth={2.4} />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Career<span className="text-indigo-600 dark:text-indigo-400">Connect</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Modern job portal connecting world-class talent with innovative recruiters through seamless search, application carts, and candidate portfolios.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Job Network Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Browse All Vacancies
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Candidate Portfolio
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Application Basket
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Applicant & Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Post New Vacancy
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Capabilities */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500" />
              Platform Features & Services
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-1.5 rounded-lg bg-slate-50 p-2 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Candidate Profiles</strong>
                  Comprehensive project showcase and ATS-friendly resumes
                </div>
              </div>

              <div className="flex items-start gap-1.5 rounded-lg bg-slate-50 p-2 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Application Basket</strong>
                  Batch multi-company checkout with customized cover notes
                </div>
              </div>

              <div className="flex items-start gap-1.5 rounded-lg bg-slate-50 p-2 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Live External Job Feeds</strong>
                  Real-time synchronization with global partner job feeds
                </div>
              </div>

              <div className="flex items-start gap-1.5 rounded-lg bg-slate-50 p-2 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block">Recruitment Pipeline</strong>
                  Dual-persona telemetry, stage tracking, and vacancy management
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 gap-4">
          <p>© 2026 CareerConnect Job Portal. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium dark:bg-slate-900">
              React 18
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium dark:bg-slate-900">
              Redux Toolkit
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium dark:bg-slate-900">
              Express & SQLite
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
