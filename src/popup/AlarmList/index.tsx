import { useEffect, useState } from "react";
import { OnChangeDialog } from "../Popup";
import { t } from "../../utils/i18n";

interface AlarmListProps {
  onChangeDialog: OnChangeDialog;
  onChangeAlarm: (alarm: EditAlarm) => void;
}

const DAY_LOCALE_MAP: { [key in Day]: string } = {
  일: t("sun"),
  월: t("mon"),
  화: t("tue"),
  수: t("wed"),
  목: t("thu"),
  금: t("fri"),
  토: t("sat")
} as const;
export const DAYS = [
  t("sun"),
  t("mon"),
  t("tue"),
  t("wed"),
  t("thu"),
  t("fri"),
  t("sat")
] as const;
type Day = (typeof DAYS)[number];

export type EditAlarm = Alarm | null;

export interface Alarm {
  id: string;
  time: string;
  days: Day[];
  isOneTime: boolean;
  memo: string;
}

export default function AlarmList({
  onChangeDialog,
  onChangeAlarm
}: AlarmListProps) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    chrome.storage.local.get("alarms", result => {
      const dbAlarms = (result.alarms || []) as Alarm[];
      dbAlarms.sort((a, b) => {
        const [aH, aM] = a.time.split(":").map(Number);
        const [bH, bM] = b.time.split(":").map(Number);
        return aH !== bH ? aH - bH : aM - bM;
      });
      console.log("dbAlarms : ", dbAlarms);
      setAlarms(dbAlarms);
    });
  }, []);

  return (
    <div
      id="alarm-list-overlay"
      className="select-none flex flex-col gap-[8px] px-[12px] py-[8px] h-[400px]"
    >
      <h1 className="text-center text-[22px] font-bold text-white sticky top-0">
        {t("extName")}
      </h1>
      <div className="scrollbar-hide overflow-auto flex-1 flex flex-col gap-[8px]">
        {alarms.map(alarm => {
          const { id, time, days, isOneTime, memo } = alarm;
          const [hour24, numberMinute] = time.split(":").map(Number);
          const hour12 = hour24 % 12 === 0 ? "12" : hour24 % 12;
          const hour = String(hour12).padStart(2, "0");
          const minute = String(numberMinute).padStart(2, "0");
          const isAM = hour24 < 12;
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
                        ? "일회용"
                        : days.map(day => DAY_LOCALE_MAP[day]).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-end gap-[14px]">
                    <span>{isAM ? "오전" : "오후"}</span>
                    <span className="text-[24px] mb-[-4px]">{`${hour}:${minute}`}</span>
                  </div>
                </div>
                <div className="items-start flex gap-[6px]">
                  <span
                    onClick={() => {
                      onChangeAlarm(alarm);
                      onChangeDialog("add", {
                        open: true
                      });
                    }}
                    className="cursor-pointer py-[4px] px-[8px] text-[14px] bg-[#434040] hover:bg-[#2d2a2a] duration-300 rounded-[12px] text-[#ff8800]"
                  >
                    수정
                  </span>
                  <span className="cursor-pointer py-[4px] px-[8px] text-[14px] bg-[#434040] hover:bg-[#2d2a2a] duration-300 rounded-[12px] text-[#ff8800]">
                    삭제
                  </span>
                </div>
              </div>
              {/*  */}
              {Boolean(memo) && (
                <div className="flex gap-[6px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14px"
                    height="14px"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-[3px]"
                  >
                    <path
                      d="M7.2 21C6.07989 21 5.51984 21 5.09202 20.782C4.71569 20.5903 4.40973 20.2843 4.21799 19.908C4 19.4802 4 18.9201 4 17.8V6.2C4 5.07989 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V7M8 7H14M8 15H9M8 11H12M11.1954 20.8945L12.5102 20.6347C13.2197 20.4945 13.5744 20.4244 13.9052 20.2952C14.1988 20.1806 14.4778 20.0317 14.7365 19.8516C15.0279 19.6486 15.2836 19.393 15.7949 18.8816L20.9434 13.7332C21.6306 13.0459 21.6306 11.9316 20.9434 11.2444C20.2561 10.5571 19.1418 10.5571 18.4546 11.2444L13.2182 16.4808C12.739 16.96 12.4994 17.1996 12.3059 17.4712C12.1341 17.7123 11.9896 17.9717 11.8751 18.2447C11.7461 18.5522 11.6686 18.882 11.5135 19.5417L11.1954 20.8945Z"
                      stroke="#fff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span className="text-[14px]">{memo}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <svg
        id="add-alarm-btn"
        className="duration-200 hover:scale-[1.07] bg-[rgba(0,0,0,0.36)] hover:bg-[rgba(0,0,0,0.45)] shadow-[0_5px_15px_rgba(0,0,0,0.35)] absolute left-1/2 transform -translate-x-1/2 bottom-[10px] cursor-pointer rounded-full p-[6px]"
        xmlns="http://www.w3.org/2000/svg"
        width="40px"
        height="40px"
        viewBox="0 0 24 24"
        fill="none"
        onClick={() => {
          onChangeDialog("add", { open: true });
        }}
      >
        <path
          d="M11.9997 15.5815V9.58148M8.9997 12.5815H14.9997M18.9997 20.5815L16.4114 18.0165M4.9997 20.5815L7.58797 18.0165M6.74234 3.99735C6.36727 3.62228 5.85856 3.41156 5.32812 3.41156C4.79769 3.41156 4.28898 3.62228 3.91391 3.99735M20.0858 6.82413C20.4609 6.44905 20.6716 5.94035 20.6716 5.40991C20.6716 4.87948 20.4609 4.37077 20.0858 3.9957C19.7107 3.62063 19.202 3.40991 18.6716 3.40991C18.1411 3.40991 17.6324 3.62063 17.2574 3.9957M18.9997 12.5815C18.9997 16.4475 15.8657 19.5815 11.9997 19.5815C8.1337 19.5815 4.9997 16.4475 4.9997 12.5815C4.9997 8.71549 8.1337 5.58149 11.9997 5.58149C15.8657 5.58149 18.9997 8.71549 18.9997 12.5815Z"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
