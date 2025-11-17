import type { TreatmentBE } from "@/lib/types";
import type { Treatment } from "@/modules/treatment/treatment-types";

interface BackendTreatmentsResponse {
  data: TreatmentBE[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const AssetGenerator = {
  getMockTreatment(overrides?: Partial<Treatment>): Treatment {
    return {
      id: 1,
      patient: "John Doe",
      procedure: "Cleaning",
      dentist: "Dr. Smith",
      date: "2025-11-17",
      status: "scheduled",
      notes: "Regular checkup",
      ...overrides,
    };
  },

  getMockTreatments(overrides?: Partial<Treatment>): Treatment[] {
    return [
      this.getMockTreatment(overrides),
      this.getMockTreatment({
        id: 2,
        patient: "Jane Smith",
        procedure: "Filling",
        dentist: "Dr. Jones",
        date: "2025-11-18",
        status: "inProgress",
        notes: "Cavity treatment",
      }),
      this.getMockTreatment({
        id: 3,
        patient: "Bob Wilson",
        procedure: "Root Canal",
        dentist: "Dr. Brown",
        date: "2025-11-19",
        status: "completed",
        notes: "Follow-up needed",
      }),
    ];
  },

  getMockBackendTreatment(overrides?: Partial<TreatmentBE>): TreatmentBE {
    return {
      id: 1,
      patient: "John Doe",
      procedure: "Cleaning",
      dentist: "Dr. Smith",
      date: "2025-11-17",
      status: "scheduled",
      notes: "Regular checkup",
      ...overrides,
    };
  },

  getMockBackendTreatments(overrides?: Partial<TreatmentBE>): TreatmentBE[] {
    return [
      this.getMockBackendTreatment(overrides),
      this.getMockBackendTreatment({
        id: 2,
        patient: "Jane Smith",
        procedure: "Filling",
        dentist: "Dr. Jones",
        date: "2025-11-18",
        status: "in_progress",
        notes: "Cavity treatment",
        cost: 100,
      }),
      this.getMockBackendTreatment({
        id: 3,
        patient: "Bob Wilson",
        procedure: "Root Canal",
        dentist: "Dr. Brown",
        date: "2025-11-19",
        status: "completed",
        notes: "Follow-up needed",
        cost: 100,
      }),
    ];
  },

  getMockTreatmentsResponse(
    overrides?: Partial<BackendTreatmentsResponse>,
  ): BackendTreatmentsResponse {
    const treatments = this.getMockBackendTreatments();
    return {
      data: treatments,
      total: treatments.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      ...overrides,
    };
  },
};
