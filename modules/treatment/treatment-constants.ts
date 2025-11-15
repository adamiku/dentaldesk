import { FILTER_STATUS, type TreatmentStatusFilter } from "./treatment-types";

export const STATUS_OPTIONS: Array<{
  label: string;
  value: TreatmentStatusFilter;
}> = Object.values(FILTER_STATUS).map((status) => ({
  label: status.label,
  value: status.value,
}));
