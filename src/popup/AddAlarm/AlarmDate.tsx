import { DATE_ORDER_BY_LOCALE, Lang } from "../../type/day";
import { t } from "../../utils/i18n";

interface AlarmDateProps {
  date: {
    day: string;
    month: string;
    year: string;
  };
  onChangeDate: (key: string, value: string) => void;
}

export default function AlarmDate({ date, onChangeDate }: AlarmDateProps) {
  const lang = chrome.i18n.getUILanguage() as Lang;
  const { order } = DATE_ORDER_BY_LOCALE[lang];

  return (
    <div className="h-[50px] grid grid-cols-3 gap-[4px]">
      {order.map(type => {
        return (
          <div className="flex flex-col gap-[3px]">
            <p className="text-white text-[12px] tracking-[1.2px]">{t(type)}</p>
            <input
              name={type}
              value={date[type]}
              onChange={e => {
                const { value, name: key } = e.target;
                onChangeDate(key, value);
              }}
              className="text-[14px] px-[8px] rounded-[4px] h-[28px] bg-white focus:outline-none focus:ring-0 border border-gray-400"
            />
          </div>
        );
      })}
    </div>
  );
}
