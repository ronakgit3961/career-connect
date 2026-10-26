import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import confetti from 'canvas-confetti';
import { createJob, updateJob } from '../store/slices/jobsSlice';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import useForm from '../hooks/useForm';
import {
  TextInput,
  SelectInput,
  TextareaInput,
  BadgeSelector,
  RangeSlider,
  ToggleSwitch
} from '../components/common/form';
import {
  JOB_CATEGORIES,
  WORKPLACE_TYPES,
  EXPERIENCE_LEVELS,
  JOB_TYPES
} from '../services/mockData';
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  RotateCcw,
  Eye,
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'cc_job_posting_draft_v2';

const POPULAR_SKILLS = [
  'React',
  'Node.js',
  'TypeScript',
  'Redux',
  'Python',
  'Docker',
  'Kubernetes',
  'AWS',
  'Figma',
  'Tailwind CSS',
  'PostgreSQL'
];

const POPULAR_PERKS = [
  '100% Health, Dental & Vision Coverage',
  'Flexible Work from Anywhere',
  'Unlimited PTO Policy',
  '$3,000 Annual Learning Budget',
  'Home Office Setup Stipend',
  '401(k) Matching up to 5%',
  'Annual Global Team Retreat'
];

const STEPS = [
  { id: 1, title: 'Role & Company', desc: 'Title, employer & location' },
  { id: 2, title: 'Terms & Pay', desc: 'Workplace & salary bounds' },
  { id: 3, title: 'Requirements', desc: 'Description & skill badges' },
  { id: 4, title: 'Preview & Publish', desc: 'Review card & confirmation' }
];

export const PostJobPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isRecruiter } = useAuth();
  const { addToast } = useNotifications();
  const isSubmitting = useSelector((state) => state.jobs.status === 'loading');

  const [currentStep, setCurrentStep] = useState(1);
  const [hasDraft, setHasDraft] = useState(false);

  // Check if draft exists (only in create mode)
  useEffect(() => {
    if (isEditMode) return;
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (stored) setHasDraft(true);
    } catch {
      setHasDraft(false);
    }
  }, [isEditMode]);

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleBlur,
    validateAll,
    resetForm
  } = useForm({
    initialValues: {
      title: '',
      company: user.company || (isRecruiter ? 'Acme Tech' : 'TechNova Corp'),
      logo: '🚀',
      category: 'Engineering',
      location: 'San Francisco, CA',
      workplaceType: 'Remote',
      type: 'Full-time',
      experienceLevel: 'Senior',
      minSalary: 120000,
      maxSalary: 175000,
      description: '',
      responsibilities: 'Architect modular frontend features\nCollaborate with UX designers and backend engineers\nWrite automated tests and maintain design system',
      requirements: '3+ years production experience with React and TypeScript\nSolid grasp of asynchronous state management and caching\nStrong communication and pair-programming mindset',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      perks: ['Flexible Work from Anywhere', 'Unlimited PTO Policy'],
      featured: true,
      urgent: false
    },
    validationRules: {
      title: {
        required: true,
        requiredMessage: 'Position title is required',
        minLength: 5
      },
      company: {
        required: true,
        requiredMessage: 'Hiring company name is required'
      },
      location: {
        required: true,
        requiredMessage: 'Location or remote specification is required'
      },
      description: {
        required: true,
        requiredMessage: 'Role overview description is required',
        minLength: 30
      },
      responsibilities: {
        required: true,
        requiredMessage: 'Please list core responsibilities'
      },
      requirements: {
        required: true,
        requiredMessage: 'Please specify candidate requirements'
      },
      minSalary: {
        min: 20000,
        custom: (val, all) =>
          Number(val) > Number(all.maxSalary) ? 'Min salary cannot exceed max salary' : ''
      }
    }
  });

  // Load existing vacancy data when in edit mode (/edit-job/:id)
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    mockApi.fetchJobById(id)
      .then((existing) => {
        if (mounted && existing) {
          resetForm({
            title: existing.title || '',
            company: existing.company || '',
            logo: existing.logo || '🚀',
            category: existing.category || 'Engineering',
            location: existing.location || 'San Francisco, CA',
            workplaceType: existing.workplaceType || 'Remote',
            type: existing.type || 'Full-time',
            experienceLevel: existing.experienceLevel || 'Senior',
            minSalary: existing.minSalary || 120000,
            maxSalary: existing.maxSalary || 175000,
            description: existing.description || '',
            responsibilities: Array.isArray(existing.responsibilities)
              ? existing.responsibilities.join('\n')
              : (existing.responsibilities || ''),
            requirements: Array.isArray(existing.requirements)
              ? existing.requirements.join('\n')
              : (existing.requirements || ''),
            skills: Array.isArray(existing.skills) ? existing.skills : [],
            perks: Array.isArray(existing.perks) ? existing.perks : [],
            featured: Boolean(existing.featured),
            urgent: Boolean(existing.urgent)
          });
        }
      })
      .catch((err) => {
        if (mounted) {
          addToast({
            type: 'error',
            title: 'Load Failed',
            message: `Could not load job #${id} for editing.`
          });
        }
      });

    return () => { mounted = false; };
  }, [id]);

  // Step-Specific Validation Gate
  const validateStep = (stepNumber) => {
    if (stepNumber === 1) {
      const titleErr = !values.title || values.title.length < 5;
      const compErr = !values.company;
      const locErr = !values.location;
      if (titleErr || compErr || locErr) {
        validateAll();
        addToast({
          type: 'warning',
          title: 'Incomplete Step 1',
          message: 'Please complete all required fields in Step 1 before continuing.'
        });
        return false;
      }
      return true;
    }

    if (stepNumber === 2) {
      if (Number(values.minSalary) > Number(values.maxSalary)) {
        addToast({
          type: 'warning',
          title: 'Invalid Salary Bounds',
          message: 'Minimum salary floor cannot exceed maximum salary ceiling.'
        });
        return false;
      }
      return true;
    }

    if (stepNumber === 3) {
      if (!values.description || values.description.length < 30) {
        validateAll();
        addToast({
          type: 'warning',
          title: 'Description Too Brief',
          message: 'Please provide at least 30 characters for the role overview.'
        });
        return false;
      }
      if (values.skills.length === 0) {
        addToast({
          type: 'warning',
          title: 'Skills Required',
          message: 'Please select at least one required technology or skill.'
        });
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Draft persistence in localStorage
  const handleSaveDraft = () => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
      setHasDraft(true);
      addToast({
        type: 'success',
        title: 'Draft Saved',
        message: 'Your vacancy form draft has been stored locally.'
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Storage Error',
        message: 'Could not save draft to local storage.'
      });
    }
  };

  const handleRestoreDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        resetForm(parsed);
        addToast({
          type: 'info',
          title: 'Draft Restored',
          message: 'Restored your previously saved vacancy form data.'
        });
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Restore Failed',
        message: 'Could not restore draft from storage.'
      });
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      addToast({
        type: 'error',
        title: 'Validation Errors',
        message: 'Please correct highlighted errors across all steps before submitting.'
      });
      return;
    }

    try {
      const payload = {
        ...values,
        responsibilities: typeof values.responsibilities === 'string'
          ? values.responsibilities.split('\n').filter((l) => l.trim())
          : values.responsibilities,
        requirements: typeof values.requirements === 'string'
          ? values.requirements.split('\n').filter((l) => l.trim())
          : values.requirements
      };

      let targetJobId;

      if (isEditMode) {
        const updated = await dispatch(updateJob({ id, jobData: payload })).unwrap();
        targetJobId = updated?.id || id;
        addToast({
          type: 'success',
          title: 'Vacancy Updated!',
          message: `${values.title} updates have been saved to the database.`
        });
      } else {
        const newJob = await dispatch(createJob(payload)).unwrap();
        targetJobId = newJob.id;

        // Clear draft
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setHasDraft(false);

        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 }
        });

        addToast({
          type: 'success',
          title: 'Vacancy Published!',
          message: `${values.title} is now live and accepting applications.`
        });
      }

      navigate(`/jobs/${targetJobId}`);
    } catch (err) {
      addToast({
        type: 'error',
        title: isEditMode ? 'Update Failed' : 'Submission Failed',
        message: err || 'Could not save job vacancy. Please verify inputs and try again.'
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Vacancy Publisher Header */}
      <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/70 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                {isEditMode ? 'Edit Job Vacancy' : 'Create & Publish Job Vacancy'}
              </h3>
              <p className="text-xs text-indigo-800/80 dark:text-indigo-300">
                {isEditMode
                  ? 'Update compensation, requirements, and role expectations stored in the live database.'
                  : 'Multi-step vacancy publisher with automatic validation, draft persistence, and candidate dispatch.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 transition"
              title="Save current progress to localStorage"
            >
              <Save size={13} />
              <span>Save Draft</span>
            </button>
            {hasDraft && (
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition"
                title="Restore previous draft"
              >
                <RotateCcw size={13} />
                <span>Restore Draft</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Step Stepper Progress Bar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                onClick={() => {
                  // Allow jumping back to earlier steps or to next step if validated
                  if (step.id < currentStep) {
                    setCurrentStep(step.id);
                  } else if (step.id === currentStep + 1 && validateStep(currentStep)) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-sm'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                    : 'border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 opacity-60'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {step.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Linear progress indicator */}
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Container */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleFinalSubmit} noValidate>
          {/* STEP 1: Role Overview & Company */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 1 of 4
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Role Title & Company Basics
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify the target job title, hiring entity, industry sector, and job location.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Position Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.title}
                  touched={touched.title}
                  required
                  icon={Briefcase}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  hint="Standard engineering titles improve candidate search match"
                />

                <TextInput
                  label="Company Name"
                  name="company"
                  value={values.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.company}
                  touched={touched.company}
                  required
                  icon={Building}
                  placeholder="e.g. StripeWave Technologies"
                />

                <SelectInput
                  label="Category / Discipline"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  options={JOB_CATEGORIES.filter((c) => c !== 'All')}
                  required
                />

                <TextInput
                  label="Location / Headquarters"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.location}
                  touched={touched.location}
                  required
                  icon={MapPin}
                  placeholder="e.g. San Francisco, CA or Remote"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Workplace & Compensation Parameters */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 2 of 4
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Employment Terms & Compensation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define workplace mode, contract type, seniority tier, and salary brackets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectInput
                  label="Workplace Mode"
                  name="workplaceType"
                  value={values.workplaceType}
                  onChange={handleChange}
                  options={WORKPLACE_TYPES.filter((w) => w !== 'All')}
                  required
                />

                <SelectInput
                  label="Employment Type"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  options={JOB_TYPES.filter((j) => j !== 'All')}
                  required
                />

                <SelectInput
                  label="Experience Level"
                  name="experienceLevel"
                  value={values.experienceLevel}
                  onChange={handleChange}
                  options={EXPERIENCE_LEVELS.filter((e) => e !== 'All')}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <RangeSlider
                  label="Minimum Annual Salary Floor"
                  name="minSalary"
                  value={values.minSalary}
                  min={30000}
                  max={250000}
                  step={5000}
                  onChange={(e) => setFieldValue('minSalary', Number(e.target.value))}
                  formatter={(v) => `$${Number(v).toLocaleString()}/yr`}
                  hint="Base compensation guarantee"
                />

                <RangeSlider
                  label="Maximum Annual Salary Ceiling"
                  name="maxSalary"
                  value={values.maxSalary}
                  min={40000}
                  max={300000}
                  step={5000}
                  onChange={(e) => setFieldValue('maxSalary', Number(e.target.value))}
                  formatter={(v) => `$${Number(v).toLocaleString()}/yr`}
                  hint="Upper bound of the role budget"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Description, Skills & Benefits */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 3 of 4
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Description, Responsibilities & Skills
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  List qualifications, expectations, and select candidate competency tags.
                </p>
              </div>

              <TextareaInput
                label="Role Overview & Mission"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description}
                touched={touched.description}
                rows={4}
                maxLength={800}
                required
                placeholder="Describe what the team is building, engineering goals, and candidate expectations..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextareaInput
                  label="Core Responsibilities (One per line)"
                  name="responsibilities"
                  value={values.responsibilities}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.responsibilities}
                  touched={touched.responsibilities}
                  rows={3}
                  required
                />

                <TextareaInput
                  label="Candidate Prerequisites (One per line)"
                  name="requirements"
                  value={values.requirements}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.requirements}
                  touched={touched.requirements}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-4 pt-2">
                <BadgeSelector
                  label="Required Skills & Competencies"
                  name="skills"
                  selected={values.skills}
                  onChange={(skills) => setFieldValue('skills', skills)}
                  options={POPULAR_SKILLS}
                  placeholder="Type custom skill and press Enter (e.g. GraphQL)..."
                  hint="Candidates match against these tags in search queries"
                />

                <BadgeSelector
                  label="Perks & Company Offerings"
                  name="perks"
                  selected={values.perks}
                  onChange={(perks) => setFieldValue('perks', perks)}
                  options={POPULAR_PERKS}
                  placeholder="Type custom benefit and press Enter..."
                />
              </div>
            </div>
          )}

          {/* STEP 4: Review, Live Card Preview & Publishing */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Step 4 of 4
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Review & Publish Vacancy
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm your vacancy parameters and review how your card will render to candidates.
                </p>
              </div>

              {/* Promotion Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <ToggleSwitch
                  name="featured"
                  checked={values.featured}
                  onChange={handleChange}
                  label="Featured Spotlight"
                  description="Pins vacancy to homepage & top of search rankings"
                />

                <ToggleSwitch
                  name="urgent"
                  checked={values.urgent}
                  onChange={handleChange}
                  label="Urgent Hire Badge"
                  description="Adds urgency indicator and fast-track review"
                />
              </div>

              {/* Live Preview Card */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Eye size={15} className="text-indigo-600" />
                  <span>Applicant View Preview:</span>
                </div>

                <div className="rounded-3xl border border-indigo-200 bg-white p-6 shadow-md dark:border-indigo-900/50 dark:bg-slate-900">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl shadow-inner dark:bg-slate-800">
                        {values.logo || '🚀'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {values.title || 'Untitled Position'}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500">
                          {values.company} • {values.location} ({values.workplaceType})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {values.featured && (
                        <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          Featured
                        </span>
                      )}
                      {values.urgent && (
                        <span className="rounded-lg bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium dark:bg-slate-800">
                      {values.type} • {values.experienceLevel}
                    </span>
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      ${(values.minSalary / 1000).toFixed(0)}k - ${(values.maxSalary / 1000).toFixed(0)}k / yr
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {values.description || 'No description provided.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {values.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                <ArrowLeft size={14} />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition active:scale-95"
                >
                  <span>Continue to Step {currentStep + 1}</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition disabled:opacity-50 active:scale-95"
                >
                  <PlusCircle size={16} />
                  <span>{isSubmitting ? 'Publishing Vacancy...' : 'Publish Job Vacancy'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
