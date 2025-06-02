import { useEffect, useState } from "react";
import { Alarm, EditAlarm } from "../../type/alarm";
import { DAY_TO_KOREAN, DAYS } from "../../type/day";
import { OnChangeDialog } from "../Popup";
import { getFromStorage, setToStorage } from "../storage";
import Header from "./Header";
import TimePicker from "./TimePicker";
import ToggleSwitch from "./ToggleSwitch";

interface AlarmListProps {
  alarm: EditAlarm | null;
  onChangeAlarm: (id: EditAlarm | null) => void;
  onChangeDialog: OnChangeDialog;
}

const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function AddAlarm({
  alarm: upperAlarm,
  onChangeAlarm,
  onChangeDialog,
}: AlarmListProps) {
  const [alarm, setAlarm] = useState(
    upperAlarm ?? {
      id: crypto.randomUUID(),
      days: ["월", "화", "수", "목", "금"],
      isOneTime: false,
      memo: "",
      time: getCurrentTime(),
    }
  );

  const { days, isOneTime, memo } = alarm;

  useEffect(() => {
    return () => {
      onChangeAlarm(null);
    };
  }, []);

  return (
    <div
      id="add-alarm-overlay"
      className="select-none absolute inset-0 w-full h-full bg-[#434040] flex flex-col justify-between"
    >
      <div>
        <Header alarm={alarm} onChangeDialog={onChangeDialog} />
        <TimePicker alarm={alarm} onChangeAlarm={setAlarm} />
      </div>
      <div className="flex flex-col bg-[#6e6c6c] flex-1 mt-[12px] mx-[4px] px-[4px] rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
        <ToggleSwitch
          isOneTime={isOneTime}
          onToggle={(isOneTime) =>
            setAlarm((prev) => ({
              ...prev,
              isOneTime,
            }))
          }
        />
        <div className="flex flex-col gap-[4px]">
          <p className="pl-[12px] text-white font-bold text-[14px]">
            활성화된 요일
          </p>
          <div className="rounded-[12px] mx-[8px]">
            <div className="grid grid-cols-7 text-center">
              {DAYS.map((day) => {
                const dayKorean = DAY_TO_KOREAN[day];
                const isSelected = days.includes(dayKorean);
                return (
                  <span
                    onClick={() => {
                      if (isSelected) {
                        setAlarm((prev) => ({
                          ...prev,
                          days: prev.days.filter((d) => d !== dayKorean),
                        }));
                      } else {
                        setAlarm((prev) => ({
                          ...prev,
                          days: [...prev.days, dayKorean],
                        }));
                      }
                    }}
                    key={day}
                    className="cursor-pointer py-[4px] px-[6px] my-[6px] mx-[2px] rounded-xl text-[13px]"
                    style={{
                      color: isSelected ? "#fff" : "#fff",
                      backgroundColor: isSelected ? "#ff8800" : "#ccc",
                      boxShadow: isSelected
                        ? "inset 0 1px 5px 0 rgba(0, 0, 0, 0.25)"
                        : undefined,
                    }}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[4px] mt-[12px]">
          <input
            className="focus:outline-none focus:ring-0 px-[8px] text-[14px] bg-white mx-[8px] rounded-[8px] h-[34px] placeholder:text-[14px]"
            placeholder="메모"
            value={memo}
            onChange={(e) =>
              setAlarm((prev) => ({
                ...prev,
                memo: e.target.value,
              }))
            }
          />
        </div>
        <button
          onClick={async () => {
            const dbAlarms = await getFromStorage<Alarm[]>("alarms");

            if (dbAlarms === null) return;

            // 수정
            if (upperAlarm) {
              if (dbAlarms === null) return;
              const newAlarms = dbAlarms.map((a) => {
                if (a.id !== alarm.id) return a;
                return alarm;
              });

              await setToStorage<Alarm[]>("alarms", newAlarms);
            }
            // 생성
            else {
              await setToStorage<Alarm[]>("alarms", [...dbAlarms, alarm]);
            }

            onChangeDialog("add", {
              open: false,
            });
          }}
          className="hover:duration-300 hover:bg-[#2d2a2a] text-center bg-[#434040] mt-auto mx-[8px] mb-[12px] p-[8px] rounded-[12px] font-bold text-white cursor-pointer"
        >
          저장
        </button>
      </div>
    </div>
  );
}
