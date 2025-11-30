export interface ScheduleEvent {
  id: string;
  date: Date;
  time: string;
  endTime?: string;
  title: string;
  description?: string;
  type: "green" | "orange";
}

export const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: "1",
    date: new Date(2025, 11, 13),
    time: "9:00 am",
    endTime: "9:15 am",
    title: "플릿 광고 공지",
    description: "12월 플릿 광고 공지하기",
    type: "green",
  },
  {
    id: "2",
    date: new Date(2025, 11, 13),
    time: "9:15 am",
    title: "플릿 서포터즈 모집 공지",
    type: "green",
  },
  {
    id: "3",
    date: new Date(2025, 11, 13),
    time: "9:20 am",
    title: "플릿 회의",
    description: "플릿 업데이트 기능 회의",
    type: "green",
  },
  {
    id: "4",
    date: new Date(2025, 11, 13),
    time: "9:20 am",
    title: "플릿 ---------",
    type: "green",
  },
  {
    id: "t4",
    date: new Date(2025, 11, 13),
    time: "9:30 am",
    title: "권수회 님",
    type: "green",
  },
  {
    id: "t5",
    date: new Date(2025, 11, 13),
    time: "10:30 am",
    title: "안수민 님",
    type: "green",
  },
  {
    id: "t6",
    date: new Date(2025, 11, 13),
    time: "10:30 am",
    title: "강수진 님",
    type: "green",
  },
  {
    id: "t7",
    date: new Date(2025, 11, 13),
    time: "11:00 am",
    title: "김지호 님",
    type: "orange",
  },
  {
    id: "t8",
    date: new Date(2025, 11, 13),
    time: "11:00 am",
    title: "반호민 님",
    type: "orange",
  },
  {
    id: "t9",
    date: new Date(2025, 11, 13),
    time: "13:00 pm",
    title: "김세희 님",
    type: "orange",
  },
  {
    id: "t10",
    date: new Date(2025, 11, 13),
    time: "13:30 pm",
    title: "문민수 님",
    type: "orange",
  },

  // 12월 15일 데이터
  {
    id: "5",
    date: new Date(2025, 11, 15),
    time: "10:00 am",
    title: "겨울 시즌 기획",
    description: "오프라인 이벤트 준비",
    type: "green",
  },
  {
    id: "15-1",
    date: new Date(2025, 11, 15),
    time: "11:00 am",
    title: "파트너사 미팅",
    type: "orange",
  },
  {
    id: "15-2",
    date: new Date(2025, 11, 15),
    time: "14:00 pm",
    title: "디자인 리뷰",
    type: "green",
  },

  // 12월 16일 데이터
  {
    id: "6",
    date: new Date(2025, 11, 16),
    time: "14:00 pm",
    title: "주간 회의",
    type: "orange",
  },
  {
    id: "16-1",
    date: new Date(2025, 11, 16),
    time: "09:30 am",
    title: "개발팀 스크럼",
    type: "green",
  },
  {
    id: "16-2",
    date: new Date(2025, 11, 16),
    time: "15:30 pm",
    title: "코드 리뷰",
    type: "green",
  },

  // 12월 17일 데이터
  {
    id: "7",
    date: new Date(2025, 11, 17),
    time: "11:00 am",
    title: "토요일 특강",
    type: "green",
  },

  // 12월 22일 데이터
  {
    id: "8",
    date: new Date(2025, 11, 22),
    time: "15:00 pm",
    title: "고객사 미팅",
    type: "orange",
  },

  // 12월 25일 데이터
  {
    id: "9",
    date: new Date(2025, 11, 25),
    time: "16:00 pm",
    title: "월말 결산 회의",
    type: "orange",
  },
];
