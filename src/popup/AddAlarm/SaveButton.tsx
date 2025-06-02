import { IDate, isValidDate } from "../../utils/time";
import { Alarm } from "../../type/alarm";
import { getFromStorage, setToStorage } from "../storage";

interface SaveButtonProps {
  isUpdate: boolean;
  canSave: boolean;
  alarm: Alarm;
  date: IDate;
  onClose: () => void;
}

export default function SaveButton({
  isUpdate,
  canSave,
  alarm,
  date,
  onClose
}: SaveButtonProps) {
  return (
    <button
      onClick={async () => {
        // TimePicker 애니메이션 시간 확보
        if (!canSave) return;

        const newAlarm = {
          ...alarm
        };

        if (newAlarm.isOneTime) {
          const dateValidation = isValidDate(date);

          if (!dateValidation) {
            alert("올바른 날짜가 아닙니다.");
            return;
          }
          const { year, month, day } = date;

          newAlarm["date"] = `${year}-${month}-${day}`;
        }

        const dbAlarms = (await getFromStorage<Alarm[]>("alarms")) || [];

        // 수정
        if (isUpdate) {
          if (dbAlarms === null) return;
          const newAlarms = dbAlarms.map(a => {
            if (a.id !== alarm.id) return a;
            return newAlarm;
          });

          await setToStorage<Alarm[]>("alarms", newAlarms);
        }
        // 생성
        else {
          await setToStorage<Alarm[]>("alarms", [...dbAlarms, newAlarm]);
        }

        onClose();
      }}
      className="hover:duration-300 hover:bg-[#2d2a2a] text-center bg-[#434040] mt-auto mx-[8px] mb-[12px] p-[8px] rounded-[12px] font-bold text-white cursor-pointer"
    >
      저장
    </button>
  );
}
