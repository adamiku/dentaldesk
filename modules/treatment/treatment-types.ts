/**
 * Domain types for Treatment module
 *
 * Architecture:
 * - TreatmentBE: Raw backend response (snake_case, all fields) - defined in lib/types.ts
 * - Treatment: Frontend entity (camelCase, UI-relevant fields only)
 * - Zod validates BE response and transforms to FE entity
 */

import { createParser, parseAsInteger } from "nuqs";
import { z } from "zod";

/**
 * BE → FE status mapping
 * Transforms snake_case status values to camelCase for frontend use
 */
export const BE_TO_FE_STATUS = {
  scheduled: "scheduled",
  in_progress: "inProgress",
  completed: "completed",
  cancelled: "cancelled",
} as const;

// FE status values (camelCase)
export const STATUS = {
  SCHEDULED: { value: "scheduled", label: "Scheduled" },
  IN_PROGRESS: { value: "inProgress", label: "In Progress" },
  COMPLETED: { value: "completed", label: "Completed" },
  CANCELLED: { value: "cancelled", label: "Cancelled" },
} as const;

export type TreatmentStatus = (typeof STATUS)[keyof typeof STATUS]["value"];

/**
 * FE → BE status mapping
 * Transforms camelCase status values back to snake_case for API requests
 */
export const FE_TO_BE_STATUS = {
  scheduled: "scheduled",
  inProgress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
} as const;

export const FILTER_STATUS = {
  ALL: { value: "all", label: "All" },
  ...STATUS,
} as const;

export type TreatmentStatusFilter =
  (typeof FILTER_STATUS)[keyof typeof FILTER_STATUS]["value"];

// Query parameter keys for treatment filters and pagination
export const TREATMENT_QUERY_PARAMS = {
  SEARCH: "search",
  STATUS: "status",
  PAGE: "page",
  PAGE_SIZE: "pageSize",
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
} as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

// Shared filter/params interface used across API, hooks, and query keys
export interface TreatmentFilters {
  search?: string;
  status?: TreatmentStatusFilter;
  page?: number;
  pageSize?: number;
}

// Zod schema for TreatmentStatusFilter - derived from constants to maintain single source of truth
export const TreatmentStatusFilterSchema = z.enum([
  FILTER_STATUS.ALL.value,
  STATUS.SCHEDULED.value,
  STATUS.IN_PROGRESS.value,
  STATUS.COMPLETED.value,
  STATUS.CANCELLED.value,
] as const);

// Custom nuqs parser using Zod validation
export const parseAsTreatmentStatusFilter = createParser({
  parse: (value) => {
    const result = TreatmentStatusFilterSchema.safeParse(value);
    return result.success ? result.data : null;
  },
  serialize: (value) => value,
}).withDefault(FILTER_STATUS.ALL.value);
export const parseAsPage = parseAsInteger.withDefault(PAGINATION_DEFAULTS.PAGE);
export const parseAsPageSize = parseAsInteger.withDefault(
  PAGINATION_DEFAULTS.PAGE_SIZE,
);

/**
 * Zod schema validates BE response and transforms to FE entity
 * Transformations:
 * - status: snake_case → camelCase ("in_progress" → "inProgress")
 * - notes: empty string → undefined
 * - cost: stripped (not needed in FE)
 */
export const TreatmentSchema = z
  .object({
    id: z.number(),
    patient: z.string(),
    procedure: z.string(),
    dentist: z.string(),
    date: z.string(),
    // Backend status values (snake_case) - must match keys in BE_TO_FE_STATUS
    status: z
      .enum(["scheduled", "in_progress", "completed", "cancelled"])
      .optional(),
    notes: z.string().optional(),
    cost: z.number().optional(),
  })
  .transform((data) => ({
    id: data.id,
    patient: data.patient,
    procedure: data.procedure,
    dentist: data.dentist,
    date: data.date,
    status: data.status ? BE_TO_FE_STATUS[data.status] : undefined,
    notes: data.notes || undefined,
  }));

export const TreatmentsResponseSchema = z.object({
  data: z.array(TreatmentSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export type Treatment = z.infer<typeof TreatmentSchema>;
export type TreatmentsResponse = z.infer<typeof TreatmentsResponseSchema>;

/**
 * Form schema for creating a new treatment
 * Validates user input before sending to API
 */
export const CreateTreatmentFormSchema = z.object({
  patient: z.string().min(1, "Patient name is required"),
  procedure: z.string().min(1, "Procedure is required"),
  dentist: z.string().min(1, "Dentist name is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

export type CreateTreatmentForm = z.infer<typeof CreateTreatmentFormSchema>;
