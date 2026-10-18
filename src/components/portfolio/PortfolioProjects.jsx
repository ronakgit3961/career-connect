import React, { useState } from 'react';
import { INITIAL_CANDIDATE_PROFILE } from '../../services/mockData';
import { ExternalLink, Github, Star, Layers, CheckCircle2, X } from 'lucide-react';
import Modal from '../common/Modal';

export const PortfolioProjects = () => {
  const profile = INITIAL_CANDIDATE_PROFILE;
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  const allTags = ['All', 'React', 'TypeScript', 'Redux', 'WebSockets', 'Tailwind CSS'];

  const filteredProjects = selectedTag === 'All'
    ? profile.projects
    : profile.projects.filter((p) => p.tags.includes(selectedTag));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Engineering Projects</h2>
          <p className="text-xs text-slate-500">Showcasing architecture, performance, and user-centric design</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              {/* Project Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-amber-400">
                  <Star size={12} fill="currentColor" />
                  <span>{project.stars}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3
                  onClick={() => setActiveProjectModal(project)}
                  className="text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 cursor-pointer transition"
                >
                  {project.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 line-clamp-1">
                  {project.tagline}
                </p>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Links footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <button
                onClick={() => setActiveProjectModal(project)}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                Deep Architecture Breakdown →
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                  title="Source code on GitHub"
                >
                  <Github size={16} />
                </a>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition"
                >
                  <ExternalLink size={12} />
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Architecture Breakdown Modal */}
      {activeProjectModal && (
        <Modal
          isOpen={Boolean(activeProjectModal)}
          onClose={() => setActiveProjectModal(null)}
          title={activeProjectModal.title}
          subtitle={activeProjectModal.tagline}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <img
              src={activeProjectModal.image}
              alt={activeProjectModal.title}
              className="h-56 w-full rounded-2xl object-cover"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeProjectModal.description}
            </p>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Engineering Innovations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>State synchronization with low latency payload batching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Automated unit tests with 90%+ branch coverage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Fully responsive with dark/light theme persistence</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <a
                href={activeProjectModal.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Github size={14} />
                <span>GitHub Repository</span>
              </a>
              <a
                href={activeProjectModal.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm"
              >
                <ExternalLink size={14} />
                <span>Launch Demo</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PortfolioProjects;
