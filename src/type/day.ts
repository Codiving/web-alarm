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
