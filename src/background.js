chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.alarms) {
    const { newValue, oldValue } = changes.alarms;

    if (!Array.isArray(newValue) || !Array.isArray(oldValue)) return;

    // 알람 개수가 줄었는지 확인
    if (newValue.length < oldValue.length) {
      const newValueIds = newValue.map((el) => el.id);
      const filteredAlarm = oldValue.filter(
        (el) => !newValueIds.includes(el.id)
      );

      if (filteredAlarm.length) {
        const deletedAlarm = filteredAlarm[0];

        // 일회성 알람인 경우에만 메시지 전송
        if (deletedAlarm?.isOneTime) {
          chrome.runtime.sendMessage({
            type: "ALARM_CLOSED",
            alarms: deletedAlarm,
          });
        }
      }
    }
  }
});
