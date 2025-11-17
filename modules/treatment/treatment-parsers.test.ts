import { describe, it, expect } from "vitest";
import {
  parseAsTreatmentStatusFilter,
  parseAsPage,
  parseAsPageSize,
  TreatmentStatusFilterSchema,
  PAGINATION_DEFAULTS,
} from "./treatment-types";

describe("Treatment Parsers", () => {
  describe("parseAsTreatmentStatusFilter", () => {
    it("should parse valid status 'all'", () => {
      const result = parseAsTreatmentStatusFilter.parse("all");
      expect(result).toBe("all");
    });

    it("should parse valid status 'scheduled'", () => {
      const result = parseAsTreatmentStatusFilter.parse("scheduled");
      expect(result).toBe("scheduled");
    });

    it("should parse valid status 'inProgress'", () => {
      const result = parseAsTreatmentStatusFilter.parse("inProgress");
      expect(result).toBe("inProgress");
    });

    it("should parse valid status 'completed'", () => {
      const result = parseAsTreatmentStatusFilter.parse("completed");
      expect(result).toBe("completed");
    });

    it("should parse valid status 'cancelled'", () => {
      const result = parseAsTreatmentStatusFilter.parse("cancelled");
      expect(result).toBe("cancelled");
    });

    it("should return null for invalid status", () => {
      const result = parseAsTreatmentStatusFilter.parse("invalid");
      expect(result).toBeNull();
    });

    it("should return null for empty string", () => {
      const result = parseAsTreatmentStatusFilter.parse("");
      expect(result).toBeNull();
    });

    it("should serialize value correctly", () => {
      const serialized = parseAsTreatmentStatusFilter.serialize("scheduled");
      expect(serialized).toBe("scheduled");
    });
  });

  describe("parseAsPage", () => {
    it("should parse valid page number", () => {
      const result = parseAsPage.parse("5");
      expect(result).toBe(5);
    });

    it("should parse zero as valid", () => {
      const result = parseAsPage.parse("0");
      expect(result).toBe(0);
    });

    it("should parse negative numbers", () => {
      const result = parseAsPage.parse("-5");
      expect(result).toBe(-5);
    });
  });

  describe("parseAsPageSize", () => {
    it("should parse valid page size", () => {
      const result = parseAsPageSize.parse("20");
      expect(result).toBe(20);
    });

    it("should return default for invalid number", () => {
      const result = parseAsPageSize.parseServerSide("invalid");
      expect(result).toBe(PAGINATION_DEFAULTS.PAGE_SIZE);
    });

    it("should parse large numbers", () => {
      const result = parseAsPageSize.parse("100");
      expect(result).toBe(100);
    });
  });

  describe("TreatmentStatusFilterSchema", () => {
    it("should validate all status values", () => {
      const validStatuses = [
        "all",
        "scheduled",
        "inProgress",
        "completed",
        "cancelled",
      ];

      for (const status of validStatuses) {
        const result = TreatmentStatusFilterSchema.safeParse(status);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(status);
        }
      }
    });

    it("should reject invalid status values", () => {
      const invalidStatuses = ["pending", "active", "", "SCHEDULED", "All"];

      for (const status of invalidStatuses) {
        const result = TreatmentStatusFilterSchema.safeParse(status);
        expect(result.success).toBe(false);
      }
    });

    it("should reject non-string values", () => {
      const result = TreatmentStatusFilterSchema.safeParse(123);
      expect(result.success).toBe(false);
    });

    it("should reject null and undefined", () => {
      expect(TreatmentStatusFilterSchema.safeParse(null).success).toBe(false);
      expect(TreatmentStatusFilterSchema.safeParse(undefined).success).toBe(
        false,
      );
    });
  });
});
