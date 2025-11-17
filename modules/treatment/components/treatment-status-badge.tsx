import { Badge } from "@/components/ui/badge";
import { STATUS, type TreatmentStatus } from "../treatment-types";
import { useTranslations } from "next-intl";

interface TreatmentStatusBadgeProps {
  status?: TreatmentStatus;
}

export function TreatmentStatusBadge({ status }: TreatmentStatusBadgeProps) {
  const t = useTranslations("treatments");

  const statusObj = Object.values(STATUS).find((s) => s.value === status);
  const label = statusObj?.label ?? status ?? t("unknown");

  return (
    <Badge className="mt-1 bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
      {label}
    </Badge>
  );
}
