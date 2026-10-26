import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Briefcase,
  Search,
  Sparkles,
  ArrowRight,
  Building2,
  Users,
  CheckCircle2,
  Layers,
  ShoppingBag,
  LayoutDashboard,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import ApplyModal from '../components/jobs/ApplyModal';
import { JOB_CATEGORIES } from '../services/mockData';

export const HomePage = () => {
  const navigate = useNavigate();
  const jobs = useSelector((state) => state.jobs.items);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalJob, setActiveModalJob] = useState(null);

  const featuredJobs = jobs.filter((j) => j.featured).slice(0, 4);
  const totalVacancies = jobs.length || 92;
  const hiringCompaniesCount = jobs.length ? new Set(jobs.map((j) => j.company)).size : 48;
  const liveFeedsCount = jobs.filter((j) => j.source === 'external').length || 79;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-indigo-50/70 via-white to-transparent dark:from-indigo-950/20 dark:via-slate-950 dark:to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-md dark:border-indigo-800/80 dark:bg-slate-900/80 dark:text-indigo-300 mb-6">
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Next-Generation Career Hub & Talent Engine</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Where Ambition Meets{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Opportunity.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CareerConnect connects high-performing professionals with forward-thinking recruiters. Search vacancies, batch apply via the Job Basket, and showcase interactive portfolios.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 mx-auto max-w-2xl flex flex-col sm:flex-row items-center gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-1 items-center gap-3 px-4 w-full">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, keywords, or company (e.g. React Architect)..."
                className="w-full bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition active:scale-95 shrink-0"
            >
              <span>Explore Roles</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Popular Search tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Trending:</span>
            {['React Engineer', 'UI/UX Design', 'Kubernetes', 'Product Manager', 'AI / ML'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-200/60 dark:border-slate-800/60">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{totalVacancies}+</p>
              <p className="text-xs text-slate-500 font-medium">Verified Vacancies</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">{hiringCompaniesCount}+</p>
              <p className="text-xs text-slate-500 font-medium">Hiring Companies</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{liveFeedsCount}+</p>
              <p className="text-xs text-slate-500 font-medium">Live API Feeds</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-violet-600 dark:text-violet-400">&lt; 24h</p>
              <p className="text-xs text-slate-500 font-medium">Avg Recruiter Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Platform Solutions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 mb-3">
            <Sparkles size={13} />
            <span>Integrated Platform Solutions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive Career Tools
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Streamlined solutions designed for every stage of recruitment — from interactive portfolio showcases to batch applications and pipeline telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Candidate Portfolio */}
          <Link
            to="/portfolio"
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-5 group-hover:scale-105 transition">
                <Users size={24} />
              </div>
              <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Candidate Showcase
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-600 transition">
                Candidate Portfolio Site
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Multi-page candidate portfolio showcase with nested tabs: Overview, Projects, Timeline, Skills bars, ATS Resume Viewer, and direct recruiter contact form.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Explore Portfolio</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 2: Application Basket / Shopping Cart */}
          <Link
            to="/cart"
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-5 group-hover:scale-105 transition">
                <ShoppingBag size={24} />
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Batch Applications
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 group-hover:text-emerald-600 transition">
                Job Basket & Batch Checkout
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Add target positions to a live shopping cart, customize per-role cover notes, and submit batch applications in one checkout flow with receipt summary.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>View Job Cart</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 3: Dashboard & Pipeline */}
          <Link
            to="/dashboard"
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 mb-5 group-hover:scale-105 transition">
                <LayoutDashboard size={24} />
              </div>
              <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                Pipeline Telemetry
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 group-hover:text-violet-600 transition">
                Seeker & Recruiter Dashboard
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dual-role analytics portal: Seeker application tracker and saved jobs, alongside Recruiter Kanban status pipeline mover and hiring velocity metrics.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
              <span>Open Dashboard</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Featured Opportunities
            </h2>
            <p className="text-xs text-slate-500">
              Hand-picked high impact roles from market leading engineering teams
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>View All {jobs.length} Vacancies</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              featured
              onQuickApply={(j) => setActiveModalJob(j)}
            />
          ))}
        </div>
      </section>

      {/* Recruiter & Candidate CTA Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Building2 size={13} />
              Recruiter Hub & Vacancy Manager
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Looking for top engineering talent?
            </h2>
            <p className="text-sm text-indigo-200 leading-relaxed">
              Post your job vacancy with rich role requirements, salary bounds, and screening criteria using our reusable form engine.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/post-job"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-indigo-950 shadow-lg hover:bg-indigo-50 transition"
              >
                <span>Post a Job Vacancy Now</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/20 transition"
              >
                <Briefcase size={14} />
                <span>Explore All Vacancies</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

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

export default HomePage;
