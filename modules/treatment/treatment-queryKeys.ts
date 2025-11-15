import type { TreatmentStatusFilter } from "./treatment-types";

interface TreatmentFilters {
  search?: string;
  status?: TreatmentStatusFilter;
}

export const TREATMENT_QUERY_KEYS = {
  all: ["treatments"] as const,
  list: (filters?: TreatmentFilters) =>
    [...TREATMENT_QUERY_KEYS.all, "list", filters] as const,
};
