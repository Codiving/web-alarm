import { Alarm, TrashedAlarm } from "../type/alarm";
import { getFromStorage, setToStorage } from "../popup/storage";

/**
 * 현재 날짜를 yyyy-mm-dd 형식으로 반환
 */
const getTodayDateString = (): string => {
  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 알람을 휴지통으로 이동
 */
export const moveToTrash = async (alarm: Alarm): Promise<void> => {
  const trashedAlarms = (await getFromStorage<TrashedAlarm[]>("trashedAlarms")) || [];

  const trashedAlarm: TrashedAlarm = {
    ...alarm,
    deletedAt: getTodayDateString(), // 오늘 날짜 (yyyy-mm-dd)
  };

  trashedAlarms.push(trashedAlarm);
  await setToStorage("trashedAlarms", trashedAlarms);
};

/**
 * 7일 지난 휴지통 항목 자동 삭제
 * 날짜로만 체크, 00시 00분 00초 기준
 */
export const cleanExpiredTrash = async (): Promise<void> => {
  const trashedAlarms = (await getFromStorage<TrashedAlarm[]>("trashedAlarms")) || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 00:00:00으로 설정

  const filtered = trashedAlarms.filter(alarm => {
    const deletedDate = new Date(alarm.deletedAt);
    deletedDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - deletedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 테스트용: 약 1.5분으로 변경 (원래는 7일)
    return diffDays < 0.001;
  });

  await setToStorage("trashedAlarms", filtered);
};

/**
 * 휴지통에서 복원
 */
export const restoreFromTrash = async (id: string): Promise<void> => {
  const trashedAlarms = (await getFromStorage<TrashedAlarm[]>("trashedAlarms")) || [];
  const alarms = (await getFromStorage<Alarm[]>("alarms")) || [];

  const targetIndex = trashedAlarms.findIndex(alarm => alarm.id === id);
  if (targetIndex === -1) return;

  const [restored] = trashedAlarms.splice(targetIndex, 1);

  // deletedAt 제거하고 alarms에 추가
  const { deletedAt, ...alarm } = restored;
  alarms.push(alarm);

  await setToStorage("trashedAlarms", trashedAlarms);
  await setToStorage("alarms", alarms);
};

/**
 * 휴지통에서 영구 삭제
 */
export const deleteFromTrash = async (id: string): Promise<void> => {
  const trashedAlarms = (await getFromStorage<TrashedAlarm[]>("trashedAlarms")) || [];
  const filtered = trashedAlarms.filter(alarm => alarm.id !== id);
  await setToStorage("trashedAlarms", filtered);
};
