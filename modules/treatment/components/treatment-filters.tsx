import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "../constants";
import type { TreatmentStatusFilter } from "../types";

interface TreatmentFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: TreatmentStatusFilter;
  onStatusChange: (status: TreatmentStatusFilter) => void;
}

export function TreatmentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: TreatmentFiltersProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
      <Input
        placeholder="Search patients, procedures, dentists..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <Select
        value={status}
        onValueChange={(value) =>
          onStatusChange(value as TreatmentStatusFilter)
        }
      >
        <SelectTrigger className="md:w-[220px]">
          <SelectValue placeholder="Filter by status" />
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
