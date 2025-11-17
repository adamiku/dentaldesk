"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Toaster } from "@/components/ui/sonner";
import { ErrorFallback } from "@/components/error-fallback";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 2,
          },
        },
      }),
  );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Log to error monitoring service (Sentry, etc.)
        console.error("App-level error caught:", error, info);
      }}
    >
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </NuqsAdapter>
    </ErrorBoundary>
  );
}
