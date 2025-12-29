import type {
  RevenueOverviewResponse,
  RevenueNetResponse,
  RevenueNetYearlyResponse,
  RevenueNetQuarterResponse,
  RevenueDetailItem,
  ProductCategoryResponse,
  ProductNetResponse,
  ProductNetYearlyResponse,
  ProductNetQuarterResponse,
  ProductNetQuarterDetailResponse,
  ProductDetailItem,
  CustomerGenderResponse,
  CustomerAgeResponse,
  OrderConversionRateResponse,
  OrderCvrResponse,
  OrderKeywordTrendResponse,
} from "@/types/sales.type";

export function generateRevenueOverview(): RevenueOverviewResponse {
  return {
    lastUpdatedAt: new Date().toISOString(),
    totalSales: 50000000,
    paymentAmount: {
      card: 30000000,
      bankTransfer: 15000000,
      pos: 5000000,
    },
    paymentCount: {
      card: 300,
      bankTransfer: 150,
      pos: 50,
    },
    refundCancelAmount: {
      card: 1000000,
      bankTransfer: 500000,
      pos: 200000,
    },
    refundCancelCount: {
      card: 10,
      bankTransfer: 5,
      pos: 2,
    },
    shippingCount: 50,
    shippingCompletedCount: 450,
  };
}

export function generateRevenueNet(
  startDate: string,
  endDate: string,
  period: "DAILY" | "WEEKLY" | "MONTHLY",
): RevenueNetResponse {
  const dates = period === "DAILY" ? 24 : period === "WEEKLY" ? 7 : 12;
  const current = Array.from({ length: dates }, (_, i) => {
    const date = new Date(startDate);
    if (period === "DAILY") {
      date.setHours(i);
      return { date: date.toISOString(), value: Math.floor(Math.random() * 1000000) + 500000 };
    } else if (period === "WEEKLY") {
      date.setDate(date.getDate() + i);
      return { date: date.toISOString().split("T")[0], value: Math.floor(Math.random() * 5000000) + 2000000 };
    } else {
      date.setMonth(date.getMonth() + i);
      return { date: date.toISOString().split("T")[0], value: Math.floor(Math.random() * 50000000) + 20000000 };
    }
  });

  const last = current.map((item) => ({
    date: item.date,
    value: Math.floor(item.value * 0.9),
  }));

  return { current, last };
}

export function generateRevenueNetYearly(startYear: string, endYear: string): RevenueNetYearlyResponse[] {
  const start = parseInt(startYear);
  const end = parseInt(endYear);
  return Array.from({ length: end - start + 1 }, (_, i) => ({
    year: (start + i).toString(),
    value: Math.floor(Math.random() * 100000000) + 50000000,
  })).reverse();
}

export function generateRevenueNetQuarter(targetYear: string): RevenueNetQuarterResponse {
  return {
    q1: Math.floor(Math.random() * 50000000) + 20000000,
    q2: Math.floor(Math.random() * 50000000) + 20000000,
    q3: Math.floor(Math.random() * 50000000) + 20000000,
    q4: Math.floor(Math.random() * 50000000) + 20000000,
  };
}

const customerNames = ["홍길동", "김철수", "이영희", "박민수", "정수진", "최지영", "강호영", "윤서연"];
const regions = [
  "서울시 강남구",
  "서울시 서초구",
  "서울시 마포구",
  "서울시 노원구",
  "서울시 송파구",
  "경기도 성남시",
  "인천시 남동구",
];

export const mockRevenueDetails: RevenueDetailItem[] = Array.from({ length: 150 }, (_, i) => {
  const name = customerNames[i % customerNames.length];
  const date = new Date();
  date.setDate(date.getDate() - (i % 30));

  return {
    transactionId: i + 1,
    name,
    nickname: `고객${String.fromCharCode(65 + (i % 26))}`,
    loginId: `customer${String(i + 1).padStart(3, "0")}`,
    phoneNumber: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    address: regions[i % regions.length],
    salesAmount: Math.floor(Math.random() * 200000) + 30000,
    canceledAmount: i % 10 === 0 ? Math.floor(Math.random() * 50000) : 0,
    refundAmount: i % 15 === 0 ? Math.floor(Math.random() * 30000) : 0,
  };
});

export function generateProductCategory(category: "GROUP" | "PRODUCT"): ProductCategoryResponse[] {
  if (category === "GROUP") {
    return [
      { label: "꽃", value: 20000000 },
      { label: "식물", value: 15000000 },
      { label: "화환", value: 10000000 },
      { label: "공간연출", value: 5000000 },
    ];
  } else {
    return [
      { label: "장미 꽃다발", value: 5000000 },
      { label: "튤립 꽃다발", value: 4000000 },
      { label: "동양난", value: 3000000 },
      { label: "서양난", value: 2000000 },
    ];
  }
}

export function generateProductNet(
  startDate: string,
  endDate: string,
  period: "DAILY" | "WEEKLY" | "MONTHLY",
): ProductNetResponse {
  return generateRevenueNet(startDate, endDate, period);
}

export function generateProductNetYearly(startYear: string, endYear: string): ProductNetYearlyResponse[] {
  return generateRevenueNetYearly(startYear, endYear);
}

export function generateProductNetQuarter(targetYear: string): ProductNetQuarterResponse[] {
  return [
    { category: "꽃", q1: 10000000, q2: 12000000, q3: 15000000, q4: 18000000 },
    { category: "식물", q1: 8000000, q2: 9000000, q3: 10000000, q4: 11000000 },
    { category: "화환", q1: 5000000, q2: 6000000, q3: 7000000, q4: 8000000 },
  ];
}

export function generateProductNetQuarterDetail(): ProductNetQuarterDetailResponse[] {
  return [
    {
      category: "FLOWER",
      lastUpdatedAt: new Date().toISOString(),
      totalSales: 55000000,
      paymentAmount: { card: 33000000, bankTransfer: 16500000, pos: 5500000 },
      paymentCount: { card: 330, bankTransfer: 165, pos: 55 },
      refundCancelAmount: { card: 1100000, bankTransfer: 550000, pos: 220000 },
      refundCancelCount: { card: 11, bankTransfer: 5, pos: 2 },
    },
    {
      category: "PLANTS",
      lastUpdatedAt: new Date().toISOString(),
      totalSales: 38000000,
      paymentAmount: { card: 22800000, bankTransfer: 11400000, pos: 3800000 },
      paymentCount: { card: 228, bankTransfer: 114, pos: 38 },
      refundCancelAmount: { card: 760000, bankTransfer: 380000, pos: 152000 },
      refundCancelCount: { card: 7, bankTransfer: 3, pos: 1 },
    },
    {
      category: "WREATH",
      lastUpdatedAt: new Date().toISOString(),
      totalSales: 22000000,
      paymentAmount: { card: 13200000, bankTransfer: 6600000, pos: 2200000 },
      paymentCount: { card: 132, bankTransfer: 66, pos: 22 },
      refundCancelAmount: { card: 440000, bankTransfer: 220000, pos: 88000 },
      refundCancelCount: { card: 4, bankTransfer: 2, pos: 1 },
    },
    {
      category: "SCENOGRAPHY",
      lastUpdatedAt: new Date().toISOString(),
      totalSales: 11000000,
      paymentAmount: { card: 6600000, bankTransfer: 3300000, pos: 1100000 },
      paymentCount: { card: 66, bankTransfer: 33, pos: 11 },
      refundCancelAmount: { card: 220000, bankTransfer: 110000, pos: 44000 },
      refundCancelCount: { card: 2, bankTransfer: 1, pos: 0 },
    },
    {
      category: "REGULAR_DELIVERY",
      lastUpdatedAt: new Date().toISOString(),
      totalSales: 5500000,
      paymentAmount: { card: 3300000, bankTransfer: 1650000, pos: 550000 },
      paymentCount: { card: 33, bankTransfer: 16, pos: 5 },
      refundCancelAmount: { card: 110000, bankTransfer: 55000, pos: 22000 },
      refundCancelCount: { card: 11, bankTransfer: 5, pos: 2 },
    },
  ];
}

const productNames = ["장미 꽃다발", "튤립 꽃다발", "동양난", "서양난", "꽃바구니", "화환", "공간연출", "정기배송"];
const paymentMethods = ["CARD", "BANK_TRANSFER", "POS", "CASH", "ETC"];

export const mockProductDetails: ProductDetailItem[] = Array.from({ length: 150 }, (_, i) => {
  const name = customerNames[i % customerNames.length];
  const date = new Date();
  date.setDate(date.getDate() - (i % 30));

  return {
    transactionId: i + 1,
    name,
    nickname: `고객${String.fromCharCode(65 + (i % 26))}`,
    loginId: `customer${String(i + 1).padStart(3, "0")}`,
    phoneNumber: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    address: regions[i % regions.length],
    productName: productNames[i % productNames.length],
    amount: Math.floor(Math.random() * 200000) + 30000,
    paymentMethod: paymentMethods[i % paymentMethods.length],
  };
});

export function generateCustomerGender(): CustomerGenderResponse {
  return {
    ratio: {
      male: 40,
      female: 55,
      etc: 5,
    },
    productsRanking: [
      { rank: 1, productName: "장미 꽃다발", count: 150 },
      { rank: 2, productName: "튤립 꽃다발", count: 120 },
      { rank: 3, productName: "동양난", count: 100 },
      { rank: 4, productName: "서양난", count: 80 },
      { rank: 5, productName: "다육식물", count: 60 },
      { rank: 6, productName: "화분", count: 40 },
      { rank: 7, productName: "공기정화", count: 20 },
      { rank: 8, productName: "축하화환", count: 10 },
      { rank: 9, productName: "근조화환", count: 5 },
      { rank: 10, productName: "플랜테리어", count: 3 },
      { rank: 11, productName: "가드닝", count: 2 },
      { rank: 12, productName: "정기배송", count: 1 },
    ],
    products: [
      { productName: "꽃다발", male: 60, female: 80, etc: 10 },
      { productName: "꽃바구니", male: 50, female: 60, etc: 10 },
      { productName: "동양난", male: 40, female: 50, etc: 10 },
      { productName: "서양난", male: 60, female: 80, etc: 10 },
      { productName: "다육식물", male: 50, female: 60, etc: 10 },
      { productName: "화분", male: 40, female: 50, etc: 10 },
      { productName: "공기정화", male: 60, female: 80, etc: 10 },
      { productName: "축하화환", male: 50, female: 60, etc: 10 },
      { productName: "근조화환", male: 40, female: 50, etc: 10 },
      { productName: "플랜테리어", male: 60, female: 80, etc: 10 },
      { productName: "가드닝", male: 50, female: 60, etc: 10 },
      { productName: "정기배송", male: 40, female: 50, etc: 10 },
    ],
  };
}

export function generateCustomerAge(): CustomerAgeResponse {
  return {
    age: [
      { label: "10대", value: 50 },
      { label: "20대", value: 300 },
      { label: "30대", value: 400 },
      { label: "40대", value: 350 },
      { label: "50대", value: 200 },
      { label: "60대", value: 100 },
      { label: "70대 이상", value: 50 },
    ],
    productsRanking: [
      { rank: 1, productName: "장미 꽃다발", count: 150 },
      { rank: 2, productName: "튤립 꽃다발", count: 120 },
      { rank: 3, productName: "동양난", count: 100 },
      { rank: 4, productName: "서양난", count: 80 },
      { rank: 5, productName: "다육식물", count: 60 },
      { rank: 6, productName: "화분", count: 40 },
      { rank: 7, productName: "공기정화", count: 20 },
      { rank: 8, productName: "축하화환", count: 10 },
      { rank: 9, productName: "근조화환", count: 5 },
      { rank: 10, productName: "플랜테리어", count: 3 },
      { rank: 11, productName: "가드닝", count: 2 },
      { rank: 12, productName: "정기배송", count: 1 },
    ],
    products: [
      {
        productName: "꽃다발",
        ageGroups: { "10s": 10, "20s": 50, "30s": 60, "40s": 20, "50s": 8, "60s": 2, "70sPlus": 0 },
      },
      {
        productName: "꽃바구니",
        ageGroups: { "10s": 8, "20s": 40, "30s": 50, "40s": 18, "50s": 4, "60s": 0, "70sPlus": 0 },
      },
      {
        productName: "동양난",
        ageGroups: { "10s": 6, "20s": 30, "30s": 40, "40s": 15, "50s": 3, "60s": 0, "70sPlus": 0 },
      },
      {
        productName: "서양난",
        ageGroups: { "10s": 4, "20s": 20, "30s": 30, "40s": 12, "50s": 2, "60s": 0, "70sPlus": 0 },
      },
      {
        productName: "다육식물",
        ageGroups: { "10s": 2, "20s": 10, "30s": 20, "40s": 8, "50s": 1, "60s": 0, "70sPlus": 0 },
      },
      { productName: "화분", ageGroups: { "10s": 1, "20s": 5, "30s": 10, "40s": 4, "50s": 0, "60s": 0, "70sPlus": 0 } },
      {
        productName: "공기정화",
        ageGroups: { "10s": 0, "20s": 2, "30s": 5, "40s": 2, "50s": 0, "60s": 0, "70sPlus": 0 },
      },
      {
        productName: "축하화환",
        ageGroups: { "10s": 0, "20s": 1, "30s": 3, "40s": 1, "50s": 0, "60s": 0, "70sPlus": 0 },
      },
      {
        productName: "근조화환",
        ageGroups: { "10s": 0, "20s": 0, "30s": 2, "40s": 0, "50s": 0, "60s": 0, "70sPlus": 0 },
      },
      {
        productName: "플랜테리어",
        ageGroups: { "10s": 0, "20s": 0, "30s": 1, "40s": 0, "50s": 0, "60s": 0, "70sPlus": 0 },
      },
      {
        productName: "가드닝",
        ageGroups: { "10s": 0, "20s": 0, "30s": 0, "40s": 0, "50s": 0, "60s": 0, "70sPlus": 0 },
      },
      {
        productName: "정기배송",
        ageGroups: { "10s": 0, "20s": 0, "30s": 0, "40s": 0, "50s": 0, "60s": 0, "70sPlus": 0 },
      },
    ],
  };
}

export function generateOrderConversionRate(): OrderConversionRateResponse {
  return {
    last: 2.5,
    current: 3.2,
  };
}

export function generateOrderCvr(startDate: string, endDate: string): OrderCvrResponse[] {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  return dates.map((date) => ({
    last: Math.random() * 2 + 2,
    current: Math.random() * 2 + 3,
  }));
}

export function generateOrderKeywordTrend(): OrderKeywordTrendResponse[] {
  return [
    { rank: 1, keyword: "장미", searchCount: 1500, bounceRate: 25.5 },
    { rank: 2, keyword: "카네이션", searchCount: 1200, bounceRate: 30.2 },
    { rank: 3, keyword: "튤립", searchCount: 800, bounceRate: 35.0 },
    { rank: 4, keyword: "백합", searchCount: 600, bounceRate: 28.5 },
    { rank: 5, keyword: "해바라기", searchCount: 400, bounceRate: 32.0 },
    { rank: 6, keyword: "화분", searchCount: 300, bounceRate: 25.5 },
    { rank: 7, keyword: "안개꽃", searchCount: 200, bounceRate: 30.2 },
    { rank: 8, keyword: "국화", searchCount: 100, bounceRate: 35.0 },
    { rank: 9, keyword: "다육이", searchCount: 50, bounceRate: 28.5 },
    { rank: 10, keyword: "프리저브드", searchCount: 30, bounceRate: 32.0 },
  ];
}
