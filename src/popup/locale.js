const ID_MAP = {
  alarm_setting_label: "popup_html_alarm_setting_label",
  time_label: "popup_html_time_label",
  day_select_label: "popup_html_day_select_label",
  memo_label: "popup_html_memo_label",
  setAlarm: "popup_html_set_alarm_button",
  alarm_list_label: "popup_html_alarm_list_label",
};

const DAY_LABELS = [
  { selector: 'label[for="sunday"]', message: "popup_html_sun" },
  { selector: 'label[for="monday"]', message: "popup_html_mon" },
  { selector: 'label[for="tuesday"]', message: "popup_html_tue" },
  { selector: 'label[for="wednesday"]', message: "popup_html_wed" },
  { selector: 'label[for="thursday"]', message: "popup_html_thu" },
  { selector: 'label[for="friday"]', message: "popup_html_fri" },
  { selector: 'label[for="saturday"]', message: "popup_html_sat" },
];

const applyPopupLocales = () => {
  for (const [id, message] of Object.entries(ID_MAP)) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = chrome.i18n.getMessage(message);
    }
  }

  DAY_LABELS.forEach(({ selector, message }) => {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = chrome.i18n.getMessage(message);
    }
  });

  const tooltipEl = document.querySelector(".tooltiptext");
  if (tooltipEl) {
    tooltipEl.textContent = chrome.i18n.getMessage(
      "popup_html_oneTime_tooltip"
    );
  }

  const toggleLabelEl = document.querySelector(".toggle-label");
  if (toggleLabelEl) {
    toggleLabelEl.textContent = chrome.i18n.getMessage(
      "popup_html_oneTime_alarm"
    );
  }

  document.title = chrome.i18n.getMessage("extName");
};

export { applyPopupLocales };
