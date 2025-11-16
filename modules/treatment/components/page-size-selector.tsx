import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PAGE_SIZE_OPTIONS } from "../treatment-types";

interface PageSizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function PageSizeSelector({
  value,
  onChange,
  disabled = false,
}: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Items per page:</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
        disabled={disabled}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
