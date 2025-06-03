type LocaleKey =
  | "extName"
  | "extDescription"
  | "am"
  | "pm"
  | "sun"
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "oneTimeAlarm"
  | "oneTimeAlarmTooltip"
  | "activeDays"
  | "activeDate"
  | "editAlarm"
  | "addAlarm"
  | "day"
  | "month"
  | "year"
  | "save"
  | "memo"
  | "invalidDate"
  | "pastDateNotAllowed"
  | "pastTimeNotAllowed";

export function t(key: LocaleKey): string {
  return chrome.i18n.getMessage(key) || key;
}
