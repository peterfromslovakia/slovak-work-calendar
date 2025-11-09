export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface EventType {
  id: string;
  name: string;
  color: string;
  textColor: string;
  icon: string; // Changed from emoji
  isDeletable?: boolean;
}

export interface EventInfo {
  typeId: string;
  note?: string;
  duration: number; // 1 for full day, 0.5 for half day
}

export type EventData = Map<string, EventInfo>;