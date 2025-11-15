"use client";

import { parseAsString, useQueryState } from "nuqs";

import { useDebouncedQueryState } from "@/lib/hooks/use-debounced-query-state";

import {
  FILTER_STATUS,
  parseAsTreatmentStatusFilter,
  TREATMENT_QUERY_PARAMS,
} from "../treatment-types";
import { useTreatments } from "../treatment-hooks";
import { AddTreatmentDialog } from "./add-treatment-dialog";
import { TreatmentFilters } from "./treatment-filters";
import { TreatmentsList } from "./treatments-list";

export function TreatmentsScreen() {
  const [searchInput, setSearchInput, searchQuery] = useDebouncedQueryState(
    TREATMENT_QUERY_PARAMS.SEARCH,
    parseAsString.withDefault(""),
    400,
  );

  const [status, setStatus] = useQueryState(
    TREATMENT_QUERY_PARAMS.STATUS,
    parseAsTreatmentStatusFilter,
  );

  const { data, isLoading, isError, refetch } = useTreatments({
    search: searchQuery || undefined,
    status: status !== FILTER_STATUS.ALL.value ? status : undefined,
  });

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
            search={searchInput}
            onSearchChange={setSearchInput}
            status={status}
            onStatusChange={setStatus}
          />

          <AddTreatmentDialog />
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {data?.data.length ?? 0} of {data?.total ?? 0} treatments
        </div>
      </section>

      <TreatmentsList
        treatments={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
      />
    </div>
  );
}
