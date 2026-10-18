import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchJobs } from './store/slices/jobsSlice';
import { fetchApplications } from './store/slices/applicationsSlice';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ToastContainer from './components/common/ToastContainer';

// Top-Level Pages
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CartPage from './pages/CartPage';
import DashboardPage from './pages/DashboardPage';
import PostJobPage from './pages/PostJobPage';
import ArchitectureGuidePage from './pages/ArchitectureGuidePage';
import NotFoundPage from './pages/NotFoundPage';

// Portfolio Mini-Project Sub-Components
import PortfolioLayout from './components/portfolio/PortfolioLayout';
import PortfolioOverview from './components/portfolio/PortfolioOverview';
import PortfolioProjects from './components/portfolio/PortfolioProjects';
import PortfolioExperience from './components/portfolio/PortfolioExperience';
import PortfolioSkills from './components/portfolio/PortfolioSkills';
import PortfolioResume from './components/portfolio/PortfolioResume';
import PortfolioContact from './components/portfolio/PortfolioContact';

export const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Initial data hydration
  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplications());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          {/* Mini-Project: Candidate Portfolio Site with Nested Sub-Routing */}
          <Route path="/portfolio" element={<PortfolioLayout />}>
            <Route index element={<PortfolioOverview />} />
            <Route path="projects" element={<PortfolioProjects />} />
            <Route path="experience" element={<PortfolioExperience />} />
            <Route path="skills" element={<PortfolioSkills />} />
            <Route path="resume" element={<PortfolioResume />} />
            <Route path="contact" element={<PortfolioContact />} />
          </Route>

          {/* Mini-Project: Application Basket (Shopping Cart) */}
          <Route path="/cart" element={<CartPage />} />

          {/* Mini-Project: Applicant & Recruiter Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Form Handling & Reusable Input Components Showcase */}
          <Route path="/post-job" element={<PostJobPage />} />

          {/* Interactive State Architecture & Syllabus Evaluation Guide */}
          <Route path="/architecture-guide" element={<ArchitectureGuidePage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
