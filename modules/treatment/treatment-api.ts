import { apiClient } from "@/lib/apiClient";

import {
  FE_TO_BE_STATUS,
  TreatmentSchema,
  TreatmentsResponseSchema,
  type CreateTreatmentForm,
  type Treatment,
  type TreatmentFilters,
  type TreatmentStatus,
  type TreatmentsResponse,
} from "./treatment-types";

const treatmentApi = "/treatments";

/**
 * Type guard to check if a TreatmentStatusFilter is a valid TreatmentStatus (excludes "all")
 */
function isTreatmentStatus(status: string): status is TreatmentStatus {
  return status !== "all";
}

async function fetchTreatments(
  params?: TreatmentFilters,
): Promise<TreatmentsResponse> {
  // Transform FE status to BE format (camelCase → snake_case)
  const backendParams = {
    search: params?.search,
    status:
      params?.status && isTreatmentStatus(params.status)
        ? FE_TO_BE_STATUS[params.status]
        : undefined,
    page: params?.page,
    pageSize: params?.pageSize,
  };

  const data = await apiClient.get(treatmentApi, {
    params: backendParams,
  });
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
