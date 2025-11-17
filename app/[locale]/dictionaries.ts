import "server-only";

const dictionaries = {
  en: () =>
    import("../../i18n/messages/en.json").then((module) => module.default),
  hu: () =>
    import("../../i18n/messages/hu.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "hu") =>
  dictionaries[locale]();
