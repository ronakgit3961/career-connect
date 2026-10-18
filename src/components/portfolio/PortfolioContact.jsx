import React from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { TextInput, SelectInput, TextareaInput, Checkbox } from '../common/form';
import { Send, Mail, Building, User, DollarSign, MessageSquare, Briefcase } from 'lucide-react';

export const PortfolioContact = () => {
  const { user, isRecruiter } = useAuth();
  const { addToast } = useToast();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useForm({
    initialValues: {
      recruiterName: isRecruiter ? user.name : '',
      workEmail: isRecruiter ? user.email : '',
      companyName: isRecruiter ? (user.company || 'TechWave Talent') : '',
      roleOffered: 'Senior Frontend Engineer',
      jobType: 'Full-time',
      estimatedSalary: '$165,000 - $190,000',
      message: 'Hello Alex, we reviewed your candidate portfolio and were deeply impressed by your work on DevCollab and Nexus UI. We would love to discuss an engineering leadership role with our team.'
    },
    validationRules: {
      recruiterName: {
        required: true,
        requiredMessage: 'Please enter your name or recruiter title',
        minLength: 2
      },
      workEmail: {
        required: true,
        requiredMessage: 'Work email is required for interview scheduling',
        email: true
      },
      companyName: {
        required: true,
        requiredMessage: 'Company or agency name is required'
      },
      roleOffered: {
        required: true,
        requiredMessage: 'Please specify the target position'
      },
      message: {
        required: true,
        requiredMessage: 'Please provide a message or opportunity overview',
        minLength: 20
      }
    },
    onSubmit: async (formValues) => {
      // Simulate network dispatch
      await new Promise((r) => setTimeout(r, 600));

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      addToast({
        type: 'success',
        title: 'Interview Inquiry Dispatched!',
        message: `Your hiring inquiry from ${formValues.companyName} was forwarded directly to Alex Rivera.`
      });

      resetForm();
    }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <MessageSquare size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Alex Rivera for Opportunities
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct recruiter inquiry pipeline • Typical response within 24 hours
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Your Name / Title"
              name="recruiterName"
              value={values.recruiterName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.recruiterName}
              touched={touched.recruiterName}
              required
              icon={User}
              placeholder="Sarah Jenkins"
            />

            <TextInput
              label="Corporate Email"
              name="workEmail"
              type="email"
              value={values.workEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.workEmail}
              touched={touched.workEmail}
              required
              icon={Mail}
              placeholder="s.jenkins@company.com"
            />

            <TextInput
              label="Company Name"
              name="companyName"
              value={values.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.companyName}
              touched={touched.companyName}
              required
              icon={Building}
              placeholder="Acme Technologies"
            />

            <TextInput
              label="Role Title Offered"
              name="roleOffered"
              value={values.roleOffered}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.roleOffered}
              touched={touched.roleOffered}
              required
              icon={Briefcase}
              placeholder="Senior React Developer"
            />

            <SelectInput
              label="Engagement Type"
              name="jobType"
              value={values.jobType}
              onChange={handleChange}
              options={['Full-time', 'Contract / Freelance', 'Part-time', 'Advisory']}
            />

            <TextInput
              label="Target Compensation Range"
              name="estimatedSalary"
              value={values.estimatedSalary}
              onChange={handleChange}
              onBlur={handleBlur}
              icon={DollarSign}
              placeholder="$150,000 - $180,000"
            />
          </div>

          <TextareaInput
            label="Inquiry Message & Role Context"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.message}
            touched={touched.message}
            rows={4}
            maxLength={600}
            required
            placeholder="Share details about the position, tech stack, team culture..."
          />

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:opacity-50 active:scale-95"
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Dispatching Message...' : 'Send Direct Inquiry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioContact;
