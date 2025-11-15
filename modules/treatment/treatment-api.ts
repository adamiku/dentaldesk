import { apiClient } from "@/lib/apiClient";

import {
  TreatmentSchema,
  TreatmentsResponseSchema,
  type CreateTreatmentForm,
  type Treatment,
  type TreatmentsResponse,
} from "./treatment-types";

const treatmentApi = "/treatments";

async function fetchTreatments(): Promise<TreatmentsResponse> {
  const data = await apiClient.get(treatmentApi);
  return TreatmentsResponseSchema.parse(data);
}

async function createTreatment(
  formData: CreateTreatmentForm,
): Promise<Treatment> {
  const data = await apiClient.post(treatmentApi, formData);
  return TreatmentSchema.parse(data);
}

export const treatmentApis = {
  fetchTreatments,
  createTreatment,
};
