import { OnChangeDialog } from "../Popup";
import Header from "./Header";

interface AlarmListProps {
  onChangeDialog: OnChangeDialog;
}

export default function AddAlarm({ onChangeDialog }: AlarmListProps) {
  return (
    <div
      id="add-alarm-overlay"
      className="z-10 absolute inset-0 w-full h-full bg-[#434040]"
    >
      <Header onChangeDialog={onChangeDialog} />
    </div>
  );
}
