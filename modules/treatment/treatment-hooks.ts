import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { treatmentApis } from "./treatment-api";
import { TREATMENT_QUERY_KEYS } from "./treatment-queryKeys";
import type {
  Treatment,
  TreatmentFilters,
  TreatmentStatus,
  TreatmentsResponse,
} from "./treatment-types";

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
    onMutate: async ({ id, status }) => {
      // Cancel outgoing list queries to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: TREATMENT_QUERY_KEYS.lists });

      // Snapshot previous list queries for rollback
      const previousData = queryClient.getQueriesData({
        queryKey: TREATMENT_QUERY_KEYS.lists,
      });

      // Optimistically update all list queries
      queryClient.setQueriesData(
        { queryKey: TREATMENT_QUERY_KEYS.lists },
        (old: TreatmentsResponse | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((treatment: Treatment) =>
              treatment.id === id ? { ...treatment, status } : treatment,
            ),
          };
        },
      );

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        for (const [queryKey, data] of context.previousData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TREATMENT_QUERY_KEYS.all });
    },
  });
}
