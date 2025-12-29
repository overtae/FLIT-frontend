import type {
  User,
  UserDetail,
  UserStatisticsTotalResponse,
  UserStatisticsOverviewResponse,
  SecederUser,
  UserSettlement,
} from "@/types/user.type";

const names = [
  "김철수",
  "이영희",
  "박민수",
  "정수진",
  "최지영",
  "강호영",
  "윤서연",
  "장민준",
  "임수아",
  "한지우",
  "오동현",
  "신미래",
  "조성민",
  "배수진",
  "홍길동",
];

const grades = ["GREEN", "YELLOW", "ORANGE", "RED", "SILVER", "GOLD", "FLINNEY", "FLITER", "PREMIUM", "VIP"];
const userTypes: Array<"CUSTOMER_INDIVIDUAL" | "CUSTOMER_OWNER" | "SHOP" | "FLORIST"> = [
  "CUSTOMER_INDIVIDUAL",
  "CUSTOMER_OWNER",
  "SHOP",
  "FLORIST",
];
const regions = [
  "서울시 강남구",
  "서울시 서초구",
  "서울시 마포구",
  "서울시 노원구",
  "서울시 송파구",
  "경기도 성남시",
  "인천시 남동구",
];

export const mockUsers: User[] = Array.from({ length: 150 }, (_, i) => {
  const name = names[i % names.length];
  const grade = grades[i % grades.length];
  const joinDate = new Date();
  joinDate.setMonth(joinDate.getMonth() - (i % 24));
  const lastLoginDate = new Date();
  lastLoginDate.setDate(lastLoginDate.getDate() - (i % 30));

  return {
    userId: i + 1,
    grade,
    profileImageUrl: "/avatars/arhamkhnz.png",
    name,
    nickname: `${name}(${String(i + 1).padStart(3, "0")})`,
    loginId: `user${String(i + 1).padStart(3, "0")}`,
    mail: `user${i + 1}@example.com`,
    address: regions[i % regions.length],
    phoneNumber: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    lastLoginDate: lastLoginDate.toISOString().split("T")[0],
    joinDate: joinDate.toISOString().split("T")[0],
  };
});

export const mockUserDetails: Record<number, UserDetail> = Object.fromEntries(
  mockUsers.slice(0, 50).map((user, i) => {
    const type = userTypes[i % userTypes.length];
    const joinDate = new Date(user.joinDate);
    const lastPurchaseDate = new Date();
    lastPurchaseDate.setDate(lastPurchaseDate.getDate() - (i % 15));

    return [
      user.userId,
      {
        ...user,
        type,
        detailAddress: `${Math.floor(Math.random() * 100)}동 ${Math.floor(Math.random() * 100)}호`,
        ...(type === "CUSTOMER_INDIVIDUAL" && {
          lastPurchaseDate: lastPurchaseDate.toISOString().split("T")[0],
        }),
        ...((type === "CUSTOMER_OWNER" || type === "SHOP" || type === "FLORIST") && {
          businessNumber: `${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}-${String(Math.floor(Math.random() * 100)).padStart(2, "0")}-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`,
        }),
        ...((type === "SHOP" || type === "FLORIST") && {
          businessLicenseUrl: `https://example.com/license-${user.userId}.jpg`,
        }),
      },
    ];
  }),
);

export const mockSecederUsers: SecederUser[] = Array.from({ length: 120 }, (_, i) => {
  const name = names[i % names.length];
  const secedeDate = new Date();
  secedeDate.setDate(secedeDate.getDate() - (i % 90));
  const joinDate = new Date(secedeDate);
  joinDate.setMonth(joinDate.getMonth() - (12 + (i % 12)));

  return {
    userId: 1000 + i + 1,
    profileImageUrl: "/avatars/arhamkhnz.png",
    name,
    nickname: `탈퇴${name}(${String(i + 1).padStart(3, "0")})`,
    loginId: `seceder${String(i + 1).padStart(3, "0")}`,
    mail: `seceder${i + 1}@example.com`,
    address: regions[i % regions.length],
    phoneNumber: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    secedeDate: secedeDate.toISOString().split("T")[0],
    joinDate: joinDate.toISOString().split("T")[0],
  };
});

export function generateUserStatisticsTotal(period: "WEEK" | "MONTH" | "YEAR" = "MONTH"): UserStatisticsTotalResponse {
  const dateCount: number = 5;
  const isMonthly: boolean = period === "MONTH";

  const dates = Array.from({ length: dateCount }, (_, i) => {
    const date = new Date();
    if (isMonthly) {
      date.setMonth(date.getMonth() - (dateCount - 1 - i));
      date.setDate(1);
    } else {
      date.setDate(date.getDate() - (dateCount - 1 - i));
    }
    return date.toISOString().split("T")[0];
  });

  return {
    current: dates.map((date) => ({ date, value: Math.floor(Math.random() * 100) + 50 })),
    last: dates.map((date) => {
      const lastDate = new Date(date);
      if (period === "WEEK") {
        lastDate.setDate(lastDate.getDate() - 7);
      } else if (period === "MONTH") {
        lastDate.setMonth(lastDate.getMonth() - 1);
      } else {
        lastDate.setFullYear(lastDate.getFullYear() - 1);
      }
      return { date: lastDate.toISOString().split("T")[0], value: Math.floor(Math.random() * 100) + 40 };
    }),
  };
}
export function generateUserStatisticsOverview(): UserStatisticsOverviewResponse {
  return {
    stats: [
      { total: 1500, changed: 50 },
      { total: 800, changed: 30 },
      { total: 200, changed: 10 },
      { total: 100, changed: -5 },
    ],
    gender: {
      male: 600,
      female: 800,
      etc: 100,
    },
    age: [
      { label: "10대", value: 50 },
      { label: "20대", value: 300 },
      { label: "30대", value: 400 },
      { label: "40대", value: 350 },
      { label: "50대", value: 200 },
      { label: "60대", value: 100 },
      { label: "70대 이상", value: 50 },
    ],
  };
}

export function generateUserSettlements(userId: number): UserSettlement[] {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    date.setDate(1);

    return {
      settlementId: userId * 100 + i + 1,
      settlementDate: date.toISOString().split("T")[0],
    };
  });
}
