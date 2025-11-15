import { Button } from "@/components/ui/button";
import type { Treatment } from "../treatment-types";
import { TreatmentCard } from "./treatment-card";
import { TreatmentCardSkeleton } from "./treatment-card-skeleton";

interface TreatmentsListProps {
  treatments: Treatment[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function TreatmentsList({
  treatments,
  isLoading,
  isError,
  refetch,
}: TreatmentsListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <TreatmentCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2 items-center rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Something went wrong
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  if (treatments.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        No treatments found
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
