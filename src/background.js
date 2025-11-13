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
    return diffDays < 0.001; // 테스트용: 약 1.5분 (원래는 7일)
  });

  await chrome.storage.local.set({ trashedAlarms: filtered });
}

/**
 * 매일 자정에 휴지통 정리 알람 생성
 */
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("cleanTrash", {
    when: getNextMidnight(),
    periodInMinutes: 1440 // 24시간마다 반복
  });
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
  chrome.alarms.create("cleanTrash", {
    when: getNextMidnight(),
    periodInMinutes: 1440 // 24시간마다 반복
  });

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
