import { Day } from "./day";

export type EditAlarm = Alarm | null;

export interface Alarm {
  id: string;
  time: string;
  days: Day[];
  isOneTime: boolean;
  memo: string;
}
