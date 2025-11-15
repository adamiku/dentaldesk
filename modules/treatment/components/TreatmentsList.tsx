import type { Treatment } from "@/lib/types";
import { TreatmentCard } from "./TreatmentCard";

interface TreatmentsListProps {
  treatments: Treatment[];
  isLoading: boolean;
}

export function TreatmentsList({ treatments, isLoading }: TreatmentsListProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Loading treatments...
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {treatments.map((treatment) => (
        <TreatmentCard key={treatment.id} treatment={treatment} />
      ))}
    </div>
  );
}
