import type { AppState, AppAction } from "../slotting/types/slotting.types";

export const initialAppState: AppState = {
  status: "idle",
  selectedDatasetId: null,
};

export function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SELECT_DATASET":
      if (state.status !== "idle") return state;
      return { ...state, selectedDatasetId: action.id };

    case "DESELECT_DATASET":
      if (state.status !== "idle") return state;
      return { ...state, selectedDatasetId: null };

    case "START_PROCESSING":
      if (state.status !== "idle") return state;
      return {
        status: "loading",
        datasetId: action.datasetId,
        progressStep: 0,
      };

    case "PROGRESS_TICK":
      if (state.status !== "loading") return state;
      return { ...state, progressStep: action.step };

    case "PROCESSING_SUCCESS":
      if (state.status !== "loading") return state;
      return { status: "success", data: action.data };

    case "PROCESSING_ERROR":
      if (state.status !== "loading") return state;
      return {
        status: "error",
        error: action.error,
        lastDatasetId: state.datasetId,
      };

    case "RESET":
      return initialAppState;

    default:
      return state;
  }
}