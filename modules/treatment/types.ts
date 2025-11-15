/**
 * Domain types for Treatment module
 */

export const STATUS = {
  SCHEDULED: { value: "scheduled", label: "Scheduled" },
  INPROGRESS: { value: "in_progress", label: "In Progress" },
  COMPLETED: { value: "completed", label: "Completed" },
  CANCELLED: { value: "cancelled", label: "Cancelled" },
} as const;

export type TreatmentStatus = (typeof STATUS)[keyof typeof STATUS]["value"];

export interface Treatment {
  id: number;
  patient: string;
  procedure: string;
  dentist: string;
  date: string;
  status?: TreatmentStatus;
  notes?: string;
  cost?: number;
}

export const FILTER_STATUS = {
  ...STATUS,
  ALL: { value: "all", label: "All" },
} as const;

export type TreatmentStatusFilter =
  (typeof FILTER_STATUS)[keyof typeof FILTER_STATUS]["value"];
