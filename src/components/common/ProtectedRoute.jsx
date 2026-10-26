import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, ArrowLeft, Building2, UserCheck, ArrowRight } from 'lucide-react';

/**
 * ProtectedRoute
 * Route guard component enforcing role-based access control (RBAC).
 * Demonstrates:
 * - Declarative route guarding in React Router v6
 * - Graceful fallback UI with contextual role switching
 * - Preserving intended navigation target
 */
export const ProtectedRoute = ({ allowedRoles = ['recruiter'], children }) => {
  const { role, switchRole } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  const isAuthorized = allowedRoles.includes(role);

  if (!isAuthorized) {
    const handleSwitchAndProceed = () => {
      switchRole('recruiter');
      addToast({
        type: 'info',
        title: 'Role Switched to Recruiter',
        message: 'Access granted to recruiter vacancy management.'
      });
    };

    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center animate-fade-in space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          <ShieldAlert size={38} />
        </div>

        <div>
          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Authorization Guard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Recruiter Access Required
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            You are currently browsing as a <strong className="text-indigo-600 dark:text-indigo-400 capitalize">{role}</strong>. Posting vacancies and managing applicant pipelines is restricted to verified <strong>Recruiter</strong> accounts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleSwitchAndProceed}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition active:scale-95"
          >
            <Building2 size={15} />
            <span>Switch to Recruiter Role & Continue</span>
          </button>
          <Link
            to="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft size={14} />
            <span>Return to Jobs</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
