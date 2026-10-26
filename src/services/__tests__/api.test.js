import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';

const storage = {};
const mockLocalStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); }
};

// Polyfill window and localStorage for headless Node test runner
global.window = { localStorage: mockLocalStorage };
global.localStorage = mockLocalStorage;

describe('Real REST API Client (src/services/api.js)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockLocalStorage.clear();
  });

  it('fetchJobs: requests /api/jobs and parses json response', async () => {
    const mockJobs = [
      { id: 'job-1', title: 'Full Stack Engineer', company: 'StripeWave' },
      { id: 'ext-arbeit-123', title: 'React Architect', company: 'Cosuno', source: 'external' }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, jobs: mockJobs, total: 2 })
    });

    const jobs = await api.fetchJobs({ search: 'React', category: 'Engineering' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/jobs?search=React&category=Engineering'),
      expect.objectContaining({ method: 'GET' })
    );
    expect(jobs).toHaveLength(2);
    expect(jobs[1].source).toBe('external');
  });

  it('fetchJobs: attaches Authorization Bearer header when token exists in storage', async () => {
    mockLocalStorage.setItem('cc_auth_token', 'sample_test_jwt_token_123');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, jobs: [] })
    });

    await api.fetchJobs();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer sample_test_jwt_token_123'
        })
      })
    );
  });

  it('applyToJob: rejects with meaningful message on duplicate application (409 Conflict)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      statusText: 'Conflict',
      json: async () => ({
        success: false,
        message: 'You have already applied for this position. Duplicate applications are not permitted.'
      })
    });

    await expect(
      api.applyToJob({ jobId: 'job-1', candidateName: 'Alex Rivera' })
    ).rejects.toThrow('You have already applied for this position');
  });

  it('login: sends POST /api/auth/login and receives token and user profile', async () => {
    const mockAuthResponse = {
      success: true,
      token: 'jwt_signed_token_xyz',
      user: {
        id: 'user-seeker-1',
        name: 'Alex Rivera',
        email: 'alex.rivera@careerconnect.dev',
        role: 'seeker'
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockAuthResponse
    });

    const result = await api.login('alex.rivera@careerconnect.dev', 'password123');

    expect(result.token).toBe('jwt_signed_token_xyz');
    expect(result.user.name).toBe('Alex Rivera');
  });

  it('batchApply: posts application cart items and candidate data', async () => {
    const mockCart = [
      { jobId: 'job-1', title: 'Senior Engineer', company: 'StripeWave' },
      { jobId: 'job-2', title: 'Frontend Lead', company: 'NovaScale' }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        applications: [
          { id: 'app-1', jobId: 'job-1' },
          { id: 'app-2', jobId: 'job-2' }
        ]
      })
    });

    const apps = await api.batchApply(mockCart, { name: 'Alex Rivera' });
    expect(apps).toHaveLength(2);
  });

  it('updateJob: sends PUT /api/jobs/:id and returns updated vacancy', async () => {
    const mockUpdated = { id: 'job-1', title: 'Principal Engineer', company: 'StripeWave' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, job: mockUpdated })
    });

    const job = await api.updateJob('job-1', { title: 'Principal Engineer' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/jobs/job-1'),
      expect.objectContaining({ method: 'PUT' })
    );
    expect(job.title).toBe('Principal Engineer');
  });

  it('deleteJob: sends DELETE /api/jobs/:id and returns success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, deletedId: 'job-1' })
    });

    const res = await api.deleteJob('job-1');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/jobs/job-1'),
      expect.objectContaining({ method: 'DELETE' })
    );
    expect(res.success).toBe(true);
  });
});
