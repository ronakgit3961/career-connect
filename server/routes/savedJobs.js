import express from 'express';
import { db } from '../db.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/saved-jobs
router.get('/', optionalAuth, (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'user-seeker-1';
    const rows = db.prepare('SELECT job_id FROM saved_jobs WHERE user_id = ?').all(userId);
    const savedJobIds = rows.map((r) => r.job_id);

    return res.json({
      success: true,
      savedJobIds
    });
  } catch (err) {
    console.error('[Get Saved Jobs Error]', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving saved jobs.' });
  }
});

// POST /api/saved-jobs/:jobId
router.post('/:jobId', optionalAuth, (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'user-seeker-1';
    const { jobId } = req.params;

    const insert = db.prepare(`
      INSERT OR IGNORE INTO saved_jobs (user_id, job_id, created_at)
      VALUES (?, ?, ?)
    `);
    insert.run(userId, jobId, new Date().toISOString());

    const rows = db.prepare('SELECT job_id FROM saved_jobs WHERE user_id = ?').all(userId);
    return res.json({
      success: true,
      message: 'Job bookmarked.',
      savedJobIds: rows.map((r) => r.job_id)
    });
  } catch (err) {
    console.error('[Save Job Error]', err);
    return res.status(500).json({ success: false, message: 'Server error saving job.' });
  }
});

// DELETE /api/saved-jobs/:jobId
router.delete('/:jobId', optionalAuth, (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'user-seeker-1';
    const { jobId } = req.params;

    db.prepare('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?').run(userId, jobId);

    const rows = db.prepare('SELECT job_id FROM saved_jobs WHERE user_id = ?').all(userId);
    return res.json({
      success: true,
      message: 'Job removed from bookmarks.',
      savedJobIds: rows.map((r) => r.job_id)
    });
  } catch (err) {
    console.error('[Remove Saved Job Error]', err);
    return res.status(500).json({ success: false, message: 'Server error removing bookmark.' });
  }
});

export default router;
