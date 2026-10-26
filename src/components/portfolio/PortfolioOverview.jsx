import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_CANDIDATE_PROFILE } from '../../services/mockData';
import {
  Code,
  Sparkles,
  GraduationCap,
  Award,
  ArrowRight,
  ExternalLink,
  Github,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const PortfolioOverview = () => {
  const profile = INITIAL_CANDIDATE_PROFILE;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {profile.yearsOfExperience}+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Years Experience</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Code size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {profile.projects.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Featured Systems</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
              <Award size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">250+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Skill Endorsements</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">99.4%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Code Quality Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: About & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About Me */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" />
              Professional Biography
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {profile.bio}
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Engineering Philosophies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Component-driven modular architecture with clean separation of concerns</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Strict accessibility (WCAG AA/AAA) & keyboard navigable interfaces</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Predictable state management using Redux Toolkit slices & Context API</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Sub-second page loads through code splitting, memoization & asset optimization</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Projects Teaser */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Featured Work Highlights
                </h2>
                <p className="text-xs text-slate-500">Selected production applications</p>
              </div>
              <Link
                to="/portfolio/projects"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>View All Projects</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.projects.slice(0, 2).map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="h-32 w-full rounded-xl object-cover mb-3"
                  />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {proj.tagline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Education & Quick Skills */}
        <div className="space-y-6">
          {/* Education Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap size={18} className="text-indigo-600" />
              Education & Credentials
            </h2>
            {profile.education.map((edu, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{edu.degree}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{edu.institution}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{edu.period}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    GPA: {edu.gpa}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Skills list */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award size={18} className="text-indigo-600" />
                Top Skills
              </h2>
              <Link
                to="/portfolio/skills"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Detailed Bars →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.slice(0, 7).map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
