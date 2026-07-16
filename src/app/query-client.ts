import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "../shared/api/api-client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const apiError = error as unknown as ApiError;
        if (
          apiError.status &&
          apiError.status >= 400 &&
          apiError.status < 500
        ) {
          return false;
        }
        if (
          apiError?.code === "NETWORK_ERROR" ||
          apiError?.code === "TIMEOUT"
        ) {
          return failureCount < 2;
        }

        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },

    mutations: {
        retry: false,
    },
  },
});