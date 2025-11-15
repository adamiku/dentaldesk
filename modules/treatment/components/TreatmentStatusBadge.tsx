import { Badge } from "@/components/ui/badge";
import type { TreatmentStatus } from "../types";

interface TreatmentStatusBadgeProps {
  status?: TreatmentStatus;
}

export function TreatmentStatusBadge({ status }: TreatmentStatusBadgeProps) {
  return (
    <Badge className="mt-1 bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
      {status}
    </Badge>
  );
}
