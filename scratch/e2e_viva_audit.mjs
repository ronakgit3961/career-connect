import app from '../server/index.js';
import { db } from '../server/db.js';

async function runVivaAudit() {
  const auditResults = [];
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  function record(workflow, endpoint, method, status, details, success) {
    auditResults.push({
      workflow,
      endpoint: `${method} ${endpoint}`,
      httpStatus: status,
      result: success ? 'PASS' : 'FAIL',
      details
    });
  }

  let candidateToken = null;
  let recruiterToken = null;
  let createdJobId = null;
  let singleAppId = null;
  let sampleJobId = null;

  try {
    // 1. Health check & DB connectivity
    {
      const res = await fetch(`${baseUrl}/health`);
      const data = await res.json();
      record(
        'System Health & Database Telemetry',
        '/health',
        'GET',
        res.status,
        `DB rows: users=${data.database.users}, jobs=${data.database.jobs}, apps=${data.database.applications}`,
        res.status === 200 && data.status === 'healthy'
      );
    }

    // 2. Candidate Authentication
    {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'alex.rivera@careerconnect.dev', password: 'password123' })
      });
      const data = await res.json();
      candidateToken = data.token;
      record(
        'Authentication (Candidate Login)',
        '/auth/login',
        'POST',
        res.status,
        `Candidate token issued, role=${data.user?.role}`,
        res.status === 200 && data.success && data.user?.role === 'seeker'
      );
    }

    // 3. Recruiter Authentication
    {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sarah.jenkins@talentpartners.io', password: 'password123' })
      });
      const data = await res.json();
      recruiterToken = data.token;
      record(
        'Authentication (Recruiter Login)',
        '/auth/login',
        'POST',
        res.status,
        `Recruiter token issued, role=${data.user?.role}`,
        res.status === 200 && data.success && data.user?.role === 'recruiter'
      );
    }

    // 4. Token verification (GET /auth/me)
    {
      const res = await fetch(`${baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      const data = await res.json();
      record(
        'Session Verification (Token Auth)',
        '/auth/me',
        'GET',
        res.status,
        `Identified user: ${data.user?.name} (${data.user?.email})`,
        res.status === 200 && data.success && data.user?.id === 'user-seeker-1'
      );
    }

    // 5. Job Search & Filtering
    {
      const res = await fetch(`${baseUrl}/jobs?search=react&limit=5`);
      const data = await res.json();
      sampleJobId = data.jobs?.[0]?.id;
      record(
        'Job Search & Query Filtering',
        '/jobs?search=react',
        'GET',
        res.status,
        `Found ${data.total} matching jobs, returned ${data.jobs?.length} on page 1`,
        res.status === 200 && data.success && Array.isArray(data.jobs)
      );
    }

    // 6. External Jobs Query
    {
      const res = await fetch(`${baseUrl}/jobs?source=external&limit=5`);
      const data = await res.json();
      record(
        'External Job Board Feed Query',
        '/jobs?source=external',
        'GET',
        res.status,
        `Retrieved external jobs: ${data.total} in DB. Sample: "${data.jobs?.[0]?.title}" by ${data.jobs?.[0]?.company}`,
        res.status === 200 && data.success && data.jobs?.length > 0
      );
    }

    // 7. Recruiter Post Vacancy (Create)
    {
      const newJobPayload = {
        title: 'Staff Platform Systems Engineer',
        company: 'CloudScale Technologies',
        category: 'DevOps',
        location: 'San Francisco, CA',
        type: 'Full-time',
        workplaceType: 'Hybrid',
        experienceLevel: 'Lead',
        minSalary: 175000,
        maxSalary: 235000,
        description: 'Lead next-generation distributed platform architecture and cloud reliability engineering across multi-region clusters.',
        responsibilities: ['Architect Kubernetes clusters', 'Manage IaC via Terraform', 'Establish SLA benchmarks'],
        requirements: ['8+ years distributed systems', 'Expert in Go/Rust and Linux internals'],
        skills: ['Kubernetes', 'Go', 'Terraform', 'AWS', 'Distributed Systems'],
        perks: ['Unlimited PTO', 'Full Health & Dental', 'Home Office Stipend']
      };

      const res = await fetch(`${baseUrl}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${recruiterToken}`
        },
        body: JSON.stringify(newJobPayload)
      });
      const data = await res.json();
      createdJobId = data.job?.id;
      const inDb = db.prepare('SELECT id, title FROM jobs WHERE id = ?').get(createdJobId);
      record(
        'Recruiter Vacancy Posting (Create)',
        '/jobs',
        'POST',
        res.status,
        `Created job #${createdJobId}. Verified in SQLite: "${inDb?.title}"`,
        res.status === 201 && data.success && Boolean(inDb)
      );
    }

    // 8. Recruiter Edit Vacancy (Update)
    {
      const updatePayload = {
        title: 'Staff Platform Systems Engineer (Lead)',
        minSalary: 180000,
        maxSalary: 245000
      };

      const res = await fetch(`${baseUrl}/jobs/${createdJobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${recruiterToken}`
        },
        body: JSON.stringify(updatePayload)
      });
      const data = await res.json();
      const inDb = db.prepare('SELECT title, min_salary, max_salary FROM jobs WHERE id = ?').get(createdJobId);
      record(
        'Recruiter Vacancy Modification (Edit)',
        `/jobs/${createdJobId}`,
        'PUT',
        res.status,
        `Updated title: "${inDb?.title}", salary: $${inDb?.min_salary}-$${inDb?.max_salary}`,
        res.status === 200 && inDb?.title === 'Staff Platform Systems Engineer (Lead)'
      );
    }

    // 9. Job Application: Single Apply
    {
      const appPayload = {
        jobId: createdJobId,
        candidateName: 'Alex Rivera',
        candidateEmail: 'alex.rivera@careerconnect.dev',
        coverNote: 'I am excited to apply for this engineering role with CareerConnect.',
        portfolioUrl: 'https://alexrivera.dev',
        resumeUrl: 'Alex_Rivera_Resume_2026.pdf'
      };

      const res = await fetch(`${baseUrl}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${candidateToken}`
        },
        body: JSON.stringify(appPayload)
      });
      const data = await res.json();
      singleAppId = data.application?.id;
      const appInDb = db.prepare('SELECT id, job_title, status FROM applications WHERE id = ?').get(singleAppId);
      record(
        'Candidate Job Application (Single Apply)',
        '/applications',
        'POST',
        res.status,
        `Application #${singleAppId} created for "${appInDb?.job_title}". Status: ${appInDb?.status}`,
        res.status === 201 && Boolean(appInDb)
      );
    }

    // 10. Job Basket: Batch Applications (Cart Checkout)
    {
      // Create a dedicated secondary job to test batch application without duplicate constraint
      const batchJob = db.prepare(`SELECT id, title, company, location FROM jobs WHERE id NOT IN (SELECT job_id FROM applications WHERE user_id = 'user-seeker-1') LIMIT 1`).get();
      if (batchJob) {
        const batchPayload = {
          cartItems: [
            {
              id: batchJob.id,
              title: batchJob.title,
              company: batchJob.company,
              location: batchJob.location
            }
          ],
          candidateData: {
            name: 'Alex Rivera',
            email: 'alex.rivera@careerconnect.dev',
            coverNote: 'Batch applied via CareerConnect Application Basket.'
          }
        };

        const res = await fetch(`${baseUrl}/applications/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${candidateToken}`
          },
          body: JSON.stringify(batchPayload)
        });
        const data = await res.json();
        record(
          'Job Basket Batch Checkout (Batch Apply)',
          '/applications/batch',
          'POST',
          res.status,
          `Batch submitted: ${data.applications?.length || 0} application(s) processed for "${batchJob.title}"`,
          res.status === 201 && Array.isArray(data.applications) && data.applications.length > 0
        );
      }
    }

    // 11. Pipeline Telemetry: Fetch Applications
    {
      const res = await fetch(`${baseUrl}/applications`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      const data = await res.json();
      record(
        'Dashboard Pipeline Telemetry (Get Applications)',
        '/applications',
        'GET',
        res.status,
        `Retrieved ${data.applications?.length} applications for user pipeline`,
        res.status === 200 && Array.isArray(data.applications)
      );
    }

    // 12. Recruiter Pipeline Status Transition (PATCH status)
    if (singleAppId) {
      const res = await fetch(`${baseUrl}/applications/${singleAppId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${recruiterToken}`
        },
        body: JSON.stringify({ status: 'Interviewing' })
      });
      const data = await res.json();
      const updatedInDb = db.prepare('SELECT status FROM applications WHERE id = ?').get(singleAppId);
      record(
        'Recruiter Candidate Status Transition',
        `/applications/${singleAppId}/status`,
        'PATCH',
        res.status,
        `Transitioned status to "${updatedInDb?.status}". Verified in SQLite`,
        res.status === 200 && updatedInDb?.status === 'Interviewing'
      );
    }

    // 13. Bookmarks: Save Job
    {
      const res = await fetch(`${baseUrl}/saved-jobs/${createdJobId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      const data = await res.json();
      const savedInDb = db.prepare('SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?').get('user-seeker-1', createdJobId);
      record(
        'Job Bookmarks (Save Job)',
        `/saved-jobs/${createdJobId}`,
        'POST',
        res.status,
        `Bookmarked job #${createdJobId}. Verified in SQLite saved_jobs: ${Boolean(savedInDb)}`,
        res.status === 200 && Boolean(savedInDb)
      );
    }

    // 14. Bookmarks: Fetch Saved Jobs
    {
      const res = await fetch(`${baseUrl}/saved-jobs`, {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      const data = await res.json();
      record(
        'Job Bookmarks (List Saved Jobs)',
        '/saved-jobs',
        'GET',
        res.status,
        `Retrieved ${data.savedJobIds?.length} saved job IDs for seeker`,
        res.status === 200 && Array.isArray(data.savedJobIds)
      );
    }

    // 15. Bookmarks: Remove Saved Job
    {
      const res = await fetch(`${baseUrl}/saved-jobs/${createdJobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      const data = await res.json();
      const savedInDb = db.prepare('SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?').get('user-seeker-1', createdJobId);
      record(
        'Job Bookmarks (Remove Bookmark)',
        `/saved-jobs/${createdJobId}`,
        'DELETE',
        res.status,
        `Removed bookmark. Exists in SQLite: ${Boolean(savedInDb)}`,
        res.status === 200 && !savedInDb
      );
    }

    // 16. Recruiter Delete Vacancy
    {
      const res = await fetch(`${baseUrl}/jobs/${createdJobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${recruiterToken}` }
      });
      const data = await res.json();
      const inDb = db.prepare('SELECT id FROM jobs WHERE id = ?').get(createdJobId);
      record(
        'Recruiter Vacancy Deletion (Delete)',
        `/jobs/${createdJobId}`,
        'DELETE',
        res.status,
        `Deleted #${createdJobId}. Persisted in SQLite: ${Boolean(inDb)}`,
        res.status === 200 && !inDb
      );
    }

    // 17. Candidate Portfolio: Contact Inquiry
    {
      const contactPayload = {
        recruiterName: 'Danielle Croft',
        workEmail: 'danielle@summitsearch.com',
        companyName: 'Summit Executive Search',
        roleOffered: 'Principal Cloud Architect',
        jobType: 'Full-time',
        estimatedSalary: '$220k - $260k',
        message: 'Impressive candidate portfolio. We would love to discuss a leadership opportunity.'
      };

      const res = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactPayload)
      });
      const data = await res.json();
      const inDb = db.prepare('SELECT id, recruiter_name, company_name FROM contact_inquiries WHERE work_email = ?').get('danielle@summitsearch.com');
      record(
        'Candidate Portfolio Contact Outreach',
        '/contact',
        'POST',
        res.status,
        `Inquiry stored: #${inDb?.id} from ${inDb?.recruiter_name} at ${inDb?.company_name}`,
        res.status === 201 && Boolean(inDb)
      );
    }

    // 18. Live External Jobs Sync Trigger
    {
      const res = await fetch(`${baseUrl}/jobs/sync`, { method: 'POST' });
      const data = await res.json();
      record(
        'External Job Board On-Demand Sync',
        '/jobs/sync',
        'POST',
        res.status,
        `Refreshed feeds: ${data.totalSynced || 0} jobs refreshed. Total in DB: ${data.totalInDatabase}`,
        res.status === 200 && data.success
      );
    }
  } catch (err) {
    console.error('Audit execution error:', err);
  } finally {
    server.close();
  }

  console.log(JSON.stringify(auditResults, null, 2));
}

runVivaAudit();
