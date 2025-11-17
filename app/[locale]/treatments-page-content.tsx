"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TreatmentsScreen } from "@/modules/treatment/components/treatments-screen";
import { ErrorFallback } from "@/components/error-fallback";

export function TreatmentsPageContent() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Log to error monitoring service (Sentry, etc.)
        console.error("Treatments page error caught:", error, info);
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <TreatmentsScreen />
      </Suspense>
    </ErrorBoundary>
  );
}
