"use client";

import { useEffect } from "react";
import { parseAsString, useQueryState } from "nuqs";

import { useDebouncedQueryState } from "@/lib/hooks/use-debounced-query-state";

import {
  FILTER_STATUS,
  parseAsPage,
  parseAsPageSize,
  parseAsTreatmentStatusFilter,
  TREATMENT_QUERY_PARAMS,
} from "../treatment-types";
import { useTreatments } from "../treatment-hooks";
import { AddTreatmentDialog } from "./add-treatment-dialog";
import { PageSizeSelector } from "./page-size-selector";
import { TreatmentFilters } from "./treatment-filters";
import { TreatmentsList } from "./treatments-list";
import { TreatmentsPagination } from "./treatments-pagination";

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

  const [page, setPage] = useQueryState(
    TREATMENT_QUERY_PARAMS.PAGE,
    parseAsPage,
  );

  const [pageSize, setPageSize] = useQueryState(
    TREATMENT_QUERY_PARAMS.PAGE_SIZE,
    parseAsPageSize,
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, status]);

  const { data, isLoading, isError, refetch } = useTreatments({
    search: searchQuery || undefined,
    status: status !== FILTER_STATUS.ALL.value ? status : undefined,
    page,
    pageSize,
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

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {data && data.total > 0 ? (
              <>
                Showing {(data.page - 1) * data.pageSize + 1}-
                {Math.min(data.page * data.pageSize, data.total)} of{" "}
                {data.total} treatments
              </>
            ) : (
              "No treatments found"
            )}
          </div>

          <PageSizeSelector
            value={pageSize}
            onChange={setPageSize}
            disabled={isLoading}
          />
        </div>
      </section>

      <TreatmentsList
        treatments={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
      />

      {data && data.totalPages > 1 && (
        <TreatmentsPagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
          disabled={isLoading}
        />
      )}
    </div>
  );
}
