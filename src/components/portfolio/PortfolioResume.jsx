import React from 'react';
import { INITIAL_CANDIDATE_PROFILE } from '../../services/mockData';
import { Download, Printer, CheckCircle2, FileText, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PortfolioResume = () => {
  const profile = INITIAL_CANDIDATE_PROFILE;
  const { addToast } = useToast();

  const handleDownload = () => {
    addToast({
      type: 'success',
      title: 'Downloading ATS Resume',
      message: 'Generating sanitized ATS-friendly PDF resume for Alex Rivera...'
    });
    // Trigger download of synthetic resume file
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'Alex_Rivera_Software_Engineer_Resume.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top action bar */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <FileText size={16} className="text-indigo-600" />
          <span>ATS Optimized Resume Standard (2026 Format)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Printer size={13} />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/30"
          >
            <Download size={13} />
            <span>Download ATS File</span>
          </button>
        </div>
      </div>

      {/* Styled ATS Document */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-md dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans space-y-8">
        {/* Header */}
        <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {profile.name}
          </h1>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
            {profile.title}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>{profile.location}</span>
            <span>•</span>
            <span>{profile.email}</span>
            <span>•</span>
            <span>{profile.phone}</span>
            <span>•</span>
            <a href={profile.portfolioUrl} className="text-indigo-600 hover:underline">
              {profile.portfolioUrl}
            </a>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-1 dark:border-slate-800">
            Executive Summary
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {profile.bio}
          </p>
        </section>

        {/* Core Competencies */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-1 dark:border-slate-800">
            Core Technical Competencies
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {profile.skills.map((s) => (
              <span
                key={s.name}
                className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-1 dark:border-slate-800">
            Professional Experience
          </h2>
          {profile.experience.map((exp, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900 dark:text-white">
                  {exp.role} <span className="font-normal text-slate-500">at {exp.company}</span>
                </span>
                <span className="text-xs text-slate-400">{exp.period}</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-1 dark:border-slate-800">
            Education & Certifications
          </h2>
          {profile.education.map((edu, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{edu.degree}</span> —{' '}
                <span className="text-slate-600 dark:text-slate-400">{edu.institution}</span>
              </div>
              <span className="text-slate-400">{edu.period} (GPA: {edu.gpa})</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default PortfolioResume;
