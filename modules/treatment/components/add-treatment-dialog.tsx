"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { ApiError } from "@/lib/apiClient";

import { useCreateTreatment } from "../treatment-hooks";
import {
  CreateTreatmentFormSchema,
  type CreateTreatmentForm,
} from "../treatment-types";

export function AddTreatmentDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateTreatment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTreatmentForm>({
    resolver: zodResolver(CreateTreatmentFormSchema),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: CreateTreatmentForm) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Treatment created successfully");
        reset();
        setOpen(false);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          toast.error(`Failed to create treatment: ${error.message}`);
        } else {
          toast.error("An unexpected error occurred");
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add treatment</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add treatment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient">Patient</Label>
              <Input
                id="patient"
                placeholder="Jane Doe"
                {...register("patient")}
              />
              {errors.patient && (
                <p className="text-sm text-destructive">
                  {errors.patient.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="procedure">Procedure</Label>
              <Input
                id="procedure"
                placeholder="Filling"
                {...register("procedure")}
              />
              {errors.procedure && (
                <p className="text-sm text-destructive">
                  {errors.procedure.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dentist">Dentist</Label>
              <Input
                id="dentist"
                placeholder="Dr. Smith"
                {...register("dentist")}
              />
              {errors.dentist && (
                <p className="text-sm text-destructive">
                  {errors.dentist.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* No error handling since it is optional */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any treatment notes"
                {...register("notes")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save treatment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
