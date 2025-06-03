import React, { useEffect, useRef, useState } from "react";
import { Alarm, EditAlarm } from "../../type/alarm";
import { t } from "../../utils/i18n";

const TEMP = "" as const;
const AM_PM = ["오전", "오후"];
const paddedAMPM = [TEMP, ...AM_PM, TEMP];

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1));
const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i));
const paddedHOURS_12 = [TEMP, ...HOURS_12, TEMP];
const paddedHOURS_24 = [TEMP, ...HOURS_24, TEMP];

const MINUTES = Array.from({ length: 60 }, (_, i) => String(i));
const paddedMINUTES = [TEMP, ...MINUTES, TEMP];

const CENTER_ITEM_HEIGHT = 70;
const OTHER_ITEM_HEIGHT = 40;

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
        behavior: "auto"
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
        height: OTHER_ITEM_HEIGHT * 2 + CENTER_ITEM_HEIGHT
      }}
    >
      {items.map((item, idx) => {
        const isCenter = idx === centerIndex;
        const height = isCenter ? CENTER_ITEM_HEIGHT : OTHER_ITEM_HEIGHT;
        const fontSize = label
          ? isCenter
            ? "24px"
            : "20px"
          : isCenter
          ? "32px"
          : "20px";
        const color = isCenter ? "white" : "gray";
        const opacity = isCenter ? 1 : 0.6;
        const text = item === TEMP ? "" : item.padStart(2, "0");

        return (
          <div
            key={item + idx}
            className="flex items-center justify-center snap-center"
            style={{
              height,
              fontSize,
              color,
              opacity,
              transition: "all 0.2s ease"
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

const getTimeInfo = (alarm: EditAlarm, is24: boolean) => {
  if (!alarm) {
    const now = new Date();
    const hour24 = now.getHours();
    const minute = String(now.getMinutes());

    if (is24) {
      return {
        hour: String(hour24),
        minute
      };
    }

    const isAM = hour24 < 12;
    const hour12 = hour24 % 12 === 0 ? "12" : String(hour24 % 12);
    return {
      isAM,
      hour: hour12,
      minute
    };
  }

  const [hour24, min] = alarm.time.split(":").map(Number);
  const minute = String(min);

  if (is24) {
    return {
      hour: String(hour24),
      minute
    };
  }

  const isAM = hour24 < 12;
  const hour12 = hour24 % 12 === 0 ? "12" : String(hour24 % 12);
  return {
    isAM,
    hour: hour12,
    minute
  };
};

interface TimePickerProps {
  alarm: Alarm;
  ampmRef: React.RefObject<string | null>;
  hourRef: React.RefObject<string | null>;
  minuteRef: React.RefObject<string | null>;
  is24HourFormat: boolean;
}

export default function TimePicker({
  alarm,
  ampmRef,
  hourRef,
  minuteRef,
  is24HourFormat
}: TimePickerProps) {
  const timeInfo = getTimeInfo(alarm, is24HourFormat);
  const hour = timeInfo.hour;
  const minute = timeInfo.minute;

  if (is24HourFormat) {
    return (
      <div className="grid grid-cols-2 gap-2 w-full text-center font-bold">
        <List valueRef={hourRef} items={paddedHOURS_24} selected={hour} />
        <List valueRef={minuteRef} items={paddedMINUTES} selected={minute} />
      </div>
    );
  }

  const ampm = timeInfo.isAM ? t("am") : t("pm");

  return (
    <div className="grid grid-cols-3 gap-2 w-full text-center font-bold">
      <List
        valueRef={ampmRef!}
        label="meridiem"
        items={paddedAMPM}
        selected={ampm}
      />
      <List valueRef={hourRef} items={paddedHOURS_12} selected={hour} />
      <List valueRef={minuteRef} items={paddedMINUTES} selected={minute} />
    </div>
  );
}
