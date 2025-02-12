import { createSlice } from "@reduxjs/toolkit";

export const STORAGE_KEY = "interviewSchedulerState";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    // Ensure UI state is reset on load
    return {
      ...state,
      ui: {
        selectedDate: null,
        showScheduleModal: false,
        editInterview: null,
        notification: null,
      },
    };
  } catch (err) {
    console.error("Error loading state:", err);
    return undefined;
  }
};

const initialState = loadState() || {
  interviews: [],
  interviewers: [
    { id: 1, name: "John Doe", role: "Technical" },
    { id: 2, name: "Jane Smith", role: "HR" },
    { id: 3, name: "Mike Johnson", role: "Behavioral" },
  ],
  filters: {
    interviewer: "",
    candidate: "",
    dateRange: {
      start: null,
      end: null,
    },
  },
  ui: {
    selectedDate: null,
    showScheduleModal: false,
    editInterview: null,
    notification: null,
  },
};

const interviewSlice = createSlice({
  name: "interviews",
  initialState,
  reducers: {
    addInterview: (state, action) => {
      state.interviews.push(action.payload);
    },
    updateInterview: (state, action) => {
      const index = state.interviews.findIndex(
        (interview) => interview.id === action.payload.id
      );
      if (index !== -1) {
        state.interviews[index] = action.payload;
      }
    },
    deleteInterview: (state, action) => {
      state.interviews = state.interviews.filter(
        (interview) => interview.id !== action.payload
      );
    },
    setInterviewerFilter: (state, action) => {
      state.filters.interviewer = action.payload;
    },
    setCandidateFilter: (state, action) => {
      state.filters.candidate = action.payload;
    },
    setDateRangeFilter: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        interviewer: "",
        candidate: "",
        dateRange: {
          start: null,
          end: null,
        },
      };
    },
    // UI Actions
    setSelectedDate: (state, action) => {
      state.ui.selectedDate = action.payload;
    },
    setShowScheduleModal: (state, action) => {
      state.ui.showScheduleModal = action.payload;
    },
    setEditInterview: (state, action) => {
      state.ui.editInterview = action.payload;
    },
    setNotification: (state, action) => {
      state.ui.notification = action.payload;
    },
    clearNotification: (state) => {
      state.ui.notification = null;
    },
  },
});

export const {
  addInterview,
  updateInterview,
  deleteInterview,
  setInterviewerFilter,
  setCandidateFilter,
  setDateRangeFilter,
  clearFilters,
  setSelectedDate,
  setShowScheduleModal,
  setEditInterview,
  setNotification,
  clearNotification,
} = interviewSlice.actions;

export default interviewSlice.reducer;
