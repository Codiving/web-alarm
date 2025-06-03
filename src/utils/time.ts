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

export const isValidDate = (
  paramDate: IDate
): "falsyDate" | "cantBeforeDate" | "today" | "success" => {
  const { year: sYear, month: sMonth, day: sDay } = paramDate;
  const year = Number(sYear);
  const month = Number(sMonth);
  const day = Number(sDay);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return "falsyDate";
  }

  if (month < 1 || month > 12) {
    return "falsyDate";
  }

  if (day < 1 || day > 31) {
    return "falsyDate";
  }

  // 유효한 실제 날짜인지 확인
  const inputDate = new Date(year, month - 1, day);
  if (
    inputDate.getFullYear() !== year ||
    inputDate.getMonth() !== month - 1 ||
    inputDate.getDate() !== day
  ) {
    return "falsyDate";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDay = new Date(inputDate);
  inputDay.setHours(0, 0, 0, 0);

  if (inputDay < today) {
    return "cantBeforeDate";
  }

  if (inputDay.getTime() === today.getTime()) {
    return "today";
  }

  return "success";
};

interface ITime {
  hour: string;
  minute: string;
}

export const isPastTime = (param: ITime): boolean => {
  const hour = Number(param.hour);
  const minute = Number(param.minute);

  if (
    isNaN(hour) ||
    hour < 0 ||
    hour > 23 ||
    isNaN(minute) ||
    minute < 0 ||
    minute > 59
  ) {
    return false;
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const inputMinutes = hour * 60 + minute;

  return inputMinutes < nowMinutes;
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

export const getHHMM = (isAM: boolean, hour: string, minute: string) => {
  const hours24 = Number(hour);

  const hour12 = () => {
    if (isAM) {
      return hours24 === 12 ? "00" : String(hours24).padStart(2, "0");
    } else {
      return hours24 === 12 ? "12" : String(hours24 + 12).padStart(2, "0");
    }
  };

  const time = `${hour12()}:${String(minute).padStart(2, "0")}`;
  return time;
};
