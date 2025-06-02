import { EditAlarm } from "src/popup/AlarmList";
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
