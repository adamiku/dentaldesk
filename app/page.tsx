import { Suspense } from "react";
import { TreatmentsScreen } from "@/modules/treatment/components/treatments-screen";

export default function TreatmentsPage() {
  return (
    // Suspense is needed for Next.js App Router when using useSearchParams (which nuqs uses internally).
    <Suspense fallback={<div>Loading...</div>}>
      <TreatmentsScreen />
    </Suspense>
  );
}
