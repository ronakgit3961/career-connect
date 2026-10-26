import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, db } from './db.js';
import authRoutes from './routes/auth.js';
import jobsRoutes from './routes/jobs.js';
import applicationsRoutes from './routes/applications.js';
import savedJobsRoutes from './routes/savedJobs.js';
import contactRoutes from './routes/contact.js';
import { syncExternalJobs } from './externalJobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable Cross-Origin Resource Sharing & JSON body parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite database schema and seed defaults
initDatabase();

// Health Check & System Status Endpoint
app.get('/api/health', (req, res) => {
  const stats = {
    status: 'healthy',
    service: 'CareerConnect Express REST API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      users: db.prepare('SELECT COUNT(*) as c FROM users').get().c,
      jobs: db.prepare('SELECT COUNT(*) as c FROM jobs').get().c,
      applications: db.prepare('SELECT COUNT(*) as c FROM applications').get().c,
      savedJobs: db.prepare('SELECT COUNT(*) as c FROM saved_jobs').get().c
    }
  };
  return res.json(stats);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);
app.use('/api/contact', contactRoutes);

// 404 Catch-All for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[CareerConnect Uncaught Server Error]', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.'
  });
});

// Start listening
const server = app.listen(PORT, async () => {
  console.log(`[CareerConnect Server] Listening on http://localhost:${PORT}`);
  console.log(`[CareerConnect Server] Environment: ${process.env.NODE_ENV || 'development'}`);

  // Fetch real external jobs from Arbeitnow / Remotive asynchronously
  try {
    const syncRes = await syncExternalJobs();
    console.log(`[CareerConnect Server] External job board sync completed: +${syncRes.totalSynced} live jobs ingested.`);
  } catch (err) {
    console.warn('[CareerConnect Server] Initial external job board sync warning:', err.message);
  }
});

export default app;
