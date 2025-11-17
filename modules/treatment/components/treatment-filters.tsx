import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "../treatment-constants";
import type { TreatmentStatusFilter } from "../treatment-types";
import { useTranslations } from "next-intl";

interface TreatmentFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: TreatmentStatusFilter;
  onStatusChange: (status: TreatmentStatusFilter) => void;
  disabled?: boolean;
}

export function TreatmentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  disabled = false,
}: TreatmentFiltersProps) {
  const t = useTranslations("treatments");

  return (
    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
      <Input
        placeholder={t("search")}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        disabled={disabled}
      />

      <Select
        value={status}
        onValueChange={(value) =>
          onStatusChange(value as TreatmentStatusFilter)
        }
        disabled={disabled}
      >
        <SelectTrigger className="md:w-[220px]">
          <SelectValue placeholder={t("filterByStatus")} />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
