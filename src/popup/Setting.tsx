import { t } from "../utils/i18n";
import { Dialog } from "./Popup";

interface SettingProps {
  is24HourFormat: boolean;
  onChangeIs24HourFormat: (format: boolean) => Promise<void>;
  onChangeDialog: (dialog: Dialog) => void;
}

export default function Setting({
  onChangeDialog,
  is24HourFormat,
  onChangeIs24HourFormat
}: SettingProps) {
  return (
    <div
      id="add-alarm-overlay"
      className="select-none absolute inset-0 w-full h-full bg-[#434040]"
    >
      <div className="p-[8px] flex justify-between items-center">
        <svg
          onClick={() => {
            onChangeDialog("list");
          }}
          id="close-alarm-overlay"
          className="cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
          width="20px"
          height="30px"
          viewBox="0 0 42 42"
        >
          <polygon
            fillRule="evenodd"
            points="31,38.32 13.391,21 31,3.68 28.279,1 8,21.01 28.279,41 "
          />
        </svg>
        <span className="text-white font-bold text-[16px]">{t("setting")}</span>
        <svg
          className="invisible"
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
          width="20px"
          height="30px"
          viewBox="0 0 42 42"
        >
          <polygon
            fillRule="evenodd"
            points="31,38.32 13.391,21 31,3.68 28.279,1 8,21.01 28.279,41 "
          />
        </svg>
      </div>
      <div className="mt-[12px] py-[8px] px-[12px] flex flex-col gap-[8px]">
        <p className="text-white font-bold">{t("timeFormat")}</p>
        <div className="flex gap-[4px]">
          <button
            onClick={async () => {
              await onChangeIs24HourFormat(true);
            }}
            className="flex-1 cursor-pointer text-[14px] text-white py-[4px] px-[8px] rounded-[4px]"
            style={{
              backgroundColor: is24HourFormat ? "#0000005c" : "#5c5c5c"
            }}
          >
            {t("twentyFourHourFormat")}
          </button>
          <button
            onClick={async () => {
              await onChangeIs24HourFormat(false);
            }}
            className="flex-1 cursor-pointer text-[14px] text-white py-[4px] px-[8px] rounded-[4px]"
            style={{
              backgroundColor: !is24HourFormat ? "#0000005c" : "#5c5c5c"
            }}
          >
            {t("twelveHourFormat")}
          </button>
        </div>
      </div>
    </div>
  );
}
