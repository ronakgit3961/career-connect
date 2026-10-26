import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dbDir, 'careerconnect.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrent performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'seeker',
      title TEXT,
      company TEXT,
      avatar TEXT,
      resume_name TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // 2. Jobs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      logo TEXT,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      workplace_type TEXT NOT NULL,
      experience_level TEXT NOT NULL,
      min_salary INTEGER DEFAULT 0,
      max_salary INTEGER DEFAULT 0,
      description TEXT NOT NULL,
      responsibilities TEXT,
      requirements TEXT,
      skills TEXT,
      perks TEXT,
      featured INTEGER DEFAULT 0,
      urgent INTEGER DEFAULT 0,
      applicants_count INTEGER DEFAULT 0,
      posted_by TEXT,
      source TEXT DEFAULT 'local',
      external_url TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // 3. Applications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      job_title TEXT NOT NULL,
      company TEXT NOT NULL,
      user_id TEXT NOT NULL,
      candidate_name TEXT NOT NULL,
      candidate_email TEXT NOT NULL,
      phone TEXT,
      portfolio_url TEXT,
      resume_url TEXT NOT NULL,
      cover_note TEXT,
      status TEXT NOT NULL DEFAULT 'Applied',
      match_score INTEGER DEFAULT 85,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, job_id)
    );
  `);

  // 4. Saved jobs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS saved_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      job_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, job_id)
    );
  `);

  // 5. Contact Inquiries table (Candidate Portfolio Outreach)
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id TEXT PRIMARY KEY,
      recruiter_name TEXT NOT NULL,
      work_email TEXT NOT NULL,
      company_name TEXT NOT NULL,
      role_offered TEXT NOT NULL,
      job_type TEXT,
      estimated_salary TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

  if (userCount === 0) {
    console.log('[DB] Seeding default users (Alex Rivera & Sarah Jenkins)...');
    const hashedPassword = bcrypt.hashSync('password123', 10);
    const now = new Date().toISOString();

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password, role, title, company, avatar, resume_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Candidate user
    insertUser.run(
      'user-seeker-1',
      'Alex Rivera',
      'alex.rivera@careerconnect.dev',
      hashedPassword,
      'seeker',
      'Full-Stack Software Engineer',
      null,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      'Alex_Rivera_Resume_2026.pdf',
      now
    );

    // Recruiter user
    insertUser.run(
      'user-recruiter-1',
      'Sarah Jenkins',
      'sarah.jenkins@talentpartners.io',
      hashedPassword,
      'recruiter',
      'Head of Talent Acquisition',
      'TechWave Talent Partners',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      null,
      now
    );
  }

  const jobCount = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE source = 'local'").get().count;
  if (jobCount === 0) {
    console.log('[DB] Seeding core recruiter vacancies...');
    const insertJob = db.prepare(`
      INSERT INTO jobs (
        id, title, company, logo, category, location, type, workplace_type,
        experience_level, min_salary, max_salary, description, responsibilities,
        requirements, skills, perks, featured, urgent, applicants_count,
        posted_by, source, external_url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialJobs = [
      {
        id: 'job-1',
        title: 'Senior Full-Stack Engineer (React & Node)',
        company: 'StripeWave Labs',
        logo: '⚡',
        category: 'Engineering',
        location: 'San Francisco, CA',
        type: 'Full-time',
        workplaceType: 'Remote',
        experienceLevel: 'Senior',
        minSalary: 140000,
        maxSalary: 185000,
        description: 'We are looking for a Senior Full-Stack Engineer to architect and build our next-generation cloud billing infrastructure. You will collaborate closely with product managers, UI/UX designers, and backend architects to deliver ultra-low latency dashboards, microservices, and client-facing SDKs.',
        responsibilities: [
          'Design, build, and maintain highly scalable web applications in React 18+ and Node.js microservices',
          'Optimize web performance, rendering pipelines, and state management using Redux Toolkit and Context API',
          'Collaborate with product designers to implement pixel-perfect, accessible UI components',
          'Participate in code reviews, mentor junior and mid-level engineers, and write comprehensive automated tests'
        ],
        requirements: [
          '5+ years of production experience with JavaScript/TypeScript, React, and Node.js',
          'Demonstrated expertise in SPA routing, asynchronous state machines, and RESTful/GraphQL APIs',
          'Strong grasp of CSS architecture, responsive design, and component-driven development',
          'Solid experience with Docker, CI/CD pipelines, and cloud platforms (AWS/GCP)'
        ],
        skills: ['React', 'Node.js', 'TypeScript', 'Redux', 'Tailwind CSS', 'PostgreSQL'],
        perks: ['$3,000 Annual Learning Stipend', 'Health, Dental & Vision (100% covered)', 'Unlimited PTO', 'Home Office Setup Grant'],
        featured: 1,
        urgent: 1,
        applicantsCount: 24,
        postedBy: 'user-recruiter-1',
        createdAt: '2026-10-15T10:00:00.000Z'
      },
      {
        id: 'job-2',
        title: 'Staff Frontend Architect',
        company: 'NovaScale AI',
        logo: '🧠',
        category: 'Engineering',
        location: 'New York, NY',
        type: 'Full-time',
        workplaceType: 'Hybrid',
        experienceLevel: 'Lead',
        minSalary: 175000,
        maxSalary: 230000,
        description: 'NovaScale AI empowers enterprises with generative workflow intelligence. As a Staff Frontend Architect, you will spearhead our client architecture, design system, and multi-tenant canvas UI.',
        responsibilities: [
          'Define the technical roadmap for frontend architecture across multiple multi-page web applications',
          'Establish state management best practices across micro-frontends and real-time WebSocket feeds',
          'Build reusable design system primitives with accessibility (WCAG AA/AAA) compliance',
          'Lead engineering initiatives that drive Lighthouse scores above 95+'
        ],
        requirements: [
          '7+ years experience designing complex web applications with modern frontend frameworks',
          'Deep architectural knowledge of React, Next.js or Vite, Redux Toolkit, and Browser APIs',
          'Proven track record of mentoring 10+ engineers and driving cross-functional alignment',
          'Deep understanding of web performance metrics (Core Web Vitals, INP, LCP)'
        ],
        skills: ['React', 'TypeScript', 'System Architecture', 'Design Systems', 'Microfrontends', 'Webpack/Vite'],
        perks: ['Equity Package (0.25% - 0.5%)', 'Bi-annual Global Engineering Summits', 'Top-tier Health Insurance', 'Annual Tech Refresh Budget'],
        featured: 1,
        urgent: 0,
        applicantsCount: 18,
        postedBy: 'user-recruiter-1',
        createdAt: '2026-10-16T14:30:00.000Z'
      },
      {
        id: 'job-3',
        title: 'Lead Product Designer (Design Systems)',
        company: 'PulseDesign Studio',
        logo: '🎨',
        category: 'Design',
        location: 'Austin, TX',
        type: 'Full-time',
        workplaceType: 'Remote',
        experienceLevel: 'Lead',
        minSalary: 135000,
        maxSalary: 170000,
        description: 'PulseDesign Studio crafts enterprise design systems and component libraries for Fortune 500 tech companies. We are seeking a Lead Product Designer to guide our cross-functional client teams and evolve our tokenized multi-brand Figma library.',
        responsibilities: [
          'Own and scale our cross-platform design token architecture and Figma component libraries',
          'Conduct usability testing sessions, synthesis workshops, and accessibility audits',
          'Partner with frontend developers to ensure design fidelity and micro-interaction polish',
          'Advocate for human-centric UX principles and design maturity across the client organization'
        ],
        requirements: [
          '6+ years in digital product design, UX research, or design systems leadership',
          'Mastery of Figma (auto-layout, components, variables, tokens) and modern prototyping tools',
          'Portfolio showing end-to-end design lifecycles from discovery to design token handoff',
          'Familiarity with HTML/CSS and component architectures (React/Tailwind)'
        ],
        skills: ['Figma', 'Design Systems', 'UX Research', 'Design Tokens', 'Prototyping', 'Accessibility'],
        perks: ['Flexible Work Hours', '401(k) Match up to 6%', 'Mental Health Stipend', 'Creative Sabbatical every 3 years'],
        featured: 0,
        urgent: 1,
        applicantsCount: 31,
        postedBy: 'user-recruiter-1',
        createdAt: '2026-10-17T09:15:00.000Z'
      },
      {
        id: 'job-4',
        title: 'Senior DevOps & Kubernetes Engineer',
        company: 'CloudMatrix Technologies',
        logo: '☁️',
        category: 'DevOps',
        location: 'Seattle, WA',
        type: 'Full-time',
        workplaceType: 'Remote',
        experienceLevel: 'Senior',
        minSalary: 155000,
        maxSalary: 195000,
        description: 'CloudMatrix powers mission-critical edge computing clusters for IoT and logistics leaders worldwide. We are looking for a Senior DevOps Engineer to scale our Terraform orchestration, multi-region Kubernetes clusters, and zero-trust mesh.',
        responsibilities: [
          'Provision, manage, and harden multi-cluster Kubernetes deployments across AWS and bare metal',
          'Maintain infrastructure as code with Terraform, Helm, and GitOps (ArgoCD)',
          'Implement observability pipelines using Prometheus, Grafana, OpenTelemetry, and Datadog',
          'Participate in on-call rotation with 99.99% SLO targets and lead blameless post-mortems'
        ],
        requirements: [
          '5+ years managing high-availability production infrastructure on Linux/AWS/GCP',
          'Extensive experience with Kubernetes container orchestration, service mesh (Istio), and CNI',
          'Proficiency with CI/CD automation, GitHub Actions, and container security scanning',
          'Solid scripting ability in Python, Go, or Bash'
        ],
        skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Prometheus', 'ArgoCD'],
        perks: ['Comprehensive Health & Dental', 'Continuous Certification Reimbursement', 'Generous Home Office Allowance', 'Annual Company Retreat'],
        featured: 1,
        urgent: 0,
        applicantsCount: 14,
        postedBy: 'user-recruiter-1',
        createdAt: '2026-10-18T16:00:00.000Z'
      },
      {
        id: 'job-5',
        title: 'Senior Product Manager - Developer Tools',
        company: 'DevFlow Systems',
        logo: '🚀',
        category: 'Product',
        location: 'San Francisco, CA',
        type: 'Full-time',
        workplaceType: 'Hybrid',
        experienceLevel: 'Senior',
        minSalary: 160000,
        maxSalary: 210000,
        description: 'DevFlow Systems builds developer productivity tooling and continuous deployment infrastructure. As Senior PM, you will spearhead our CLI and developer portal roadmap.',
        responsibilities: [
          'Define the product vision, quarterly roadmap, and success OKRs for developer onboarding',
          'Conduct qualitative interviews with senior developers and engineering leaders',
          'Collaborate with engineering managers and designers in an agile 2-week sprint cycle',
          'Track conversion funnels, developer telemetry, and feature adoption'
        ],
        requirements: [
          '4+ years product management experience focusing on developer-facing tools or SaaS APIs',
          'Technical background or prior experience as a software engineer is strongly preferred',
          'Demonstrated ability to turn ambiguous developer feedback into concise PRDs',
          'Exceptional written communication and cross-functional leadership skills'
        ],
        skills: ['Product Strategy', 'Developer Experience', 'Agile/Scrum', 'Data Analytics', 'Roadmapping'],
        perks: ['Equity Package', 'Commuter Benefits', 'Full Health & Vision', 'Annual Learning & Conference Budget'],
        featured: 0,
        urgent: 0,
        applicantsCount: 22,
        postedBy: 'user-recruiter-1',
        createdAt: '2026-10-19T11:20:00.000Z'
      },
      {
        id: 'job-6',
        title: 'Junior Frontend Developer (React)',
        company: 'NextGen Digital Agency',
        logo: '✨',
        category: 'Engineering',
        location: 'Chicago, IL',
        type: 'Full-time',
        workplaceType: 'On-site',
        experienceLevel: 'Entry-Level',
        minSalary: 75000,
        maxSalary: 95000,
        description: 'NextGen Digital is a fast-paced creative agency building interactive web applications for high-growth consumer brands. We are seeking a motivated Junior Frontend Developer passionate about modern React, state management, and responsive CSS.',
        responsibilities: [
          'Translate Figma wireframes into accessible, responsive React components with Tailwind CSS',
          'Collaborate with senior developers to consume RESTful endpoints and manage global state',
          'Write clean, modular code with unit tests and participate in active pull request reviews',
          'Assist with QA testing, cross-browser compatibility checks, and bug triage'
        ],
        requirements: [
          '1+ year of hands-on experience building projects with React, JavaScript (ES6+), and CSS/Tailwind',
          'Basic understanding of Git workflow, component lifecycle, and React hooks (useState, useEffect, useContext)',
          'Strong curiosity, eagerness to learn, and proactive communication in a team setting',
          'A portfolio or GitHub repository showcasing personal or academic projects'
        ],
        skills: ['React', 'JavaScript', 'Tailwind CSS', 'Git', 'HTML5', 'Responsive Design'],
        perks: ['Dedicated 1-on-1 Senior Mentorship', 'Comprehensive Health Plan', 'Paid Time Off & Holidays', 'Friday Team Lunches & Tech Talks'],
        featured: 0,
        urgent: 1,
        applicantsCount: 47,
        postedBy: 'user-recruiter-1',
        createdAt: '2026-10-20T08:45:00.000Z'
      }
    ];

    for (const j of initialJobs) {
      insertJob.run(
        j.id,
        j.title,
        j.company,
        j.logo,
        j.category,
        j.location,
        j.type,
        j.workplaceType,
        j.experienceLevel,
        j.minSalary,
        j.maxSalary,
        j.description,
        JSON.stringify(j.responsibilities),
        JSON.stringify(j.requirements),
        JSON.stringify(j.skills),
        JSON.stringify(j.perks),
        j.featured,
        j.urgent,
        j.applicantsCount,
        j.postedBy,
        'local',
        null,
        j.createdAt
      );
    }
  }

  const appCount = db.prepare('SELECT COUNT(*) as count FROM applications').get().count;
  if (appCount === 0) {
    console.log('[DB] Seeding initial applications...');
    const insertApp = db.prepare(`
      INSERT INTO applications (
        id, job_id, job_title, company, user_id, candidate_name,
        candidate_email, phone, portfolio_url, resume_url, cover_note,
        status, match_score, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertApp.run(
      'app-101',
      'job-1',
      'Senior Full-Stack Engineer (React & Node)',
      'StripeWave Labs',
      'user-seeker-1',
      'Alex Rivera',
      'alex.rivera@careerconnect.dev',
      '+1 (555) 019-2834',
      'https://alexrivera.dev',
      'Alex_Rivera_Resume_2026.pdf',
      'Excited about scaling StripeWave’s infrastructure! I have built high-throughput microservices and modular React apps.',
      'Interviewing',
      94,
      '2026-10-16T12:00:00.000Z'
    );

    insertApp.run(
      'app-102',
      'job-2',
      'Staff Frontend Architect',
      'NovaScale AI',
      'user-seeker-1',
      'Alex Rivera',
      'alex.rivera@careerconnect.dev',
      '+1 (555) 019-2834',
      'https://alexrivera.dev',
      'Alex_Rivera_Resume_2026.pdf',
      'With extensive architecture experience building design systems and state engines, I would love to shape NovaScale’s frontend vision.',
      'Under Review',
      89,
      '2026-10-17T15:30:00.000Z'
    );
  }

  const savedCount = db.prepare('SELECT COUNT(*) as count FROM saved_jobs').get().count;
  if (savedCount === 0) {
    console.log('[DB] Seeding initial saved jobs for candidate...');
    const insertSaved = db.prepare('INSERT OR IGNORE INTO saved_jobs (user_id, job_id, created_at) VALUES (?, ?, ?)');
    insertSaved.run('user-seeker-1', 'job-1', new Date().toISOString());
    insertSaved.run('user-seeker-1', 'job-3', new Date().toISOString());
  }
}
