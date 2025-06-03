import { Alarm } from "../type/alarm";
import {
  getOverlayEntry,
  removeOverlay,
  removeOverlayEntry,
  showOverlay,
  updateOverlayVisibility
} from "./overlayManager.js";

function getCurrentTimestamp() {
  const now = new Date();

  return {
    yyyy: String(now.getFullYear()),
    mm: String(now.getMonth() + 1).padStart(2, "0"),
    dd: String(now.getDate()).padStart(2, "0"),
    hour: String(now.getHours()).padStart(2, "0"),
    minute: String(now.getMinutes()).padStart(2, "0")
  };
}

// 현재 알람 목록 확인 및 조건 충족 시 overlay 표시
function checkAlarms() {
  const { yyyy, mm, dd, hour, minute } = getCurrentTimestamp();
  const now = new Date();

  const dayMap = ["일", "월", "화", "수", "목", "금", "토"];
  const todayKorean = dayMap[now.getDay()];

  chrome.storage.local.get(["alarms", "closedAlarms"], result => {
    const alarms = result.alarms || [];
    const closedAlarms = result.closedAlarms || {};

    alarms.forEach((alarm: Alarm) => {
      const { time, days, id, isOneTime, date } = alarm;
      const [alarmHours, alarmMinutes] = time.split(":");

      if (closedAlarms[id]) {
        const closedDate = new Date(closedAlarms[id]);
        if (closedDate.getTime() < now.getTime()) {
          delete closedAlarms[id];
          chrome.storage.local.set({ closedAlarms });
        } else {
          return; // 닫힌 알람 유지 중
        }
      }

      // 일회용 알람인 경우 날짜까지 같은지 확인
      if (isOneTime) {
        const currentDate = `${yyyy}-${mm}-${dd}`;
        if (currentDate !== date) {
          return;
        }
      }
      if (
        alarmHours === hour &&
        alarmMinutes === minute &&
        days.includes(todayKorean)
      ) {
        showOverlay(alarm);
      }
    });
  });
}

// chrome.storage 변경 감지해 overlay 제거 처리
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") return;

  if (changes.closedAlarms) {
    const closedAlarms = changes.closedAlarms.newValue || {};

    for (const alarmId of Object.keys(closedAlarms)) {
      const entry = getOverlayEntry(alarmId);
      if (entry) {
        const { overlay, intervalId } = entry;
        if (document.body.contains(overlay)) {
          removeOverlay(overlay);
        }
        clearInterval(intervalId);
        removeOverlayEntry(alarmId);
      }
    }

    // 남은 overlay가 있으면 마지막만 표시, 없으면 body overflow 복원
    updateOverlayVisibility();
  }
});

// 1초마다 알람 체크 실행
setInterval(checkAlarms, 1000);
