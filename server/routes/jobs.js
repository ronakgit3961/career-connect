import express from 'express';
import { db } from '../db.js';
import { optionalAuth, verifyToken, requireRole } from '../middleware/auth.js';
import { syncExternalJobs } from '../externalJobs.js';

const router = express.Router();

function formatJob(row) {
  if (!row) return null;
  return {
    ...row,
    featured: Boolean(row.featured),
    urgent: Boolean(row.urgent),
    responsibilities: row.responsibilities ? JSON.parse(row.responsibilities) : [],
    requirements: row.requirements ? JSON.parse(row.requirements) : [],
    skills: row.skills ? JSON.parse(row.skills) : [],
    perks: row.perks ? JSON.parse(row.perks) : [],
    minSalary: row.min_salary,
    maxSalary: row.max_salary,
    workplaceType: row.workplace_type,
    experienceLevel: row.experience_level,
    applicantsCount: row.applicants_count,
    postedAt: row.created_at,
    externalUrl: row.external_url
  };
}

// GET /api/jobs
router.get('/', (req, res) => {
  try {
    const {
      search = '',
      category = 'All',
      workplaceType = 'All',
      experienceLevel = 'All',
      jobType = 'All',
      minSalary = 0,
      source = 'all',
      sortBy = 'newest',
      page = 1,
      limit = 50
    } = req.query;

    let conditions = ['1=1'];
    let params = [];

    if (search && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      conditions.push('(LOWER(title) LIKE ? OR LOWER(company) LIKE ? OR LOWER(description) LIKE ? OR LOWER(skills) LIKE ?)');
      params.push(term, term, term, term);
    }

    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (workplaceType && workplaceType !== 'All') {
      conditions.push('workplace_type = ?');
      params.push(workplaceType);
    }

    if (experienceLevel && experienceLevel !== 'All') {
      conditions.push('experience_level = ?');
      params.push(experienceLevel);
    }

    if (jobType && jobType !== 'All') {
      conditions.push('type = ?');
      params.push(jobType);
    }

    if (Number(minSalary) > 0) {
      conditions.push('max_salary >= ?');
      params.push(Number(minSalary));
    }

    if (source && source !== 'all') {
      conditions.push('source = ?');
      params.push(source);
    }

    let orderClause = 'ORDER BY created_at DESC';
    if (sortBy === 'salary-high') {
      orderClause = 'ORDER BY max_salary DESC, created_at DESC';
    } else if (sortBy === 'salary-low') {
      orderClause = 'ORDER BY min_salary ASC, created_at DESC';
    } else if (sortBy === 'applicants') {
      orderClause = 'ORDER BY applicants_count DESC, created_at DESC';
    }

    const whereClause = conditions.join(' AND ');

    // Total count
    const totalRow = db.prepare(`SELECT COUNT(*) as count FROM jobs WHERE ${whereClause}`).get(...params);
    const total = totalRow.count;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const rows = db.prepare(`SELECT * FROM jobs WHERE ${whereClause} ${orderClause} LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

    const jobs = rows.map(formatJob);

    return res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      jobs
    });
  } catch (err) {
    console.error('[Get Jobs Error]', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving jobs.' });
  }
});

// GET /api/jobs/:id
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ success: false, message: `Job vacancy #${id} not found.` });
    }

    return res.json({
      success: true,
      job: formatJob(row)
    });
  } catch (err) {
    console.error('[Get Job By Id Error]', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving job.' });
  }
});

// POST /api/jobs (Create Vacancy)
router.post('/', optionalAuth, (req, res) => {
  try {
    const {
      title,
      company,
      logo = '💼',
      category = 'Engineering',
      location,
      type = 'Full-time',
      workplaceType = 'Remote',
      experienceLevel = 'Mid-Level',
      minSalary = 100000,
      maxSalary = 150000,
      description,
      responsibilities = [],
      requirements = [],
      skills = [],
      perks = [],
      featured = false,
      urgent = false
    } = req.body;

    if (!title || title.trim().length < 4) {
      return res.status(400).json({ success: false, message: 'Job title is required (minimum 4 characters).' });
    }

    if (!company || company.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }

    if (!location || location.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Location is required.' });
    }

    if (!description || description.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Job description must be at least 20 characters.' });
    }

    const id = `job-recruiter-${Date.now()}`;
    const now = new Date().toISOString();
    const postedBy = req.user ? req.user.id : 'user-recruiter-1';

    const insert = db.prepare(`
      INSERT INTO jobs (
        id, title, company, logo, category, location, type, workplace_type,
        experience_level, min_salary, max_salary, description, responsibilities,
        requirements, skills, perks, featured, urgent, applicants_count,
        posted_by, source, external_url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      title.trim(),
      company.trim(),
      logo,
      category,
      location.trim(),
      type,
      workplaceType,
      experienceLevel,
      Number(minSalary) || 0,
      Number(maxSalary) || 0,
      description.trim(),
      JSON.stringify(Array.isArray(responsibilities) ? responsibilities : []),
      JSON.stringify(Array.isArray(requirements) ? requirements : []),
      JSON.stringify(Array.isArray(skills) ? skills : []),
      JSON.stringify(Array.isArray(perks) ? perks : []),
      featured ? 1 : 0,
      urgent ? 1 : 0,
      0,
      postedBy,
      'local',
      null,
      now
    );

    const created = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      message: 'Job vacancy published successfully.',
      job: formatJob(created)
    });
  } catch (err) {
    console.error('[Create Job Error]', err);
    return res.status(500).json({ success: false, message: 'Server error creating vacancy.' });
  }
});

// POST /api/jobs/sync (Trigger external job refresh)
router.post('/sync', async (req, res) => {
  try {
    const results = await syncExternalJobs();
    const countRow = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
    return res.json({
      success: true,
      message: 'Live job boards synchronized.',
      totalInDatabase: countRow.count,
      ...results
    });
  } catch (err) {
    console.error('[Sync Jobs Error]', err);
    return res.status(500).json({ success: false, message: 'Error syncing external job feeds.' });
  }
});

// PUT /api/jobs/:id (Recruiter Edit Vacancy)
router.put('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `Job vacancy #${id} not found.` });
    }

    const {
      title = existing.title,
      company = existing.company,
      logo = existing.logo,
      category = existing.category,
      location = existing.location,
      type = existing.type,
      workplaceType = existing.workplace_type,
      experienceLevel = existing.experience_level,
      minSalary = existing.min_salary,
      maxSalary = existing.max_salary,
      description = existing.description,
      responsibilities = existing.responsibilities ? JSON.parse(existing.responsibilities) : [],
      requirements = existing.requirements ? JSON.parse(existing.requirements) : [],
      skills = existing.skills ? JSON.parse(existing.skills) : [],
      perks = existing.perks ? JSON.parse(existing.perks) : [],
      featured = existing.featured,
      urgent = existing.urgent
    } = req.body;

    const update = db.prepare(`
      UPDATE jobs SET
        title = ?, company = ?, logo = ?, category = ?, location = ?,
        type = ?, workplace_type = ?, experience_level = ?,
        min_salary = ?, max_salary = ?, description = ?,
        responsibilities = ?, requirements = ?, skills = ?, perks = ?,
        featured = ?, urgent = ?
      WHERE id = ?
    `);

    update.run(
      title,
      company,
      logo,
      category,
      location,
      type,
      workplaceType,
      experienceLevel,
      Number(minSalary) || 0,
      Number(maxSalary) || 0,
      description,
      JSON.stringify(Array.isArray(responsibilities) ? responsibilities : []),
      JSON.stringify(Array.isArray(requirements) ? requirements : []),
      JSON.stringify(Array.isArray(skills) ? skills : []),
      JSON.stringify(Array.isArray(perks) ? perks : []),
      featured ? 1 : 0,
      urgent ? 1 : 0,
      id
    );

    const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    return res.json({
      success: true,
      message: 'Job vacancy updated successfully.',
      job: formatJob(updated)
    });
  } catch (err) {
    console.error('[Update Job Error]', err);
    return res.status(500).json({ success: false, message: 'Server error updating job vacancy.' });
  }
});

// DELETE /api/jobs/:id (Recruiter Delete Vacancy)
router.delete('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id FROM jobs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `Job vacancy #${id} not found.` });
    }

    const deleteTx = db.transaction(() => {
      db.prepare('DELETE FROM saved_jobs WHERE job_id = ?').run(id);
      db.prepare('DELETE FROM jobs WHERE id = ?').run(id);
    });
    deleteTx();

    return res.json({
      success: true,
      message: `Job vacancy #${id} deleted successfully.`,
      deletedId: id
    });
  } catch (err) {
    console.error('[Delete Job Error]', err);
    return res.status(500).json({ success: false, message: 'Server error deleting job vacancy.' });
  }
});

export default router;
