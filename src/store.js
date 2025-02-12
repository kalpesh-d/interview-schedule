import { configureStore } from "@reduxjs/toolkit";
import interviewReducer from "./feature/interviewSlice";
import { STORAGE_KEY } from "./feature/interviewSlice";

const saveState = (state) => {
  try {
    // Remove UI state before saving
    const stateToSave = {
      ...state,
      ui: undefined,
    };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Error saving state:", err);
  }
};

const store = configureStore({
  reducer: {
    interviews: interviewReducer,
  },
});

store.subscribe(() => {
  saveState(store.getState().interviews);
});

export default store;
