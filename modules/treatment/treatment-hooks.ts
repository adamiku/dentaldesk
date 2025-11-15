import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { treatmentApis } from "./treatment-api";
import { TREATMENT_QUERY_KEYS } from "./treatment-queryKeys";
import type { TreatmentStatusFilter } from "./treatment-types";

interface UseTreatmentsParams {
  search?: string;
  status?: TreatmentStatusFilter;
}

export function useTreatments(params?: UseTreatmentsParams) {
  return useQuery({
    queryKey: TREATMENT_QUERY_KEYS.list(params),
    queryFn: () => treatmentApis.fetchTreatments(params),
  });
}

export function useCreateTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: treatmentApis.createTreatment,
    onSuccess: () => {
      // Invalidate all treatment list queries (with any filter combination)
      queryClient.invalidateQueries({ queryKey: TREATMENT_QUERY_KEYS.all });
    },
  });
}
