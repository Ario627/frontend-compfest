import { useMutation } from "@tanstack/react-query";
import { postRecommend } from "../api/recommend.api";
import { recommendResponseSchema } from "../schemas/recommend.schema";
import type { ApiError } from "../../../shared/api/api-client";
import type { RecommendationData, AppError } from "../types/slotting.types";
import { getDisplayMessage } from "../utils/error-messages";

interface UseRecommendMutationOptions {
  readonly onStartProcessing: (datasetId: string) => void;
  readonly onSuccess: (data: RecommendationData) => void;
  readonly onError: (error: AppError) => void;
}

export function useRecommendMutation(options: UseRecommendMutationOptions) {
  return useMutation({
    mutationFn: async (datasetId: string) => {
      options.onStartProcessing(datasetId);

      const response = await postRecommend(datasetId);
      const parsed = recommendResponseSchema.parse(response);

      return parsed.data;
    },
    onSuccess: (data) => {
      options.onSuccess(data);
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const appError: AppError = {
        code: apiError.code ?? "UNKNOWN",
        message: getDisplayMessage(apiError),
        statusCode: apiError.status,
        technicalDetail: apiError.message,
      };
      options.onError(appError);
    },
  });
}
