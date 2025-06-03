import { useState } from "react";
import { EditAlarm } from "../type/alarm";
import AddAlarm from "./AddAlarm";
import AlarmList from "./AlarmList";
import { t } from "../utils/i18n";

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

  return (
    <div className="relative w-[330px] h-[400px] bg-[#434040] overflow-hidden">
      {dialog.add.open && (
        <AddAlarm
          alarm={alarm}
          onChangeAlarm={onChangeAlarm}
          onChangeDialog={onChangeDialog}
        />
      )}
      {!dialog.add.open && (
        <AlarmList
          onChangeAlarm={onChangeAlarm}
          onChangeDialog={onChangeDialog}
          type={type}
          onChangeType={type => setType(type)}
        />
      )}
    </div>
  );
}
