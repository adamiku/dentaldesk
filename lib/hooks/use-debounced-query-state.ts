import type { Dispatch, SetStateAction } from "react";
import type { UseQueryStateOptions } from "nuqs";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { useDebounce } from "./use-debounce";

/**
 * A debounced version of useQueryState from nuqs
 * Provides immediate local state updates while debouncing URL parameter changes
 *
 * @param key - The URL query parameter key
 * @param options - The nuqs parser options (e.g., parseAsString.withDefault(""))
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns [inputValue, setInputValue, debouncedValue] - Input value updates immediately, debounced value updates after delay
 *
 * @example
 * ```tsx
 * const [searchInput, setSearchInput, searchQuery] = useDebouncedQueryState(
 *   "search",
 *   parseAsString.withDefault(""),
 *   300
 * );
 * // Use searchInput for the input field (immediate updates)
 * // Use searchQuery for API calls (debounced updates)
 * ```
 */
export function useDebouncedQueryState(
  key: string,
  options: UseQueryStateOptions<string>,
  delay = 300,
): [string, Dispatch<SetStateAction<string>>, string] {
  const [urlParam, setUrlParam] = useQueryState(key, options);

  // Local state for immediate input feedback
  const [localValue, setLocalValue] = useState<string>(urlParam ?? "");

  const debouncedValue = useDebounce(localValue, delay);

  // Sync local value with URL param when it changes externally (e.g., browser back/forward)
  useEffect(() => {
    setLocalValue(urlParam ?? "");
  }, [urlParam]);

  // Update URL parameter when debounced value changes
  useEffect(() => {
    if (debouncedValue !== urlParam) {
      setUrlParam(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, setUrlParam]);

  return [localValue, setLocalValue, debouncedValue];
}
