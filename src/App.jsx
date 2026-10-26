import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchJobs } from './store/slices/jobsSlice';
import { fetchApplications } from './store/slices/applicationsSlice';

// Common Core Components (Synchronous for instant shell rendering)
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ToastContainer from './components/common/ToastContainer';
import Breadcrumbs from './components/common/Breadcrumbs';
import ProtectedRoute from './components/common/ProtectedRoute';
import RouteLoadingFallback from './components/common/RouteLoadingFallback';

// Route-Level Code Splitting (React.lazy)
// Reduces initial JavaScript bundle size and demonstrates production SPA performance
const HomePage = lazy(() => import('./pages/HomePage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PostJobPage = lazy(() => import('./pages/PostJobPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Candidate Portfolio Sub-Components (Lazy-loaded chunks)
const PortfolioLayout = lazy(() => import('./components/portfolio/PortfolioLayout'));
const PortfolioOverview = lazy(() => import('./components/portfolio/PortfolioOverview'));
const PortfolioProjects = lazy(() => import('./components/portfolio/PortfolioProjects'));
const PortfolioExperience = lazy(() => import('./components/portfolio/PortfolioExperience'));
const PortfolioSkills = lazy(() => import('./components/portfolio/PortfolioSkills'));
const PortfolioResume = lazy(() => import('./components/portfolio/PortfolioResume'));
const PortfolioContact = lazy(() => import('./components/portfolio/PortfolioContact'));

export const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Scroll restoration on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Hydrate initial data into Redux store
  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplications());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* Candidate Portfolio with Nested Sub-Routing */}
            <Route path="/portfolio" element={<PortfolioLayout />}>
              <Route index element={<PortfolioOverview />} />
              <Route path="projects" element={<PortfolioProjects />} />
              <Route path="experience" element={<PortfolioExperience />} />
              <Route path="skills" element={<PortfolioSkills />} />
              <Route path="resume" element={<PortfolioResume />} />
              <Route path="contact" element={<PortfolioContact />} />
            </Route>

            {/* Application Basket (Job Cart) */}
            <Route path="/cart" element={<CartPage />} />

            {/* Applicant & Recruiter Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Role-Protected Route: Recruiter Post & Edit Vacancy Form */}
            <Route
              path="/post-job"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <PostJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-job/:id"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <PostJobPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
