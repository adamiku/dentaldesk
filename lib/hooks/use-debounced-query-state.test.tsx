import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { parseAsString } from "nuqs";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import type { ReactNode } from "react";
import { useDebouncedQueryState } from "./use-debounced-query-state";

// Wrapper with NuqsTestingAdapter
const wrapper = ({ children }: { children: ReactNode }) => (
  <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
);

describe("useDebouncedQueryState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with default value from options", () => {
    const { result } = renderHook(
      () =>
        useDebouncedQueryState("search", parseAsString.withDefault(""), 300),
      { wrapper },
    );

    const [localValue, , debouncedValue] = result.current;
    expect(localValue).toBe("");
    expect(debouncedValue).toBe("");
  });

  it("should update local value immediately", () => {
    const { result } = renderHook(
      () =>
        useDebouncedQueryState("search", parseAsString.withDefault(""), 300),
      { wrapper },
    );

    act(() => {
      const [, setLocalValue] = result.current;
      setLocalValue("test");
    });

    const [localValue, , debouncedValue] = result.current;
    expect(localValue).toBe("test");
    expect(debouncedValue).toBe(""); // Still old value
  });

  it("should support functional updates", () => {
    const { result } = renderHook(
      () =>
        useDebouncedQueryState("search", parseAsString.withDefault(""), 300),
      { wrapper },
    );

    act(() => {
      const [, setLocalValue] = result.current;
      setLocalValue("initial");
    });

    act(() => {
      const [, setLocalValue] = result.current;
      setLocalValue((prev) => `${prev} updated`);
    });

    const [localValue] = result.current;
    expect(localValue).toBe("initial updated");
  });

  it("should return all three values in correct order", () => {
    const { result } = renderHook(
      () =>
        useDebouncedQueryState("search", parseAsString.withDefault(""), 300),
      { wrapper },
    );

    const [localValue, setLocalValue, debouncedValue] = result.current;

    expect(typeof localValue).toBe("string");
    expect(typeof setLocalValue).toBe("function");
    expect(typeof debouncedValue).toBe("string");
  });
});
