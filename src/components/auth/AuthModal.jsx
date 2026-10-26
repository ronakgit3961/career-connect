import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import { Mail, Lock, User, Building2, UserCheck, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export const AuthModal = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    authLoading
  } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
    title: '',
    company: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const isLogin = authModalMode === 'login';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setErrorMessage('Please provide both email and password.');
          return;
        }
        await login(formData.email, formData.password);
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: 'Authenticated successfully with CareerConnect JWT session.'
        });
      } else {
        if (!formData.name || formData.name.trim().length < 2) {
          setErrorMessage('Please enter your full name (at least 2 characters).');
          return;
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setErrorMessage('Please enter a valid email address.');
          return;
        }
        if (!formData.password || formData.password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          return;
        }
        await register(formData);
        addToast({
          type: 'success',
          title: 'Account Created!',
          message: `Your account was successfully registered and stored in the database.`
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleQuickDemo = (type) => {
    if (type === 'seeker') {
      setFormData((prev) => ({
        ...prev,
        email: 'alex.rivera@careerconnect.dev',
        password: 'password123'
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        email: 'sarah.jenkins@talentpartners.io',
        password: 'password123'
      }));
    }
    setErrorMessage('');
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      title={isLogin ? 'Sign In to CareerConnect' : 'Create CareerConnect Account'}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              isLogin
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              !isLogin
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Demo Fast Fill Buttons */}
        {isLogin && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <p className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
              <KeyRound size={13} />
              <span>Quick Sign-In (Sample Accounts):</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('seeker')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-2 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 transition"
              >
                <UserCheck size={13} />
                <span>Alex (Candidate)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-2 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 transition"
              >
                <Building2 size={13} />
                <span>Sarah (Recruiter)</span>
              </button>
            </div>
          </div>
        )}

        {/* Inline Error Alert */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 animate-shake">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Registration Extra Fields */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Jordan Lee"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, role: 'seeker' }))}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-semibold transition ${
                      formData.role === 'seeker'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-500'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                    }`}
                  >
                    <UserCheck size={14} />
                    <span>Job Seeker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, role: 'recruiter' }))}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-semibold transition ${
                      formData.role === 'recruiter'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-500'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                    }`}
                  >
                    <Building2 size={14} />
                    <span>Recruiter</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
            {!isLogin && (
              <p className="mt-1 text-[10px] text-slate-400">
                Minimum 6 characters (hashed with bcrypt on the server).
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50"
          >
            {authLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Authenticating with Backend...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In Securely' : 'Create Account'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AuthModal;
