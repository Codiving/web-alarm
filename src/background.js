chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.alarms) {
    const { newValue, oldValue } = changes.alarms;

    if (!Array.isArray(newValue) || !Array.isArray(oldValue)) return;

    // 알람 개수가 줄었는지 확인
    if (newValue.length < oldValue.length) {
      console.log("알람 개수가 줄었습니다.");
      const newValueIds = newValue.map((el) => el.id);
      const filteredAlarm = oldValue.filter(
        (el) => !newValueIds.includes(el.id)
      );

      if (filteredAlarm.length) {
        const deletedAlarm = filteredAlarm[0];

        // 일회성 알람인 경우에만 메시지 전송
        if (deletedAlarm?.isOneTime) {
          console.log("삭제된 알람은 일회성 알람입니다.");
          chrome.runtime.sendMessage({
            type: "ALARM_CLOSED",
            alarms: deletedAlarm,
          });
        } else {
          console.log("삭제된 알람은 일회성 알람이 아닙니다.");
        }
      }
    }
  }
});

/**
 * 확장 프로그램을 로드하였지만, 이미 실행중인 탭에서는 동작하지 않음
 * 따라서, 실행중인 탭에서도 동작하도록 스크립트를 실행해줌
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.url && tab.url.startsWith("http")) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });
      }
    }
  });
});
