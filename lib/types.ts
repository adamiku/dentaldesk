export type TreatmentStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

/**
 * Backend entity - matches API response structure
 * Used by: API routes, mock data layer
 * Characteristics: snake_case status, includes all BE fields (cost, etc.)
 */
export interface TreatmentBE {
  id: number;
  patient: string;
  procedure: string;
  dentist: string;
  date: string;
  status?: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  cost?: number;
}
