import { t } from "../../utils/i18n";
import { Dialog } from "../Popup";

interface HeaderProps {
  isEdit: boolean;
  onChangeDialog: (dialog: Dialog) => void;
}

export default function Header({ isEdit, onChangeDialog }: HeaderProps) {
  return (
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
      <span className="text-white font-bold text-[16px]">
        {isEdit ? t("editAlarm") : t("addAlarm")}
      </span>
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
  );
}
