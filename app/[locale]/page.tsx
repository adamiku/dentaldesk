import { setRequestLocale } from "next-intl/server";
import { TreatmentsPageContent } from "./treatments-page-content";

export default async function TreatmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TreatmentsPageContent />;
}
