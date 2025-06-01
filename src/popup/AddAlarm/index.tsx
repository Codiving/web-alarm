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

export default function AddAlarm({ onChangeDialog }: AlarmListProps) {
  const [days, setDays] = useState<number[]>([]);
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
                className="cursor-pointer py-[4px] px-[6px] my-[6px] mx-[2px] rounded-xl text-[14px]"
                style={{
                  color: isSelected ? "#fff" : undefined,
                  backgroundColor: isSelected ? "#4a90e2" : undefined
                }}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
