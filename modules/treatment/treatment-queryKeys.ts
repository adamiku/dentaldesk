import type { TreatmentFilters } from "./treatment-types";

export const TREATMENT_QUERY_KEYS = {
  all: ["treatments"] as const,
  lists: ["treatments", "list"] as const,
  list: (filters?: TreatmentFilters) =>
    [...TREATMENT_QUERY_KEYS.all, "list", filters] as const,
};
