import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockApi } from '../../services/mockApi';
import { recordRequest } from './asyncStateSlice';
import { clearCart, setLastCheckedOut } from './cartSlice';
import { incrementApplicantCount } from './jobsSlice';

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { dispatch, rejectWithValue }) => {
    const startTime = Date.now();
    try {
      const data = await mockApi.fetchApplications();
      dispatch(
        recordRequest({
          endpoint: 'GET /api/applications',
          status: 'SUCCESS',
          duration: Date.now() - startTime
        })
      );
      return data;
    } catch (err) {
      dispatch(
        recordRequest({
          endpoint: 'GET /api/applications',
          status: 'ERROR',
          duration: Date.now() - startTime,
          error: err.message
        })
      );
      return rejectWithValue(err.message || 'Failed to fetch applications');
    }
  }
);

export const submitApplication = createAsyncThunk(
  'applications/submitApplication',
  async (applicationData, { dispatch, rejectWithValue }) => {
    const startTime = Date.now();
    try {
      const result = await mockApi.applyToJob(applicationData);
      dispatch(incrementApplicantCount(applicationData.jobId));
      dispatch(
        recordRequest({
          endpoint: 'POST /api/applications',
          status: 'SUCCESS',
          duration: Date.now() - startTime
        })
      );
      return result;
    } catch (err) {
      dispatch(
        recordRequest({
          endpoint: 'POST /api/applications',
          status: 'ERROR',
          duration: Date.now() - startTime,
          error: err.message
        })
      );
      return rejectWithValue(err.message || 'Application submission failed');
    }
  }
);

export const batchApplyFromCart = createAsyncThunk(
  'applications/batchApplyFromCart',
  async ({ cartItems, candidateData }, { dispatch, rejectWithValue }) => {
    const startTime = Date.now();
    try {
      const newApps = await mockApi.batchApply(cartItems, candidateData);
      cartItems.forEach((c) => dispatch(incrementApplicantCount(c.jobId)));
      dispatch(setLastCheckedOut(newApps));
      dispatch(clearCart());
      dispatch(
        recordRequest({
          endpoint: 'POST /api/applications/batch',
          status: 'SUCCESS',
          duration: Date.now() - startTime
        })
      );
      return newApps;
    } catch (err) {
      dispatch(
        recordRequest({
          endpoint: 'POST /api/applications/batch',
          status: 'ERROR',
          duration: Date.now() - startTime,
          error: err.message
        })
      );
      return rejectWithValue(err.message || 'Batch application checkout failed');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ appId, newStatus }, { dispatch, rejectWithValue }) => {
    try {
      await mockApi.updateApplicationStatus(appId, newStatus);
      return { appId, newStatus };
    } catch (err) {
      return rejectWithValue(err.message || 'Status update failed');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    submitting: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchApplications
      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // submitApplication
      .addCase(submitApplication.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(submitApplication.rejected, (state) => {
        state.submitting = false;
      })
      // batchApplyFromCart
      .addCase(batchApplyFromCart.pending, (state) => {
        state.submitting = true;
      })
      .addCase(batchApplyFromCart.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(...action.payload);
      })
      .addCase(batchApplyFromCart.rejected, (state) => {
        state.submitting = false;
      })
      // updateApplicationStatus with Optimistic UI Update & Rollback support
      .addCase(updateApplicationStatus.pending, (state, action) => {
        // Optimistically apply new status immediately
        if (action.meta && action.meta.arg) {
          const { appId, newStatus } = action.meta.arg;
          const app = state.items.find((a) => a.id === appId);
          if (app) {
            app._previousStatus = app.status;
            app.status = newStatus;
          }
        }
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const { appId, newStatus } = action.payload;
        const app = state.items.find((a) => a.id === appId);
        if (app) {
          app.status = newStatus;
          delete app._previousStatus;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        // Rollback to previous status if network or transaction rejected
        if (action.meta && action.meta.arg) {
          const { appId } = action.meta.arg;
          const app = state.items.find((a) => a.id === appId);
          if (app && app._previousStatus) {
            app.status = app._previousStatus;
            delete app._previousStatus;
          }
        }
        state.error = action.payload || 'Failed to update status';
      });
  }
});

export default applicationsSlice.reducer;
