import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test-utils/test-utils";
import { HttpResponse, delay } from "msw";
import server, { mockRequest } from "../../test-utils/server";
import { AssetGenerator } from "../../test-utils/assetGenerator";
import { treatmentApis } from "@/modules/treatment/treatment-api";
import Page from "./page";

describe("TreatmentsPage", () => {
  const mockParams = Promise.resolve({ locale: "en" });

  beforeEach(() => {
    server.resetHandlers();
  });

  describe("Initial Render", () => {
    it("should render the page heading", async () => {
      render(await Page({ params: mockParams }));

      expect(
        screen.getByRole("heading", { level: 1, name: "DentalDesk" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Track dental treatments and their status."),
      ).toBeInTheDocument();
    });

    it("should render search and filter controls", async () => {
      mockRequest(
        "get",
        treatmentApis.treatmentApiPath,
        AssetGenerator.getMockTreatmentsResponse(),
      );

      render(await Page({ params: mockParams }));

      expect(
        screen.getByPlaceholderText("Search patients, procedures, dentists..."),
      ).toBeInTheDocument();

      const comboboxes = screen.getAllByRole("combobox");
      expect(comboboxes.length).toBeGreaterThan(0);

      expect(
        screen.getByRole("button", { name: /add treatment/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should show loading state while fetching treatments", async () => {
      // Mock slow API response
      mockRequest("get", treatmentApis.treatmentApiPath, async () => {
        await delay(100);
        return HttpResponse.json(AssetGenerator.getMockTreatmentsResponse());
      });

      render(await Page({ params: mockParams }));

      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.getByTestId("treatments-loading")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("treatments-loading"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Success State", () => {
    it("should display treatments when data loads successfully", async () => {
      const mockResponse = AssetGenerator.getMockTreatmentsResponse();
      mockRequest("get", treatmentApis.treatmentApiPath, mockResponse);

      render(await Page({ params: mockParams }));

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        expect(screen.getByText("Bob Wilson")).toBeInTheDocument();

        expect(
          screen.getByText(/showing 1-3 of 3 treatments/i),
        ).toBeInTheDocument();
      });
    });

    it("should display 'No treatments found' when no data", async () => {
      mockRequest("get", treatmentApis.treatmentApiPath, {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      });

      render(await Page({ params: mockParams }));

      await waitFor(() => {
        expect(screen.getByText("No treatments found")).toBeInTheDocument();
      });
    });
  });

  describe("Error State", () => {
    it("should display error message when API fails", async () => {
      mockRequest("get", treatmentApis.treatmentApiPath, () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      });

      render(await Page({ params: mockParams }));

      await waitFor(() => {
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      });

      expect(
        screen.getByRole("button", { name: /retry/i }),
      ).toBeInTheDocument();
    });

    it("should allow retrying after error", async () => {
      let callCount = 0;

      mockRequest("get", treatmentApis.treatmentApiPath, () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }
        return HttpResponse.json(AssetGenerator.getMockTreatmentsResponse());
      });

      const { user } = render(await Page({ params: mockParams }));

      await waitFor(() => {
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      });
      const retryButton = screen.getByRole("button", { name: /retry/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
    });
  });

  describe("Searching", () => {
    it("should search treatments by patient name", async () => {
      mockRequest("get", treatmentApis.treatmentApiPath, ({ request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get("search");

        if (search === "Jane") {
          return HttpResponse.json(
            AssetGenerator.getMockTreatmentsResponse({
              data: [
                AssetGenerator.getMockBackendTreatment({
                  id: 2,
                  patient: "Jane Smith",
                  procedure: "Filling",
                }),
              ],
              total: 1,
            }),
          );
        }

        return HttpResponse.json(AssetGenerator.getMockTreatmentsResponse());
      });

      const { user } = render(await Page({ params: mockParams }));

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
      const searchInput = screen.getByPlaceholderText(
        "Search patients, procedures, dentists...",
      );
      await user.type(searchInput, "Jane");

      await waitFor(
        () => {
          expect(screen.getByText("Jane Smith")).toBeInTheDocument();
          expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });

    it("should reset to page 1 when search query changes", async () => {
      let requestedPage = 1;
      let requestCount = 0;

      mockRequest("get", treatmentApis.treatmentApiPath, ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get("page");
        const search = url.searchParams.get("search");
        requestedPage = page ? Number.parseInt(page) : 1;
        requestCount++;

        return HttpResponse.json(
          AssetGenerator.getMockTreatmentsResponse({
            data: search
              ? []
              : AssetGenerator.getMockBackendTreatments().slice(0, 3),
            total: search ? 0 : 30,
            totalPages: search ? 0 : 3,
          }),
        );
      });

      const { user } = render(await Page({ params: mockParams }));

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      const initialRequestCount = requestCount;

      const searchInput = screen.getByPlaceholderText(
        "Search patients, procedures, dentists...",
      );
      await user.type(searchInput, "test");

      await waitFor(() => {
        expect(searchInput).toHaveValue("test");
        expect(requestCount).toBeGreaterThan(initialRequestCount);
        expect(requestedPage).toBe(1);
      });
    });
  });
});
