import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddTreatmentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add treatment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add treatment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="patient">Patient</Label>
            <Input id="patient" name="patient" placeholder="Jane Doe" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="procedure">Procedure</Label>
            <Input id="procedure" name="procedure" placeholder="Filling" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dentist">Dentist</Label>
            <Input id="dentist" name="dentist" placeholder="Dr. Smith" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any treatment notes"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save treatment</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
