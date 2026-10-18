import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { submitApplication } from '../../store/slices/applicationsSlice';
import useForm from '../../hooks/useForm';
import Modal from '../common/Modal';
import { TextInput, TextareaInput, FileUpload, Checkbox } from '../common/form';
import { Send, User, Mail, Phone, Globe, CheckCircle2, Building, DollarSign } from 'lucide-react';

export const ApplyModal = ({ isOpen, onClose, job }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isSubmitting = useSelector((state) => state.applications.submitting);

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
    resetForm
  } = useForm({
    initialValues: {
      fullName: user.name || '',
      email: user.email || '',
      phone: '+1 (555) 019-2834',
      portfolioUrl: 'https://alexrivera.dev',
      resume: user.resumeName || 'Alex_Rivera_Resume_2026.pdf',
      coverNote: `I am thrilled to apply for the ${job?.title || 'position'} at ${job?.company || 'your company'}. My experience in modern web architecture aligns directly with your technical requirements.`,
      agreeToTerms: true
    },
    validationRules: {
      fullName: {
        required: true,
        requiredMessage: 'Please enter your full legal name',
        minLength: 3
      },
      email: {
        required: true,
        requiredMessage: 'Email address is required for communication',
        email: true
      },
      phone: {
        required: true,
        requiredMessage: 'Contact phone number is required',
        phone: true
      },
      portfolioUrl: {
        url: true
      },
      resume: {
        required: true,
        requiredMessage: 'Please upload or select an ATS-compatible resume'
      },
      coverNote: {
        required: true,
        requiredMessage: 'Please include a brief personalized note to the hiring team',
        minLength: 20
      },
      agreeToTerms: {
        custom: (val) => (!val ? 'You must agree to the application sharing terms' : '')
      }
    },
    onSubmit: async (formValues) => {
      try {
        const payload = {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          candidateName: formValues.fullName,
          candidateEmail: formValues.email,
          phone: formValues.phone,
          portfolioUrl: formValues.portfolioUrl,
          resumeUrl: typeof formValues.resume === 'object' ? formValues.resume.name : formValues.resume,
          coverNote: formValues.coverNote
        };

        await dispatch(submitApplication(payload)).unwrap();

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        addToast({
          type: 'success',
          title: 'Application Dispatched!',
          message: `Your application for ${job.title} at ${job.company} has been received.`
        });

        onClose();
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Submission Failed',
          message: err || 'Could not submit your application. Check simulated errors in syllabus lab.'
        });
      }
    }
  });

  if (!job) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply to ${job.company}`}
      subtitle={`Position: ${job.title} • ${job.location} (${job.workplaceType})`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job summary header pill */}
        <div className="flex items-center justify-between rounded-2xl bg-indigo-50/70 p-3.5 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">{job.logo || '💼'}</span>
            <div>
              <p className="font-bold">{job.title}</p>
              <p className="text-[11px] opacity-80">{job.company} • {job.type}</p>
            </div>
          </div>
          <span className="font-bold bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-lg">
            ${(job.minSalary / 1000).toFixed(0)}k - ${(job.maxSalary / 1000).toFixed(0)}k
          </span>
        </div>

        {/* 2-column personal inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Full Name"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.fullName}
            touched={touched.fullName}
            required
            icon={User}
            placeholder="John Doe"
          />

          <TextInput
            label="Email Address"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            required
            icon={Mail}
            placeholder="john@example.com"
          />

          <TextInput
            label="Phone Number"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            touched={touched.phone}
            required
            icon={Phone}
            placeholder="+1 (555) 000-0000"
          />

          <TextInput
            label="Portfolio / GitHub URL"
            name="portfolioUrl"
            value={values.portfolioUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.portfolioUrl}
            touched={touched.portfolioUrl}
            icon={Globe}
            placeholder="https://yourportfolio.dev"
          />
        </div>

        {/* Resume upload */}
        <FileUpload
          label="ATS Resume (PDF / DOCX)"
          name="resume"
          value={values.resume}
          onChange={(e) => setFieldValue('resume', e.target.value)}
          error={errors.resume}
          touched={touched.resume}
          required
        />

        {/* Personalized Cover Note */}
        <TextareaInput
          label="Why are you a great match for this role?"
          name="coverNote"
          value={values.coverNote}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.coverNote}
          touched={touched.coverNote}
          rows={3}
          maxLength={500}
          required
          placeholder="Highlight relevant achievements, projects, or passions..."
        />

        {/* Terms agreement checkbox */}
        <div className="pt-1">
          <Checkbox
            name="agreeToTerms"
            checked={values.agreeToTerms}
            onChange={handleChange}
            label="I confirm the above information is accurate and authorize CareerConnect to share my profile with the hiring team."
          />
          {touched.agreeToTerms && errors.agreeToTerms && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.agreeToTerms}</p>
          )}
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:opacity-50 active:scale-95"
          >
            <Send size={14} />
            <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;
