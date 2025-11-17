import { beforeAll, afterEach, afterAll, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import server from "./test-utils/server";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ locale: "en" }),
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

// Mock i18n navigation
vi.mock("@/i18n/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  Link: vi.fn(({ children }) => children),
  redirect: vi.fn(),
  getPathname: vi.fn(),
}));

// Mock next-intl server functions
vi.mock("next-intl/server", async () => {
  const actual = await vi.importActual("next-intl/server");
  return {
    ...actual,
    setRequestLocale: vi.fn(),
  };
});

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
