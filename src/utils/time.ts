import { Alarm, EditAlarm } from "../type/alarm";
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
    minute: String(minutes).padStart(2, "0")
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

export const isValidDate = (paramDate: IDate): boolean => {
  const { year: sYear, month: sMonth, day: sDay } = paramDate;
  const year = Number(sYear);
  const month = Number(sMonth);
  const day = Number(sDay);

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

export const getDateInfo = (date: string) => {
  const [year, month, day] = date.split("-");
  return {
    year,
    month,
    day
  };
};

export interface IDate {
  day: string;
  month: string;
  year: string;
}

export const getInitDate = () => {
  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return {
    year,
    month,
    day
  };
};

const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getInitAlarm = () => {
  const alarm: Alarm = {
    id: crypto.randomUUID(),
    days: ["월", "화", "수", "목", "금"],
    isOneTime: false,
    memo: "",
    time: getCurrentTime(),
    date: "" // 생성 시는 데이터 넣지 않고 위에(index.tsx) 있는 date state 사용함
  };

  return alarm;
};
