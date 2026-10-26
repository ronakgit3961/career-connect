import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// POST /api/contact (Candidate Portfolio Contact Form)
router.post('/', (req, res) => {
  try {
    const {
      recruiterName,
      workEmail,
      companyName,
      roleOffered,
      jobType = 'Full-time',
      estimatedSalary = '',
      message
    } = req.body;

    if (!recruiterName || recruiterName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Recruiter name is required.' });
    }

    if (!workEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
      return res.status(400).json({ success: false, message: 'Valid work email is required.' });
    }

    if (!companyName || companyName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }

    if (!roleOffered || roleOffered.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Role offered is required.' });
    }

    if (!message || message.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Message must be at least 20 characters.' });
    }

    const id = `inquiry-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO contact_inquiries (
        id, recruiter_name, work_email, company_name, role_offered,
        job_type, estimated_salary, message, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      recruiterName.trim(),
      workEmail.trim().toLowerCase(),
      companyName.trim(),
      roleOffered.trim(),
      jobType,
      estimatedSalary,
      message.trim(),
      now
    );

    const created = db.prepare('SELECT * FROM contact_inquiries WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      message: 'Direct recruiter inquiry submitted successfully. The candidate has been notified!',
      inquiry: created
    });
  } catch (err) {
    console.error('[Submit Contact Inquiry Error]', err);
    return res.status(500).json({ success: false, message: 'Server error saving inquiry.' });
  }
});

// GET /api/contact
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM contact_inquiries ORDER BY created_at DESC').all();
    return res.json({
      success: true,
      count: rows.length,
      inquiries: rows
    });
  } catch (err) {
    console.error('[Get Contact Inquiries Error]', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving inquiries.' });
  }
});

export default router;
