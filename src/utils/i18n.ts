import { LocaleKey } from "../type/day";

export function t(key: LocaleKey): string {
  return chrome.i18n.getMessage(key) || key;
}
