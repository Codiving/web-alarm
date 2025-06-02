import { useEffect, useRef, useState } from "react";
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
  const [canSave, setCanSave] = useState(false);
  const [alarm, setAlarm] = useState(
    upperAlarm ?? {
      id: crypto.randomUUID(),
      days: ["월", "화", "수", "목", "금"],
      isOneTime: false,
      memo: "",
      time: getCurrentTime(),
      date: "",
    }
  );

  const { days, isOneTime, memo } = alarm;

  const ampmRef = useRef<string>(null);
  const hourRef = useRef<string>(null);
  const minuteRef = useRef<string>(null);

  useEffect(() => {
    setTimeout(() => {
      setCanSave(true);
    }, 1500);

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
        <TimePicker
          alarm={alarm}
          onChangeAlarm={setAlarm}
          ampmRef={ampmRef}
          hourRef={hourRef}
          minuteRef={minuteRef}
        />
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
          <p className="pl-[10px] text-white font-bold text-[14px]">
            {isOneTime ? "활성화된 요일" : "활성화된 날짜"}
          </p>
          <div className="rounded-[12px] mx-[8px]">
            {!isOneTime && (
              <div className="h-[50px] grid grid-cols-7 gap-[2px] text-center">
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
                      className="self-baseline cursor-pointer py-[4px] px-[6px] my-[6px] rounded-xl text-[13px]"
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
            )}
            {isOneTime && (
              <div className="h-[50px] grid grid-cols-3 gap-[4px]">
                <div className="flex flex-col gap-[3px]">
                  <p className="text-white text-[12px] tracking-[1.2px]">DAY</p>
                  <input className="p-[4px] rounded-[4px] h-[28px] bg-white focus:outline-none focus:ring-0 border border-gray-400" />
                </div>
                <div className="flex flex-col gap-[3px]">
                  <p className="text-white text-[12px] tracking-[1.2px]">
                    MONTH
                  </p>
                  <input className="p-[4px] rounded-[4px] h-[28px] bg-white focus:outline-none focus:ring-0 border border-gray-400" />
                </div>
                <div className="flex flex-col gap-[3px]">
                  <p className="text-white text-[12px] tracking-[1.2px]">
                    YEAR
                  </p>
                  <input className="p-[4px] rounded-[4px] h-[28px] bg-white focus:outline-none focus:ring-0 border border-gray-400" />
                </div>
              </div>
            )}
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
            // TimePicker 애니메이션 시간 확보
            if (!canSave) return;

            const dbAlarms = (await getFromStorage<Alarm[]>("alarms")) || [];

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
