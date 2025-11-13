import { useEffect, useState } from "react";
import { TrashedAlarm } from "../type/alarm";
import { t } from "../utils/i18n";
import {
  cleanExpiredTrash,
  restoreFromTrash,
  deleteFromTrash,
} from "../utils/trash";
import { getFromStorage } from "./storage";
import { Dialog } from "./Popup";
import { getTimeInfo } from "../utils/time";

interface TrashProps {
  onChangeDialog: (dialog: Dialog) => void;
  is24HourFormat: boolean;
}

export default function Trash({ onChangeDialog, is24HourFormat }: TrashProps) {
  const [trashedAlarms, setTrashedAlarms] = useState<TrashedAlarm[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchTrashedAlarms = async () => {
    // 7일 지난 항목 자동 삭제
    await cleanExpiredTrash();
    const trashed =
      (await getFromStorage<TrashedAlarm[]>("trashedAlarms")) || [];
    setTrashedAlarms(trashed);
    // 삭제된 항목이 선택되어 있으면 선택 해제
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      const trashedIds = new Set(trashed.map((a) => a.id));
      Array.from(newSet).forEach((id) => {
        if (!trashedIds.has(id)) {
          newSet.delete(id);
        }
      });
      return newSet;
    });
  };

  useEffect(() => {
    fetchTrashedAlarms();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleRestoreSelected = async () => {
    for (const id of selectedIds) {
      await restoreFromTrash(id);
    }
    setSelectedIds(new Set());
    await fetchTrashedAlarms();
  };

  const handleDeleteSelected = async () => {
    if (confirm(t("confirmDeletePermanently"))) {
      for (const id of selectedIds) {
        await deleteFromTrash(id);
      }
      setSelectedIds(new Set());
      await fetchTrashedAlarms();
    }
  };

  const getDaysRemaining = (deletedAt: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deletedDate = new Date(deletedAt);
    deletedDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - deletedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return 7 - diffDays;
  };

  return (
    <div
      id="trash-overlay"
      className="select-none absolute inset-0 w-full h-full bg-[#434040] flex flex-col"
    >
      {/* Header */}
      <div className="p-[8px] flex justify-between items-center">
        <svg
          onClick={() => {
            onChangeDialog("list");
          }}
          id="close-trash-overlay"
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
        <span className="text-white font-bold text-[16px]">{t("trash")}</span>
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

      {/* Trash List */}
      <div className="flex-1 px-[12px] py-[8px] overflow-y-auto">
        {trashedAlarms.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-[14px] opacity-60">
              {t("emptyTrashMessage")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[8px]">
            {trashedAlarms.map((alarm) => {
              const { hour, minute, isAM } = getTimeInfo(alarm);
              const daysRemaining = getDaysRemaining(alarm.deletedAt);
              const isSelected = selectedIds.has(alarm.id);

              return (
                <div
                  key={alarm.id}
                  onClick={() => toggleSelection(alarm.id)}
                  className={`rounded-[8px] p-[12px] cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#4a4a4a] border-2 border-[#FFC107]"
                      : "bg-[#3a3a3a] border-2 border-transparent"
                  }`}
                >
                  {/* Alarm Info */}
                  <div className="flex items-start gap-[12px]">
                    {/* Checkbox */}
                    <div className="mt-[4px]">
                      <div
                        className={`w-[20px] h-[20px] rounded-[4px] border-2 flex items-center justify-center ${
                          isSelected
                            ? "bg-[#FFC107] border-[#FFC107]"
                            : "border-[#666]"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="#000"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Alarm Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-[8px]">
                        <span className="text-white font-bold text-[20px]">
                          {is24HourFormat
                            ? `${alarm.time}`
                            : `${isAM ? "AM" : "PM"} ${hour}:${minute}`}
                        </span>
                      </div>
                      {alarm.isOneTime ? (
                        <p className="text-white text-[12px] opacity-70 mt-[2px]">
                          {alarm.date}
                        </p>
                      ) : (
                        <p className="text-white text-[12px] opacity-70 mt-[2px]">
                          {alarm.days.join(", ")}
                        </p>
                      )}
                      {alarm.memo && (
                        <p className="text-white text-[11px] opacity-80 mt-[4px] bg-[#2a2a2a] px-[8px] py-[4px] rounded-[4px]">
                          {alarm.memo}
                        </p>
                      )}
                      {/* Days Remaining */}
                      <div className="mt-[8px]">
                        <span className="text-[#FFC107] text-[11px] font-medium bg-[#2a2a2a] px-[8px] py-[2px] rounded-[4px]">
                          {daysRemaining > 0
                            ? `${daysRemaining}${t("daysRemaining")}`
                            : t("willBeDeletedToday")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      {selectedIds.size > 0 && (
        <div className="py-[8px] px-[12px] bg-[#2a2a2a] border-t-2 border-[#1a1a1a] flex gap-[8px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestoreSelected();
            }}
            className="flex-1 cursor-pointer flex flex-col items-center justify-center gap-[2px]"
          >
            {/* Refresh Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="restore-icon"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span className="text-white text-[11px] font-medium">
              {t("restoreSelected")} ({selectedIds.size})
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSelected();
            }}
            className="flex-1 cursor-pointer flex flex-col items-center justify-center gap-[2px]"
          >
            {/* Trash Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="trash-icon"
            >
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <span className="text-white text-[11px] font-medium">
              {t("deleteSelected")} ({selectedIds.size})
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
