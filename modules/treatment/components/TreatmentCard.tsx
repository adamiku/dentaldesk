import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Treatment } from "@/lib/types";
import { TreatmentStatusBadge } from "./TreatmentStatusBadge";
import { TreatmentStatusSelect } from "./TreatmentStatusSelect";

interface TreatmentCardProps {
  treatment: Treatment;
}

export function TreatmentCard({ treatment }: TreatmentCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{treatment.patient}</CardTitle>
        <CardDescription>{treatment.procedure}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs text-muted-foreground">Dentist</div>
          <div className="text-sm font-medium">{treatment.dentist}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Date</div>
          <div className="text-sm font-medium">{treatment.date}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Status</div>
          <TreatmentStatusBadge status={treatment.status} />
        </div>
        {treatment.notes ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {treatment.notes}
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        <TreatmentStatusSelect currentStatus={treatment.status} />
      </CardFooter>
    </Card>
  );
}
