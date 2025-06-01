import { useState } from "react";
import { OnChangeDialog } from "../Popup";
import Header from "./Header";
import TimePicker from "./TimePicker";
import { t } from "../../utils/i18n";

const DAYS = [
  t("popup_html_sun"),
  t("popup_html_mon"),
  t("popup_html_tue"),
  t("popup_html_wed"),
  t("popup_html_thu"),
  t("popup_html_fri"),
  t("popup_html_sat")
];
interface AlarmListProps {
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

export default function AddAlarm({ onChangeDialog }: AlarmListProps) {
  const [days, setDays] = useState<number[]>([]);
  const [isOn, setIsOn] = useState(false);

  const [enabled, setEnabled] = useState(false);
  return (
    <div
      id="add-alarm-overlay"
      className="z-10 absolute inset-0 w-full h-full bg-[#434040] flex flex-col justify-between"
    >
      <div>
        <Header onChangeDialog={onChangeDialog} />
        <TimePicker />
      </div>
      <div className="bg-[#6e6c6c] flex-1 mt-[12px] px-[4px] rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
        <ToggleSwitch isOn={isOn} onToggle={setIsOn} />
        <div className="flex flex-col gap-[4px]">
          <p className="pl-[12px] text-white font-bold text-[14px]">
            활성화된 요일
          </p>
          <div className="rounded-[12px] mx-[8px]">
            <div className="grid grid-cols-7 text-center">
              {DAYS.map((day, index) => {
                const isSelected = days.includes(index);
                return (
                  <span
                    onClick={() => {
                      if (isSelected) {
                        setDays(prev => prev.filter(day => day !== index));
                      } else {
                        setDays(prev => [...prev, index]);
                      }
                    }}
                    key={day}
                    className="cursor-pointer py-[4px] px-[6px] my-[6px] mx-[2px] rounded-xl text-[13px]"
                    style={{
                      color: isSelected ? "#fff" : undefined,
                      backgroundColor: isSelected ? "#4a90e2" : "#ccc"
                    }}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
