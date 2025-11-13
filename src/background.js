/**
 * 만료된 휴지통 항목 정리 (7일 이상 경과)
 */
async function cleanExpiredTrash() {
  const result = await chrome.storage.local.get(["trashedAlarms"]);
  const trashedAlarms = result.trashedAlarms || [];

  if (trashedAlarms.length === 0) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = trashedAlarms.filter(alarm => {
    const deletedDate = new Date(alarm.deletedAt);
    deletedDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - deletedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 7; // 7일 미만인 항목만 유지
  });

  await chrome.storage.local.set({ trashedAlarms: filtered });
}

/**
 * 매일 자정에 휴지통 정리 알람 생성
 * 브라우저 시작 시 만료된 휴지통 항목도 정리
 */
chrome.runtime.onStartup.addListener(() => {
  cleanExpiredTrash(); // 놓친 자정이 있을 수 있으니 바로 정리
  createCleanTrashAlarm();
});

/**
 * 다음 자정 시간 계산
 */
function getNextMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

/**
 * cleanTrash 알람 생성
 */
function createCleanTrashAlarm() {
  chrome.alarms.create("cleanTrash", {
    when: getNextMidnight(),
    periodInMinutes: 1440 // 24시간마다 반복
  });
}

/**
 * 알람 이벤트 리스너
 */
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "cleanTrash") {
    cleanExpiredTrash();
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.alarms) {
    const { newValue, oldValue } = changes.alarms;

    if (!Array.isArray(newValue) || !Array.isArray(oldValue)) return;

    // 알람 개수가 줄었는지 확인
    if (newValue.length < oldValue.length) {
      // console.log("알람 개수가 줄었습니다.");
      const newValueIds = newValue.map(el => el.id);
      const filteredAlarm = oldValue.filter(el => !newValueIds.includes(el.id));

      if (filteredAlarm.length) {
        const deletedAlarm = filteredAlarm[0];

        // 일회성 알람인 경우에만 메시지 전송
        if (deletedAlarm?.isOneTime) {
          // console.log("삭제된 알람은 일회성 알람입니다.");
          chrome.runtime.sendMessage({
            type: "ALARM_CLOSED",
            alarms: deletedAlarm
          });
        } else {
          // console.log("삭제된 알람은 일회성 알람이 아닙니다.");
        }
      }
    }
  }
});

/**
 * 확장 프로그램을 로드하였지만, 이미 실행중인 탭에서는 동작하지 않음
 * 따라서, 실행중인 탭에서도 동작하도록 스크립트를 실행해줌
 * 또한, 휴지통 자동 정리 알람을 생성
 */

chrome.runtime.onInstalled.addListener(() => {
  // 휴지통 자동 정리 알람 생성
  createCleanTrashAlarm();

  // 기존 탭에 content script 주입
  chrome.tabs.query({}, tabs => {
    for (const tab of tabs) {
      if (tab.url && tab.url.startsWith("http")) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
      }
    }
  });
});

/**
 * 확장 프로그램이 깨어날 때마다 알람 존재 여부 확인 및 만료 항목 정리
 * service worker가 재시작될 때 알람이 사라지는 것을 방지하고
 * 놓친 자정이 있을 경우를 대비하여 바로 정리 실행
 */
chrome.alarms.get("cleanTrash", (alarm) => {
  if (!alarm) {
    cleanExpiredTrash(); // 놓친 자정이 있을 수 있으니 바로 정리
    createCleanTrashAlarm();
  }
});
