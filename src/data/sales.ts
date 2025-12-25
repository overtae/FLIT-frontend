import { SalesDetail, RevenueDetail } from "@/types/dashboard";

const baseSalesDetails: SalesDetail[] = [
  {
    id: "1",
    name: "홍길동",
    nickname: "고객A",
    nicknameId: "customer001",
    phone: "010-1234-5678",
    address: "서울시 강남구",
    productName: "꽃다발",
    amount: 50000,
    paymentMethod: "카드",
  },
  {
    id: "2",
    name: "김철수",
    nickname: "고객B",
    nicknameId: "customer002",
    phone: "010-2345-6789",
    address: "서울시 서초구",
    productName: "꽃바구니",
    amount: 80000,
    paymentMethod: "계좌이체",
  },
  {
    id: "3",
    name: "이영희",
    nickname: "고객C",
    nicknameId: "customer003",
    phone: "010-3456-7890",
    address: "경기도 성남시",
    productName: "동양난",
    amount: 120000,
    paymentMethod: "현장결제",
  },
  {
    id: "4",
    name: "박민수",
    nickname: "고객D",
    nicknameId: "customer004",
    phone: "010-4567-8901",
    address: "인천시 남동구",
    productName: "서양난",
    amount: 150000,
    paymentMethod: "카드",
  },
  {
    id: "5",
    name: "정수진",
    nickname: "고객E",
    nicknameId: "customer005",
    phone: "010-5678-9012",
    address: "서울시 송파구",
    productName: "다육식물",
    amount: 30000,
    paymentMethod: "카드",
  },
];

const names = ["홍길동", "김철수", "이영희", "박민수", "정수진", "최지영", "강호영", "윤서연", "장민준", "임수아"];
const productNames = [
  "꽃다발",
  "꽃바구니",
  "동양난",
  "서양난",
  "다육식물",
  "화분",
  "공기정화식물",
  "축하화환",
  "근조화환",
];
const paymentMethods = ["카드", "계좌이체", "현장결제"];
const regions = [
  "서울시 강남구",
  "서울시 서초구",
  "서울시 마포구",
  "서울시 송파구",
  "경기도 성남시",
  "인천시 남동구",
  "부산시 해운대구",
  "대전시 유성구",
];

export const mockSalesDetails: SalesDetail[] = [
  ...baseSalesDetails,
  ...Array.from({ length: 295 }, (_, i) => {
    const id = (i + 6).toString();
    const name = names[i % names.length];
    const productName = productNames[i % productNames.length];
    const paymentMethod = paymentMethods[i % paymentMethods.length];
    const region = regions[i % regions.length];
    const amount = (Math.floor(Math.random() * 20) + 1) * 10000;

    return {
      id,
      name: `${name}${i > 0 ? i : ""}`,
      nickname: `고객${String.fromCharCode(65 + (i % 26))}${i > 26 ? i : ""}`,
      nicknameId: `customer${String(i + 1).padStart(3, "0")}`,
      phone: `010-${String(i % 10000).padStart(4, "0")}-${String((i * 3) % 10000).padStart(4, "0")}`,
      address: `${region} ${i + 1}번지`,
      productName: `${productName} ${i % 10 === 0 ? "대형" : i % 5 === 0 ? "중형" : "소형"}`,
      amount,
      paymentMethod,
    };
  }),
];

const baseRevenueDetails: RevenueDetail[] = [
  {
    id: "1",
    nickname: "아미화",
    nicknameId: "sm101",
    phone: "010-0000-0000",
    address: "서울시 강남구 테헤란로 27",
    revenueAmount: 5000000,
    revenueCount: 50,
    cancelAmount: 200000,
    cancelCount: 2,
    refundAmount: 100000,
    refundCount: 1,
  },
  {
    id: "2",
    nickname: "플로리스트A",
    nicknameId: "fl001",
    phone: "010-1111-1111",
    address: "서울시 서초구 서초대로 123",
    revenueAmount: 8000000,
    revenueCount: 80,
    cancelAmount: 300000,
    cancelCount: 3,
    refundAmount: 150000,
    refundCount: 2,
  },
  {
    id: "3",
    nickname: "매장B",
    nicknameId: "shop002",
    phone: "010-2222-2222",
    address: "경기도 성남시 분당구 정자동",
    revenueAmount: 12000000,
    revenueCount: 120,
    cancelAmount: 500000,
    cancelCount: 5,
    refundAmount: 200000,
    refundCount: 2,
  },
];

const shopNames = ["매장", "플라워샵", "꽃집", "식물원"];
const floristNames = ["플로리스트", "꽃 디자이너", "플라워 아티스트"];

export const mockRevenueDetails: RevenueDetail[] = [
  ...baseRevenueDetails,
  ...Array.from({ length: 197 }, (_, i) => {
    const id = (i + 4).toString();
    const isShop = i % 2 === 0;
    const nameBase = isShop ? shopNames[i % shopNames.length] : floristNames[i % floristNames.length];
    const revenueCount = Math.floor(Math.random() * 200 + 10);
    const revenueAmount = revenueCount * 100000;
    const cancelCount = Math.floor(revenueCount * 0.05);
    const cancelAmount = cancelCount * 50000;
    const refundCount = Math.floor(revenueCount * 0.02);
    const refundAmount = refundCount * 50000;

    return {
      id,
      nickname: `${nameBase}${String.fromCharCode(65 + (i % 26))}`,
      nicknameId: `${isShop ? "shop" : "florist"}${String(i + 1).padStart(3, "0")}`,
      phone: `010-${String(i % 10000).padStart(4, "0")}-${String((i * 3) % 10000).padStart(4, "0")}`,
      address: `${regions[i % regions.length]} ${i + 1}번지`,
      revenueAmount,
      revenueCount,
      cancelAmount,
      cancelCount,
      refundAmount,
      refundCount,
    };
  }),
];

export interface RevenueDashboardData {
  totalRevenue: number;
  paymentAmount: number;
  paymentCount: number;
  deliveryInProgress: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  deliveryCompleted: number;
  paymentCountBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
  paymentAmountBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
  refundCancelCountBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
  refundCancelAmountBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
}

export function generateRevenueDashboardData(date?: Date): RevenueDashboardData {
  const paymentCountBreakdown = {
    card: 150,
    transfer: 80,
    pos: 120,
  };

  const paymentAmountBreakdown = {
    card: 15000000,
    transfer: 8000000,
    pos: 7000000,
  };

  const refundCancelCountBreakdown = {
    card: 8,
    transfer: 4,
    pos: 3,
  };

  const refundCancelAmountBreakdown = {
    card: 1200000,
    transfer: 800000,
    pos: 430000,
  };

  const paymentAmount = paymentAmountBreakdown.card + paymentAmountBreakdown.transfer + paymentAmountBreakdown.pos;
  const paymentCount = paymentCountBreakdown.card + paymentCountBreakdown.transfer + paymentCountBreakdown.pos;
  const refundCancelAmount =
    refundCancelAmountBreakdown.card + refundCancelAmountBreakdown.transfer + refundCancelAmountBreakdown.pos;
  const refundCancelCount =
    refundCancelCountBreakdown.card + refundCancelCountBreakdown.transfer + refundCancelCountBreakdown.pos;
  const totalRevenue = paymentAmount - refundCancelAmount;
  const deliveryInProgress = 25;
  const deliveryCompleted = paymentCount - deliveryInProgress - refundCancelCount;

  return {
    totalRevenue,
    paymentAmount,
    paymentCount,
    deliveryInProgress,
    refundCancelAmount,
    refundCancelCount,
    deliveryCompleted,
    paymentCountBreakdown,
    paymentAmountBreakdown,
    refundCancelCountBreakdown,
    refundCancelAmountBreakdown,
  };
}

export interface YearlyRevenueDetailData {
  totalAmount: number;
  paymentAmount: number;
  paymentCount: number;
  deliveryInProgress: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  deliveryCompleted: number;
}

export function generateYearlyRevenueDetailData(year: string): YearlyRevenueDetailData {
  return {
    totalAmount: 1361471840,
    paymentAmount: 1200000000,
    paymentCount: 1250,
    deliveryInProgress: 50,
    refundCancelAmount: 161471840,
    refundCancelCount: 25,
    deliveryCompleted: 1175,
  };
}

export interface QuarterProductDetailData {
  totalAmount: number;
  paymentAmount: number;
  paymentCount: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  deliveryInProgress: number;
  deliveryCompleted: number;
  paymentBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
}

export function generateQuarterProductDetailData(year: string, quarter?: string): QuarterProductDetailData {
  const paymentAmount = 1200000000;
  const paymentCount = 1250;
  const refundCancelAmount = 161471840;
  const refundCancelCount = 25;
  const totalAmount = paymentAmount - refundCancelAmount;
  const deliveryInProgress = 50;
  const deliveryCompleted = paymentCount - deliveryInProgress - refundCancelCount;

  return {
    totalAmount,
    paymentAmount,
    paymentCount,
    refundCancelAmount,
    refundCancelCount,
    deliveryInProgress,
    deliveryCompleted,
    paymentBreakdown: {
      card: 1500000000,
      transfer: 500000000,
      pos: 800000000,
    },
  };
}

export interface OrderDashboardData {
  cvrData: Array<{ period: string; cvr: number }>;
  searchTrendData: Array<{ keyword: string; search: number; bounceRate: number }>;
}

export function generateOrderDashboardData(): OrderDashboardData {
  return {
    cvrData: [
      { period: "1주", cvr: 2.5 },
      { period: "2주", cvr: 3.0 },
      { period: "3주", cvr: 2.8 },
      { period: "4주", cvr: 3.2 },
      { period: "5주", cvr: 3.5 },
    ],
    searchTrendData: [
      { keyword: "장미", search: 1000, bounceRate: 25.5 },
      { keyword: "화분", search: 800, bounceRate: 30.2 },
      { keyword: "꽃다발", search: 600, bounceRate: 28.1 },
      { keyword: "식물", search: 500, bounceRate: 32.5 },
      { keyword: "화환", search: 400, bounceRate: 27.8 },
    ],
  };
}

export interface CustomerDashboardData {
  genderData: Array<{ name: string; value: number }>;
  ageData: Array<{ age: string; value: number }>;
  rankingData: Array<{ rank: number; name: string; amount: number }>;
}

export function generateCustomerDashboardData(): CustomerDashboardData {
  return {
    genderData: [
      { name: "남성", value: 400 },
      { name: "여성", value: 600 },
    ],
    ageData: [
      { age: "20대", value: 200 },
      { age: "30대", value: 300 },
      { age: "40대", value: 250 },
      { age: "50대", value: 150 },
      { age: "60대+", value: 100 },
    ],
    rankingData: [
      { rank: 1, name: "고객A", amount: 1000000 },
      { rank: 2, name: "고객B", amount: 800000 },
      { rank: 3, name: "고객C", amount: 600000 },
      { rank: 4, name: "고객D", amount: 500000 },
      { rank: 5, name: "고객E", amount: 400000 },
    ],
  };
}

export interface CvrChartData {
  weekly: Array<{ day: string; thisWeek: number; lastWeek: number }>;
  monthly: Array<{ week: string; thisMonth: number; lastMonth: number }>;
  yearly: Array<{ month: string; thisYear: number; lastYear: number }>;
}

export function generateCvrChartData(): CvrChartData {
  return {
    weekly: [
      { day: "Sun", thisWeek: 3.2, lastWeek: 2.8 },
      { day: "Mon", thisWeek: 3.5, lastWeek: 3.1 },
      { day: "Tue", thisWeek: 3.8, lastWeek: 3.3 },
      { day: "Wed", thisWeek: 3.6, lastWeek: 3.2 },
      { day: "Thu", thisWeek: 3.9, lastWeek: 3.5 },
      { day: "Fri", thisWeek: 4.1, lastWeek: 3.7 },
      { day: "Sat", thisWeek: 3.7, lastWeek: 3.4 },
    ],
    monthly: [
      { week: "1주", thisMonth: 3.5, lastMonth: 3.2 },
      { week: "2주", thisMonth: 3.8, lastMonth: 3.4 },
      { week: "3주", thisMonth: 3.9, lastMonth: 3.6 },
      { week: "4주", thisMonth: 4.1, lastMonth: 3.8 },
    ],
    yearly: [
      { month: "1월", thisYear: 3.2, lastYear: 2.9 },
      { month: "2월", thisYear: 3.5, lastYear: 3.1 },
      { month: "3월", thisYear: 3.8, lastYear: 3.4 },
      { month: "4월", thisYear: 3.9, lastYear: 3.6 },
      { month: "5월", thisYear: 4.1, lastYear: 3.8 },
      { month: "6월", thisYear: 4.2, lastYear: 3.9 },
    ],
  };
}

export interface ConversionRateData {
  weekly: { current: number; last: number };
  monthly: { current: number; last: number };
  yearly: { current: number; last: number };
}

export function generateConversionRateData(): ConversionRateData {
  return {
    weekly: {
      current: 75,
      last: 72,
    },
    monthly: {
      current: 78,
      last: 75,
    },
    yearly: {
      current: 82,
      last: 79,
    },
  };
}
