import React, { useEffect, useRef, useState } from "react";
import { TEMP } from ".";

const CENTER_ITEM_HEIGHT = 50;
const OTHER_ITEM_HEIGHT = 30;

interface ListProps {
  items: string[];
  selected: string;
  label?: string;
  valueRef: React.RefObject<string | null>;
}

export default function List({ items, selected, label, valueRef }: ListProps) {
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
}
