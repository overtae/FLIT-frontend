export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  description?: string;
};

export type ScheduleCalendarDate = {
  date: string;
  hasSchedule: boolean;
};
