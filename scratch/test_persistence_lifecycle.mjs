import Database from 'better-sqlite3';
import app from '../server/index.js';

async function testPersistenceLifecycle() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  const results = {
    step1_creation: {},
    step2_reload_verification: {},
    step3_cleanup: {},
    verified: false
  };

  const testJobId = `audit-test-job-${Date.now()}`;
  const testUserId = 'user-seeker-1';
  let testAppId = null;

  try {
    // 1. Log in as recruiter to create job
    const recLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sarah.jenkins@talentpartners.io', password: 'password123' })
    });
    const { token: recruiterToken } = await recLoginRes.json();

    // 2. Log in as seeker to apply and bookmark
    const seekerLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.rivera@careerconnect.dev', password: 'password123' })
    });
    const { token: seekerToken } = await seekerLoginRes.json();

    // --- STEP 1: CREATE TEST ENTITIES ---
    // A. Create test job
    const createJobRes = await fetch(`${baseUrl}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recruiterToken}`
      },
      body: JSON.stringify({
        id: testJobId,
        title: 'Audit Persistence Test Role',
        company: 'Audit Corp',
        category: 'Engineering',
        location: 'Remote',
        description: 'Test job description to verify SQLite persistence across session reloads.'
      })
    });
    const jobData = await createJobRes.json();
    const createdJobActualId = jobData.job?.id;
    results.step1_creation.jobCreated = {
      status: createJobRes.status,
      id: createdJobActualId,
      title: jobData.job?.title
    };

    // B. Create test application
    const createAppRes = await fetch(`${baseUrl}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${seekerToken}`
      },
      body: JSON.stringify({
        jobId: createdJobActualId,
        jobTitle: 'Audit Persistence Test Role',
        company: 'Audit Corp',
        candidateName: 'Alex Rivera',
        candidateEmail: 'alex.rivera@careerconnect.dev',
        coverNote: 'Test application for persistence verification lifecycle.'
      })
    });
    const appData = await createAppRes.json();
    testAppId = appData.application?.id;
    results.step1_creation.applicationCreated = {
      status: createAppRes.status,
      id: testAppId,
      statusStage: appData.application?.status
    };

    // C. Create test bookmark
    const saveJobRes = await fetch(`${baseUrl}/saved-jobs/${createdJobActualId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    const saveData = await saveJobRes.json();
    results.step1_creation.bookmarkCreated = {
      status: saveJobRes.status,
      savedJobIds: saveData.savedJobIds
    };

    // --- STEP 2: RELOAD / SIMULATE FRESH SESSION ---
    // Read directly from a fresh SQLite Database handle to verify on-disk persistence
    const directDb = new Database('server/data/careerconnect.db');
    const persistedJob = directDb.prepare('SELECT id, title, company FROM jobs WHERE id = ?').get(createdJobActualId);
    const persistedApp = directDb.prepare('SELECT id, job_id, status FROM applications WHERE id = ?').get(testAppId);
    const persistedBookmark = directDb.prepare('SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?').get(testUserId, createdJobActualId);

    // Also verify via fresh HTTP GET requests
    const fetchJobRes = await fetch(`${baseUrl}/jobs/${createdJobActualId}`);
    const fetchAppRes = await fetch(`${baseUrl}/applications`, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });
    const fetchBookmarksRes = await fetch(`${baseUrl}/saved-jobs`, {
      headers: { Authorization: `Bearer ${seekerToken}` }
    });

    const reloadedJobJson = await fetchJobRes.json();
    const reloadedAppsJson = await fetchAppRes.json();
    const reloadedBookmarksJson = await fetchBookmarksRes.json();

    const appFoundInList = reloadedAppsJson.applications?.some((a) => a.id === testAppId);
    const bookmarkFoundInList = reloadedBookmarksJson.savedJobIds?.includes(createdJobActualId);

    results.step2_reload_verification = {
      diskJob: persistedJob,
      diskApp: persistedApp,
      diskBookmark: Boolean(persistedBookmark),
      apiJobMatches: reloadedJobJson.job?.id === createdJobActualId,
      apiAppFoundInSession: appFoundInList,
      apiBookmarkFoundInSession: bookmarkFoundInList
    };

    const allPersisted = Boolean(persistedJob) && Boolean(persistedApp) && Boolean(persistedBookmark) && appFoundInList && bookmarkFoundInList;

    // --- STEP 3: SAFE TARGETED CLEANUP ---
    // Only clean up the 3 test records created in this test
    const deleteBookmarkRes = await fetch(`${baseUrl}/saved-jobs/${createdJobActualId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${seekerToken}` }
    });

    // Delete application directly from SQLite
    directDb.prepare('DELETE FROM applications WHERE id = ?').run(testAppId);

    // Delete job via recruiter endpoint
    const deleteJobRes = await fetch(`${baseUrl}/jobs/${createdJobActualId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${recruiterToken}` }
    });

    // Verify cleanup in SQLite
    const remainingJob = directDb.prepare('SELECT id FROM jobs WHERE id = ?').get(createdJobActualId);
    const remainingApp = directDb.prepare('SELECT id FROM applications WHERE id = ?').get(testAppId);
    const remainingBookmark = directDb.prepare('SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?').get(testUserId, createdJobActualId);

    results.step3_cleanup = {
      testJobDeleted: !remainingJob,
      testAppDeleted: !remainingApp,
      testBookmarkDeleted: !remainingBookmark
    };

    directDb.close();

    results.verified = allPersisted && !remainingJob && !remainingApp && !remainingBookmark;
  } catch (err) {
    results.error = err.message;
  } finally {
    server.close();
  }

  console.log(JSON.stringify(results, null, 2));
}

testPersistenceLifecycle();
