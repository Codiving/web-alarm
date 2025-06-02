import { EditAlarm } from "../type/alarm";
import { t } from "./i18n";

const getTimeParts = (hours24: number, minutes: number) => {
  const am = t("am");
  const pm = t("pm");
  const isAM = hours24 < 12;
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return {
    isAM,
    meridiem: isAM ? am : pm,
    hour: String(hour12).padStart(2, "0"),
    minute: String(minutes).padStart(2, "0"),
  };
};

export const getTimeInfo = (alarm: EditAlarm) => {
  if (!alarm) {
    const now = new Date();
    return getTimeParts(now.getHours(), now.getMinutes());
  }

  const [hour24, minute] = alarm.time.split(":").map(Number);
  return getTimeParts(hour24, minute);
};

export const isValidDate = (paramDate: string): boolean => {
  const [year, month, day] = paramDate.split("-").map(Number);
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return false;
  }

  if (month < 1 || month > 12) {
    return false;
  }

  if (day < 1 || day > 31) {
    return false;
  }

  // JavaScript의 Date 객체를 이용해 실제 유효한 날짜인지 검사
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};
