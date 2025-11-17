import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { Treatment, TreatmentStatus } from "../treatment-types";
import { useUpdateTreatmentStatus } from "../treatment-hooks";
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
  const updateStatusMutation = useUpdateTreatmentStatus();

  const handleStatusChange = (
    treatmentId: number,
    newStatus: TreatmentStatus,
  ) => {
    updateStatusMutation.mutate(
      { id: treatmentId, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Status updated successfully");
        },
        onError: () => {
          toast.error("Failed to update status. Please try again.");
        },
      },
    );
  };

  const isUpdating = (treatmentId: number) => {
    return (
      updateStatusMutation.isPending &&
      updateStatusMutation.variables?.id === treatmentId
    );
  };

  if (isLoading) {
    return (
      <div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        data-testid="treatments-loading"
      >
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
        <TreatmentCard
          key={treatment.id}
          treatment={treatment}
          onStatusChange={handleStatusChange}
          isUpdating={isUpdating(treatment.id)}
        />
      ))}
    </div>
  );
}
