import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const DEFAULT_SEEKER = {
  id: 'user-seeker-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@careerconnect.dev',
  role: 'seeker',
  title: 'Full-Stack Software Engineer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  company: null,
  resumeName: 'Alex_Rivera_Resume_2026.pdf'
};

const DEFAULT_RECRUITER = {
  id: 'user-recruiter-1',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@talentpartners.io',
  role: 'recruiter',
  title: 'Head of Talent Acquisition',
  company: 'TechWave Talent Partners',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('cc_auth_token') || null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('cc_active_role') || 'seeker';
    } catch {
      return 'seeker';
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cc_user_profile');
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // fallback
    }
    return role === 'recruiter' ? DEFAULT_RECRUITER : DEFAULT_SEEKER;
  });

  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saved_jobs_v1');
      return saved ? JSON.parse(saved) : ['job-1', 'job-3'];
    } catch {
      return ['job-1', 'job-3'];
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authLoading, setAuthLoading] = useState(false);

  // Sync token and role to localStorage
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('cc_auth_token', token);
      } else {
        localStorage.removeItem('cc_auth_token');
      }
    } catch (err) {
      console.warn('Failed to persist auth token', err);
    }
  }, [token]);

  useEffect(() => {
    try {
      localStorage.setItem('cc_active_role', role);
      localStorage.setItem('cc_user_profile', JSON.stringify(user));
    } catch (err) {
      console.warn('Failed to persist user profile', err);
    }
  }, [role, user]);

  // Initial load: Fetch saved jobs and user profile from real backend
  useEffect(() => {
    let mounted = true;

    async function hydrateAuth() {
      // If we don't have a token, auto-login with default demo user to get real JWT
      if (!token) {
        try {
          const email = role === 'recruiter' ? DEFAULT_RECRUITER.email : DEFAULT_SEEKER.email;
          const authData = await api.login(email, 'password123');
          if (mounted && authData?.token) {
            setToken(authData.token);
            setUser(authData.user);
          }
        } catch {
          // If server is not yet ready, graceful silent fallback
        }
      }

      // Fetch persisted saved jobs from SQLite
      try {
        const ids = await api.fetchSavedJobs();
        if (mounted && Array.isArray(ids)) {
          setSavedJobIds(ids);
          localStorage.setItem('cc_saved_jobs_v1', JSON.stringify(ids));
        }
      } catch {
        // Fallback to local storage
      }
    }

    hydrateAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Login handler with real backend verification & JWT storage
  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    try {
      const data = await api.login(email, password);
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);

      // Refresh saved jobs for this user
      try {
        const ids = await api.fetchSavedJobs();
        if (Array.isArray(ids)) {
          setSavedJobIds(ids);
        }
      } catch {
        // Ignore
      }

      setAuthModalOpen(false);
      return data.user;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Register handler with real bcrypt hash & SQLite insert
  const register = useCallback(async (userData) => {
    setAuthLoading(true);
    try {
      const data = await api.register(userData);
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);
      setAuthModalOpen(false);
      return data.user;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setToken(null);
    try {
      localStorage.removeItem('cc_auth_token');
    } catch {
      // Ignore
    }
    // Reset to seeker demo user
    setUser(DEFAULT_SEEKER);
    setRole('seeker');
  }, []);

  // Switch persona with seamless real backend JWT token sync
  const switchRole = useCallback(
    async (nextRole) => {
      setRole(nextRole);
      const targetUser = nextRole === 'recruiter' ? DEFAULT_RECRUITER : DEFAULT_SEEKER;
      setUser(targetUser);

      // Attempt to acquire real JWT token for the selected persona
      try {
        const authData = await api.login(targetUser.email, 'password123');
        if (authData?.token) {
          setToken(authData.token);
          setUser(authData.user);
        }
      } catch (err) {
        console.warn('Could not auto-login demo role to backend:', err.message);
      }
    },
    []
  );

  // Toggle Save Job: updates SQLite saved_jobs table with real persistence
  const toggleSaveJob = useCallback(
    async (jobId) => {
      const isCurrentlySaved = savedJobIds.includes(jobId);
      // Optimistic state update
      setSavedJobIds((prev) =>
        isCurrentlySaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]
      );

      try {
        const updatedIds = await api.toggleSavedJob(jobId, isCurrentlySaved);
        if (Array.isArray(updatedIds)) {
          setSavedJobIds(updatedIds);
          localStorage.setItem('cc_saved_jobs_v1', JSON.stringify(updatedIds));
        }
      } catch (err) {
        console.warn('Failed to sync saved job to backend:', err.message);
      }
    },
    [savedJobIds]
  );

  const isJobSaved = useCallback((jobId) => savedJobIds.includes(jobId), [savedJobIds]);

  const openLoginModal = useCallback(() => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  }, []);

  const openRegisterModal = useCallback(() => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      token,
      isAuthenticated: Boolean(token),
      isRecruiter: role === 'recruiter',
      isSeeker: role === 'seeker',
      switchRole,
      login,
      register,
      logout,
      savedJobIds,
      toggleSaveJob,
      isJobSaved,
      authModalOpen,
      setAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      openLoginModal,
      openRegisterModal,
      authLoading
    }),
    [
      user,
      role,
      token,
      switchRole,
      login,
      register,
      logout,
      savedJobIds,
      toggleSaveJob,
      isJobSaved,
      authModalOpen,
      authModalMode,
      openLoginModal,
      openRegisterModal,
      authLoading
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
