import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const SEEKER_USER = {
  id: 'user-seeker-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@careerconnect.dev',
  role: 'seeker',
  title: 'Full-Stack Software Engineer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  company: null,
  resumeName: 'Alex_Rivera_Resume_2026.pdf'
};

const RECRUITER_USER = {
  id: 'user-recruiter-1',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@talentpartners.io',
  role: 'recruiter',
  title: 'Head of Talent Acquisition',
  company: 'TechWave Talent Partners',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
};

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('cc_active_role') || 'seeker';
  });

  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('cc_active_role') || 'seeker';
    return savedRole === 'recruiter' ? RECRUITER_USER : SEEKER_USER;
  });

  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saved_jobs_v1');
      return saved ? JSON.parse(saved) : ['job-1', 'job-3'];
    } catch {
      return ['job-1', 'job-3'];
    }
  });

  useEffect(() => {
    localStorage.setItem('cc_active_role', role);
    setUser(role === 'recruiter' ? RECRUITER_USER : SEEKER_USER);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('cc_saved_jobs_v1', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const switchRole = (newRole) => {
    setRole(newRole);
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const isJobSaved = (jobId) => savedJobIds.includes(jobId);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isRecruiter: role === 'recruiter',
        isSeeker: role === 'seeker',
        switchRole,
        savedJobIds,
        toggleSaveJob,
        isJobSaved
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
