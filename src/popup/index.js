import { applyPopupLocales } from "./locale";

let editingIndex = null;
const day_locale = {
  일: "sun",
  월: "mon",
  화: "tue",
  수: "wed",
  목: "thu",
  금: "fri",
  토: "sat",
};

document.addEventListener("DOMContentLoaded", () => {
  applyPopupLocales();

  const setAlarmButton = document.getElementById("setAlarm");
  const repeatTimeInput = document.getElementById("repeatTime");
  const alarmList = document.getElementById("alarmList");
  const memoInput = document.getElementById("memoInput");
  const resetIcon = document.getElementById("reset");
  const canceldEdit = document.getElementById("cancelEdit");
  const oneTimeAlarm = document.getElementById("oneTimeAlarm");

  canceldEdit.textContent = chrome.i18n.getMessage("popup_html_cancel");

  resetIcon.addEventListener("click", () => {
    const dayMap = {
      sunday: "일",
      monday: "월",
      tuesday: "화",
      wednesday: "수",
      thursday: "목",
      friday: "금",
      saturday: "토",
    };

    Object.keys(dayMap).forEach((id) => {
      const checkbox = document.getElementById(id);
      checkbox.checked = false;
    });
  });

  canceldEdit.addEventListener("click", () => {
    canceldEdit.style.display = "none";
    resetIcon.click();

    const alarmItems = alarmList.querySelectorAll("li");
    alarmItems[editingIndex].classList.remove("editing");

    editingIndex = null;

    document.getElementById("alarm_setting_label").textContent =
      chrome.i18n.getMessage("popup_html_alarm_setting_label");

    // 편집 중인 알람의 버튼 숨기기
    const allGroups = document.querySelectorAll(".button-group");
    allGroups.forEach((group) => {
      group.style.display = "flex";
    });
  });

  // 마지막 선택된 요일을 복원
  chrome.storage.local.get("lastSelectedDays", (result) => {
    const lastSelectedDays = result.lastSelectedDays || [];
    const dayMapReverse = {
      일: "sunday",
      월: "monday",
      화: "tuesday",
      수: "wednesday",
      목: "thursday",
      금: "friday",
      토: "saturday",
    };

    if (lastSelectedDays.length) {
      lastSelectedDays.forEach((day) => {
        const checkboxId = dayMapReverse[day];
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    } else {
      ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach(
        (checkboxId) => {
          const checkbox = document.getElementById(checkboxId);
          if (checkbox) {
            checkbox.checked = true;
          }
        }
      );
    }
  });

  // Enter 키 입력 시 알람 설정 실행
  memoInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setAlarmButton.click();
    }
  });

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  repeatTimeInput.value = `${hours}:${minutes}`;

  chrome.storage.local.get("alarms", (result) => {
    const alarms = result.alarms || [];
    alarms.forEach((alarm, index) => {
      addAlarmToDOM(alarm, index);
    });
  });

  function addAlarmToDOM(alarm, index) {
    const li = document.createElement("li");

    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";

    const timeSpan = document.createElement("span");
    timeSpan.textContent = `${chrome.i18n.getMessage("time_label")}: ${
      alarm.time
    }`;

    const daysSpan = document.createElement("span");
    const alarmDays = alarm.days || [];
    const translatedDays = alarmDays.map((day) =>
      chrome.i18n.getMessage(`popup_html_${day_locale[day]}`)
    );

    daysSpan.textContent =
      alarmDays.length === 7
        ? chrome.i18n.getMessage("everyday_label")
        : translatedDays.join(", ");

    const memoSpan = document.createElement("span");
    memoSpan.textContent = ` ${chrome.i18n.getMessage("memo_label")}: ${
      alarm.memo || ""
    }`;

    wrap.appendChild(daysSpan);
    wrap.appendChild(timeSpan);

    if (alarm.memo && alarm.memo.length) {
      wrap.appendChild(memoSpan);
    }

    const editButton = document.createElement("img");
    editButton.src = "/icons/edit-icon.svg";
    editButton.className = "edit-icon";
    editButton.alt = "Edit";
    editButton.addEventListener("click", () => editAlarm(index));

    const deleteButton = document.createElement("img");
    deleteButton.src = "/icons/delete-icon.svg";
    deleteButton.className = "delete-icon";
    deleteButton.alt = "Delete";
    deleteButton.addEventListener("click", () => deleteAlarm(index));

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    li.id = alarm.id;
    li.appendChild(wrap);
    li.appendChild(buttonGroup);

    alarmList.appendChild(li);
  }

  function deleteAlarm(index) {
    chrome.storage.local.get("alarms", (result) => {
      const alarms = result.alarms || [];
      alarms.splice(index, 1);
      chrome.storage.local.set({ alarms }, () => {
        alarmList.innerHTML = "";
        alarms.forEach((alarm, idx) => {
          addAlarmToDOM(alarm, idx);
        });
      });
    });
  }

  function editAlarm(index) {
    chrome.storage.local.get("alarms", (result) => {
      const alarms = result.alarms || [];
      const alarm = alarms[index];
      if (!alarm) return;

      // 시간 세팅
      document.getElementById("repeatTime").value = alarm.time;

      const allDays = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      // 모두 체크 해제
      allDays.forEach((dayId) => {
        const checkbox = document.getElementById(dayId);
        if (checkbox) checkbox.checked = false;
      });
      // 알람에 저장된 요일만 체크
      alarm.days.forEach((dayKor) => {
        const dayMapReverse = {
          일: "sunday",
          월: "monday",
          화: "tuesday",
          수: "wednesday",
          목: "thursday",
          금: "friday",
          토: "saturday",
        };
        const checkboxId = dayMapReverse[dayKor];
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) checkbox.checked = true;
      });

      // 메모 세팅
      document.getElementById("memoInput").value = alarm.memo || "";

      // 편집 중인 인덱스 저장
      editingIndex = index;

      canceldEdit.style.display = "block";

      document.getElementById("alarm_setting_label").textContent =
        chrome.i18n.getMessage("popup_html_alarm_edit_label");

      document.getElementById("setAlarm").textContent =
        chrome.i18n.getMessage("popup_html_save");

      // 편집 중인 알람의 버튼 숨기기
      const allGroups = document.querySelectorAll(".button-group");
      allGroups.forEach((group) => {
        group.style.display = "none";
      });

      const alarmItems = alarmList.querySelectorAll("li");
      alarmItems[index].classList.add("editing");
    });
  }

  setAlarmButton.addEventListener("click", () => {
    const selectedDays = getSelectedDays();

    if (!selectedDays.length) {
      alert(chrome.i18n.getMessage("alert_empty_day"));
      return;
    }

    let alarmTime = repeatTimeInput.value;

    if (!alarmTime) {
      alert(chrome.i18n.getMessage("alert_input_time"));
      return;
    }

    const memo = memoInput.value.trim();

    const alarmDate = new Date();
    const [hours, minutes] = alarmTime.split(":");
    alarmDate.setHours(hours, minutes, 0, 0);

    const formattedTime = `${String(alarmDate.getHours()).padStart(
      2,
      "0"
    )}:${String(alarmDate.getMinutes()).padStart(2, "0")}`;

    const isOneTime = oneTimeAlarm.checked;
    const id = crypto.randomUUID();
    const newAlarm = {
      id,
      time: formattedTime,
      days: selectedDays,
      memo,
      isOneTime,
    };

    chrome.storage.local.get("alarms", (result) => {
      const alarms = result.alarms || [];
      if (editingIndex !== null) {
        // 편집 모드: 기존 알람 수정
        // 중복 체크 (자기 자신 제외)
        for (let i = 0; i < alarms.length; i++) {
          if (i === editingIndex) continue;
          const existing = alarms[i];
          if (existing.time === formattedTime) {
            const overlapDays = existing.days.filter((day) =>
              selectedDays.includes(day)
            );
            if (overlapDays.length > 0) {
              alert(chrome.i18n.getMessage("popup_html_exist_time"));
              // 해당 알람 DOM 요소로 스크롤
              const alarmItems = alarmList.querySelectorAll("li");
              const targetItem = alarmItems[i];
              if (targetItem) {
                targetItem.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });

                targetItem.classList.add("error-blinking");

                setTimeout(() => {
                  targetItem.classList.remove("error-blinking");
                }, 5000);
              }

              return;
            }
          }
        }

        alarms[editingIndex] = {
          ...alarms[editingIndex],
          time: formattedTime,
          days: selectedDays,
          memo,
        };

        document.getElementById("setAlarm").textContent =
          chrome.i18n.getMessage("popup_html_set_alarm_button");

        // 편집 중인 알람의 버튼 숨기기
        const allGroups = document.querySelectorAll(".button-group");
        allGroups.forEach((group) => {
          group.style.display = "flex";
        });

        // 편집 중인 li 표시 숨기기
        const alarmItems = alarmList.querySelectorAll("li");
        alarmItems[editingIndex].classList.remove("editing");
      } else {
        for (let i = 0; i < alarms.length; i++) {
          const existing = alarms[i];
          if (existing.time === newAlarm.time) {
            const overlapDays = existing.days.filter((day) =>
              newAlarm.days.includes(day)
            );

            if (overlapDays.length > 0) {
              alert(chrome.i18n.getMessage("popup_html_exist_time"));

              // 해당 알람 DOM 요소로 스크롤
              const alarmItems = alarmList.querySelectorAll("li");
              const targetItem = alarmItems[i];
              if (targetItem) {
                targetItem.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });

                targetItem.classList.add("error-blinking");

                setTimeout(() => {
                  targetItem.classList.remove("error-blinking");
                }, 5000);
              }

              return;
            }
          }
        }
        alarms.push(newAlarm);
      }

      alarms.sort((a, b) => {
        const [aH, aM] = a.time.split(":").map(Number);
        const [bH, bM] = b.time.split(":").map(Number);
        return aH !== bH ? aH - bH : aM - bM;
      });

      chrome.storage.local.set({ alarms }, () => {
        alarmList.innerHTML = "";
        alarms.forEach((alarmItem, idx) => {
          addAlarmToDOM(alarmItem, idx);
        });

        // 새로 추가한 알람 DOM 요소 찾기
        const alarmItems = alarmList.querySelectorAll("li");
        for (let i = 0; i < alarms.length; i++) {
          if (
            alarms[i].id === id ||
            (typeof editingIndex === "number" &&
              alarms[editingIndex].id === alarms[i].id)
          ) {
            const newItem = alarmItems[i];
            if (newItem) {
              newItem.scrollIntoView({ behavior: "smooth", block: "center" });
              newItem.classList.add("success-blinking");
              setTimeout(() => {
                newItem.classList.remove("success-blinking");
              }, 5000);
            }
            break;
          }
        }
        editingIndex = null;
        document.getElementById("alarm_setting_label").textContent =
          chrome.i18n.getMessage("popup_html_alarm_setting_label");
      });

      oneTimeAlarm.checked = false;
      memoInput.value = "";

      chrome.storage.local.set({ lastSelectedDays: selectedDays });
    });
  });
});

function getSelectedDays() {
  const dayMap = {
    sunday: "일",
    monday: "월",
    tuesday: "화",
    wednesday: "수",
    thursday: "목",
    friday: "금",
    saturday: "토",
  };

  const days = [];
  Object.keys(dayMap).forEach((id) => {
    const checkbox = document.getElementById(id);
    if (checkbox && checkbox.checked) {
      days.push(dayMap[id]);
    }
  });
  return days;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ALARM_CLOSED") {
    const deletedAlarm = message.alarms;

    const alarmList = document.getElementById("alarmList");
    if (!alarmList) return;

    const liToRemove = document.getElementById(deletedAlarm.id);
    if (liToRemove && liToRemove.parentElement === alarmList) {
      alarmList.removeChild(liToRemove);
    }
  }
});
