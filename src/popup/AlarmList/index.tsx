import { useCallback, useEffect, useState } from "react";
import { Alarm, EditAlarm } from "../../type/alarm";
import { DATE_ORDER_BY_LOCALE, DAY_LOCALE_MAP, Lang } from "../../type/day";
import { t } from "../../utils/i18n";
import { getTimeInfo } from "../../utils/time";
import { OnChangeDialog } from "../Popup";
import { getFromStorage, setToStorage } from "../storage";
import EditDeleteButton from "./EditDeleteButton";
import FloatingAddButton from "./FloatingAddButton";
import Memo from "./Memo";
import SettingButton from "./SettingButton";

interface AlarmListProps {
  onChangeDialog: OnChangeDialog;
  onChangeAlarm: (alarm: EditAlarm) => void;
  type: string;
  onChangeType: (type: string) => void;
  is24HourFormat: boolean;
  onChangeIs24HourFormat: (format: boolean) => Promise<void>;
}

const TYPES = [t("all"), t("normalAlarm"), t("oneTimeAlarm")] as const;

const getDate = (date: string) => {
  const lang = chrome.i18n.getUILanguage() as Lang;
  const format = DATE_ORDER_BY_LOCALE[lang] || {
    order: ["year", "month", "day"],
    separator: "-"
  };

  const [year, month, day] = date.split("-");
  const dateParts = {
    year,
    month,
    day
  };

  const reordered = format.order.map(key => dateParts[key]);

  return reordered.join(format.separator);
};

export default function AlarmList({
  onChangeDialog,
  onChangeAlarm,
  type: upperType,
  onChangeType,
  is24HourFormat,
  onChangeIs24HourFormat
}: AlarmListProps) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const openAddAlarmLayer = () => onChangeDialog("add", { open: true });

  const openEditAlarmLayer = (alarm: Alarm) => {
    onChangeAlarm(alarm);
    onChangeDialog("add", {
      open: true
    });
  };

  const fetchAlarms = useCallback(async () => {
    const dbAlarms = await getFromStorage<Alarm[]>("alarms");

    if (dbAlarms === null) return;
    dbAlarms.sort((a, b) => {
      const [aH, aM] = a.time.split(":").map(Number);
      const [bH, bM] = b.time.split(":").map(Number);
      return aH !== bH ? aH - bH : aM - bM;
    });
    setAlarms(dbAlarms);
  }, []);

  const loadAlarms = useCallback(async () => {
    await fetchAlarms();
  }, [fetchAlarms]);

  useEffect(() => {
    loadAlarms();
  }, [loadAlarms]);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "ALARM_CLOSED") {
        console.log("일회성 알람이 종료되었습니다:", message.alarms);
        loadAlarms();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [loadAlarms]);

  return (
    <div
      id="alarm-list-overlay"
      className="select-none flex flex-col gap-[8px] px-[12px] py-[8px] h-[450px]"
    >
      <div className="flex justify-between items-center">
        <SettingButton className="invisible" />

        <h1 className="text-center text-[22px] font-bold text-white sticky top-0">
          {t("extName")}
        </h1>
        <SettingButton className="cursor-pointer" />
      </div>
      <div className="flex gap-[4px]">
        <button
          onClick={async () => {
            await onChangeIs24HourFormat(true);
          }}
          className="cursor-pointer text-[14px] text-white py-[4px] px-[8px] rounded-[4px]"
          style={{
            backgroundColor: is24HourFormat ? "#0000005c" : "#5c5c5c"
          }}
        >
          {t("twentyFourHourFormat")}
        </button>
        <button
          onClick={async () => {
            await onChangeIs24HourFormat(false);
          }}
          className="cursor-pointer text-[14px] text-white py-[4px] px-[8px] rounded-[4px]"
          style={{
            backgroundColor: !is24HourFormat ? "#0000005c" : "#5c5c5c"
          }}
        >
          {t("twelveHourFormat")}
        </button>
      </div>
      <div className="flex gap-[4px]">
        {TYPES.map(type => {
          return (
            <button
              onClick={() => {
                onChangeType(type);
              }}
              className="cursor-pointer text-[14px] text-white py-[4px] px-[8px] rounded-[4px]"
              style={{
                backgroundColor: type === upperType ? "#0000005c" : "#5c5c5c"
              }}
            >
              {type}
            </button>
          );
        })}
      </div>
      <div className="scrollbar-hide overflow-auto flex-1 flex flex-col gap-[8px]">
        {alarms.map(alarm => {
          const { id, days, isOneTime, memo } = alarm;
          const { hour, minute, meridiem, isAM } = getTimeInfo(alarm);

          if (upperType === t("oneTimeAlarm")) {
            if (!isOneTime) return null;
          }

          if (upperType === t("normalAlarm")) {
            if (isOneTime) return null;
          }

          return (
            <div
              key={id}
              className="text-white p-[10px] pb-[8px] gap-[8px] w-full rounded-xl bg-[#5c5c5c] flex flex-col"
            >
              <div className="flex justify-between">
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16px"
                      height="16px"
                      viewBox="0 0 28 28"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M11 4.54125C8.11878 5.68927 6.0772 8.44184 6.07706 11.6767V17.9802L3.31773 20.658C3.12222 20.8387 3 21.0961 3 21.3818V21.5114C3 22.6045 3.89543 23.4906 5 23.4906H10.0255C10.2508 25.4654 11.9443 27 14 27C16.0557 27 17.7492 25.4654 17.9745 23.4906H23C24.1046 23.4906 25 22.6045 25 21.5114V21.382C25.0001 21.0963 24.8779 20.8388 24.6823 20.658L21.9232 17.9805V11.677C21.9231 8.44206 19.8814 5.6891 17 4.54114V3.47401C17 2.18459 15.9963 1.54919 15.6019 1.354C15.0885 1.09988 14.5194 1 14 1C13.4806 1 12.9115 1.09988 12.3981 1.354C12.0037 1.54919 11 2.18459 11 3.47401V4.54125ZM14.927 3.96881C14.9218 3.98589 14.9164 4.00272 14.9108 4.0193C14.6118 3.98595 14.308 3.96881 14.0001 3.96881C13.6922 3.96881 13.3883 3.98596 13.0893 4.01933C13.0836 4.00274 13.0782 3.9859 13.073 3.96881H13V3.47401C13 3.20076 13.4473 2.97921 14 2.97921C14.5527 2.97921 15 3.20076 15 3.47401V3.96881H14.927ZM15.9483 23.4906H12.0517C12.2572 24.3674 13.0515 25.0208 14 25.0208C14.9485 25.0208 15.7428 24.3674 15.9483 23.4906ZM8.07706 11.6767C8.07722 8.53096 10.7105 5.94802 14.0001 5.94802C17.2898 5.94802 19.9231 8.53096 19.9232 11.6767H8.07706ZM8.07706 11.6767H19.9232V17.9805C19.9232 18.5121 20.1393 19.0214 20.5229 19.3936L22.7052 21.5114H5.29484L7.77028 19.1091C7.95901 18.9296 8.07706 18.6772 8.07706 18.3958V11.6767Z"
                        fill="#fff"
                        fill-rule="evenodd"
                      />
                    </svg>
                    <p className="text-[14px]">
                      {isOneTime
                        ? `${t("oneTimeAlarm")} / ${getDate(alarm.date)}`
                        : days.length === 7
                        ? t("everyday")
                        : days.map(day => DAY_LOCALE_MAP[day]).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-end gap-[14px]">
                    {!is24HourFormat && <span>{meridiem}</span>}
                    <span className="text-[24px] mb-[-4px]">{`${
                      !is24HourFormat
                        ? hour
                        : isAM
                        ? hour === "12"
                          ? "00"
                          : hour
                        : hour === "12"
                        ? "12"
                        : Number(hour) + 12
                    }:${minute}`}</span>
                  </div>
                </div>
                <EditDeleteButton
                  onEdit={() => {
                    openEditAlarmLayer(alarm);
                  }}
                  onDelete={async () => {
                    const filtered = alarms.filter(a => a.id !== alarm.id);
                    await setToStorage("alarms", filtered);
                    await fetchAlarms();
                  }}
                />
              </div>
              {/*  */}
              {Boolean(memo) && <Memo memo={memo} />}
            </div>
          );
        })}
      </div>
      <FloatingAddButton onClick={openAddAlarmLayer} />
    </div>
  );
}
