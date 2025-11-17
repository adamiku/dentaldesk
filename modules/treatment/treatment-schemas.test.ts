import { describe, it, expect } from "vitest";
import {
  TreatmentSchema,
  TreatmentsResponseSchema,
  CreateTreatmentFormSchema,
  BE_TO_FE_STATUS,
} from "./treatment-types";

describe("Treatment Schemas", () => {
  describe("TreatmentSchema", () => {
    it("should validate and transform valid treatment data", () => {
      const backendData = {
        id: 1,
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        status: "scheduled",
        notes: "Regular checkup",
        cost: 100,
      };

      const result = TreatmentSchema.parse(backendData);

      expect(result).toEqual({
        id: 1,
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        status: "scheduled",
        notes: "Regular checkup",
      });
      // cost should be stripped
      expect(result).not.toHaveProperty("cost");
    });

    it("should transform status from snake_case to camelCase", () => {
      const backendData = {
        id: 1,
        patient: "John Doe",
        procedure: "Root Canal",
        dentist: "Dr. Jones",
        date: "2024-02-01",
        status: "in_progress",
        notes: "",
      };

      const result = TreatmentSchema.parse(backendData);

      expect(result.status).toBe(BE_TO_FE_STATUS.in_progress);
      expect(result.status).toBe("inProgress");
    });

    it("should handle all status transformations", () => {
      const statuses = [
        { backend: "scheduled", frontend: "scheduled" },
        { backend: "in_progress", frontend: "inProgress" },
        { backend: "completed", frontend: "completed" },
        { backend: "cancelled", frontend: "cancelled" },
      ];

      for (const { backend, frontend } of statuses) {
        const data = {
          id: 1,
          patient: "Test",
          procedure: "Test",
          dentist: "Test",
          date: "2024-01-01",
          status: backend,
        };

        const result = TreatmentSchema.parse(data);
        expect(result.status).toBe(frontend);
      }
    });

    it("should convert empty string notes to undefined", () => {
      const data = {
        id: 1,
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        status: "scheduled",
        notes: "",
      };

      const result = TreatmentSchema.parse(data);
      expect(result.notes).toBeUndefined();
    });

    it("should keep non-empty notes", () => {
      const data = {
        id: 1,
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        status: "scheduled",
        notes: "Important note",
      };

      const result = TreatmentSchema.parse(data);
      expect(result.notes).toBe("Important note");
    });

    it("should handle optional status field", () => {
      const data = {
        id: 1,
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
      };

      const result = TreatmentSchema.parse(data);
      expect(result.status).toBeUndefined();
    });

    it("should handle optional notes field", () => {
      const data = {
        id: 1,
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        status: "scheduled",
      };

      const result = TreatmentSchema.parse(data);
      expect(result.notes).toBeUndefined();
    });

    it("should strip cost field from response", () => {
      const data = {
        id: 1,
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        status: "scheduled",
        cost: 999,
      };

      const result = TreatmentSchema.parse(data);
      expect(result).not.toHaveProperty("cost");
    });

    it("should reject invalid data with missing required fields", () => {
      const invalidData = {
        id: 1,
        patient: "John Doe",
        // missing required fields
      };

      expect(() => TreatmentSchema.parse(invalidData)).toThrow();
    });

    it("should reject invalid status values", () => {
      const data = {
        id: 1,
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        status: "invalid_status",
      };

      expect(() => TreatmentSchema.parse(data)).toThrow();
    });

    it("should reject invalid data types", () => {
      const data = {
        id: "not-a-number",
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        status: "scheduled",
      };

      expect(() => TreatmentSchema.parse(data)).toThrow();
    });
  });

  describe("TreatmentsResponseSchema", () => {
    it("should validate paginated response", () => {
      const response = {
        data: [
          {
            id: 1,
            patient: "John Doe",
            procedure: "Cleaning",
            dentist: "Dr. Smith",
            date: "2024-01-15",
            status: "scheduled",
            notes: "",
          },
          {
            id: 2,
            patient: "Jane Doe",
            procedure: "Filling",
            dentist: "Dr. Jones",
            date: "2024-01-16",
            status: "in_progress",
            notes: "First session",
          },
        ],
        total: 50,
        page: 1,
        pageSize: 10,
        totalPages: 5,
      };

      const result = TreatmentsResponseSchema.parse(response);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(50);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(5);
      expect(result.data[1].status).toBe("inProgress");
    });

    it("should validate empty data array", () => {
      const response = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      };

      const result = TreatmentsResponseSchema.parse(response);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("should reject response with missing pagination fields", () => {
      const response = {
        data: [],
        total: 0,
        // missing page, pageSize, totalPages
      };

      expect(() => TreatmentsResponseSchema.parse(response)).toThrow();
    });

    it("should reject response with invalid data field", () => {
      const response = {
        data: "not-an-array",
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      };

      expect(() => TreatmentsResponseSchema.parse(response)).toThrow();
    });
  });

  describe("CreateTreatmentFormSchema", () => {
    it("should validate valid form data", () => {
      const formData = {
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        notes: "Regular checkup",
      };

      const result = CreateTreatmentFormSchema.parse(formData);

      expect(result).toEqual(formData);
    });

    it("should validate form data without optional notes", () => {
      const formData = {
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
      };

      const result = CreateTreatmentFormSchema.parse(formData);

      expect(result).toEqual(formData);
      expect(result.notes).toBeUndefined();
    });

    it("should validate form data with empty notes", () => {
      const formData = {
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
        notes: "",
      };

      const result = CreateTreatmentFormSchema.parse(formData);
      expect(result.notes).toBe("");
    });

    it("should reject form with empty patient name", () => {
      const formData = {
        patient: "",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
      };

      const result = CreateTreatmentFormSchema.safeParse(formData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Patient name is required");
      }
    });

    it("should reject form with empty procedure", () => {
      const formData = {
        patient: "John Doe",
        procedure: "",
        dentist: "Dr. Smith",
        date: "2024-01-15",
      };

      const result = CreateTreatmentFormSchema.safeParse(formData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Procedure is required");
      }
    });

    it("should reject form with empty dentist name", () => {
      const formData = {
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "",
        date: "2024-01-15",
      };

      const result = CreateTreatmentFormSchema.safeParse(formData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Dentist name is required");
      }
    });

    it("should reject form with empty date", () => {
      const formData = {
        patient: "John Doe",
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "",
      };

      const result = CreateTreatmentFormSchema.safeParse(formData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Date is required");
      }
    });

    it("should reject form with missing required fields", () => {
      const formData = {
        patient: "John Doe",
        // missing procedure, dentist, date
      };

      expect(() => CreateTreatmentFormSchema.parse(formData)).toThrow();
    });

    it("should reject form with invalid data types", () => {
      const formData = {
        patient: 123,
        procedure: "Cleaning",
        dentist: "Dr. Smith",
        date: "2024-01-15",
      };

      expect(() => CreateTreatmentFormSchema.parse(formData)).toThrow();
    });
  });
});
