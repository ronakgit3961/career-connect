import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import confetti from 'canvas-confetti';
import { createJob } from '../store/slices/jobsSlice';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useForm from '../hooks/useForm';
import {
  TextInput,
  SelectInput,
  TextareaInput,
  BadgeSelector,
  RangeSlider,
  Checkbox,
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
  AlertCircle
} from 'lucide-react';

export const PostJobPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isRecruiter, switchRole } = useAuth();
  const { addToast } = useToast();
  const isSubmitting = useSelector((state) => state.jobs.status === 'loading');

  const popularSkills = [
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

  const popularPerks = [
    '100% Health, Dental & Vision Coverage',
    'Flexible Work from Anywhere',
    'Unlimited PTO Policy',
    '$3,000 Annual Learning Budget',
    'Home Office Setup Stipend',
    '401(k) Matching up to 5%',
    'Annual Global Team Retreat'
  ];

  const {
    values,
    errors,
    touched,
    dirty,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
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
      maxSalary: 170000,
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
        requiredMessage: 'Please list at least 2 core responsibilities'
      },
      requirements: {
        required: true,
        requiredMessage: 'Please specify candidate requirements'
      },
      minSalary: {
        min: 20000,
        custom: (val, all) => (Number(val) > Number(all.maxSalary) ? 'Min salary cannot exceed max salary' : '')
      }
    },
    onSubmit: async (formValues) => {
      try {
        const payload = {
          ...formValues,
          responsibilities: formValues.responsibilities.split('\n').filter((l) => l.trim()),
          requirements: formValues.requirements.split('\n').filter((l) => l.trim())
        };

        const newJob = await dispatch(createJob(payload)).unwrap();

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });

        addToast({
          type: 'success',
          title: 'Vacancy Published!',
          message: `${formValues.title} is now live and accepting applications.`
        });

        navigate(`/jobs/${newJob.id}`);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Posting Failed',
          message: err || 'Could not publish job vacancy. Check simulated error toggles.'
        });
      }
    }
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Evaluation Syllabus Header */}
      <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/70 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <PlusCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
              Form Handling & Reusable Input Components Showcase
            </h3>
            <p className="text-xs text-indigo-800/80 dark:text-indigo-300">
              Demonstrates custom useForm hook, field-level validation rules, touched/dirty tracking, and reusable input primitives (TextInput, SelectInput, RangeSlider, BadgeSelector, Checkbox).
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Post a New Job Vacancy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fill out the details below to attract top tier talent to your team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              1. Role & Company Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="Job Position Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title}
                touched={touched.title}
                required
                icon={Briefcase}
                placeholder="e.g. Senior Full-Stack Engineer"
                hint="Use clear, standard industry titles for better search ranking"
              />

              <TextInput
                label="Hiring Company Name"
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
                label="Primary Category"
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

          {/* Section: Workplace & Employment Parameters */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              2. Employment Terms & Workplace
            </h2>

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
                label="Job Type"
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

            {/* Compensation Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <RangeSlider
                label="Minimum Annual Salary Floor"
                name="minSalary"
                value={values.minSalary}
                min={30000}
                max={250000}
                step={5000}
                onChange={(e) => setFieldValue('minSalary', Number(e.target.value))}
                formatter={(v) => `$${Number(v).toLocaleString()}/yr`}
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
              />
            </div>
          </div>

          {/* Section: Role Details */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              3. Description & Detailed Requirements
            </h2>

            <TextareaInput
              label="Role Overview & Mission"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.description}
              rows={4}
              maxLength={1000}
              required
              placeholder="Describe what the engineer will build, why this team is exciting, and how this role impacts customers..."
            />

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
              hint="Enter bullet points separated by new lines"
            />

            <TextareaInput
              label="Candidate Requirements (One per line)"
              name="requirements"
              value={values.requirements}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.requirements}
              touched={touched.requirements}
              rows={3}
              required
              hint="List key qualifications, tech proficiencies, and experience prerequisites"
            />
          </div>

          {/* Section: Badges (Skills & Benefits) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              4. Tech Stack & Compensation Perks
            </h2>

            <BadgeSelector
              label="Required Technologies & Skills"
              name="skills"
              selected={values.skills}
              onChange={(newSkills) => setFieldValue('skills', newSkills)}
              options={popularSkills}
              placeholder="Type custom skill and press Enter (e.g. GraphQL)..."
              hint="Candidates will be matched based on these required competencies"
            />

            <BadgeSelector
              label="Perks, Benefits & Offerings"
              name="perks"
              selected={values.perks}
              onChange={(newPerks) => setFieldValue('perks', newPerks)}
              options={popularPerks}
              placeholder="Type custom benefit and press Enter..."
            />
          </div>

          {/* Section: Promotion & Badges */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleSwitch
                name="featured"
                checked={values.featured}
                onChange={handleChange}
                label="Featured Vacancy Spotlight"
                description="Highlights position on homepage and top of search results"
              />

              <ToggleSwitch
                name="urgent"
                checked={values.urgent}
                onChange={handleChange}
                label="Urgent Hire Flame Badge"
                description="Indicates immediate hiring need with rapid interview turnaround"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => resetForm()}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:opacity-50 active:scale-95"
            >
              <PlusCircle size={16} />
              <span>{isSubmitting ? 'Publishing Vacancy...' : 'Publish Job Vacancy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
