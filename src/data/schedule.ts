import type { Schedule } from "@/types/schedule.type";

const scheduleTitles = [
  "주간 회의",
  "고객 미팅",
  "배송 일정",
  "재고 점검",
  "신규 상품 입고",
  "마케팅 회의",
  "정기 점검",
  "이벤트 준비",
  "교육 세션",
  "팀 빌딩",
];

const scheduleContents = [
  "팀 주간 회의 진행",
  "신규 고객 상담",
  "대량 주문 배송",
  "월간 재고 점검",
  "신규 상품 입고 및 정리",
  "마케팅 전략 회의",
  "시스템 정기 점검",
  "이벤트 준비 및 진행",
  "직원 교육 세션",
  "팀 빌딩 활동",
];

export const mockSchedules: Schedule[] = Array.from({ length: 150 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + (i % 60));
  const startHour = 9 + (i % 8);
  const startMinute = (i * 15) % 60;
  const endHour = startHour + 1 + Math.floor(i % 3);
  const endMinute = (startMinute + 30) % 60;

  const hasEndTime = i % 3 !== 0;

  return {
    scheduleId: i + 1,
    title: scheduleTitles[i % scheduleTitles.length],
    content: scheduleContents[i % scheduleContents.length],
    targetDate: date.toISOString().split("T")[0],
    startTime: `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
    ...(hasEndTime && {
      endTime: `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`,
    }),
  };
});

export function getSchedulesByMonth(year?: string, month?: string): Schedule[] {
  if (!year || !month) {
    return mockSchedules;
  }
  return mockSchedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.targetDate);
    return (
      scheduleDate.getFullYear().toString() === year &&
      (scheduleDate.getMonth() + 1).toString().padStart(2, "0") === month.toString().padStart(2, "0")
    );
  });
}
