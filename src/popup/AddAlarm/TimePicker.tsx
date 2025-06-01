import React, { useState, useEffect, useRef } from "react";
import { EditAlarm } from "../AlarmList";

const ITEM_HEIGHT = 60;
const AM_PM = ["오전", "오후"];
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i));

interface ListProps {
  items: string[];
  selected: string;
  onSelect: (val: string) => void;
  className: string;
}

const List = ({ items, selected, onSelect, className }: ListProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = items.indexOf(selected);
    if (index >= 0 && ref.current) {
      ref.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "auto"
      });
    }
  }, [selected]);

  return (
    <div
      ref={ref}
      className="overflow-y-auto scroll-smooth snap-y snap-mandatory"
      style={{
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        height: ITEM_HEIGHT
      }}
    >
      {items.map(item => (
        <div
          key={item}
          className={`flex items-center justify-center snap-center text-white ${className}`}
          style={{
            height: ITEM_HEIGHT
          }}
          onClick={() => onSelect(item)}
        >
          {String(item).padStart(2, "0")}
        </div>
      ))}
    </div>
  );
};

const getTimeInfo = (alarm: EditAlarm) => {
  if (!alarm) {
    const now = new Date();
    const currentHours = now.getHours();
    const isAM = currentHours < 12;
    const hours12 = currentHours % 12 === 0 ? "12" : String(currentHours % 12);
    const currentMinutes = String(now.getMinutes());

    return {
      isAM,
      hour: hours12,
      minute: currentMinutes
    };
  }

  const { time } = alarm;
  const [hour24, numberMinute] = time.split(":").map(Number);
  const hour12 = hour24 % 12 === 0 ? "12" : String(hour24 % 12);
  const hour = String(hour12);
  const minute = String(numberMinute);
  const isAM = hour24 < 12;

  return {
    isAM,
    hour,
    minute
  };
};

interface TimePickerProps {
  alarm: EditAlarm;
}

export default function TimePicker({ alarm }: TimePickerProps) {
  const { isAM, hour: h, minute: m } = getTimeInfo(alarm);
  const [ampm, setAmpm] = useState(isAM ? "오전" : "오후");
  const [hour, setHour] = useState(h);
  const [minute, setMinute] = useState(m);

  const ampmRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const scrollTo = (
    ref: React.RefObject<HTMLDivElement | null>,
    index: number
  ) => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ITEM_HEIGHT * index,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollTo(ampmRef, AM_PM.indexOf(ampm));
    scrollTo(hourRef, HOURS.indexOf(hour));
    scrollTo(minuteRef, MINUTES.indexOf(minute));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2 w-full text-center font-bold">
      <List
        items={["오전", "오후"]}
        selected={ampm}
        onSelect={setAmpm}
        className="text-[20px]"
      />
      <List
        items={HOURS}
        selected={hour}
        onSelect={setHour}
        className="text-[32px]"
      />
      <List
        items={MINUTES}
        selected={minute}
        onSelect={setMinute}
        className="text-[32px]"
      />
    </div>
  );
}
