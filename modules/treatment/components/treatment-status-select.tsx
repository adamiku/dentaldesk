import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS, type TreatmentStatus } from "../types";

interface TreatmentStatusSelectProps {
  currentStatus?: TreatmentStatus;
}

export function TreatmentStatusSelect({
  currentStatus,
}: TreatmentStatusSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Update status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={currentStatus === STATUS.SCHEDULED.value}
        >
          {STATUS.SCHEDULED.label}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={currentStatus === STATUS.INPROGRESS.value}
        >
          {STATUS.INPROGRESS.label}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={currentStatus === STATUS.COMPLETED.value}
        >
          {STATUS.COMPLETED.label}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
