import { apiClient } from "@/lib/apiClient";

import {
  TreatmentsResponseSchema,
  type TreatmentsResponse,
} from "./treatment-types";

const treatmentApi = "/treatments";

async function fetchTreatments(): Promise<TreatmentsResponse> {
  const data = await apiClient.get(treatmentApi);
  return TreatmentsResponseSchema.parse(data);
}

export const treatmentApis = {
  fetchTreatments,
};
