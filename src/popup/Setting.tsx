import { Dialog } from "./Popup";

interface SettingProps {
  onChangeDialog: (dialog: Dialog) => void;
}

export default function Setting({ onChangeDialog }: SettingProps) {
  return (
    <div
      id="add-alarm-overlay"
      className="select-none absolute inset-0 w-full h-full bg-[#434040] flex flex-col justify-between"
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
        <span className="text-white font-bold text-[16px]">{"Setting"}</span>
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
    </div>
  );
}
