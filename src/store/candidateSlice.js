import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  currentCandidate: null,
  currentInterview: null,
  isLoading: false,
  error: null
};

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addCandidate: (state, action) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = action.payload;
      }
    },
    setCurrentCandidate: (state, action) => {
      state.currentCandidate = action.payload;
    },
    setCurrentInterview: (state, action) => {
      state.currentInterview = action.payload;
    },
    updateInterviewProgress: (state, action) => {
      if (state.currentInterview) {
        state.currentInterview = { ...state.currentInterview, ...action.payload };
      }
    },
    completeInterview: (state, action) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.interview = action.payload.interview;
        candidate.status = 'completed';
        candidate.completedAt = new Date().toISOString();
      }
      state.currentInterview = null;
    },
    clearCurrentSession: (state) => {
      state.currentCandidate = null;
      state.currentInterview = null;
    },
    pauseInterview: (state, action) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.status = 'paused';
        candidate.interview = action.payload.interview;
      }
      state.currentInterview = null;
    }
  }
});

export const {
  setLoading,
  setError,
  addCandidate,
  updateCandidate,
  setCurrentCandidate,
  setCurrentInterview,
  updateInterviewProgress,
  completeInterview,
  clearCurrentSession,
  pauseInterview
} = candidateSlice.actions;

export default candidateSlice.reducer;
