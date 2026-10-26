import { db } from './db.js';

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferCategory(title = '', tags = []) {
  const text = `${title} ${tags.join(' ')}`.toLowerCase();
  if (text.includes('design') || text.includes('ui/ux') || text.includes('product design')) return 'Design';
  if (text.includes('devops') || text.includes('cloud') || text.includes('infrastructure') || text.includes('sre') || text.includes('kubernetes')) return 'DevOps';
  if (text.includes('product manager') || text.includes('product owner') || text.includes('scrum')) return 'Product';
  if (text.includes('data') || text.includes('ai') || text.includes('machine learning') || text.includes('analytics')) return 'Data & AI';
  if (text.includes('marketing') || text.includes('sales') || text.includes('growth')) return 'Marketing';
  return 'Engineering';
}

function inferExperienceLevel(title = '') {
  const t = title.toLowerCase();
  if (t.includes('staff') || t.includes('principal') || t.includes('lead') || t.includes('head') || t.includes('director')) return 'Lead';
  if (t.includes('senior') || t.includes('sr.') || t.includes('sr ')) return 'Senior';
  if (t.includes('junior') || t.includes('jr.') || t.includes('entry') || t.includes('intern') || t.includes('associate')) return 'Entry-Level';
  return 'Mid-Level';
}

function inferSalary(title = '', experience = 'Mid-Level') {
  if (experience === 'Lead') return { min: 165000, max: 225000 };
  if (experience === 'Senior') return { min: 135000, max: 180000 };
  if (experience === 'Entry-Level') return { min: 70000, max: 95000 };
  return { min: 105000, max: 145000 };
}

export async function syncExternalJobs() {
  const results = {
    arbeitnowCount: 0,
    remotiveCount: 0,
    totalSynced: 0,
    errors: []
  };

  const upsertJob = db.prepare(`
    INSERT INTO jobs (
      id, title, company, logo, category, location, type, workplace_type,
      experience_level, min_salary, max_salary, description, responsibilities,
      requirements, skills, perks, featured, urgent, applicants_count,
      posted_by, source, external_url, created_at
    ) VALUES (
      @id, @title, @company, @logo, @category, @location, @type, @workplace_type,
      @experience_level, @min_salary, @max_salary, @description, @responsibilities,
      @requirements, @skills, @perks, @featured, @urgent, @applicants_count,
      @posted_by, @source, @external_url, @created_at
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      company = excluded.company,
      location = excluded.location,
      min_salary = excluded.min_salary,
      max_salary = excluded.max_salary,
      description = excluded.description,
      requirements = excluded.requirements,
      skills = excluded.skills
  `);

  const runUpsert = db.transaction((jobsList) => {
    for (const j of jobsList) {
      upsertJob.run(j);
    }
  });

  // 1. Fetch from Arbeitnow Public Job API
  const arbeitUrl = process.env.EXTERNAL_JOBS_API || 'https://www.arbeitnow.com/api/job-board-api';
  try {
    const res = await fetch(arbeitUrl, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000)
    });

    if (res.ok) {
      const json = await res.json();
      const rawJobs = Array.isArray(json?.data) ? json.data.slice(0, 30) : []; // take top 30 live tech jobs
      const formatted = rawJobs.map((item) => {
        const title = item.title || 'Software Professional';
        const exp = inferExperienceLevel(title);
        const cat = inferCategory(title, item.tags || []);
        const salary = inferSalary(title, exp);
        const cleanDesc = stripHtml(item.description) || `Exciting opportunity at ${item.company_name}.`;
        const skills = Array.isArray(item.tags) && item.tags.length > 0
          ? item.tags.slice(0, 6)
          : ['JavaScript', 'React', 'Cloud'];

        return {
          id: `ext-arbeit-${item.slug || Math.random().toString(36).substring(7)}`,
          title,
          company: item.company_name || 'Global Tech Partner',
          logo: '🌐',
          category: cat,
          location: item.location || 'Remote (EU / Global)',
          type: item.job_types?.[0] || 'Full-time',
          workplace_type: item.remote ? 'Remote' : (item.location?.toLowerCase().includes('remote') ? 'Hybrid' : 'On-site'),
          experience_level: exp,
          min_salary: salary.min,
          max_salary: salary.max,
          description: cleanDesc,
          responsibilities: JSON.stringify([
            `Collaborate with cross-functional product and engineering teams at ${item.company_name}`,
            'Design scalable software solutions and maintain robust production code',
            'Participate in architecture discussions, code reviews, and sprint planning'
          ]),
          requirements: JSON.stringify(skills.map((s) => `Demonstrated proficiency in ${s}`)),
          skills: JSON.stringify(skills),
          perks: JSON.stringify(['Remote Flexibility', 'Competitive Global Compensation', 'Equipment Allowance']),
          featured: Math.random() > 0.75 ? 1 : 0,
          urgent: Math.random() > 0.8 ? 1 : 0,
          applicants_count: Math.floor(Math.random() * 20) + 5,
          posted_by: 'external-api',
          source: 'external',
          external_url: item.url || 'https://www.arbeitnow.com',
          created_at: item.created_at ? new Date(item.created_at * 1000).toISOString() : new Date().toISOString()
        };
      });

      if (formatted.length > 0) {
        runUpsert(formatted);
        results.arbeitnowCount = formatted.length;
      }
    }
  } catch (err) {
    results.errors.push(`Arbeitnow API: ${err.message}`);
  }

  // 2. Fetch from Remotive Public Remote Job API
  const remotiveUrl = process.env.REMOTIVE_API || 'https://remotive.com/api/remote-jobs?limit=15';
  try {
    const res = await fetch(remotiveUrl, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000)
    });

    if (res.ok) {
      const json = await res.json();
      const rawJobs = Array.isArray(json?.jobs) ? json.jobs.slice(0, 15) : [];
      const formatted = rawJobs.map((item) => {
        const title = item.title || 'Remote Engineer';
        const exp = inferExperienceLevel(title);
        const cat = inferCategory(title, item.tags || []);
        const salary = inferSalary(title, exp);
        const cleanDesc = stripHtml(item.description) || `Remote role at ${item.company_name}.`;
        const skills = Array.isArray(item.tags) && item.tags.length > 0
          ? item.tags.slice(0, 6)
          : ['Remote Work', 'Modern Tech Stack', 'Agile'];

        return {
          id: `ext-remotive-${item.id || Math.random().toString(36).substring(7)}`,
          title,
          company: item.company_name || 'Remote Tech Partner',
          logo: '🚀',
          category: cat,
          location: item.candidate_required_location || 'Worldwide (Remote)',
          type: item.job_type || 'Full-time',
          workplace_type: 'Remote',
          experience_level: exp,
          min_salary: salary.min,
          max_salary: salary.max,
          description: cleanDesc,
          responsibilities: JSON.stringify([
            `Deliver high-impact digital solutions as part of ${item.company_name}`,
            'Develop test-driven code and participate in async team communications',
            'Ensure reliability, accessibility, and high performance across distributed systems'
          ]),
          requirements: JSON.stringify(skills.map((s) => `Solid background in ${s}`)),
          skills: JSON.stringify(skills),
          perks: JSON.stringify(['100% Worldwide Remote', 'Flexible Work Schedule', 'Home Office Stipend']),
          featured: Math.random() > 0.7 ? 1 : 0,
          urgent: 0,
          applicants_count: Math.floor(Math.random() * 18) + 4,
          posted_by: 'external-api',
          source: 'external',
          external_url: item.url || 'https://remotive.com',
          created_at: item.publication_date || new Date().toISOString()
        };
      });

      if (formatted.length > 0) {
        runUpsert(formatted);
        results.remotiveCount = formatted.length;
      }
    }
  } catch (err) {
    results.errors.push(`Remotive API: ${err.message}`);
  }

  results.totalSynced = results.arbeitnowCount + results.remotiveCount;
  return results;
}
