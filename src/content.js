let originalBodyOverflow = null;
const overlayMap = new Map(); // alarm.id => { overlay, intervalId }

// overlay DOM 요소 생성
function createOverlay(alarm) {
  const overlay = document.createElement("div");
  overlay.className = "web-alarm";
  overlay.id = `web-alarm-${alarm.id}`;
  overlay.dataset.id = alarm.id;

  /**
   * overlay에 보여지는 텍스트
   * 시간, 메모, close 관련 텍스트
   */
  overlay.innerHTML = `
    <div class="message-box">
      <p class="current-time"></p>
      <p class="alarm-time">${chrome.i18n.getMessage("content_js_alarm")} : ${
    alarm.time
  }</p>
      ${alarm.memo ? `<p class="alarm-memo">${alarm.memo}</p>` : ""}
    </div>
    <p class="alarm-close-message">${chrome.i18n.getMessage(
      "content_js_alarm_close"
    )}</p>
  `;

  return overlay;
}

// 인자로 넘어온 시간을 HH:mm으로 반환
function formatTime(date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

// 현재 시각을 overlay에 표시
function updateCurrentTime(overlay) {
  if (!overlay) return;

  const currentTimeElement = overlay.querySelector(".current-time");
  if (!currentTimeElement) return;

  currentTimeElement.textContent = formatTime(new Date());
}

// overlay 클릭 시 처리 로직
function handleOverlayClick(alarm, overlay, intervalId) {
  removeOverlay(overlay);

  const alarmId = alarm.id;
  const closedTime = new Date(new Date().getTime() + 60 * 1000).toISOString();

  chrome.storage.local.get(["alarms", "closedAlarms"], (result) => {
    const alarms = result.alarms || [];
    const closedAlarms = result.closedAlarms || {};

    const index = alarms.findIndex((a) => a.id === alarmId);
    const foundAlarm = alarms[index];

    if (foundAlarm?.isOneTime) {
      alarms.splice(findIndex, 1);
    }
    closedAlarms[alarmId] = closedTime;

    chrome.storage.local.set({ alarms, closedAlarms });

    clearInterval(intervalId);
    overlayMap.delete(alarmId);
  });

  // 남은 overlay가 있다면 마지막 것만 표시
  updateLastOverlayVisibility();
}

function removeOverlay(overlay) {
  if (document.body.contains(overlay)) {
    document.body.removeChild(overlay);
  }
}

function updateLastOverlayVisibility() {
  if (overlayMap.size > 0) {
    const lastOverlay = Array.from(overlayMap.values()).pop();
    if (lastOverlay) {
      lastOverlay.overlay.style.display = "flex";
    }
  } else {
    document.body.style.overflow = originalBodyOverflow || "";
    originalBodyOverflow = null;
  }
}

// 알람 overlay 생성 및 표시
function showOverlayWithAlarm(alarm) {
  // 이미 표시 중이면 무시
  if (overlayMap.has(alarm.id)) return;

  // 첫 overlay 생성 시점에만 원래 overflow 저장
  if (overlayMap.size === 0) {
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  // 기존 overlay 모두 숨기기 (최상단만 보이도록)
  overlayMap.forEach(({ overlay }) => {
    overlay.style.display = "none";
  });

  const overlay = createOverlay(alarm);
  updateCurrentTime(overlay);

  const intervalId = setInterval(() => updateCurrentTime(overlay), 1000);

  overlayMap.set(alarm.id, { overlay, intervalId });

  overlay.addEventListener("click", () => {
    handleOverlayClick(alarm, overlay, intervalId);
  });

  overlay.style.display = "flex";
  document.body.appendChild(overlay);
}

// 현재 알람 목록 확인 및 조건 충족 시 표시
function checkAlarms() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const today = now.getDay();
  const dayMap = ["일", "월", "화", "수", "목", "금", "토"];
  const todayKorean = dayMap[today];

  chrome.storage.local.get(["alarms", "closedAlarms"], (result) => {
    const alarms = result.alarms || [];
    const closedAlarms = result.closedAlarms || {};

    alarms.forEach((alarm) => {
      const { time, days, id } = alarm;
      const [alarmHours, alarmMinutes] = time.split(":");

      if (closedAlarms[id]) {
        const closedDate = new Date(closedAlarms[id]);
        if (closedDate.getTime() < now.getTime()) {
          delete closedAlarms[id];
          chrome.storage.local.set({ closedAlarms });
        } else {
          return;
        }
      }

      if (
        alarmHours === hours &&
        alarmMinutes === minutes &&
        days.includes(todayKorean)
      ) {
        showOverlayWithAlarm(alarm);
      }
    });
  });
}

// closedAlarms 갱신 감지하여 해당 overlay 제거
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.closedAlarms) {
    const closedAlarms = changes.closedAlarms.newValue || {};

    for (const alarmId of Object.keys(closedAlarms)) {
      const entry = overlayMap.get(alarmId);
      if (entry) {
        const { overlay, intervalId } = entry;
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        clearInterval(intervalId);
        overlayMap.delete(alarmId);
      }
    }

    // 닫힘 처리 후 남은 overlay 있으면 마지막 overlay 보여주기
    if (overlayMap.size > 0) {
      const lastEntry = Array.from(overlayMap.values()).pop();
      if (lastEntry) {
        lastEntry.overlay.style.display = "flex";
      }
    } else {
      document.body.style.overflow = originalBodyOverflow || "";
      originalBodyOverflow = null;
    }
  }
});

// 1초마다 알람 체크
setInterval(checkAlarms, 1000);
