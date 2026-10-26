import { useState, useCallback } from 'react';

/**
 * Pure validation rule engine
 * Validates a single field against a declarative rule set.
 * Separated from React lifecycle for standalone unit testing and predictable reusability.
 */
export const validateFieldRule = (rules, value, allValues = {}) => {
  if (!rules) return '';

  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return rules.requiredMessage || 'This field is required';
  }

  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `Minimum ${rules.minLength} characters required`;
  }

  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `Maximum ${rules.maxLength} characters allowed`;
  }

  if (rules.email && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return 'Please enter a valid email address';
    }
  }

  if (rules.phone && typeof value === 'string' && value.trim()) {
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}$/;
    if (!phoneRegex.test(value.trim())) {
      return 'Please enter a valid phone number (e.g. +1 555-123-4567)';
    }
  }

  if (rules.url && typeof value === 'string' && value.trim()) {
    try {
      new URL(value);
    } catch {
      return 'Please enter a valid URL (e.g. https://example.com)';
    }
  }

  if (rules.min !== undefined && Number(value) < rules.min) {
    return `Must be at least ${rules.min}`;
  }

  if (rules.max !== undefined && Number(value) > rules.max) {
    return `Must be at most ${rules.max}`;
  }

  if (rules.custom && typeof rules.custom === 'function') {
    const customError = rules.custom(value, allValues);
    if (customError) return customError;
  }

  return '';
};

/**
 * Custom form validation hook
 * Demonstrates:
 * - Local form state management
 * - Touched and dirty tracking
 * - Real-time validation strategies (onBlur, onChange after touch)
 * - Declarative schema validation rules
 */
export const useForm = ({ initialValues = {}, validationRules = {}, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [dirty, setDirty] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFieldValue = useCallback(
    (name, value, allValues = values) => {
      return validateFieldRule(validationRules[name], value, allValues);
    },
    [validationRules, values]
  );

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => {
      const updated = { ...prev, [name]: fieldValue };
      // Real-time validation if field was touched
      if (touched[name]) {
        const error = validateFieldValue(name, fieldValue, updated);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      }
      return updated;
    });

    setDirty((prev) => ({ ...prev, [name]: true }));
  }, [touched, validateFieldValue]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => {
      const updated = { ...prev, [name]: value };
      if (touched[name]) {
        const error = validateFieldValue(name, value, updated);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      }
      return updated;
    });
    setDirty((prev) => ({ ...prev, [name]: true }));
  }, [touched, validateFieldValue]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateFieldValue(name, values[name], values);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [values, validateFieldValue]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateFieldValue(fieldName, values[fieldName], values);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Mark all validated fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched((prev) => ({ ...prev, ...allTouched }));

    return isValid;
  }, [validationRules, values, validateFieldValue]);

  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const isValid = validateAll();
    if (!isValid) return;

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values, { resetForm });
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validateAll, onSubmit, values]);

  const resetForm = useCallback((customValues = initialValues) => {
    setValues(customValues);
    setErrors({});
    setTouched({});
    setDirty({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    dirty,
    isSubmitting,
    handleChange,
    setFieldValue,
    handleBlur,
    validateAll,
    handleSubmit,
    resetForm
  };
};

export default useForm;
