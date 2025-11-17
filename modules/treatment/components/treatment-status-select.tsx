import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS, type TreatmentStatus } from "../treatment-types";
import { useTranslations } from "next-intl";

interface TreatmentStatusSelectProps {
  treatmentId: number;
  currentStatus?: TreatmentStatus;
  onStatusChange: (treatmentId: number, newStatus: TreatmentStatus) => void;
  disabled?: boolean;
}

export function TreatmentStatusSelect({
  treatmentId,
  currentStatus,
  onStatusChange,
  disabled = false,
}: TreatmentStatusSelectProps) {
  const statusOptions = Object.values(STATUS);
  const t = useTranslations("treatments");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          {t("updateStatus")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("updateStatus")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((status) => (
          <DropdownMenuCheckboxItem
            key={status.value}
            checked={currentStatus === status.value}
            onCheckedChange={() => {
              if (currentStatus !== status.value) {
                onStatusChange(treatmentId, status.value);
              }
            }}
            disabled={disabled || currentStatus === status.value}
          >
            {status.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
