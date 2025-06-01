import { useState } from "react";
import AddAlarm from "./AddAlarm";
import AlarmList from "./AlarmList";

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

  const onChangeDialog = <K extends DialogKey>(
    key: K,
    value: DialogType[K]
  ) => {
    setDialog(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="relative w-[300px] h-[400px] bg-[#434040] overflow-hidden">
      {dialog.add.open && <AddAlarm onChangeDialog={onChangeDialog} />}
      <AlarmList onChangeDialog={onChangeDialog} />
    </div>
  );
}
