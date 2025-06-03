import { IDate, isPastTime, isValidDate } from "../../utils/time";
import { Alarm } from "../../type/alarm";
import { getFromStorage, setToStorage } from "../storage";
import { t } from "../../utils/i18n";

interface SaveButtonProps {
  isUpdate: boolean;
  canSave: boolean;
  alarm: Alarm;
  date: IDate;
  onClose: () => void;
  ampmRef: React.RefObject<string | null>;
  hourRef: React.RefObject<string | null>;
  minuteRef: React.RefObject<string | null>;
}

export default function SaveButton({
  isUpdate,
  canSave,
  alarm,
  date,
  onClose,
  ampmRef,
  hourRef,
  minuteRef
}: SaveButtonProps) {
  return (
    <button
      onClick={async () => {
        // TimePicker 애니메이션 시간 확보
        if (!canSave) return;
        if (!ampmRef.current) return;
        if (!hourRef.current) return;
        if (!minuteRef.current) return;

        const hours24 = Number(hourRef.current);
        const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

        const minute = minuteRef.current;
        const time = `${String(hour12).padStart(2, "0")}:${minute.padStart(
          2,
          "0"
        )}`;

        const newAlarm = {
          ...alarm,
          time
        };

        if (newAlarm.isOneTime) {
          const dateValidation = isValidDate(date);

          if (dateValidation === "falsyDate") {
            alert(t("invalidDate"));
            return;
          }
          if (dateValidation === "cantBeforeDate") {
            alert(t("pastDateNotAllowed"));
            return;
          }

          // 오늘인 경우 시간까지 검사
          if (dateValidation === "today") {
            const isPast = isPastTime({
              hour: String(hours24),
              minute
            });
            if (isPast) {
              alert(t("pastTimeNotAllowed"));
              return;
            }
          }

          const { year, month, day } = date;

          newAlarm["date"] = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
        }

        const dbAlarms = (await getFromStorage<Alarm[]>("alarms")) || [];

        // 수정
        if (isUpdate) {
          if (dbAlarms === null) return;
          const newAlarms = dbAlarms.map(a => {
            if (a.id !== alarm.id) return a;
            return newAlarm;
          });

          console.log("newAlarm : ", newAlarm);

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
      {t("save")}
    </button>
  );
}
