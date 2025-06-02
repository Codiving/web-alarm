import React, { useEffect, useRef, useState } from "react";
import { Alarm, EditAlarm } from "../../type/alarm";

const TEMP = "" as const;
const AM_PM = ["오전", "오후"];
const paddedAMPM = [TEMP, ...AM_PM, TEMP];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const paddedHOURS = [TEMP, ...HOURS, TEMP];

const MINUTES = Array.from({ length: 60 }, (_, i) => String(i));
const paddedMINUTES = [TEMP, ...MINUTES, TEMP];

const CENTER_ITEM_HEIGHT = 50;
const OTHER_ITEM_HEIGHT = 30;

interface ListProps {
  items: string[];
  selected: string;
  label?: string;
  valueRef: React.RefObject<string | null>;
}

const List = ({ items, selected, label, valueRef }: ListProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);

  const totalHeightAt = (index: number) =>
    index * OTHER_ITEM_HEIGHT - (CENTER_ITEM_HEIGHT - OTHER_ITEM_HEIGHT);

  useEffect(() => {
    const index = items.indexOf(selected);
    if (index >= 0 && ref.current) {
      ref.current.scrollTo({
        top: totalHeightAt(index),
        behavior: "auto",
      });
      setCenterIndex(index);
    }
  }, [selected]);

  const handleScroll = () => {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const visibleCenter = scrollTop + CENTER_ITEM_HEIGHT;
    const index = Math.round(
      (visibleCenter - OTHER_ITEM_HEIGHT) / OTHER_ITEM_HEIGHT
    );

    valueRef.current = items[index];
    setCenterIndex(index);
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className="overflow-y-auto scroll-smooth snap-y snap-mandatory"
      style={{
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        height: OTHER_ITEM_HEIGHT * 2 + CENTER_ITEM_HEIGHT,
      }}
    >
      {items.map((item, idx) => {
        const isCenter = idx === centerIndex;
        const height = isCenter ? CENTER_ITEM_HEIGHT : OTHER_ITEM_HEIGHT;
        const fontSize = isCenter ? (label ? "20px" : "28px") : "16px";
        const color = isCenter ? "white" : "gray";
        const opacity = isCenter ? 1 : 0.6;
        const text = item === TEMP ? "" : item.padStart(2, "0");

        return (
          <div
            key={item + idx}
            className={"flex items-center justify-center snap-center"}
            style={{
              height,
              fontSize,
              color,
              opacity,
              transition: "all 0.2s ease",
            }}
          >
            {text}
          </div>
        );
      })}
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
      minute: currentMinutes,
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
    minute,
  };
};

interface TimePickerProps {
  alarm: Alarm;
  onChangeAlarm: (alarm: Alarm) => void;
  ampmRef: React.RefObject<string | null>;
  hourRef: React.RefObject<string | null>;
  minuteRef: React.RefObject<string | null>;
}

export default function TimePicker({
  alarm,
  onChangeAlarm,
  ampmRef,
  hourRef,
  minuteRef,
}: TimePickerProps) {
  const { isAM, hour, minute } = getTimeInfo(alarm);
  const ampm = isAM ? "오전" : "오후";

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
