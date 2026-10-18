import React, { useState } from 'react';
import { INITIAL_CANDIDATE_PROFILE } from '../../services/mockData';
import { Award, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PortfolioSkills = () => {
  const [skills, setSkills] = useState(INITIAL_CANDIDATE_PROFILE.skills);
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToast } = useToast();

  const categories = ['All', 'Frontend', 'Core', 'Backend', 'DevOps'];

  const handleEndorse = (skillName) => {
    setSkills((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, endorsements: s.endorsements + 1 } : s))
    );
    addToast({
      type: 'success',
      title: 'Skill Endorsed!',
      message: `You added an endorsement for Alex's proficiency in ${skillName}.`
    });
  };

  const filteredSkills =
    activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Technical Skills & Proficiencies</h2>
          <p className="text-xs text-slate-500">Endorsed competencies across modern web architecture</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeCategory === c
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {skill.name}
                  </span>
                  <span className="ml-2 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {skill.category}
                  </span>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {skill.level}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>

            {/* Endorsement footer */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {skill.endorsements} Endorsements
              </span>
              <button
                onClick={() => handleEndorse(skill.name)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 transition"
              >
                <ThumbsUp size={12} />
                <span>Endorse</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioSkills;
