import { useEffect, useState } from "react";
import { OnChangeDialog } from "../Popup";
import Header from "./Header";
import TimePicker from "./TimePicker";
import { t } from "../../utils/i18n";
import { Alarm, Day, DAY_TO_KOREAN, DAYS, EditAlarm } from "../AlarmList";
import { getFromStorage } from "../storage";

interface AlarmListProps {
  alarm: EditAlarm | null;
  onChangeAlarm: (id: EditAlarm | null) => void;
  onChangeDialog: OnChangeDialog;
}

type ToggleSwitchProps = {
  isOn: boolean;
  onToggle: (newState: boolean) => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => {
  return (
    <div className="flex justify-end items-center gap-[4px]">
      <div className="tooltip">
        <span className="tooltiptext">
          설정된 요일과 상관 없이 1번 발생하고 삭제됩니다.
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="#6e6c6c"
          className="mt-[2px]"
        >
          <g id="Warning / Info">
            <path
              id="Vector"
              d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </div>

      <div className="one-time-toggle">
        <label
          htmlFor="oneTimeAlarm"
          className="text-[14px] text-white font-bold"
        >
          1회용 알람
        </label>
        <label className="switch">
          <input
            type="checkbox"
            id="oneTimeAlarm"
            checked={isOn}
            onChange={e => onToggle(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default function AddAlarm({
  alarm,
  onChangeAlarm,
  onChangeDialog
}: AlarmListProps) {
  const [days, setDays] = useState<Day[]>(["월", "화", "수", "목", "금"]);
  const [isOn, setIsOn] = useState(false);
  const [memo, setMemo] = useState(alarm?.memo ?? "");

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
        <TimePicker alarm={alarm} />
      </div>
      <div className="flex flex-col bg-[#6e6c6c] flex-1 mt-[12px] mx-[4px] px-[4px] rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
        <ToggleSwitch isOn={isOn} onToggle={setIsOn} />
        <div className="flex flex-col gap-[4px]">
          <p className="pl-[12px] text-white font-bold text-[14px]">
            활성화된 요일
          </p>
          <div className="rounded-[12px] mx-[8px]">
            <div className="grid grid-cols-7 text-center">
              {DAYS.map(day => {
                const dayKorean = DAY_TO_KOREAN[day];
                const isSelected = days.includes(dayKorean);
                return (
                  <span
                    onClick={() => {
                      if (isSelected) {
                        setDays(prev => prev.filter(d => d !== dayKorean));
                      } else {
                        setDays(prev => [...prev, dayKorean]);
                      }
                    }}
                    key={day}
                    className="cursor-pointer py-[4px] px-[6px] my-[6px] mx-[2px] rounded-xl text-[13px]"
                    style={{
                      color: isSelected ? "#fff" : "#fff",
                      backgroundColor: isSelected ? "#ff8800" : "#ccc",
                      boxShadow: isSelected
                        ? "inset 0 1px 5px 0 rgba(0, 0, 0, 0.25)"
                        : undefined
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
            onChange={e => setMemo(e.target.value)}
          />
        </div>
        <button
          onClick={async () => {
            const dbAlarms = await getFromStorage<Alarm[]>("alarms");

            if (dbAlarms === null) return;

            // 수정
            if (alarm) {
              if (dbAlarms === null) return;
              const newAlarms = dbAlarms.map(a => {
                if (a.id !== alarm.id) return a;
                return {
                  ...a,
                  days,
                  isOneTime: isOn,
                  memo
                };
              });
            }
            // 생성
            else {
            }
          }}
          className="hover:duration-300 hover:bg-[#2d2a2a] text-center bg-[#434040] mt-auto mx-[12px] mb-[12px] p-[8px] rounded-[12px] font-bold text-white cursor-pointer"
        >
          저장
        </button>
      </div>
    </div>
  );
}
