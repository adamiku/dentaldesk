import { useQuery } from "@tanstack/react-query";
import { treatmentApis } from "./treatment-api";
import { TREATMENT_QUERY_KEYS } from "./treatment-queryKeys";

export function useTreatments() {
  return useQuery({
    queryKey: TREATMENT_QUERY_KEYS.all,
    queryFn: treatmentApis.fetchTreatments,
  });
}
