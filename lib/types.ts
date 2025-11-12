export type TreatmentStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

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
