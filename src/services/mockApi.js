import { api } from './api';
import { INITIAL_JOBS, INITIAL_CANDIDATE_PROFILE, INITIAL_APPLICATIONS } from './mockData';

const STORAGE_KEYS = {
  JOBS: 'cc_jobs_v1',
  PROFILE: 'cc_candidate_profile_v1',
  APPLICATIONS: 'cc_applications_v1',
  SAVED_JOBS: 'cc_saved_jobs_v1'
};

// Client-side latency and error handling configuration
export const apiConfig = {
  latencyMs: 300,
  shouldSimulateError: false,
  errorRate: 0,
  errorMessage: 'Simulated 500 Internal Server Error: Gateway timeout while querying job repository.'
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Failed reading ${key} from localStorage`, err);
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed writing ${key} to localStorage`, err);
  }
};

export const mockApi = {
  // Fetch all jobs: queries real Express backend /api/jobs (with SQLite & live Arbeitnow jobs)
  async fetchJobs() {
    if (apiConfig.shouldSimulateError) {
      await delay(apiConfig.latencyMs);
      throw new Error(apiConfig.errorMessage);
    }

    try {
      const jobs = await api.fetchJobs();
      if (Array.isArray(jobs) && jobs.length > 0) {
        setStored(STORAGE_KEYS.JOBS, jobs);
        return jobs;
      }
    } catch (err) {
      console.warn('Real API /api/jobs fetch failed, falling back to local storage cache:', err.message);
    }

    return getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  },

  // Fetch single job by ID: queries real Express backend /api/jobs/:id
  async fetchJobById(id) {
    if (apiConfig.shouldSimulateError) {
      await delay(apiConfig.latencyMs);
      throw new Error(apiConfig.errorMessage);
    }

    try {
      const job = await api.fetchJobById(id);
      if (job) return job;
    } catch (err) {
      console.warn(`Real API fetch for job #${id} failed:`, err.message);
    }

    const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const job = jobs.find((j) => j.id === id);
    if (!job) {
      throw new Error(`Job #${id} was not found.`);
    }
    return job;
  },

  // Create a new job vacancy (Recruiter): persists to real SQLite database
  async createJob(jobData) {
    if (apiConfig.shouldSimulateError) {
      await delay(apiConfig.latencyMs);
      throw new Error('Failed to post job: Database transaction rejected.');
    }

    try {
      const newJob = await api.createJob(jobData);
      if (newJob) {
        const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
        setStored(STORAGE_KEYS.JOBS, [newJob, ...jobs]);
        return newJob;
      }
    } catch (err) {
      console.warn('Real API /api/jobs POST failed, fallback saving:', err.message);
    }

    const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString(),
      applicantsCount: 0,
      featured: Boolean(jobData.featured),
      urgent: Boolean(jobData.urgent)
    };
    const updated = [newJob, ...jobs];
    setStored(STORAGE_KEYS.JOBS, updated);
    return newJob;
  },

  // Update a job vacancy (Recruiter): persists to real SQLite database
  async updateJob(id, jobData) {
    if (apiConfig.shouldSimulateError) {
      await delay(apiConfig.latencyMs);
      throw new Error('Failed to update job: Database transaction rejected.');
    }

    try {
      const updatedJob = await api.updateJob(id, jobData);
      if (updatedJob) {
        const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
        const idx = jobs.findIndex((j) => j.id === id);
        if (idx !== -1) {
          jobs[idx] = updatedJob;
        } else {
          jobs.unshift(updatedJob);
        }
        setStored(STORAGE_KEYS.JOBS, jobs);
        return updatedJob;
      }
    } catch (err) {
      console.warn(`Real API update for job #${id} failed:`, err.message);
    }

    const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx !== -1) {
      jobs[idx] = { ...jobs[idx], ...jobData };
      setStored(STORAGE_KEYS.JOBS, jobs);
      return jobs[idx];
    }
    throw new Error(`Job #${id} was not found.`);
  },

  // Delete a job vacancy (Recruiter): deletes from SQLite database
  async deleteJob(id) {
    if (apiConfig.shouldSimulateError) {
      await delay(apiConfig.latencyMs);
      throw new Error('Failed to delete job: Database transaction rejected.');
    }

    try {
      await api.deleteJob(id);
    } catch (err) {
      console.warn(`Real API delete for job #${id} failed:`, err.message);
    }

    const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const filtered = jobs.filter((j) => j.id !== id);
    setStored(STORAGE_KEYS.JOBS, filtered);
    return { success: true, deletedId: id };
  },

  // Apply to a single job: persists to SQLite applications table with duplicate prevention
  async applyToJob(applicationData) {
    if (apiConfig.shouldSimulateError) {
      await delay(apiConfig.latencyMs);
      throw new Error('Application submission failed due to simulated server error.');
    }

    const newApp = await api.applyToJob(applicationData);
    return newApp;
  },

  // Batch apply from Shopping Cart / Job Basket: executes SQLite batch transaction
  async batchApply(cartItems, candidateData) {
    if (apiConfig.shouldSimulateError) {
      await delay(apiConfig.latencyMs);
      throw new Error('Batch application checkout failed. Server could not process bulk applications.');
    }

    return await api.batchApply(cartItems, candidateData);
  },

  // Get all applications: queries real SQLite applications table
  async fetchApplications() {
    if (apiConfig.shouldSimulateError) {
      await delay(apiConfig.latencyMs);
      throw new Error('Failed to retrieve applications pipeline.');
    }

    try {
      const apps = await api.fetchApplications();
      if (Array.isArray(apps)) {
        setStored(STORAGE_KEYS.APPLICATIONS, apps);
        return apps;
      }
    } catch (err) {
      console.warn('Real API /api/applications fetch failed, using fallback:', err.message);
    }

    return getStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  // Update application status: persists pipeline transition to SQLite
  async updateApplicationStatus(appId, newStatus) {
    try {
      const updated = await api.updateApplicationStatus(appId, newStatus);
      return { appId, newStatus, ...updated };
    } catch (err) {
      console.warn('Real API status update failed:', err.message);
      const apps = getStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
      const updated = apps.map((a) => (a.id === appId ? { ...a, status: newStatus } : a));
      setStored(STORAGE_KEYS.APPLICATIONS, updated);
      return { appId, newStatus };
    }
  },

  // Get candidate profile
  async fetchCandidateProfile() {
    return getStored(STORAGE_KEYS.PROFILE, INITIAL_CANDIDATE_PROFILE);
  },

  // Update candidate profile
  async updateCandidateProfile(profileData) {
    setStored(STORAGE_KEYS.PROFILE, profileData);
    return profileData;
  },

  // Reset to initial mock data
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_JOBS);
  }
};

export default mockApi;
