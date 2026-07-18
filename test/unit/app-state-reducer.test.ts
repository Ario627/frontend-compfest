import { describe, it, expect } from "vitest";
import {
  appStateReducer,
  initialAppState,
} from "../../src/features/store/app-state.reducer";
import type {
  AppState,
  RecommendationData,
} from "../../src/features/slotting/types/slotting.types";

const mockData: RecommendationData = {
  summary: { warehouse: "Test", total_orders: 10, total_items: 20 },
  slotting: { before: [], after: [] },
  picking_route: [],
  distance: { before: 100, after: 60, saved: 40, saving_percentage: 40 },
};

describe("appStateReducer", () => {
  it("returns initial state", () => {
    expect(initialAppState).toEqual({
      status: "idle",
      selectedDatasetId: null,
    });
  });

  describe("SELECT_DATASET", () => {
    it("selects dataset when idle", () => {
      const next = appStateReducer(initialAppState, {
        type: "SELECT_DATASET",
        id: "small",
      });
      expect(next).toEqual({ status: "idle", selectedDatasetId: "small" });
    });

    it("ignores when not idle", () => {
      const loading: AppState = {
        status: "loading",
        datasetId: "x",
        progressStep: 0,
      };
      const next = appStateReducer(loading, {
        type: "SELECT_DATASET",
        id: "small",
      });
      expect(next).toBe(loading);
    });
  });

  describe("DESELECT_DATASET", () => {
    it("clears selection when idle", () => {
      const state: AppState = { status: "idle", selectedDatasetId: "small" };
      const next = appStateReducer(state, { type: "DESELECT_DATASET" });
      expect(next).toEqual({ status: "idle", selectedDatasetId: null });
    });

    it("ignores when not idle", () => {
      const loading: AppState = {
        status: "loading",
        datasetId: "x",
        progressStep: 0,
      };
      const next = appStateReducer(loading, { type: "DESELECT_DATASET" });
      expect(next).toBe(loading);
    });
  });

  describe("START_PROCESSING", () => {
    it("transitions idle to loading", () => {
      const state: AppState = { status: "idle", selectedDatasetId: "small" };
      const next = appStateReducer(state, {
        type: "START_PROCESSING",
        datasetId: "small",
      });
      expect(next).toEqual({
        status: "loading",
        datasetId: "small",
        progressStep: 0,
      });
    });

    it("ignores when not idle", () => {
      const loading: AppState = {
        status: "loading",
        datasetId: "x",
        progressStep: 0,
      };
      const next = appStateReducer(loading, {
        type: "START_PROCESSING",
        datasetId: "y",
      });
      expect(next).toBe(loading);
    });
  });

  describe("PROGRESS_TICK", () => {
    it("updates progress step when loading", () => {
      const state: AppState = {
        status: "loading",
        datasetId: "small",
        progressStep: 0,
      };
      const next = appStateReducer(state, { type: "PROGRESS_TICK", step: 2 });
      expect(next).toEqual({
        status: "loading",
        datasetId: "small",
        progressStep: 2,
      });
    });

    it("ignores when not loading", () => {
      const next = appStateReducer(initialAppState, {
        type: "PROGRESS_TICK",
        step: 1,
      });
      expect(next).toBe(initialAppState);
    });
  });

  describe("PROCESSING_SUCCESS", () => {
    it("transitions loading to success", () => {
      const state: AppState = {
        status: "loading",
        datasetId: "small",
        progressStep: 3,
      };
      const next = appStateReducer(state, {
        type: "PROCESSING_SUCCESS",
        data: mockData,
      });
      expect(next).toEqual({ status: "success", data: mockData });
    });

    it("ignores when not loading", () => {
      const next = appStateReducer(initialAppState, {
        type: "PROCESSING_SUCCESS",
        data: mockData,
      });
      expect(next).toBe(initialAppState);
    });
  });

  describe("PROCESSING_ERROR", () => {
    it("transitions loading to error with lastDatasetId", () => {
      const state: AppState = {
        status: "loading",
        datasetId: "medium",
        progressStep: 1,
      };
      const error = { code: "TIMEOUT", message: "Timeout" };
      const next = appStateReducer(state, {
        type: "PROCESSING_ERROR",
        error,
      });
      expect(next).toEqual({
        status: "error",
        error,
        lastDatasetId: "medium",
      });
    });

    it("ignores when not loading", () => {
      const next = appStateReducer(initialAppState, {
        type: "PROCESSING_ERROR",
        error: { code: "X", message: "Y" },
      });
      expect(next).toBe(initialAppState);
    });
  });

  describe("RESET", () => {
    it("resets from success state to initial", () => {
      const successState: AppState = { status: "success", data: mockData };
      expect(appStateReducer(successState, { type: "RESET" })).toEqual(
        initialAppState,
      );
    });

    it("resets from error state to initial", () => {
      const errorState: AppState = {
        status: "error",
        error: { code: "X", message: "Y" },
      };
      expect(appStateReducer(errorState, { type: "RESET" })).toEqual(
        initialAppState,
      );
    });

    it("resets from loading state to initial", () => {
      const loadingState: AppState = {
        status: "loading",
        datasetId: "small",
        progressStep: 2,
      };
      expect(appStateReducer(loadingState, { type: "RESET" })).toEqual(
        initialAppState,
      );
    });
  });
});
