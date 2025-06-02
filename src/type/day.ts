import { t } from "../utils/i18n";

export const DAY_LOCALE_MAP: { [key in Day]: string } = {
  일: t("sun"),
  월: t("mon"),
  화: t("tue"),
  수: t("wed"),
  목: t("thu"),
  금: t("fri"),
  토: t("sat"),
} as const;

export const DAY_TO_KOREAN = {
  [t("sun")]: "일",
  [t("mon")]: "월",
  [t("tue")]: "화",
  [t("wed")]: "수",
  [t("thu")]: "목",
  [t("fri")]: "금",
  [t("sat")]: "토",
};

export const DAYS = [
  t("sun"),
  t("mon"),
  t("tue"),
  t("wed"),
  t("thu"),
  t("fri"),
  t("sat"),
] as const;

export type Day = (typeof DAYS)[number];

type LocaleKey =
  | "extName"
  | "extDescription"
  | "am"
  | "pm"
  | "sun"
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "oneTimeAlarm"
  | "oneTimeAlarmTooltip"
  | "activeDays"
  | "save"
  | "memo";

type LocaleObject = {
  [key in LocaleKey]: {
    message: string;
  };
};

type Locale = {
  [key in LangCode]: LocaleObject;
};

type LangCode =
  | "ar"
  | "de"
  | "en"
  | "es"
  | "fr"
  | "hi"
  | "it"
  | "ja"
  | "ko"
  | "pt_BR"
  | "ru"
  | "th"
  | "vi"
  | "zh_CN";

const locales: Locale = {
  ar: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "احصل على تنبيه صامت من الموقع عند عدم القدرة على إصدار صوت. سيتم عرض التنبيه في الوقت المحدد.",
    },
    am: { message: "ص" },
    pm: { message: "م" },
    sun: { message: "أح" },
    mon: { message: "اث" },
    tue: { message: "ثل" },
    wed: { message: "أر" },
    thu: { message: "خم" },
    fri: { message: "جم" },
    sat: { message: "سب" },
    oneTimeAlarm: { message: "تنبيه لمرة واحدة" },
    oneTimeAlarmTooltip: {
      message: "يظهر مرة واحدة ثم يتم حذفه بغض النظر عن أيام الأسبوع المحددة.",
    },
    activeDays: { message: "الأيام النشطة" },
    save: { message: "حفظ" },
    memo: { message: "ملاحظة" },
  },
  de: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "Erhalten Sie stumme Alarme auf der Website, wenn kein Ton erlaubt ist. Die Benachrichtigung erscheint zur eingestellten Zeit.",
    },
    am: { message: "AM" },
    pm: { message: "PM" },
    sun: { message: "So" },
    mon: { message: "Mo" },
    tue: { message: "Di" },
    wed: { message: "Mi" },
    thu: { message: "Do" },
    fri: { message: "Fr" },
    sat: { message: "Sa" },
    oneTimeAlarm: { message: "Einmaliger Alarm" },
    oneTimeAlarmTooltip: {
      message:
        "Wird unabhängig vom Wochentag einmal ausgelöst und dann gelöscht.",
    },
    activeDays: { message: "Aktive Tage" },
    save: { message: "Speichern" },
    memo: { message: "Notiz" },
  },
  en: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "Get a silent alarm from the website when sound is not allowed. The notification will appear at the exact time.",
    },
    am: { message: "AM" },
    pm: { message: "PM" },
    sun: { message: "Sun" },
    mon: { message: "Mon" },
    tue: { message: "Tue" },
    wed: { message: "Wed" },
    thu: { message: "Thu" },
    fri: { message: "Fri" },
    sat: { message: "Sat" },
    oneTimeAlarm: { message: "One-Time Alarm" },
    oneTimeAlarmTooltip: {
      message: "Occurs once and is deleted, regardless of the set weekday.",
    },
    activeDays: { message: "Active Days" },
    save: { message: "Save" },
    memo: { message: "Memo" },
  },
  es: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "Recibe una alarma silenciosa desde el sitio web cuando no se permite el sonido. La notificación aparecerá a la hora exacta.",
    },
    am: { message: "a. m." },
    pm: { message: "p. m." },
    sun: { message: "Dom" },
    mon: { message: "Lun" },
    tue: { message: "Mar" },
    wed: { message: "Mié" },
    thu: { message: "Jue" },
    fri: { message: "Vie" },
    sat: { message: "Sáb" },
    oneTimeAlarm: { message: "Alarma única" },
    oneTimeAlarmTooltip: {
      message:
        "Ocurre una vez y se elimina, sin importar los días seleccionados.",
    },
    activeDays: { message: "Días activos" },
    save: { message: "Guardar" },
    memo: { message: "Nota" },
  },
  fr: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "Recevez une alarme silencieuse depuis le site web lorsque le son est désactivé. La notification apparaîtra à l'heure exacte.",
    },
    am: { message: "AM" },
    pm: { message: "PM" },
    sun: { message: "Dim" },
    mon: { message: "Lun" },
    tue: { message: "Mar" },
    wed: { message: "Mer" },
    thu: { message: "Jeu" },
    fri: { message: "Ven" },
    sat: { message: "Sam" },
    oneTimeAlarm: { message: "Alarme unique" },
    oneTimeAlarmTooltip: {
      message:
        "Déclenchée une seule fois et supprimée, quel que soit le jour défini.",
    },
    activeDays: { message: "Jours actifs" },
    save: { message: "Enregistrer" },
    memo: { message: "Mémo" },
  },
  hi: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "जब ध्वनि की अनुमति न हो, तब वेबसाइट से मूक अलार्म प्राप्त करें। अधिसूचना निर्धारित समय पर दिखाई देगी।",
    },
    am: { message: "पूर्वाह्न" },
    pm: { message: "अपराह्न" },
    sun: { message: "रवि" },
    mon: { message: "सोम" },
    tue: { message: "मंगल" },
    wed: { message: "बुध" },
    thu: { message: "गुरु" },
    fri: { message: "शुक्र" },
    sat: { message: "शनि" },
    oneTimeAlarm: { message: "एक बार का अलार्म" },
    oneTimeAlarmTooltip: {
      message:
        "निर्धारित दिनों की परवाह किए बिना एक बार सक्रिय होगा और फिर हट जाएगा।",
    },
    activeDays: { message: "सक्रिय दिन" },
    save: { message: "सहेजें" },
    memo: { message: "नोट" },
  },
  it: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "Ricevi un allarme silenzioso dal sito quando l'audio non è consentito. La notifica apparirà all'ora esatta.",
    },
    am: { message: "AM" },
    pm: { message: "PM" },
    sun: { message: "Dom" },
    mon: { message: "Lun" },
    tue: { message: "Mar" },
    wed: { message: "Mer" },
    thu: { message: "Gio" },
    fri: { message: "Ven" },
    sat: { message: "Sab" },
    oneTimeAlarm: { message: "Allarme singolo" },
    oneTimeAlarmTooltip: {
      message:
        "Si attiva una sola volta e viene eliminato, indipendentemente dal giorno impostato.",
    },
    activeDays: { message: "Giorni attivi" },
    save: { message: "Salva" },
    memo: { message: "Memo" },
  },
  ja: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "音が出せない環境で、ウェブサイトから無音アラームを受け取ることができます。設定した時間に通知が表示されます。",
    },
    am: { message: "午前" },
    pm: { message: "午後" },
    sun: { message: "日" },
    mon: { message: "月" },
    tue: { message: "火" },
    wed: { message: "水" },
    thu: { message: "木" },
    fri: { message: "金" },
    sat: { message: "土" },
    oneTimeAlarm: { message: "1回のみのアラーム" },
    oneTimeAlarmTooltip: {
      message: "設定した曜日に関係なく1回のみ鳴動し、その後削除されます。",
    },
    activeDays: { message: "有効な曜日" },
    save: { message: "保存" },
    memo: { message: "メモ" },
  },
  ko: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "조용한 환경에서 소리를 낼 수 없을 때, 웹사이트에서 무음 알람을 받아보세요. 정확한 시간에 알림이 표시됩니다.",
    },
    am: { message: "오전" },
    pm: { message: "오후" },
    sun: { message: "일" },
    mon: { message: "월" },
    tue: { message: "화" },
    wed: { message: "수" },
    thu: { message: "목" },
    fri: { message: "금" },
    sat: { message: "토" },
    oneTimeAlarm: { message: "1회용 알람" },
    oneTimeAlarmTooltip: {
      message: "설정된 요일과 상관 없이 1번 발생하고 삭제됩니다.",
    },
    activeDays: { message: "활성화된 요일" },
    save: { message: "저장" },
    memo: { message: "메모" },
  },
  pt_BR: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "Receba um alarme silencioso do site quando o som não for permitido. A notificação aparecerá na hora exata.",
    },
    am: { message: "AM" },
    pm: { message: "PM" },
    sun: { message: "Dom" },
    mon: { message: "Seg" },
    tue: { message: "Ter" },
    wed: { message: "Qua" },
    thu: { message: "Qui" },
    fri: { message: "Sex" },
    sat: { message: "Sáb" },
    oneTimeAlarm: { message: "Alarme único" },
    oneTimeAlarmTooltip: {
      message:
        "Ocorre uma vez e é excluído, independentemente do dia da semana definido.",
    },
    activeDays: { message: "Dias ativos" },
    save: { message: "Salvar" },
    memo: { message: "Nota" },
  },
  ru: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "Получайте беззвучный сигнал с сайта, когда звук отключён. Уведомление появится точно в указанное время.",
    },
    am: { message: "ДП" },
    pm: { message: "ПП" },
    sun: { message: "Вс" },
    mon: { message: "Пн" },
    tue: { message: "Вт" },
    wed: { message: "Ср" },
    thu: { message: "Чт" },
    fri: { message: "Пт" },
    sat: { message: "Сб" },
    oneTimeAlarm: { message: "Одноразовый будильник" },
    oneTimeAlarmTooltip: {
      message:
        "Срабатывает один раз и удаляется, независимо от выбранных дней недели.",
    },
    activeDays: { message: "Активные дни" },
    save: { message: "Сохранить" },
    memo: { message: "Заметка" },
  },
  th: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "รับการเตือนแบบเงียบจากเว็บไซต์เมื่อไม่สามารถเปิดเสียงได้ การแจ้งเตือนจะแสดงตรงเวลาที่กำหนด",
    },
    am: { message: "ก่อนเที่ยง" },
    pm: { message: "หลังเที่ยง" },
    sun: { message: "อา" },
    mon: { message: "จ" },
    tue: { message: "อ" },
    wed: { message: "พ" },
    thu: { message: "พฤ" },
    fri: { message: "ศ" },
    sat: { message: "ส" },
    oneTimeAlarm: { message: "ปลุกครั้งเดียว" },
    oneTimeAlarmTooltip: {
      message: "ทำงานเพียงครั้งเดียวและลบออกโดยไม่สนใจวันตั้งค่า",
    },
    activeDays: { message: "วันที่ใช้งาน" },
    save: { message: "บันทึก" },
    memo: { message: "บันทึกช่วยจำ" },
  },
  vi: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "Nhận cảnh báo im lặng từ trang web khi không thể phát âm thanh. Thông báo sẽ xuất hiện đúng giờ.",
    },
    am: { message: "SA" },
    pm: { message: "CH" },
    sun: { message: "CN" },
    mon: { message: "T2" },
    tue: { message: "T3" },
    wed: { message: "T4" },
    thu: { message: "T5" },
    fri: { message: "T6" },
    sat: { message: "T7" },
    oneTimeAlarm: { message: "Báo thức một lần" },
    oneTimeAlarmTooltip: {
      message: "Chỉ kêu một lần và sẽ bị xoá, bất kể ngày thiết lập.",
    },
    activeDays: { message: "Ngày kích hoạt" },
    save: { message: "Lưu" },
    memo: { message: "Ghi chú" },
  },
  zh_CN: {
    extName: { message: "Web Alarm" },
    extDescription: {
      message:
        "当无法发出声音时，从网站接收无声闹钟。通知将在设定时间准确显示。",
    },
    am: { message: "上午" },
    pm: { message: "下午" },
    sun: { message: "日" },
    mon: { message: "一" },
    tue: { message: "二" },
    wed: { message: "三" },
    thu: { message: "四" },
    fri: { message: "五" },
    sat: { message: "六" },
    oneTimeAlarm: { message: "一次性闹钟" },
    oneTimeAlarmTooltip: {
      message: "不管设置了哪一天，只响一次然后删除。",
    },
    activeDays: { message: "激活日期" },
    save: { message: "保存" },
    memo: { message: "备忘" },
  },
};
