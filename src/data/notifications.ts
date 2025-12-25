import { Notification } from "@/types/notifications";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "새로운 주문",
    message: "새로운 주문이 접수되었습니다.",
    time: "5분 전",
    isRead: false,
  },
  {
    id: "2",
    title: "배송 완료",
    message: "주문 #12345의 배송이 완료되었습니다.",
    time: "1시간 전",
    isRead: false,
  },
  {
    id: "3",
    title: "시스템 업데이트",
    message: "시스템이 업데이트되었습니다.",
    time: "2시간 전",
    isRead: true,
  },
  {
    id: "4",
    title: "정산 완료",
    message: "12월 정산이 완료되었습니다.",
    time: "3시간 전",
    isRead: true,
  },
  {
    id: "5",
    title: "새로운 리뷰",
    message: "고객이 새로운 리뷰를 작성했습니다.",
    time: "5시간 전",
    isRead: false,
  },
];
