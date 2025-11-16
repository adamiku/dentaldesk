import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { treatmentApis } from "./treatment-api";
import { TREATMENT_QUERY_KEYS } from "./treatment-queryKeys";
import type { TreatmentFilters, TreatmentStatus } from "./treatment-types";

export function useTreatments(params?: TreatmentFilters) {
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

export function useUpdateTreatmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TreatmentStatus }) =>
      treatmentApis.updateTreatmentStatus(id, status),
    onSuccess: () => {
      // Invalidate all treatment list queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: TREATMENT_QUERY_KEYS.all });
    },
  });
}
