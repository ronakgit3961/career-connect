# CareerConnect 💼 | Next-Gen Job & Talent Portal

**CareerConnect** is a modern, high-performance job portal built with **HTML5, Tailwind CSS, JavaScript (ES6+), and React 18**. It connects job seekers with recruiters through an intuitive, streamlined platform: candidates can search, filter, and batch-apply for jobs, while recruiters can post vacancies, evaluate applicant pools, and manage recruitment status pipelines.

---

## 🎯 Evaluation Syllabus Mapping (Project Evaluation-I)

| Evaluation Topic | Key Concepts | Implementation in CareerConnect | File / Route Links |
| :--- | :--- | :--- | :--- |
| **1. Navigation Layout & Page Structure** | • Multi-page SPA design<br>• Dynamic routing<br>• Sub-routing & active tabs<br>• **Mini-project on a Portfolio site with routing** | • Top-level SPA navigation with sticky navbar, mobile drawer, breadcrumbs, and 404 handler.<br>• **Candidate Portfolio Mini-Project**: Dedicated candidate showcase with nested tabs: Overview, Projects, Timeline, Skills bars, ATS Resume Viewer, and direct recruiter contact form. | • [`App.jsx`](file:///Users/ronak/Documents/project/src/App.jsx)<br>• [`PortfolioLayout.jsx`](file:///Users/ronak/Documents/project/src/components/portfolio/PortfolioLayout.jsx)<br>• Route: `/portfolio/*` |
| **2. Context API & State Management** | • State architecture in React<br>• Global vs. Local state<br>• Redux Toolkit<br>• Context API<br>• Asynchronous state management<br>• Loading & error handling<br>• **Mini-project on Shopping Cart or Dashboard** | • **Hybrid State Architecture**:<br>  - **Context API**: `AuthContext` (dual-role persona switching: Seeker vs. Recruiter), `ThemeContext` (dark/light mode), `ToastContext` (alert dispatchers).<br>  - **Redux Toolkit**: `jobsSlice`, `cartSlice`, `applicationsSlice`, `asyncStateSlice`.<br>  - **Local State**: Form values, touched/dirty flags, modal visibility via `useState`.<br>• **Async State Simulation**: Thunks with configurable network latency (100ms - 2500ms), 500 error injection toggle, shimmer skeletons (`JobCardSkeleton`), and retry banners.<br>• **Mini-Project 1 (Shopping Cart)**: "Job Basket" (`/cart`) for multi-job selection, per-job tailored pitch notes, and batch application checkout.<br>• **Mini-Project 2 (Dashboard)**: `/dashboard` with candidate application lifecycle and recruiter Kanban pipeline mover. | • [`store/index.js`](file:///Users/ronak/Documents/project/src/store/index.js)<br>• [`cartSlice.js`](file:///Users/ronak/Documents/project/src/store/slices/cartSlice.js)<br>• [`CartPage.jsx`](file:///Users/ronak/Documents/project/src/pages/CartPage.jsx)<br>• [`DashboardPage.jsx`](file:///Users/ronak/Documents/project/src/pages/DashboardPage.jsx)<br>• [`ArchitectureGuidePage.jsx`](file:///Users/ronak/Documents/project/src/pages/ArchitectureGuidePage.jsx) |
| **3. Form Handling in React** | • Form validation strategies<br>• Reusable input components | • **Custom Hook**: `useForm.js` managing values, errors, touched/dirty tracking, and validation rules (required, minLength, email, phone, url, salary floor logic).<br>• **Reusable Components Library** (`src/components/common/form/`):<br>  - `FormField`: Accessible wrapper with label, tooltip, and error message.<br>  - `TextInput`: Prefix icons, clear buttons, validation borders.<br>  - `SelectInput`: Styled custom select dropdown.<br>  - `TextareaInput`: Dynamic character counters.<br>  - `BadgeSelector`: Multi-tag selection and custom tag creation.<br>  - `FileUpload`: Drag-and-drop resume upload with file size checks and progress bar.<br>  - `RangeSlider`: Salary floor and ceiling slider with formatted currency display.<br>  - `Checkbox` & `ToggleSwitch`: Custom styled toggles.<br>• **Production Forms**:<br>  - Recruiter Post Vacancy Form (`/post-job`)<br>  - Quick Application Modal (`ApplyModal.jsx`)<br>  - Candidate Portfolio Hiring Inquiry Form (`PortfolioContact.jsx`) | • [`useForm.js`](file:///Users/ronak/Documents/project/src/hooks/useForm.js)<br>• [`components/common/form/`](file:///Users/ronak/Documents/project/src/components/common/form/)<br>• [`PostJobPage.jsx`](file:///Users/ronak/Documents/project/src/pages/PostJobPage.jsx)<br>• [`ApplyModal.jsx`](file:///Users/ronak/Documents/project/src/components/jobs/ApplyModal.jsx) |

---

## 🚀 Key Features

1. **Dual-Persona Role Switching**:
   - One-click toggle between **Job Seeker** and **Recruiter** in the top navigation bar.
   - Tailored navigation links, application permissions, and recruiter candidate pipeline status changers.

2. **Job Explorer & Filtering Engine**:
   - Real-time search across job titles, tech stack, and hiring companies.
   - Category filter pills (Engineering, Design, DevOps, Product, AI/Data, Marketing).
   - Workplace type (Remote, Hybrid, On-site), Job type, Experience level, and Minimum Salary Floor slider.
   - Grid and List layout toggles with bookmarking and quick-apply modals.

3. **Application Basket (Shopping Cart Mini-Project)**:
   - Save target jobs to a central Job Basket (`/cart`).
   - Add customized cover notes and select tailored resumes per job.
   - One-click **Batch Checkout** that applies to all queued roles simultaneously with celebratory confetti and submission receipt generation.

4. **Candidate Career Portfolio (Routing Mini-Project)**:
   - Deep nested routing at `/portfolio`:
     - `/portfolio` (Overview & Bio)
     - `/portfolio/projects` (Interactive project cards, live demos, and architecture modals)
     - `/portfolio/experience` (Career milestones timeline)
     - `/portfolio/skills` (Visual proficiency meters with interactive endorsement buttons)
     - `/portfolio/resume` (ATS-compatible resume format with print and JSON export)
     - `/portfolio/contact` (Direct recruiter hiring inquiry form)

5. **Recruiter & Seeker Dashboard**:
   - Seeker view: Track application status (Applied, Under Review, Interviewing, Offered, Rejected) and manage bookmarked vacancies.
   - Recruiter view: Manage vacancy applicant pools and transition candidate status in real-time.

6. **Interactive State & Evaluation Lab**:
   - Dedicated page at `/architecture-guide` where evaluators can test network latency (100ms - 2500ms) with a live slider, inject simulated 500 network errors to verify error boundaries, and monitor real-time API dispatch logs.

---

## 🛠️ Technology Stack

- **Framework**: React 18.3 (Vite 6)
- **State Management**:
  - **Redux Toolkit** (Global job data, application cart, candidate pipelines, async state simulator)
  - **React Context API** (`AuthContext`, `ThemeContext`, `ToastContext`)
  - **React Local State** (`useState`, `useCallback`, `useMemo` for forms & UI controls)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with dark mode class support, custom scrollbars, and shimmer animations
- **Icons**: Lucide React
- **Delight & Animations**: Canvas Confetti, CSS keyframes

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Architecture

```
career-connect/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx                       # Entry point (Redux Provider, Contexts, Router)
    ├── App.jsx                        # Root SPA routes & layout
    ├── index.css                      # Tailwind base & shimmer animation classes
    ├── context/
    │   ├── AuthContext.jsx            # Dual persona (Seeker / Recruiter), bookmarks
    │   ├── ThemeContext.jsx           # Dark / light theme toggle
    │   └── ToastContext.jsx           # Animated notification alerts
    ├── store/
    │   ├── index.js                   # Redux store configuration
    │   └── slices/
    │       ├── jobsSlice.js           # Vacancies, filters, search, async thunks
    │       ├── cartSlice.js           # Job Basket / Shopping Cart mini-project
    │       ├── applicationsSlice.js   # Application pipeline & recruiter status
    │       └── asyncStateSlice.js     # Latency control & simulated error injection
    ├── services/
    │   ├── mockApi.js                 # Async service layer with localStorage & failure injection
    │   └── mockData.js                # Rich dataset of jobs, candidate profile, and projects
    ├── hooks/
    │   ├── useForm.js                 # Custom form hook with touched/dirty/schema validation
    │   └── useDebounce.js             # Debounce utility for search inputs
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx             # SPA header with role switcher & cart badge
    │   │   ├── Footer.jsx             # Footer with syllabus checklist
    │   │   ├── Modal.jsx              # Accessible modal dialog
    │   │   ├── ToastContainer.jsx     # Floating toast alert queue
    │   │   ├── LoadingSkeleton.jsx    # Shimmer skeleton states
    │   │   ├── ErrorBanner.jsx        # Retryable error display
    │   │   └── form/                  # Reusable form components
    │   │       ├── FormField.jsx
    │   │       ├── TextInput.jsx
    │   │       ├── TextareaInput.jsx
    │   │       ├── SelectInput.jsx
    │   │       ├── BadgeSelector.jsx
    │   │       ├── FileUpload.jsx
    │   │       ├── RangeSlider.jsx
    │   │       └── Checkbox.jsx
    │   ├── jobs/
    │   │   ├── JobCard.jsx            # Job card with quick-apply and cart toggles
    │   │   ├── JobFilters.jsx         # Search and multi-criteria filter bar
    │   │   └── ApplyModal.jsx         # Validated application modal
    │   └── portfolio/                 # Candidate Portfolio Mini-Project
    │       ├── PortfolioLayout.jsx    # Sub-route navigation tabs
    │       ├── PortfolioOverview.jsx
    │       ├── PortfolioProjects.jsx
    │       ├── PortfolioExperience.jsx
    │       ├── PortfolioSkills.jsx
    │       ├── PortfolioResume.jsx
    │       └── PortfolioContact.jsx
    └── pages/
        ├── HomePage.jsx               # Hero, search, spotlight hubs, featured jobs
        ├── JobsPage.jsx               # Job repository with filters and view toggles
        ├── JobDetailPage.jsx          # Full job specifications & application sidebar
        ├── CartPage.jsx               # Shopping Cart Mini-Project (Job Basket)
        ├── DashboardPage.jsx          # Dashboard Mini-Project (Dual Seeker/Recruiter)
        ├── PostJobPage.jsx            # Form validation & reusable input components
        ├── ArchitectureGuidePage.jsx  # Interactive State & Syllabus Lab
        └── NotFoundPage.jsx           # 404 handler
```
