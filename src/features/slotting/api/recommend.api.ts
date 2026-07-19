import { apiClient } from "../../../shared/api/api-client";
import type {
  RecommendRequest,
  RecommendResponse,
} from "../types/slotting.types";
import { MOCK_RECOMMEND_RESPONSE } from "../mocs/mock-recommend-response";

export async function postRecommend(
  datasetId: string,
): Promise<RecommendResponse> {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return MOCK_RECOMMEND_RESPONSE;
  }

  const request: RecommendRequest = { dataset: datasetId };
  return apiClient.post<RecommendResponse>("/recommend", request);
}