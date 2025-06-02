import { Day } from "./day";

export type EditAlarm = Alarm | null;

export interface Alarm {
  id: string;
  time: string;
  days: Day[];
  isOneTime: boolean;
  memo: string;
  date: string; // yyyy-mm-dd, isOneTime이 true인 경우만 있음
}
