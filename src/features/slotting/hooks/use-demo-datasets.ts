import { useQuery } from "@tanstack/react-query";
import { fetchDemoDatasets } from "../api/demo.api";

export function useDemoDatasets() {
  return useQuery({
    queryKey: ["demo", "list"],
    queryFn: fetchDemoDatasets,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}