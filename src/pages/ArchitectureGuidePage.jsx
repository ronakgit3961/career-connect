import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLatency,
  toggleSimulateError,
  clearRequestHistory
} from '../store/slices/asyncStateSlice';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  Code2,
  Layers,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Sliders,
  Send,
  Zap,
  RefreshCw,
  Trash2,
  FileText
} from 'lucide-react';

export const ArchitectureGuidePage = () => {
  const dispatch = useDispatch();
  const { latencyMs, simulateError, requestHistory } = useSelector((state) => state.asyncState);
  const { user, role, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const handleTestToast = (type) => {
    addToast({
      type,
      title: `${type.toUpperCase()} Notification`,
      message: `Triggered from the Context API state demonstration panel.`
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-400/30">
            <Sparkles size={13} />
            <span>Project Evaluation-I Comprehensive Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            CareerConnect Technical Architecture & State Lab
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Live interactive laboratory demonstrating the entire Project Evaluation-I syllabus: Multi-page SPA navigation, global vs. local state architecture (Redux Toolkit + Context API), asynchronous state handling, and declarative form validation with reusable inputs.
          </p>
        </div>
      </div>

      {/* Live Interactive Async State Controller */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Asynchronous State & Latency Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Adjust network latency and toggle error injection in real-time to test loading skeletons and error banners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(clearRequestHistory())}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Simulated Network Latency:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{latencyMs} ms</span>
              </div>
              <input
                type="range"
                min={100}
                max={2500}
                step={100}
                value={latencyMs}
                onChange={(e) => dispatch(setLatency(Number(e.target.value)))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-700"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>100ms (Blazing)</span>
                <span>800ms (Realistic 4G)</span>
                <span>2500ms (High Latency)</span>
              </div>
            </div>

            {/* Error Injection Toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    simulateError
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Simulate 500 Network API Failure
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {simulateError
                      ? 'API calls will reject to test error UI and retry button'
                      : 'Mock API calls resolve successfully'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(toggleSimulateError())}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  simulateError
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200'
                }`}
              >
                {simulateError ? 'Error Mode: ON' : 'Error Mode: OFF'}
              </button>
            </div>

            {/* Test Toasts */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Context API: Toast Notification Dispatchers
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTestToast('success')}
                  className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  Success Toast
                </button>
                <button
                  onClick={() => handleTestToast('error')}
                  className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  Error Toast
                </button>
                <button
                  onClick={() => handleTestToast('warning')}
                  className="rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  Warning Toast
                </button>
                <button
                  onClick={() => handleTestToast('info')}
                  className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300"
                >
                  Info Toast
                </button>
              </div>
            </div>
          </div>

          {/* Real-time telemetry log */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Simulated Network Dispatch History</span>
              <span className="font-mono text-[10px] text-slate-400">
                {requestHistory.length} calls recorded
              </span>
            </h3>

            {requestHistory.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No network calls logged yet. Perform a search or checkout to see live records.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {requestHistory.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-xl bg-white p-2.5 text-[11px] shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          req.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[160px]">
                        {req.endpoint}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                      <span>{req.duration}ms</span>
                      <span>•</span>
                      <span>{req.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4 Syllabus Pillar Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pillar 1: Navigation & Page Structure */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Syllabus Topic 1
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Navigation Layout & Page Structure
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            CareerConnect implements a Multi-page Single Page Application (SPA) with declarative client-side routing via React Router v6.
          </p>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Top-level SPA Routes:</strong> <code>/</code>, <code>/jobs</code>, <code>/jobs/:id</code>, <code>/cart</code>, <code>/dashboard</code>, <code>/post-job</code>, <code>/architecture-guide</code></span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Mini-Project Portfolio with Sub-Routing:</strong> <code>/portfolio</code> with nested routes: <code>overview</code>, <code>projects</code>, <code>experience</code>, <code>skills</code>, <code>resume</code>, <code>contact</code></span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Protected & Dynamic State:</strong> Role-conditional navigation, URL search param synchronization, and 404 catch-all</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Context API & State Architecture */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
              <Database size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Syllabus Topic 2
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Context API & State Management
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Hybrid state architecture utilizing React Context API for cross-cutting application concerns and Redux Toolkit for complex relational data.
          </p>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Context API:</strong> <code>AuthContext</code> (dual persona), <code>ThemeContext</code> (light/dark sync), <code>ToastContext</code> (notification queue)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Redux Toolkit Slices:</strong> <code>jobsSlice</code>, <code>cartSlice</code> (Job Basket), <code>applicationsSlice</code>, <code>asyncStateSlice</code></span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Local vs. Global State:</strong> Form field touches and modal visibility handled locally with <code>useState</code>; cart items and job listings dispatched globally</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Asynchronous State & Mini-Projects */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Cpu size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Syllabus Topic 3
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Async State & Mini-Projects
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Full asynchronous state lifecycle with pending, fulfilled, and rejected cases handled via Redux <code>createAsyncThunk</code>.
          </p>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Mini-Project Shopping Cart:</strong> The Job Basket (<code>/cart</code>) enables multi-role selection, custom cover notes, and atomic batch submission</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Mini-Project Dashboard:</strong> <code>/dashboard</code> features seeker tracking and recruiter Kanban pipeline mover</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Loading & Error States:</strong> Custom shimmer skeletons (<code>JobCardSkeleton</code>) and retryable error banners (<code>ErrorBanner</code>)</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Form Handling & Validation */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Syllabus Topic 4
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Form Handling & Reusable Inputs
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Enterprise form validation engine using a custom <code>useForm</code> hook paired with modular, reusable input components.
          </p>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Validation Strategies:</strong> Schema rules, real-time feedback onBlur, touched and dirty states, regex validation for emails, phones, and URLs</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Reusable Inputs:</strong> <code>TextInput</code>, <code>SelectInput</code>, <code>TextareaInput</code>, <code>FileUpload</code>, <code>RangeSlider</code>, <code>BadgeSelector</code>, <code>Checkbox</code></span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Forms in Production:</strong> Post Vacancy Form, Job Application Modal, Recruiter Contact Form</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureGuidePage;
