import { describe, it, expect } from 'vitest';
import jobsReducer, {
  setSearchFilter,
  setCategoryFilter,
  setWorkplaceFilter,
  setMinSalaryFilter,
  setSortBy,
  resetFilters,
  selectFilteredJobs
} from '../jobsSlice';

describe('jobsSlice & createSelector Reselect Memoization', () => {
  const sampleJobs = [
    {
      id: 'job-1',
      title: 'Senior React Developer',
      company: 'TechWave',
      category: 'Engineering',
      workplaceType: 'Remote',
      type: 'Full-time',
      experienceLevel: 'Senior',
      minSalary: 130000,
      maxSalary: 160000,
      postedAt: '2026-10-20T10:00:00Z',
      applicantsCount: 15,
      skills: ['React', 'TypeScript', 'Redux']
    },
    {
      id: 'job-2',
      title: 'UI/UX Product Designer',
      company: 'PixelCraft',
      category: 'Design',
      workplaceType: 'Hybrid',
      type: 'Full-time',
      experienceLevel: 'Mid-Level',
      minSalary: 90000,
      maxSalary: 120000,
      postedAt: '2026-10-22T10:00:00Z',
      applicantsCount: 25,
      skills: ['Figma', 'UI/UX']
    },
    {
      id: 'job-3',
      title: 'DevOps & Cloud Architect',
      company: 'CloudMatrix',
      category: 'DevOps',
      workplaceType: 'On-site',
      type: 'Contract',
      experienceLevel: 'Lead',
      minSalary: 150000,
      maxSalary: 200000,
      postedAt: '2026-10-18T10:00:00Z',
      applicantsCount: 8,
      skills: ['AWS', 'Kubernetes']
    }
  ];

  const createTestState = (filters = {}, sortBy = 'newest') => ({
    jobs: {
      items: sampleJobs,
      filters: {
        search: '',
        category: 'All',
        workplaceType: 'All',
        experienceLevel: 'All',
        jobType: 'All',
        minSalary: 0,
        ...filters
      },
      sortBy,
      status: 'succeeded',
      error: null
    }
  });

  it('should update filters in reducer correctly', () => {
    let state = jobsReducer(undefined, { type: 'unknown' });
    state = jobsReducer(state, setSearchFilter('React'));
    expect(state.filters.search).toBe('React');

    state = jobsReducer(state, setCategoryFilter('Engineering'));
    expect(state.filters.category).toBe('Engineering');

    state = jobsReducer(state, setWorkplaceFilter('Remote'));
    expect(state.filters.workplaceType).toBe('Remote');

    state = jobsReducer(state, setMinSalaryFilter(100000));
    expect(state.filters.minSalary).toBe(100000);

    state = jobsReducer(state, setSortBy('salary-high'));
    expect(state.sortBy).toBe('salary-high');

    state = jobsReducer(state, resetFilters());
    expect(state.filters.search).toBe('');
    expect(state.filters.category).toBe('All');
  });

  it('selectFilteredJobs: should filter by search keyword across title and skills', () => {
    const state = createTestState({ search: 'TypeScript' });
    const filtered = selectFilteredJobs(state);
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Senior React Developer');
  });

  it('selectFilteredJobs: should filter by category', () => {
    const state = createTestState({ category: 'Design' });
    const filtered = selectFilteredJobs(state);
    expect(filtered.length).toBe(1);
    expect(filtered[0].company).toBe('PixelCraft');
  });

  it('selectFilteredJobs: should filter by minimum salary floor', () => {
    const state = createTestState({ minSalary: 180000 });
    const filtered = selectFilteredJobs(state);
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('DevOps & Cloud Architect');
  });

  it('selectFilteredJobs: should sort by salary descending', () => {
    const state = createTestState({}, 'salary-high');
    const filtered = selectFilteredJobs(state);
    expect(filtered[0].maxSalary).toBe(200000); // DevOps
    expect(filtered[1].maxSalary).toBe(160000); // React
    expect(filtered[2].maxSalary).toBe(120000); // Design
  });

  it('selectFilteredJobs: should memoize results when state is identical', () => {
    const state = createTestState();
    const result1 = selectFilteredJobs(state);
    const result2 = selectFilteredJobs(state);
    // Reference equality guaranteed by Reselect memoization
    expect(result1).toBe(result2);
  });
});
