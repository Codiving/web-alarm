import { DAYS } from "../../type/day";
import { DAY_TO_KOREAN } from "../../type/day";

interface AlarmDaysProps {
  days: string[];
  onChangeDays: (dayKorean: string, isSelected: boolean) => void;
}

export default function AlarmDays({ days, onChangeDays }: AlarmDaysProps) {
  return (
    <div className="h-[50px] grid grid-cols-7 gap-[2px] text-center">
      {DAYS.map(day => {
        const dayKorean = DAY_TO_KOREAN[day];
        const isSelected = days.includes(dayKorean);
        return (
          <span
            onClick={() => {
              onChangeDays(dayKorean, isSelected);
            }}
            key={day}
            className="self-baseline cursor-pointer py-[4px] px-[6px] my-[6px] rounded-xl text-[13px]"
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
  );
}
