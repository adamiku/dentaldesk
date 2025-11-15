import type { TreatmentStatus } from "@/lib/types";

export const STATUS_OPTIONS: Array<{
  label: string;
  value: TreatmentStatus | "all";
}> = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];
