import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { mockApi } from '../../services/mockApi';
import { recordRequest } from './asyncStateSlice';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { dispatch, rejectWithValue }) => {
    const startTime = Date.now();
    try {
      const data = await mockApi.fetchJobs();
      dispatch(
        recordRequest({
          endpoint: 'GET /api/jobs',
          status: 'SUCCESS',
          duration: Date.now() - startTime
        })
      );
      return data;
    } catch (err) {
      dispatch(
        recordRequest({
          endpoint: 'GET /api/jobs',
          status: 'ERROR',
          duration: Date.now() - startTime,
          error: err.message
        })
      );
      return rejectWithValue(err.message || 'Failed to fetch jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { dispatch, rejectWithValue }) => {
    const startTime = Date.now();
    try {
      const newJob = await mockApi.createJob(jobData);
      dispatch(
        recordRequest({
          endpoint: 'POST /api/jobs',
          status: 'SUCCESS',
          duration: Date.now() - startTime
        })
      );
      return newJob;
    } catch (err) {
      dispatch(
        recordRequest({
          endpoint: 'POST /api/jobs',
          status: 'ERROR',
          duration: Date.now() - startTime,
          error: err.message
        })
      );
      return rejectWithValue(err.message || 'Failed to post vacancy');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, { dispatch, rejectWithValue }) => {
    const startTime = Date.now();
    try {
      const updatedJob = await mockApi.updateJob(id, jobData);
      dispatch(
        recordRequest({
          endpoint: `PUT /api/jobs/${id}`,
          status: 'SUCCESS',
          duration: Date.now() - startTime
        })
      );
      return updatedJob;
    } catch (err) {
      dispatch(
        recordRequest({
          endpoint: `PUT /api/jobs/${id}`,
          status: 'ERROR',
          duration: Date.now() - startTime,
          error: err.message
        })
      );
      return rejectWithValue(err.message || 'Failed to update vacancy');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { dispatch, rejectWithValue }) => {
    const startTime = Date.now();
    try {
      await mockApi.deleteJob(id);
      dispatch(
        recordRequest({
          endpoint: `DELETE /api/jobs/${id}`,
          status: 'SUCCESS',
          duration: Date.now() - startTime
        })
      );
      return id;
    } catch (err) {
      dispatch(
        recordRequest({
          endpoint: `DELETE /api/jobs/${id}`,
          status: 'ERROR',
          duration: Date.now() - startTime,
          error: err.message
        })
      );
      return rejectWithValue(err.message || 'Failed to delete vacancy');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filters: {
      search: '',
      category: 'All',
      workplaceType: 'All',
      experienceLevel: 'All',
      jobType: 'All',
      minSalary: 0
    },
    sortBy: 'newest', // 'newest' | 'salary-high' | 'salary-low' | 'applicants'
    selectedJob: null
  },
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },
    setWorkplaceFilter: (state, action) => {
      state.filters.workplaceType = action.payload;
    },
    setExperienceFilter: (state, action) => {
      state.filters.experienceLevel = action.payload;
    },
    setJobTypeFilter: (state, action) => {
      state.filters.jobType = action.payload;
    },
    setMinSalaryFilter: (state, action) => {
      state.filters.minSalary = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: 'All',
        workplaceType: 'All',
        experienceLevel: 'All',
        jobType: 'All',
        minSalary: 0
      };
      state.sortBy = 'newest';
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    incrementApplicantCount: (state, action) => {
      const job = state.items.find((j) => j.id === action.payload);
      if (job) {
        job.applicantsCount = (job.applicantsCount || 0) + 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchJobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load jobs';
      })
      // createJob
      .addCase(createJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // updateJob
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.items.findIndex((j) => j.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      // deleteJob
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload);
      });
  }
});

export const {
  setSearchFilter,
  setCategoryFilter,
  setWorkplaceFilter,
  setExperienceFilter,
  setJobTypeFilter,
  setMinSalaryFilter,
  resetFilters,
  setSortBy,
  setSelectedJob,
  incrementApplicantCount
} = jobsSlice.actions;

// Base input selectors for Reselect memoization
const selectJobsItems = (state) => state.jobs.items;
const selectJobsFilters = (state) => state.jobs.filters;
const selectJobsSortBy = (state) => state.jobs.sortBy;

/**
 * Reselect Memoized Selector (Redux Toolkit createSelector)
 * Prevents expensive array filtering/sorting recalculations when unrelated state updates.
 */
export const selectFilteredJobs = createSelector(
  [selectJobsItems, selectJobsFilters, selectJobsSortBy],
  (items, filters, sortBy) => {
    return items
      .filter((job) => {
        // Search text match
        if (filters.search) {
          const query = filters.search.toLowerCase();
          const matchesTitle = job.title.toLowerCase().includes(query);
          const matchesCompany = job.company.toLowerCase().includes(query);
          const matchesSkills = job.skills?.some((s) => s.toLowerCase().includes(query));
          if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
        }
        // Category match
        if (filters.category !== 'All' && job.category !== filters.category) {
          return false;
        }
        // Workplace match
        if (filters.workplaceType !== 'All' && job.workplaceType !== filters.workplaceType) {
          return false;
        }
        // Experience match
        if (filters.experienceLevel !== 'All' && job.experienceLevel !== filters.experienceLevel) {
          return false;
        }
        // Job Type match
        if (filters.jobType !== 'All' && job.type !== filters.jobType) {
          return false;
        }
        // Min salary filter
        if (filters.minSalary > 0 && job.maxSalary < filters.minSalary) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.postedAt) - new Date(a.postedAt);
        }
        if (sortBy === 'salary-high') {
          return b.maxSalary - a.maxSalary;
        }
        if (sortBy === 'salary-low') {
          return a.minSalary - b.minSalary;
        }
        if (sortBy === 'applicants') {
          return (b.applicantsCount || 0) - (a.applicantsCount || 0);
        }
        return 0;
      });
  }
);

export default jobsSlice.reducer;
