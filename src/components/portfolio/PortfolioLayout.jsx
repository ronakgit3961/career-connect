import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { INITIAL_CANDIDATE_PROFILE } from '../../services/mockData';
import {
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  Layers,
  Sparkles,
  Award,
  FileText,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Download
} from 'lucide-react';

export const PortfolioLayout = () => {
  const profile = INITIAL_CANDIDATE_PROFILE;

  const tabs = [
    { label: 'Overview', to: '/portfolio', end: true, icon: Sparkles },
    { label: 'Featured Projects', to: '/portfolio/projects', icon: Layers, badge: profile.projects.length },
    { label: 'Experience & Timeline', to: '/portfolio/experience', icon: Briefcase },
    { label: 'Skills & Proficiencies', to: '/portfolio/skills', icon: Award },
    { label: 'ATS Resume View', to: '/portfolio/resume', icon: FileText },
    { label: 'Hire / Inquire', to: '/portfolio/contact', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Profile Card Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Banner Image */}
          <div className="h-44 sm:h-56 w-full relative">
            <img
              src={profile.banner}
              alt="Cover Banner"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Profile Header Info */}
          <div className="relative px-6 pb-6 pt-0 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl border-4 border-white object-cover shadow-xl dark:border-slate-900"
                  />
                  <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 text-white" title="Available for hire">
                    <CheckCircle2 size={14} />
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {profile.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {profile.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {profile.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={13} />
                      {profile.yearsOfExperience} Years Experience
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {profile.hourlyRate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
                <Link
                  to="/portfolio/contact"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
                >
                  <MessageSquare size={14} />
                  <span>Hire Candidate</span>
                </Link>
                <Link
                  to="/portfolio/resume"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <FileText size={14} />
                  <span>View Resume</span>
                </Link>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
              >
                <Linkedin size={14} />
                <span>LinkedIn</span>
              </a>
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
              >
                <Globe size={14} />
                <span>Personal Website</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Mail size={13} />
                {profile.email}
              </span>
            </div>
          </div>

          {/* Sub-Route Navigation Tabs */}
          <div className="flex overflow-x-auto border-t border-slate-200 bg-slate-50/60 px-4 sm:px-8 dark:border-slate-800 dark:bg-slate-900/60 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {tab.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Nested Route Outlet Content */}
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PortfolioLayout;
