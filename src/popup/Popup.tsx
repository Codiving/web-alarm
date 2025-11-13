import { useEffect, useState } from "react";
import { EditAlarm } from "../type/alarm";
import { t } from "../utils/i18n";
import AddAlarm from "./AddAlarm";
import AlarmList from "./AlarmList";
import { getIs24HourFormat } from "../type/day";
import { setToStorage } from "./storage";
import Setting from "./Setting";
import Trash from "./Trash";

export type Dialog = "add" | "list" | "setting" | "trash";

export default function Popup() {
  const [dialog, setDialog] = useState<Dialog>("list");
  const [alarm, setAlarm] = useState<EditAlarm>(null);
  const [type, setType] = useState<string>(t("all"));
  const [is24HourFormat, setIs24HourFormat] = useState<boolean | null>(null);
  const [isSidePanel, setIsSidePanel] = useState<boolean>(false);

  const onChangeDialog = (dialog: Dialog) => setDialog(dialog);

  const onChangeAlarm = (alarm: EditAlarm) => setAlarm(alarm);

  const onChangeIs24HourFormat = async (format: boolean) => {
    setIs24HourFormat(format);
    await setToStorage("is24HourFormat", format);
  };

  useEffect(() => {
    (async () => {
      const result = await getIs24HourFormat();
      setIs24HourFormat(result);

      // 사이드 패널인지 확인
      // @ts-ignore - sidePanel API는 타입 정의가 없을 수 있음
      if (chrome.sidePanel && window.location.pathname.includes("sidepanel")) {
        setIsSidePanel(true);
      }
    })();
  }, []);

  if (is24HourFormat === null) return null;

  return (
    <div
      className={`relative bg-[#434040] overflow-hidden ${
        isSidePanel ? "w-full h-screen" : "w-[330px] h-[450px]"
      }`}
    >
      {dialog === "add" && (
        <AddAlarm
          alarm={alarm}
          onChangeAlarm={onChangeAlarm}
          onChangeDialog={onChangeDialog}
          is24HourFormat={is24HourFormat}
          currentType={type}
        />
      )}
      {dialog === "list" && (
        <AlarmList
          onChangeAlarm={onChangeAlarm}
          onChangeDialog={onChangeDialog}
          type={type}
          onChangeType={type => setType(type)}
          is24HourFormat={is24HourFormat}
          isSidePanel={isSidePanel}
        />
      )}
      {dialog === "setting" && (
        <Setting
          onChangeDialog={onChangeDialog}
          is24HourFormat={is24HourFormat}
          onChangeIs24HourFormat={onChangeIs24HourFormat}
        />
      )}
      {dialog === "trash" && (
        <Trash
          onChangeDialog={onChangeDialog}
          is24HourFormat={is24HourFormat}
        />
      )}
    </div>
  );
}
