import { useEffect, useState } from "react";
import { EditAlarm } from "../type/alarm";
import { t } from "../utils/i18n";
import AddAlarm from "./AddAlarm";
import AlarmList from "./AlarmList";
import { getIs24HourFormat } from "../type/day";
import { setToStorage } from "./storage";

const DIALOG = {
  add: {
    open: false
  }
};

type DialogType = typeof DIALOG; // DIALOG 객체의 타입 추론
type DialogKey = keyof DialogType;
export type OnChangeDialog = <K extends DialogKey>(
  key: K,
  value: DialogType[K]
) => void;

export default function Popup() {
  const [dialog, setDialog] = useState(DIALOG);
  const [alarm, setAlarm] = useState<EditAlarm>(null);
  const [type, setType] = useState<string>(t("all"));
  const [is24HourFormat, setIs24HourFormat] = useState<boolean | null>(null);

  const onChangeDialog = <K extends DialogKey>(
    key: K,
    value: DialogType[K]
  ) => {
    setDialog(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const onChangeAlarm = (alarm: EditAlarm) => setAlarm(alarm);

  const onChangeIs24HourFormat = async (format: boolean) => {
    setIs24HourFormat(format);
    await setToStorage("is24HourFormat", format);
  };

  useEffect(() => {
    (async () => {
      const result = await getIs24HourFormat();
      setIs24HourFormat(result);
    })();
  }, []);

  if (is24HourFormat === null) return null;

  return (
    <div className="relative w-[330px] h-[450px] bg-[#434040] overflow-hidden">
      {dialog.add.open && (
        <AddAlarm
          alarm={alarm}
          onChangeAlarm={onChangeAlarm}
          onChangeDialog={onChangeDialog}
          is24HourFormat={is24HourFormat}
        />
      )}
      {!dialog.add.open && (
        <AlarmList
          onChangeAlarm={onChangeAlarm}
          onChangeDialog={onChangeDialog}
          type={type}
          onChangeType={type => setType(type)}
          is24HourFormat={is24HourFormat}
          onChangeIs24HourFormat={onChangeIs24HourFormat}
        />
      )}
    </div>
  );
}
