import { createSlice } from '@reduxjs/toolkit';
import { apiConfig } from '../../services/mockApi';

const asyncStateSlice = createSlice({
  name: 'asyncState',
  initialState: {
    latencyMs: 400,
    simulateError: false,
    errorMessage: 'Simulated 500 Network Error: Service temporarily unavailable',
    requestHistory: []
  },
  reducers: {
    setLatency: (state, action) => {
      state.latencyMs = action.payload;
      apiConfig.latencyMs = action.payload;
    },
    toggleSimulateError: (state) => {
      state.simulateError = !state.simulateError;
      apiConfig.shouldSimulateError = state.simulateError;
    },
    setSimulateError: (state, action) => {
      state.simulateError = action.payload;
      apiConfig.shouldSimulateError = action.payload;
    },
    recordRequest: (state, action) => {
      state.requestHistory.unshift({
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        endpoint: action.payload.endpoint,
        status: action.payload.status, // 'PENDING' | 'SUCCESS' | 'ERROR'
        duration: action.payload.duration || state.latencyMs,
        timestamp: new Date().toLocaleTimeString(),
        error: action.payload.error || null
      });
      if (state.requestHistory.length > 15) {
        state.requestHistory.pop();
      }
    },
    clearRequestHistory: (state) => {
      state.requestHistory = [];
    }
  }
});

export const {
  setLatency,
  toggleSimulateError,
  setSimulateError,
  recordRequest,
  clearRequestHistory
} = asyncStateSlice.actions;

export default asyncStateSlice.reducer;
