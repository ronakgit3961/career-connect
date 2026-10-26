import { describe, it, expect } from 'vitest';
import { validateFieldRule } from '../useForm';

describe('validateFieldRule (Form Validation Strategies Engine)', () => {
  it('should validate required fields', () => {
    const rule = { required: true, requiredMessage: 'Name is mandatory' };
    expect(validateFieldRule(rule, '')).toBe('Name is mandatory');
    expect(validateFieldRule(rule, '   ')).toBe('Name is mandatory');
    expect(validateFieldRule(rule, 'Alex Rivera')).toBe('');
  });

  it('should validate minLength rules', () => {
    const rule = { minLength: 5 };
    expect(validateFieldRule(rule, 'abcd')).toBe('Minimum 5 characters required');
    expect(validateFieldRule(rule, 'abcde')).toBe('');
  });

  it('should validate email format with regex', () => {
    const rule = { email: true };
    expect(validateFieldRule(rule, 'invalid-email')).toBe('Please enter a valid email address');
    expect(validateFieldRule(rule, 'alex@')).toBe('Please enter a valid email address');
    expect(validateFieldRule(rule, 'alex@careerconnect.dev')).toBe('');
  });

  it('should validate phone numbers', () => {
    const rule = { phone: true };
    expect(validateFieldRule(rule, '123')).toBe(
      'Please enter a valid phone number (e.g. +1 555-123-4567)'
    );
    expect(validateFieldRule(rule, '+1 (555) 234-5678')).toBe('');
  });

  it('should validate URL format', () => {
    const rule = { url: true };
    expect(validateFieldRule(rule, 'not-a-url')).toBe(
      'Please enter a valid URL (e.g. https://example.com)'
    );
    expect(validateFieldRule(rule, 'https://github.com/alexrivera')).toBe('');
  });

  it('should validate minimum numeric thresholds', () => {
    const rule = { min: 50000 };
    expect(validateFieldRule(rule, 30000)).toBe('Must be at least 50000');
    expect(validateFieldRule(rule, 60000)).toBe('');
  });

  it('should execute custom validation functions with allValues context', () => {
    const rule = {
      custom: (val, all) => (Number(val) > Number(all.max) ? 'Min cannot exceed Max' : '')
    };
    expect(validateFieldRule(rule, 150000, { max: 100000 })).toBe('Min cannot exceed Max');
    expect(validateFieldRule(rule, 80000, { max: 100000 })).toBe('');
  });
});
