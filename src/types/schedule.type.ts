export interface Schedule {
  scheduleId: number;
  title: string;
  content: string;
  targetDate: string;
  startTime: string;
  endTime?: string;
}

export interface ScheduleParams {
  year?: string;
  month?: string;
}
