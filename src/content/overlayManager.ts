let originalBodyOverflow: any = null;
const overlayMap = new Map();

function createOverlay(alarm: any) {
  const overlay = document.createElement("div");
  overlay.className = "web-alarm";
  overlay.id = `web-alarm-${alarm.id}`;
  overlay.dataset.id = alarm.id;

  overlay.innerHTML = `
    <div class="message-box">
      <p class="current-time"></p>
      <p class="alarm-time">${chrome.i18n.getMessage("alarm")} : ${
    alarm.time
  }</p>
      ${alarm.memo ? `<p class="alarm-memo">${alarm.memo}</p>` : ""}
    </div>
    <p class="alarm-close-message">${chrome.i18n.getMessage(
      "closeAlarmMessage"
    )}</p>
  `;

  return overlay;
}

function getCurrentTime() {
  const date = new Date();
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(u => String(u).padStart(2, "0"))
    .join(":");
}

function updateCurrentTime(overlay: any) {
  if (!overlay) return;

  const currentTimeElement = overlay.querySelector(".current-time");
  if (!currentTimeElement) return;

  currentTimeElement.textContent = getCurrentTime();
}

function showOverlay(alarm: any) {
  if (overlayMap.has(alarm.id)) return;

  if (overlayMap.size === 0) {
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

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

function removeOverlay(overlay: any) {
  if (document.body.contains(overlay)) {
    document.body.removeChild(overlay);
  }
}

function updateOverlayVisibility() {
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

function getOverlayEntry(alarmId: any) {
  return overlayMap.get(alarmId);
}

function removeOverlayEntry(alarmId: any) {
  overlayMap.delete(alarmId);
}

function handleOverlayClick(alarm: any, overlay: any, intervalId: any) {
  removeOverlay(overlay);

  const alarmId = alarm.id;
  const closedTime = new Date(Date.now() + 60 * 1000).toISOString();

  chrome.storage.local.get(
    ["alarms", "closedAlarms", "trashedAlarms"],
    result => {
      const alarms = result.alarms || [];
      const closedAlarms = result.closedAlarms || {};
      const trashedAlarms = result.trashedAlarms || [];

      const index = alarms.findIndex((a: any) => a.id === alarmId);
      const foundAlarm = alarms[index];

      if (foundAlarm?.isOneTime) {
        // 일회용 알람을 휴지통으로 이동
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const deletedAt = `${yyyy}-${mm}-${dd}`;

        trashedAlarms.push({
          ...foundAlarm,
          deletedAt
        });

        alarms.splice(index, 1);
      }
      closedAlarms[alarmId] = closedTime;

      chrome.storage.local.set({ alarms, closedAlarms, trashedAlarms });

      clearInterval(intervalId);
      overlayMap.delete(alarmId);

      updateOverlayVisibility();
    }
  );
}

export {
  getOverlayEntry,
  removeOverlay,
  removeOverlayEntry,
  showOverlay,
  updateOverlayVisibility
};
