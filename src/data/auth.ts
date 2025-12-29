import type { UserInfo, Notification } from "@/types/auth.type";

export const mockUserInfo: UserInfo = {
  userId: 1,
  profileImageUrl: "/avatars/arhamkhnz.png",
  name: "Admin",
  nickname: "Admin",
  phoneNumber: "010-1234-5678",
  sns: "https://instagram.com/admin",
  level: "MASTER",
  code: "admin001",
  address: "서울시 강남구 테헤란로 123",
  detailAddress: "101동 101호",
};

const notificationTitles = [
  "새로운 주문이 접수되었습니다",
  "정산이 완료되었습니다",
  "배송이 시작되었습니다",
  "주문이 취소되었습니다",
  "환불이 처리되었습니다",
  "새로운 리뷰가 등록되었습니다",
  "재고 부족 알림",
  "이벤트 안내",
  "시스템 점검 안내",
  "쿠폰이 발급되었습니다",
];

const notificationContents = [
  "주문번호 #{number}가 접수되었습니다.",
  "{year}년 {month}월 정산이 완료되었습니다.",
  "주문번호 #{number}의 배송이 시작되었습니다.",
  "주문번호 #{number}가 취소되었습니다.",
  "주문번호 #{number}의 환불이 처리되었습니다.",
  "새로운 리뷰가 등록되었습니다.",
  "재고가 부족한 상품이 있습니다.",
  "새로운 이벤트가 시작되었습니다.",
  "시스템 점검이 예정되어 있습니다.",
  "쿠폰이 발급되었습니다.",
];

export const mockNotifications: Notification[] = Array.from({ length: 150 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(i / 3));
  date.setHours(9 + (i % 12), (i * 7) % 60, 0);

  const titleIndex = i % notificationTitles.length;
  const contentIndex = i % notificationContents.length;
  const isRead = i % 3 !== 0;

  return {
    notificationId: i + 1,
    title: notificationTitles[titleIndex],
    content: notificationContents[contentIndex]
      .replace("{number}", String(10000 + i))
      .replace("{year}", String(date.getFullYear()))
      .replace("{month}", String(date.getMonth() + 1)),
    createdAt: date.toISOString(),
    isRead,
  };
});
