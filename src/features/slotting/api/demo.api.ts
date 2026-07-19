import { apiClient } from "../../../shared/api/api-client";
import type { DatasetsResponse } from "../types/slotting.types";
import { datasetsResponseSchema } from "../schemas/demo.schema";

export async function fetchDemoDatasets() {
  const response = await apiClient.get<DatasetsResponse>("/demo/list");
  return datasetsResponseSchema.parse(response).datasets;
}