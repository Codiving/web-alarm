import { useEffect, useRef, useState } from "react";
import { EditAlarm } from "../../type/alarm";
import { getDateInfo, getInitAlarm, getInitDate } from "../../utils/time";
import { OnChangeDialog } from "../Popup";
import AlarmDate from "./AlarmDate";
import AlarmDays from "./AlarmDays";
import Header from "./Header";
import MemoInput from "./MemoInput";
import SaveButton from "./SaveButton";
import TimePicker from "./TimePicker";
import ToggleSwitch from "./ToggleSwitch";
import { t } from "../../utils/i18n";

interface AlarmListProps {
  alarm: EditAlarm | null;
  onChangeAlarm: (id: EditAlarm | null) => void;
  onChangeDialog: OnChangeDialog;
}

export default function AddAlarm({
  alarm: upperAlarm,
  onChangeAlarm,
  onChangeDialog
}: AlarmListProps) {
  const [canSave, setCanSave] = useState(false);
  const [date, setDate] = useState(
    upperAlarm?.date ? getDateInfo(upperAlarm.date) : getInitDate()
  );
  const [alarm, setAlarm] = useState(upperAlarm ?? getInitAlarm());

  const { days, isOneTime, memo } = alarm;

  const ampmRef = useRef<string>(null);
  const hourRef = useRef<string>(null);
  const minuteRef = useRef<string>(null);

  const handleDate = (key: string, value: string) => {
    setDate(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggle = (isOneTime: boolean) =>
    setAlarm(prev => ({
      ...prev,
      isOneTime
    }));

  const handleDays = (dayKorean: string, isSelected: boolean) => {
    if (isSelected) {
      setAlarm(prev => ({
        ...prev,
        days: prev.days.filter(d => d !== dayKorean)
      }));
    } else {
      setAlarm(prev => ({
        ...prev,
        days: [...prev.days, dayKorean]
      }));
    }
  };

  const handleMemo = (memo: string) =>
    setAlarm(prev => ({
      ...prev,
      memo
    }));

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
          ampmRef={ampmRef}
          hourRef={hourRef}
          minuteRef={minuteRef}
        />
      </div>
      <div className="flex flex-col bg-[#6e6c6c] flex-1 mt-[12px] mx-[4px] px-[4px] rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
        <ToggleSwitch isOneTime={isOneTime} onToggle={handleToggle} />
        <div className="flex flex-col gap-[4px]">
          <p className="pl-[10px] text-white font-bold text-[14px]">
            {isOneTime ? t("activeDays") : t("activeDate")}
          </p>
          <div className="rounded-[12px] mx-[8px]">
            {!isOneTime && <AlarmDays days={days} onChangeDays={handleDays} />}
            {isOneTime && <AlarmDate date={date} onChangeDate={handleDate} />}
          </div>
        </div>
        <MemoInput memo={memo} onChange={handleMemo} />
        <SaveButton
          isUpdate={!!upperAlarm}
          canSave={canSave}
          alarm={alarm}
          date={date}
          ampmRef={ampmRef}
          hourRef={hourRef}
          minuteRef={minuteRef}
          onClose={() =>
            onChangeDialog("add", {
              open: false
            })
          }
        />
      </div>
    </div>
  );
}
