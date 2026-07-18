import { useReducer, useCallback } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/query-client";
import {
  appStateReducer,
  initialAppState,
} from "./features/store/app-state.reducer";
import { InputPage } from "./features/slotting/components/input/input-page";
import { LoadingState } from "./features/slotting/components/loading/loading-state";
import { ErrorState } from "./features/slotting/components/error/error-state";
import { ResultPage } from "./features/slotting/components/result/result-page";
import { useRecommendMutation } from "./features/slotting/hooks/use-recommend-mutation";
import type { AppError, RecommendationData } from "./features/slotting/types/slotting.types";
import type { AppState } from "./features/slotting/types/slotting.types";

function AppContent() {
  const [state, dispatch] = useReducer(appStateReducer, initialAppState);

  const handleStartProcessing = useCallback((datasetId: string) => {
    dispatch({ type: "START_PROCESSING", datasetId });
  }, []);

  const handleSuccess = useCallback(
    (data: RecommendationData) => {
      dispatch({ type: "PROCESSING_SUCCESS", data });
    },
    []
  );

  const handleError = useCallback(
    (error: AppError) => {
      dispatch({ type: "PROCESSING_ERROR", error });
    },
    []
  );

  const mutation = useRecommendMutation({
    onStartProcessing: handleStartProcessing,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleSelectDataset = (id: string) => {
    dispatch({ type: "SELECT_DATASET", id });
  };

  const handleSubmit = () => {
    if (state.status === "idle" && state.selectedDatasetId) {
      mutation.mutate(state.selectedDatasetId);
    }
  };

  const handleProgressTick = (step: number) => {
    dispatch({ type: "PROGRESS_TICK", step });
  };

  const handleCancel = () => {
    mutation.reset();
    dispatch({ type: "RESET" });
  };

  const handleRetry = () => {
    if (state.status === "error" && state.lastDatasetId) {
      mutation.mutate(state.lastDatasetId);
    }
  };

  const handleReset = () => {
    mutation.reset();
    dispatch({ type: "RESET" });
  };

  const handleNewBatch = () => {
    mutation.reset();
    dispatch({ type: "RESET" });
  };

  const renderState = (appState: AppState) => {
    switch (appState.status) {
      case "idle":
        return (
          <InputPage
            selectedDatasetId={appState.selectedDatasetId}
            onSelectDataset={handleSelectDataset}
            onSubmit={handleSubmit}
          />
        );
      case "loading":
        return (
          <LoadingState
            currentStep={appState.progressStep}
            onTick={handleProgressTick}
            onCancel={handleCancel}
          />
        );
      case "success":
        return <ResultPage data={appState.data} onNewBatch={handleNewBatch} />;
      case "error":
        return (
          <ErrorState
            error={appState.error}
            onRetry={handleRetry}
            onReset={handleReset}
          />
        );
    }
  };

  return renderState(state);
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
