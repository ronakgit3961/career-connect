import { INITIAL_JOBS, INITIAL_CANDIDATE_PROFILE, INITIAL_APPLICATIONS } from './mockData';

const STORAGE_KEYS = {
  JOBS: 'cc_jobs_v1',
  PROFILE: 'cc_candidate_profile_v1',
  APPLICATIONS: 'cc_applications_v1',
  SAVED_JOBS: 'cc_saved_jobs_v1'
};

// Simulation config (can be modified dynamically via store/UI for evaluation testing)
export const apiConfig = {
  latencyMs: 400,
  shouldSimulateError: false,
  errorRate: 0, // 0 to 1
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
  // Fetch all jobs with simulated latency and error check
  async fetchJobs() {
    await delay(apiConfig.latencyMs);
    if (apiConfig.shouldSimulateError) {
      throw new Error(apiConfig.errorMessage);
    }
    const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    return jobs;
  },

  // Fetch single job
  async fetchJobById(id) {
    await delay(apiConfig.latencyMs);
    if (apiConfig.shouldSimulateError) {
      throw new Error(apiConfig.errorMessage);
    }
    const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const job = jobs.find((j) => j.id === id);
    if (!job) {
      throw new Error(`Job #${id} was not found.`);
    }
    return job;
  },

  // Create a new job vacancy (Recruiter)
  async createJob(jobData) {
    await delay(apiConfig.latencyMs + 200);
    if (apiConfig.shouldSimulateError) {
      throw new Error('Failed to post job: Database transaction rejected.');
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

  // Apply to a single job
  async applyToJob(applicationData) {
    await delay(apiConfig.latencyMs + 300);
    if (apiConfig.shouldSimulateError) {
      throw new Error('Application submission failed due to simulated server error.');
    }
    const apps = getStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const newApp = {
      id: `app-${Date.now()}`,
      appliedAt: new Date().toISOString(),
      status: 'Applied',
      matchScore: Math.floor(Math.random() * 20) + 80,
      ...applicationData
    };
    const updated = [newApp, ...apps];
    setStored(STORAGE_KEYS.APPLICATIONS, updated);

    // Increment applicant count on job
    const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const updatedJobs = jobs.map((j) =>
      j.id === applicationData.jobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j
    );
    setStored(STORAGE_KEYS.JOBS, updatedJobs);

    return newApp;
  },

  // Batch apply from Shopping Cart / Job Basket
  async batchApply(cartItems, candidateData) {
    await delay(apiConfig.latencyMs + 500);
    if (apiConfig.shouldSimulateError) {
      throw new Error('Batch application checkout failed. Server could not process bulk applications.');
    }
    const apps = getStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const newApps = cartItems.map((item, idx) => ({
      id: `app-${Date.now()}-${idx}`,
      jobId: item.jobId,
      jobTitle: item.title,
      company: item.company,
      candidateName: candidateData.name,
      candidateEmail: candidateData.email,
      resumeUrl: item.resumeUrl || candidateData.resumeUrl || 'portfolio_resume.pdf',
      coverNote: item.coverNote || candidateData.defaultCoverNote || 'Batch applied through CareerConnect Job Cart',
      status: 'Applied',
      matchScore: Math.floor(Math.random() * 15) + 85,
      appliedAt: new Date().toISOString()
    }));

    const updated = [...newApps, ...apps];
    setStored(STORAGE_KEYS.APPLICATIONS, updated);

    // Update applicant count on jobs
    const jobs = getStored(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const appliedJobIds = new Set(cartItems.map((c) => c.jobId));
    const updatedJobs = jobs.map((j) =>
      appliedJobIds.has(j.id) ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j
    );
    setStored(STORAGE_KEYS.JOBS, updatedJobs);

    return newApps;
  },

  // Get all applications
  async fetchApplications() {
    await delay(apiConfig.latencyMs);
    if (apiConfig.shouldSimulateError) {
      throw new Error('Failed to retrieve applications pipeline.');
    }
    return getStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  // Update application status (Recruiter pipeline)
  async updateApplicationStatus(appId, newStatus) {
    await delay(300);
    const apps = getStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const updated = apps.map((a) => (a.id === appId ? { ...a, status: newStatus } : a));
    setStored(STORAGE_KEYS.APPLICATIONS, updated);
    return { appId, newStatus };
  },

  // Get candidate profile
  async fetchCandidateProfile() {
    await delay(200);
    return getStored(STORAGE_KEYS.PROFILE, INITIAL_CANDIDATE_PROFILE);
  },

  // Update candidate profile
  async updateCandidateProfile(profileData) {
    await delay(300);
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
