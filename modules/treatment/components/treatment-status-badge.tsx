import { Badge } from "@/components/ui/badge";
import { STATUS, type TreatmentStatus } from "../treatment-types";

interface TreatmentStatusBadgeProps {
  status?: TreatmentStatus;
}

export function TreatmentStatusBadge({ status }: TreatmentStatusBadgeProps) {
  const statusObj = Object.values(STATUS).find((s) => s.value === status);
  const label = statusObj?.label ?? status ?? "Unknown";

  return (
    <Badge className="mt-1 bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
      {label}
    </Badge>
  );
}
