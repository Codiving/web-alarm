interface AlarmDateProps {
  date: {
    day: string;
    month: string;
    year: string;
  };
  onChangeDate: (key: string, value: string) => void;
}

export default function AlarmDate({ date, onChangeDate }: AlarmDateProps) {
  return (
    <div className="h-[50px] grid grid-cols-3 gap-[4px]">
      <div className="flex flex-col gap-[3px]">
        <p className="text-white text-[12px] tracking-[1.2px]">DAY</p>
        <input
          name="day"
          value={date.day}
          onChange={e => {
            const { value, name: key } = e.target;
            onChangeDate(key, value);
          }}
          className="text-[14px] px-[8px] rounded-[4px] h-[28px] bg-white focus:outline-none focus:ring-0 border border-gray-400"
        />
      </div>
      <div className="flex flex-col gap-[3px]">
        <p className="text-white text-[12px] tracking-[1.2px]">MONTH</p>
        <input
          name="month"
          value={date.month}
          onChange={e => {
            const { value, name: key } = e.target;
            onChangeDate(key, value);
          }}
          className="text-[14px] px-[8px] rounded-[4px] h-[28px] bg-white focus:outline-none focus:ring-0 border border-gray-400"
        />
      </div>
      <div className="flex flex-col gap-[3px]">
        <p className="text-white text-[12px] tracking-[1.2px]">YEAR</p>
        <input
          name="year"
          value={date.year}
          onChange={e => {
            const { value, name: key } = e.target;
            onChangeDate(key, value);
          }}
          className="text-[14px] px-[8px] rounded-[4px] h-[28px] bg-white focus:outline-none focus:ring-0 border border-gray-400"
        />
      </div>
    </div>
  );
}
