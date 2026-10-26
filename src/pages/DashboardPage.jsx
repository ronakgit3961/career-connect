import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchApplications, updateApplicationStatus } from '../store/slices/applicationsSlice';
import { deleteJob } from '../store/slices/jobsSlice';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Bookmark,
  TrendingUp,
  Building,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Send,
  PlusCircle,
  FileText,
  UserCheck,
  Trash2
} from 'lucide-react';

const STATUS_COLORS = {
  Applied: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Under Review': 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Reviewing: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Interviewing: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Offered: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
};

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, role, switchRole, isRecruiter, savedJobIds } = useAuth();
  const { addToast } = useToast();

  const applications = useSelector((state) => state.applications.items);
  const appStatus = useSelector((state) => state.applications.status);
  const jobs = useSelector((state) => state.jobs.items);

  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'saved' | 'analytics'

  useEffect(() => {
    dispatch(fetchApplications());
  }, [role, dispatch]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await dispatch(updateApplicationStatus({ appId, newStatus })).unwrap();
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Candidate moved to "${newStatus}" stage.`
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Status Update Failed',
        message: 'Could not update application status.'
      });
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete the vacancy "${jobTitle}"? This will permanently remove it from listings.`)) {
      return;
    }
    try {
      await dispatch(deleteJob(jobId)).unwrap();
      addToast({
        type: 'success',
        title: 'Vacancy Deleted',
        message: `"${jobTitle}" has been removed from active listings.`
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Could not delete the vacancy.'
      });
    }
  };

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header Profile Summary */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <span className="rounded-lg bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 capitalize">
                  {user.role}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {user.title} {user.company ? `at ${user.company}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => switchRole(role === 'seeker' ? 'recruiter' : 'seeker')}
              className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition"
              title="Toggle between candidate and recruiter persona"
            >
              Switch to {isRecruiter ? '👤 Job Seeker' : '🏢 Recruiter'}
            </button>
            {isRecruiter ? (
              <Link
                to="/post-job"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700"
              >
                <PlusCircle size={14} />
                <span>Post New Vacancy</span>
              </Link>
            ) : (
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700"
              >
                <UserCheck size={14} />
                <span>View My Portfolio</span>
              </Link>
            )}
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <p className="text-xs text-slate-500 font-medium">
              {isRecruiter ? 'Total Applicants' : 'Applications Sent'}
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {applications.length}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <p className="text-xs text-slate-500 font-medium">
              {isRecruiter ? 'Open Vacancies' : 'Saved Bookmarks'}
            </p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {isRecruiter ? jobs.length : savedJobIds.length}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <p className="text-xs text-slate-500 font-medium">Interviews Scheduled</p>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {applications.filter((a) => a.status === 'Interviewing').length}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <p className="text-xs text-slate-500 font-medium">Offers / Placed</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {applications.filter((a) => a.status === 'Offered').length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tab View */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'pipeline'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            {isRecruiter ? 'Applicant Hiring Pipeline' : 'My Active Applications'} ({applications.length})
          </button>
          {isRecruiter ? (
            <button
              onClick={() => setActiveTab('vacancies')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'vacancies'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Manage Posted Vacancies ({jobs.length})
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'saved'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Saved Jobs ({savedJobs.length})
            </button>
          )}
        </div>

        {/* Tab 1: Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isRecruiter ? 'Candidate Applications Pipeline' : 'Submitted Applications'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRecruiter
                    ? 'Review incoming candidates and transition their hiring status'
                    : 'Track your application status and interview invitations'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">Role / Company</th>
                    <th className="py-3.5 px-6">Candidate</th>
                    <th className="py-3.5 px-6">Applied Date</th>
                    <th className="py-3.5 px-6">Match Fit</th>
                    <th className="py-3.5 px-6">Current Status</th>
                    {isRecruiter && <th className="py-3.5 px-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900 dark:text-white">{app.jobTitle}</p>
                        <p className="text-slate-500 font-medium">{app.company}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {app.candidateName}
                        </p>
                        <p className="text-slate-400 text-[11px]">{app.candidateEmail}</p>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {app.matchScore || 92}%
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold border ${
                            STATUS_COLORS[app.status] || STATUS_COLORS.Applied
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      {isRecruiter && (
                        <td className="py-4 px-6 text-right">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Jobs */}
        {activeTab === 'saved' && !isRecruiter && (
          <div className="space-y-4">
            {savedJobs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-800">
                <Bookmark size={24} className="mx-auto text-slate-400" />
                <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                  No saved vacancies yet
                </p>
                <p className="text-xs text-slate-400">Click the bookmark icon on any job card to save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobs.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        <Link to={`/jobs/${j.id}`} className="hover:text-indigo-600">
                          {j.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-500">{j.company} • {j.location}</p>
                    </div>
                    <Link
                      to={`/jobs/${j.id}`}
                      className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Recruiter Posted Vacancies Management */}
        {activeTab === 'vacancies' && isRecruiter && (
          <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Active Vacancies Management
                </h2>
                <p className="text-xs text-slate-500">
                  Inspect and manage all live job openings published to the candidate marketplace.
                </p>
              </div>
              <Link
                to="/post-job"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <PlusCircle size={14} />
                <span>Post Vacancy</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">Role & Company</th>
                    <th className="py-3.5 px-6">Location & Type</th>
                    <th className="py-3.5 px-6">Salary Bounds</th>
                    <th className="py-3.5 px-6">Applicants</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {jobs.slice(0, 30).map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-4 px-6">
                        <Link to={`/jobs/${j.id}`} className="font-bold text-slate-900 hover:text-indigo-600 dark:text-white">
                          {j.title}
                        </Link>
                        <p className="text-slate-500">{j.company} • {j.category}</p>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                        {j.location} ({j.workplaceType || 'Remote'})
                      </td>
                      <td className="py-4 px-6 font-semibold text-emerald-600 dark:text-emerald-400">
                        ${(j.minSalary || 0).toLocaleString()} - ${(j.maxSalary || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {j.applicantsCount || 0} applied
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/jobs/${j.id}`}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                          >
                            View
                          </Link>
                          <Link
                            to={`/edit-job/${j.id}`}
                            className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(j.id, j.title)}
                            className="rounded-lg bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400"
                            title="Delete vacancy"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
