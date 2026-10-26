// CareerConnect Real REST API Client
// Handles authentication headers, error envelopes, and seamless backend communication

const API_BASE = '/api';

const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('cc_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.warn('Could not read auth token from storage', err);
  }

  return headers;
};

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMsg = data?.message || `HTTP ${res.status}: ${res.statusText}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Jobs
  async fetchJobs(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.workplaceType && filters.workplaceType !== 'All') params.set('workplaceType', filters.workplaceType);
    if (filters.experienceLevel && filters.experienceLevel !== 'All') params.set('experienceLevel', filters.experienceLevel);
    if (filters.jobType && filters.jobType !== 'All') params.set('jobType', filters.jobType);
    if (filters.minSalary) params.set('minSalary', filters.minSalary.toString());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.page) params.set('page', filters.page.toString());
    params.set('limit', '100'); // Load up to 100 jobs for smooth client filtering

    const url = `${API_BASE}/jobs?${params.toString()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.jobs || [];
  },

  async fetchJobById(id) {
    const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.job;
  },

  async createJob(jobData) {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData)
    });
    const data = await handleResponse(res);
    return data.job;
  },

  async updateJob(id, jobData) {
    const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData)
    });
    const data = await handleResponse(res);
    return data.job;
  },

  async deleteJob(id) {
    const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await handleResponse(res);
  },

  async syncLiveJobs() {
    const res = await fetch(`${API_BASE}/jobs/sync`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await handleResponse(res);
  },

  // Applications
  async fetchApplications() {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.applications || [];
  },

  async applyToJob(applicationData) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    const data = await handleResponse(res);
    return data.application;
  },

  async batchApply(cartItems, candidateData) {
    const res = await fetch(`${API_BASE}/applications/batch`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cartItems, candidateData })
    });
    const data = await handleResponse(res);
    return data.applications || [];
  },

  async updateApplicationStatus(appId, newStatus) {
    const res = await fetch(`${API_BASE}/applications/${encodeURIComponent(appId)}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    const data = await handleResponse(res);
    return data.application;
  },

  // Saved Jobs / Bookmarks
  async fetchSavedJobs() {
    const res = await fetch(`${API_BASE}/saved-jobs`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.savedJobIds || [];
  },

  async toggleSavedJob(jobId, currentlySaved) {
    const method = currentlySaved ? 'DELETE' : 'POST';
    const res = await fetch(`${API_BASE}/saved-jobs/${encodeURIComponent(jobId)}`, {
      method,
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.savedJobIds || [];
  },

  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.user;
  },

  // Contact Inquiries (Candidate Portfolio)
  async submitContactInquiry(data) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  async fetchContactInquiries() {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleResponse(res);
    return data.inquiries || [];
  },

  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return await handleResponse(res);
  }
};

export default api;
