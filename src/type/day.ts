import { getFromStorage } from "../popup/storage";
import { t } from "../utils/i18n";

export const DAY_LOCALE_MAP: { [key in Day]: string } = {
  일: t("sun"),
  월: t("mon"),
  화: t("tue"),
  수: t("wed"),
  목: t("thu"),
  금: t("fri"),
  토: t("sat")
} as const;

export const DAY_TO_KOREAN = {
  [t("sun")]: "일",
  [t("mon")]: "월",
  [t("tue")]: "화",
  [t("wed")]: "수",
  [t("thu")]: "목",
  [t("fri")]: "금",
  [t("sat")]: "토"
};

export const DAYS = [
  t("sun"),
  t("mon"),
  t("tue"),
  t("wed"),
  t("thu"),
  t("fri"),
  t("sat")
] as const;

export type Day = (typeof DAYS)[number];

export type Lang = keyof typeof DATE_ORDER_BY_LOCALE;

export const DATE_ORDER_BY_LOCALE = {
  ar: { order: ["day", "month", "year"], separator: "-", is24HourFormat: true },
  de: { order: ["day", "month", "year"], separator: ".", is24HourFormat: true },
  en: {
    order: ["month", "day", "year"],
    separator: "/",
    is24HourFormat: false
  },
  es: { order: ["day", "month", "year"], separator: "/", is24HourFormat: true },
  fr: { order: ["day", "month", "year"], separator: "/", is24HourFormat: true },
  hi: {
    order: ["day", "month", "year"],
    separator: "-",
    is24HourFormat: false
  },
  it: { order: ["day", "month", "year"], separator: "/", is24HourFormat: true },
  ja: { order: ["year", "month", "day"], separator: "-", is24HourFormat: true },
  ko: { order: ["year", "month", "day"], separator: "-", is24HourFormat: true },
  pt_BR: {
    order: ["day", "month", "year"],
    separator: "/",
    is24HourFormat: false
  },
  ru: { order: ["day", "month", "year"], separator: ".", is24HourFormat: true },
  th: {
    order: ["day", "month", "year"],
    separator: "/",
    is24HourFormat: false
  },
  vi: { order: ["day", "month", "year"], separator: "/", is24HourFormat: true },
  zh_CN: {
    order: ["year", "month", "day"],
    separator: "-",
    is24HourFormat: true
  }
} as const;

export const getIs24HourFormat = async () => {
  const lang = chrome.i18n.getUILanguage() as Lang;
  const { is24HourFormat } = DATE_ORDER_BY_LOCALE[lang];

  const dbValue = getFromStorage("is24HourFormat");

  if (typeof dbValue === "boolean") {
    return dbValue;
  }
  return is24HourFormat;
};
