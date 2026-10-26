import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { selectCartCount } from '../../store/slices/cartSlice';
import NotificationCenter from './NotificationCenter';
import AuthModal from '../auth/AuthModal';
import {
  Briefcase,
  ShoppingBag,
  LayoutDashboard,
  UserCheck,
  PlusCircle,
  Sun,
  Moon,
  Menu,
  X,
  Building2,
  Sparkles,
  ArrowRight,
  LogIn,
  LogOut
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, switchRole, isRecruiter, openLoginModal, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const cartCount = useSelector(selectCartCount);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleToggle = () => {
    const nextRole = role === 'seeker' ? 'recruiter' : 'seeker';
    switchRole(nextRole);
  };

  const navLinks = [
    { label: 'Explore Jobs', to: '/jobs', icon: Briefcase },
    { label: 'Candidate Portfolio', to: '/portfolio', icon: UserCheck },
    { label: 'Job Basket', to: '/cart', icon: ShoppingBag, count: cartCount },
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Post Vacancy', to: '/post-job', icon: PlusCircle, recruiterOnly: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/25 transition group-hover:scale-105">
            <Briefcase size={20} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Career<span className="text-indigo-600 dark:text-indigo-400">Connect</span>
              </span>
              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                SPA
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              Job Portal & Talent Marketplace
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300'
                      : link.highlight
                      ? 'text-indigo-600 hover:bg-indigo-50/50 dark:text-indigo-400 dark:hover:bg-indigo-950/30'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                <Icon size={15} />
                <span>{link.label}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white animate-pulse-subtle">
                    {link.count}
                  </span>
                )}
                {link.badge && (
                  <span className="rounded bg-violet-100 px-1.5 py-0.2 text-[9px] font-semibold text-violet-700 dark:bg-violet-900/60 dark:text-violet-300">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions Right */}
        <div className="flex items-center gap-2.5">
          {/* Persona Switcher (Context API Demo) */}
          <div className="hidden sm:flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => switchRole('seeker')}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                role === 'seeker'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <UserCheck size={13} />
              <span>Job Seeker</span>
            </button>
            <button
              onClick={() => switchRole('recruiter')}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                role === 'recruiter'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Building2 size={13} />
              <span>Recruiter</span>
            </button>
          </div>

          {/* Post Job CTA button */}
          <button
            onClick={() => {
              if (role !== 'recruiter') switchRole('recruiter');
              navigate('/post-job');
            }}
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-indigo-600 active:scale-95"
          >
            <PlusCircle size={14} />
            <span>Post a Job</span>
          </button>

          {/* Notification Center (Context API + useReducer showcase) */}
          <NotificationCenter />

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* User profile capsule with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 py-1 pl-1 pr-2.5 cursor-pointer hover:border-indigo-300 transition dark:border-slate-800 dark:bg-slate-900"
              title="Account & Auth"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="h-7 w-7 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                  {user.role} {token ? '• JWT Active' : ''}
                </p>
              </div>
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-fade-in"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 rounded bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    Role: {user.role}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-left transition"
                  >
                    <LayoutDashboard size={14} />
                    <span>My Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      openLoginModal();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-left transition"
                  >
                    <LogIn size={14} />
                    <span>Sign In / Switch Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 text-left transition"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 px-4 pt-3 pb-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 animate-slide-up">
          {/* Persona switcher mobile */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
            <button
              onClick={() => switchRole('seeker')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                role === 'seeker'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500'
              }`}
            >
              Job Seeker View
            </button>
            <button
              onClick={() => switchRole('recruiter')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                role === 'recruiter'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'text-slate-500'
              }`}
            >
              Recruiter View
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={17} />
                    <span>{link.label}</span>
                  </div>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                      {link.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
      {/* Auth Modal (Sign In / Register) */}
      <AuthModal />
    </header>
  );
};

export default Navbar;
