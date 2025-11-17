"use client";

import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = {
  en: "English",
  hu: "Magyar",
};

export function LanguageSelector() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = params.locale as string;

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
