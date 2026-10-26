import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:5001/api';

describe('Live Backend & SQLite Database Integration (Real HTTP Requests)', () => {
  let isServerRunning = false;
  let authToken = null;
  const testCandidateEmail = 'alex.rivera@careerconnect.dev';
  const testCandidatePassword = 'password123';
  let createdTestJobId = null;

  beforeAll(async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
      isServerRunning = res.ok;
    } catch {
      isServerRunning = false;
    }
  });

  it('1. Live GET /api/health: Returns 200 with real database row counts', async (ctx) => {
    if (!isServerRunning) {
      ctx.skip();
      return;
    }
    const res = await fetch(`${BASE_URL}/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('healthy');
    expect(data.service).toContain('CareerConnect Express REST API');
    expect(typeof data.database.users).toBe('number');
    expect(typeof data.database.jobs).toBe('number');
    expect(typeof data.database.applications).toBe('number');
    expect(data.database.jobs).toBeGreaterThan(0);
  });

  it('2. Live POST /api/auth/login: Authenticates against SQLite with bcrypt and returns valid JWT', async (ctx) => {
    if (!isServerRunning) {
      ctx.skip();
      return;
    }
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCandidateEmail,
        password: testCandidatePassword
      })
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe(testCandidateEmail);
    expect(data.user.password).toBeUndefined(); // ensure password is not leaked

    authToken = data.token;
  });

  it('3. Live GET /api/auth/me: Verifies Bearer JWT and retrieves user profile from SQLite', async (ctx) => {
    if (!isServerRunning || !authToken) {
      ctx.skip();
      return;
    }

    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.name).toBe('Alex Rivera');
    expect(data.user.role).toBe('seeker');
  });

  it('4. Live GET /api/jobs: Reads jobs from SQLite with pagination, search, and category filter', async (ctx) => {
    if (!isServerRunning) {
      ctx.skip();
      return;
    }
    const res = await fetch(`${BASE_URL}/jobs?limit=5&category=Engineering`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.jobs)).toBe(true);
    expect(data.jobs.length).toBeGreaterThan(0);
    expect(data.page).toBe(1);
    expect(data.limit).toBe(5);
    expect(data.total).toBeGreaterThan(0);
    data.jobs.forEach((job) => {
      expect(job.category).toBe('Engineering');
      expect(Array.isArray(job.skills)).toBe(true);
    });
  });

  it('5. Live GET /api/jobs/:id: Retrieves single job record from SQLite', async (ctx) => {
    if (!isServerRunning) {
      ctx.skip();
      return;
    }
    const res = await fetch(`${BASE_URL}/jobs/job-1`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.job.id).toBe('job-1');
    expect(data.job.company).toBe('StripeWave Labs');
    expect(Array.isArray(data.job.responsibilities)).toBe(true);
    expect(Array.isArray(data.job.requirements)).toBe(true);
  });

  it('6. Live POST /api/jobs: Recruiter publishes a new job vacancy written directly to SQLite', async (ctx) => {
    if (!isServerRunning) {
      ctx.skip();
      return;
    }
    const newJobPayload = {
      title: `E2E Live Architect Vacancy ${Date.now()}`,
      company: 'Test Integration Corp',
      location: 'San Francisco, CA',
      category: 'Engineering',
      type: 'Full-time',
      workplaceType: 'Remote',
      experienceLevel: 'Senior',
      minSalary: 160000,
      maxSalary: 210000,
      description: 'Live test vacancy created via unmocked integration test suite writing directly to SQLite database.',
      skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      responsibilities: ['Architect microservices', 'Lead technical designs'],
      requirements: ['5+ years production experience']
    };

    const res = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(newJobPayload)
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.job.id).toBeDefined();
    expect(data.job.title).toBe(newJobPayload.title);
    expect(data.job.source).toBe('local');

    createdTestJobId = data.job.id;
  });

  it('6b. Live PUT /api/jobs/:id: Recruiter updates vacancy title and details in SQLite', async (ctx) => {
    if (!isServerRunning || !createdTestJobId) {
      ctx.skip();
      return;
    }

    const updatedTitle = `Updated Architect Vacancy ${Date.now()}`;
    const res = await fetch(`${BASE_URL}/jobs/${createdTestJobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: updatedTitle,
        maxSalary: 235000
      })
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.job.title).toBe(updatedTitle);
    expect(data.job.maxSalary).toBe(235000);
  });

  it('7. Live POST /api/applications: Candidate applies to job; verifies database write and duplicate guard', async (ctx) => {
    if (!isServerRunning || !createdTestJobId) {
      ctx.skip();
      return;
    }

    const appPayload = {
      jobId: createdTestJobId,
      jobTitle: 'E2E Live Architect Vacancy',
      company: 'Test Integration Corp',
      candidateName: 'Alex Rivera',
      candidateEmail: 'alex.rivera@careerconnect.dev',
      userId: 'user-seeker-1',
      phone: '+1 (555) 019-2834',
      resumeUrl: 'Alex_Rivera_Resume_2026.pdf',
      coverNote: 'First application submission in live integration test suite.'
    };

    // First submission: should succeed with 201 Created
    const res1 = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(appPayload)
    });

    expect(res1.status).toBe(201);
    const data1 = await res1.json();
    expect(data1.success).toBe(true);
    expect(data1.application.id).toBeDefined();
    expect(data1.application.status).toBe('Applied');

    // Duplicate submission: same user applying for same job must return 409 Conflict
    const res2 = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(appPayload)
    });

    expect(res2.status).toBe(409);
    const data2 = await res2.json();
    expect(data2.success).toBe(false);
    expect(data2.message).toContain('Duplicate applications are not permitted');
  });

  it('8. Live Saved Jobs: Reads, bookmarks, and removes bookmarks from SQLite', async (ctx) => {
    if (!isServerRunning) {
      ctx.skip();
      return;
    }

    // 1. Fetch current saved jobs
    const getRes = await fetch(`${BASE_URL}/saved-jobs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(Array.isArray(getData.savedJobIds)).toBe(true);

    // 2. Bookmark a specific job
    const postRes = await fetch(`${BASE_URL}/saved-jobs/job-2`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.savedJobIds).toContain('job-2');

    // 3. Remove bookmark
    const delRes = await fetch(`${BASE_URL}/saved-jobs/job-2`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(delRes.status).toBe(200);
    const delData = await delRes.json();
    expect(delData.savedJobIds).not.toContain('job-2');
  });

  it('9. Live Contact Inquiries: Recruiter submits candidate portfolio inquiry written to SQLite', async (ctx) => {
    if (!isServerRunning) {
      ctx.skip();
      return;
    }

    const inquiryPayload = {
      recruiterName: 'Vance Talent',
      workEmail: 'vance@talentpartners.co',
      companyName: 'Vance Capital',
      roleOffered: 'Staff Architect',
      jobType: 'Full-time',
      estimatedSalary: '$190,000',
      message: 'Excited by your full-stack achievements on CareerConnect!'
    };

    const postRes = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryPayload)
    });

    expect(postRes.status).toBe(201);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.inquiry.id).toBeDefined();

    const getRes = await fetch(`${BASE_URL}/contact`);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.count).toBeGreaterThan(0);
  });

  it('10. Live DELETE /api/jobs/:id: Recruiter deletes vacancy from SQLite database', async (ctx) => {
    if (!isServerRunning || !createdTestJobId) {
      ctx.skip();
      return;
    }

    const res = await fetch(`${BASE_URL}/jobs/${createdTestJobId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.deletedId).toBe(createdTestJobId);

    // Verify it's no longer retrievable (returns 404)
    const getRes = await fetch(`${BASE_URL}/jobs/${createdTestJobId}`);
    expect(getRes.status).toBe(404);
  });
});
