import express from 'express';
import { db } from '../db.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

function formatApplication(row) {
  if (!row) return null;
  return {
    id: row.id,
    jobId: row.job_id,
    jobTitle: row.job_title,
    company: row.company,
    userId: row.user_id,
    candidateName: row.candidate_name,
    candidateEmail: row.candidate_email,
    phone: row.phone,
    portfolioUrl: row.portfolio_url,
    resumeUrl: row.resume_url,
    coverNote: row.cover_note,
    status: row.status,
    matchScore: row.match_score,
    appliedAt: row.created_at
  };
}

// GET /api/applications
router.get('/', optionalAuth, (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const isRecruiter = req.user && req.user.role === 'recruiter';

    let rows;
    if (isRecruiter) {
      // Recruiters see applications across all vacancies
      rows = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
    } else if (userId) {
      // Authenticated seeker sees their applications
      rows = db.prepare('SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    } else {
      // Default seeker view (Alex Rivera)
      rows = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
    }

    return res.json({
      success: true,
      count: rows.length,
      applications: rows.map(formatApplication)
    });
  } catch (err) {
    console.error('[Get Applications Error]', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving applications.' });
  }
});

// POST /api/applications (Single Job Application)
router.post('/', optionalAuth, (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      company,
      candidateName,
      candidateEmail,
      phone = '',
      portfolioUrl = '',
      resumeUrl = 'Resume.pdf',
      coverNote = ''
    } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    const resolvedName = (candidateName && candidateName.trim()) || (req.user ? req.user.name : '');
    const resolvedEmail = (candidateEmail && candidateEmail.trim()) || (req.user ? req.user.email : '');

    if (!resolvedName || resolvedName.length < 2) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    if (!resolvedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resolvedEmail)) {
      return res.status(400).json({ success: false, message: 'Valid email is required.' });
    }

    const userId = req.user ? req.user.id : (req.body.userId || 'user-seeker-1');

    // Duplicate Application Check: Prevent submitting twice for the same vacancy
    const existing = db.prepare('SELECT id, created_at FROM applications WHERE user_id = ? AND job_id = ?').get(userId, jobId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `You have already applied for this position on ${new Date(existing.created_at).toLocaleDateString()}. Duplicate applications are not permitted.`
      });
    }

    const id = `app-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const now = new Date().toISOString();
    const matchScore = Math.floor(Math.random() * 15) + 85;

    // Insert application and increment applicants_count on job atomically
    const insertTx = db.transaction(() => {
      db.prepare(`
        INSERT INTO applications (
          id, job_id, job_title, company, user_id, candidate_name,
          candidate_email, phone, portfolio_url, resume_url, cover_note,
          status, match_score, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        jobId,
        jobTitle || 'Role',
        company || 'Company',
        userId,
        resolvedName.trim(),
        resolvedEmail.trim().toLowerCase(),
        phone,
        portfolioUrl,
        resumeUrl,
        coverNote,
        'Applied',
        matchScore,
        now
      );

      db.prepare('UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = ?').run(jobId);
    });

    insertTx();

    const created = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      message: 'Application dispatched successfully!',
      application: formatApplication(created)
    });
  } catch (err) {
    console.error('[Submit Application Error]', err);
    return res.status(500).json({ success: false, message: 'Server error processing application.' });
  }
});

// POST /api/applications/batch (Batch Apply from Shopping Cart / Job Basket)
router.post('/batch', optionalAuth, (req, res) => {
  try {
    const { cartItems = [], candidateData = {} } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Job basket is empty. Please add jobs before checking out.' });
    }

    const userId = req.user ? req.user.id : (candidateData.id || 'user-seeker-1');
    const candidateName = candidateData.name || (req.user ? req.user.name : 'Alex Rivera');
    const candidateEmail = candidateData.email || (req.user ? req.user.email : 'alex.rivera@careerconnect.dev');

    const createdApps = [];
    const skippedJobs = [];

    const batchTx = db.transaction(() => {
      const checkExisting = db.prepare('SELECT id FROM applications WHERE user_id = ? AND job_id = ?');
      const insertApp = db.prepare(`
        INSERT INTO applications (
          id, job_id, job_title, company, user_id, candidate_name,
          candidate_email, phone, portfolio_url, resume_url, cover_note,
          status, match_score, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const incrementCount = db.prepare('UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = ?');

      cartItems.forEach((item, index) => {
        const targetJobId = item.jobId || item.id;
        if (!targetJobId) return;

        const already = checkExisting.get(userId, targetJobId);
        if (already) {
          skippedJobs.push(item.title);
          return;
        }

        const id = `app-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`;
        const now = new Date().toISOString();
        const matchScore = Math.floor(Math.random() * 15) + 85;

        insertApp.run(
          id,
          targetJobId,
          item.title,
          item.company,
          userId,
          candidateName,
          candidateEmail,
          candidateData.phone || '+1 (555) 019-2834',
          candidateData.portfolioUrl || 'https://alexrivera.dev',
          item.customResume || candidateData.resumeName || 'Alex_Rivera_Resume_2026.pdf',
          item.coverNote || 'Batch applied through CareerConnect Job Cart',
          'Applied',
          matchScore,
          now
        );

        incrementCount.run(targetJobId);

        createdApps.push({
          id,
          jobId: targetJobId,
          jobTitle: item.title,
          company: item.company,
          userId,
          candidateName,
          candidateEmail,
          status: 'Applied',
          matchScore,
          appliedAt: now
        });
      });
    });

    batchTx();

    return res.status(201).json({
      success: true,
      message: `Successfully submitted ${createdApps.length} application(s).${skippedJobs.length > 0 ? ` (${skippedJobs.length} position(s) were previously applied for and skipped).` : ''}`,
      applications: createdApps,
      skippedJobs
    });
  } catch (err) {
    console.error('[Batch Apply Error]', err);
    return res.status(500).json({ success: false, message: 'Server error processing batch applications.' });
  }
});

// PATCH /api/applications/:id/status (Recruiter status transition)
router.patch('/:id/status', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['Applied', 'Under Review', 'Reviewing', 'Interviewing', 'Offered', 'Rejected'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid application status. Allowed: [${allowed.join(', ')}]`
      });
    }

    const app = db.prepare('SELECT id FROM applications WHERE id = ?').get(id);
    if (!app) {
      return res.status(404).json({ success: false, message: `Application #${id} not found.` });
    }

    db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: `Status updated to ${status}.`,
      application: formatApplication(updated)
    });
  } catch (err) {
    console.error('[Update Application Status Error]', err);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
});

export default router;
