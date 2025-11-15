import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TreatmentStatus } from "@/lib/types";

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
				<DropdownMenuCheckboxItem checked={currentStatus === "scheduled"}>
					Scheduled
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem checked={currentStatus === "in_progress"}>
					In Progress
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem checked={currentStatus === "completed"}>
					Completed
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
