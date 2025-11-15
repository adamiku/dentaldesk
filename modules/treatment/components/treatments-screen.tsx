"use client";

import { useEffect, useState } from "react";
import type { Treatment } from "../types";
import { FILTER_STATUS, type TreatmentStatusFilter } from "../types";
import { AddTreatmentDialog } from "./add-treatment-dialog";
import { TreatmentFilters } from "./treatment-filters";
import { TreatmentsList } from "./treatments-list";

export function TreatmentsScreen() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filtered, setFiltered] = useState<Treatment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TreatmentStatusFilter>(
    FILTER_STATUS.ALL.value,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const response = await fetch("/api/treatments");
      const data = await response.json();
      const items = data.data ?? [];

      setTreatments(items);
      setFiltered(items);
      setTotal(items.length);
      setIsLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    let next = [...treatments];

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
  }, [search, status, treatments]);

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
          />

          <AddTreatmentDialog />
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {total} treatments
        </div>
      </section>

      <TreatmentsList treatments={filtered} isLoading={isLoading} />
    </div>
  );
}
