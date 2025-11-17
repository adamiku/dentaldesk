import { Suspense } from "react";
import { TreatmentsScreen } from "@/modules/treatment/components/treatments-screen";
import { setRequestLocale } from "next-intl/server";

export default async function TreatmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    // Suspense is needed for Next.js App Router when using useSearchParams (which nuqs uses internally).
    <Suspense fallback={<div>Loading...</div>}>
      <TreatmentsScreen />
    </Suspense>
  );
}
