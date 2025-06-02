import { useRef } from "react";
import { Alarm } from "../../../type/alarm";
import { getTimeInfo } from "../../../utils/time";
import List from "./List";

export const TEMP = "" as const;
const AM_PM = ["오전", "오후"];
const paddedAMPM = [TEMP, ...AM_PM, TEMP];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const paddedHOURS = [TEMP, ...HOURS, TEMP];

const MINUTES = Array.from({ length: 60 }, (_, i) => String(i));
const paddedMINUTES = [TEMP, ...MINUTES, TEMP];

interface TimePickerProps {
  alarm: Alarm;
  onChangeAlarm: (alarm: Alarm) => void;
}

export default function TimePicker({ alarm, onChangeAlarm }: TimePickerProps) {
  const { isAM, hour, minute } = getTimeInfo(alarm);
  const ampm = isAM ? "오전" : "오후";

  const ampmRef = useRef<string>(null);
  const hourRef = useRef<string>(null);
  const minuteRef = useRef<string>(null);

  return (
    <div className="grid grid-cols-3 gap-2 w-full text-center font-bold">
      <List
        valueRef={ampmRef}
        label="meridiem"
        items={paddedAMPM}
        selected={ampm}
      />
      <List valueRef={hourRef} items={paddedHOURS} selected={hour} />
      <List valueRef={minuteRef} items={paddedMINUTES} selected={minute} />
    </div>
  );
}
