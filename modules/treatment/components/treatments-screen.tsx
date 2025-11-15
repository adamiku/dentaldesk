"use client";

import { useEffect, useState } from "react";
import {
  FILTER_STATUS,
  type TreatmentStatusFilter,
  type Treatment,
} from "../treatment-types";
import { AddTreatmentDialog } from "./add-treatment-dialog";
import { TreatmentFilters } from "./treatment-filters";
import { TreatmentsList } from "./treatments-list";
import { useTreatments } from "../treatment-hooks";

export function TreatmentsScreen() {
  const [filtered, setFiltered] = useState<Treatment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TreatmentStatusFilter>(
    FILTER_STATUS.ALL.value,
  );

  const { data, isLoading, isError, refetch } = useTreatments();

  useEffect(() => {
    let next = [...(data?.data ?? [])];

    if (search.trim()) {
      const query = search.toLowerCase();
      next = next.filter((item) => {
        return (
          item.patient.toLowerCase().includes(query) ||
          item.procedure.toLowerCase().includes(query) ||
          item.dentist.toLowerCase().includes(query)
        );
      });
    }

    if (status !== FILTER_STATUS.ALL.value) {
      next = next.filter((item) => (item.status || "unknown") === status);
    }
    // eslint-disable-next-line
    setFiltered(next);
  }, [search, status, data?.data]);

  return (
    <div className="container mx-auto flex flex-col gap-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">DentalDesk</h1>
        <p className="text-sm text-muted-foreground">
          Track dental treatments and their status.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-lg border bg-card/40 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <TreatmentFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            disabled={isLoading}
          />

          <AddTreatmentDialog />
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {data?.total ?? 0} treatments
        </div>
      </section>

      <TreatmentsList
        treatments={filtered}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
      />
    </div>
  );
}
