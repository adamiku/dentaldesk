import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Treatment, TreatmentStatus } from "../treatment-types";
import { TreatmentStatusBadge } from "./treatment-status-badge";
import { TreatmentStatusSelect } from "./treatment-status-select";
import { useTranslations } from "next-intl";

interface TreatmentCardProps {
  treatment: Treatment;
  onStatusChange: (treatmentId: number, newStatus: TreatmentStatus) => void;
  isUpdating: boolean;
}

export function TreatmentCard({
  treatment,
  onStatusChange,
  isUpdating,
}: TreatmentCardProps) {
  const t = useTranslations("treatments");

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{treatment.patient}</CardTitle>
        <CardDescription>{treatment.procedure}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs text-muted-foreground">{t("dentist")}</div>
          <div className="text-sm font-medium">{treatment.dentist}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{t("date")}</div>
          <div className="text-sm font-medium">{treatment.date}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{t("status")}</div>
          <TreatmentStatusBadge status={treatment.status} />
        </div>
        {treatment.notes ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {treatment.notes}
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        <TreatmentStatusSelect
          treatmentId={treatment.id}
          currentStatus={treatment.status}
          onStatusChange={onStatusChange}
          disabled={isUpdating}
        />
      </CardFooter>
    </Card>
  );
}
