export type Category = "FLOWER" | "PLANTS" | "WREATH" | "SCENOGRAPHY" | "REGULAR_DELIVERY";
export type CategoryType = "GROUP" | "PRODUCT";
export type PeriodType = "DAILY" | "WEEKLY" | "MONTHLY";
export type OrderPeriod = "WEEKLY" | "MONTHLY" | "YEARLY";
export type Region = "SEOUL" | "GYEONGGI" | "INCHEON" | "ETC";

export interface RevenueOverviewParams {
  targetDate?: string;
}

export interface RevenueOverviewResponse {
  lastUpdatedAt: string;
  totalSales: number;
  paymentAmount: {
    card: number;
    bankTransfer: number;
    pos: number;
  };
  paymentCount: {
    card: number;
    bankTransfer: number;
    pos: number;
  };
  refundCancelAmount: {
    card: number;
    bankTransfer: number;
    pos: number;
  };
  refundCancelCount: {
    card: number;
    bankTransfer: number;
    pos: number;
  };
  shippingCount: number;
  shippingCompletedCount: number;
}

export interface RevenueNetParams {
  period: PeriodType;
  paymentMethod?: "ALL" | "CARD" | "POS" | "BANK_TRANSFER";
  startDate: string;
  endDate: string;
}

export interface RevenueNetResponse {
  current: Array<{ date: string; value: number }>;
  last: Array<{ date: string; value: number }>;
}

export interface RevenueNetYearlyParams {
  startYear: string;
  endYear: string;
}

export interface RevenueNetYearlyResponse {
  year: string;
  value: number;
}

export interface RevenueNetQuarterParams {
  targetYear: string;
}

export interface RevenueNetQuarterResponse {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export interface RevenueDetailParams {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  category?: "ALL" | Category;
  paymentMethod?: "ALL" | "CARD" | "CASH" | "BANK_TRANSFER" | "ETC";
  region?: "ALL" | Region;
  status?: "ALL" | "REGISTER" | "PROGRESS" | "COMPLETED" | "CANCELED";
}

export interface RevenueDetailItem {
  transactionId: number;
  name: string;
  nickname: string;
  loginId: string;
  phoneNumber: string;
  address: string;
  salesAmount: number;
  canceledAmount: number;
  refundAmount: number;
  category?: Category;
  paymentMethod?: "CARD" | "CASH" | "BANK_TRANSFER" | "ETC";
  status?: "REGISTER" | "PROGRESS" | "COMPLETED" | "CANCELED";
  orderDate?: string;
}

export interface ProductCategoryParams {
  targetDate: string;
  category: CategoryType;
}

export interface ProductCategoryResponse {
  label: string;
  value: number;
}

export interface ProductNetParams {
  period: PeriodType;
  paymentMethod?: "ALL" | "CARD" | "POS" | "BANK_TRANSFER";
  startDate: string;
  endDate: string;
}

export interface ProductNetResponse {
  current: Array<{ date: string; value: number }>;
  last: Array<{ date: string; value: number }>;
}

export interface ProductNetYearlyParams {
  startYear: string;
  endYear: string;
}

export interface ProductNetYearlyResponse {
  year: string;
  value: number;
}

export interface ProductNetQuarterParams {
  targetYear: string;
}

export interface ProductNetQuarterResponse {
  category: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export interface ProductNetQuarterDetailResponse {
  category: string;
  lastUpdatedAt: string;
  totalSales: number;
  paymentAmount: {
    card: number;
    bankTransfer: number;
    pos: number;
  };
  paymentCount: {
    card: number;
    bankTransfer: number;
    pos: number;
  };
  refundCancelAmount: {
    card: number;
    bankTransfer: number;
    pos: number;
  };
  refundCancelCount: {
    card: number;
    bankTransfer: number;
    pos: number;
  };
}

export interface ProductDetailParams {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  category?: "ALL" | Category;
  paymentMethod?: "ALL" | "CARD" | "CASH" | "BANK_TRANSFER" | "ETC";
  region?: "ALL" | Region;
  status?: "ALL" | "REGISTER" | "PROGRESS" | "COMPLETED" | "CANCELED";
}

export interface ProductDetailItem {
  transactionId: number;
  name: string;
  nickname: string;
  loginId: string;
  phoneNumber: string;
  address: string;
  productName: string;
  amount: number;
  paymentMethod: string;
  status?: "REGISTER" | "PROGRESS" | "COMPLETED" | "CANCELED";
  orderDate?: string;
}

export interface CustomerGenderParams {
  targetDate: string;
}

export interface CustomerGenderResponse {
  ratio: {
    male: number;
    female: number;
    etc: number;
  };
  productsRanking: Array<{
    rank: number;
    productName: string;
    count: number;
  }>;
  products: Array<{
    productName: string;
    male: number;
    female: number;
    etc: number;
  }>;
}

export interface CustomerAgeParams {
  targetDate: string;
}

export interface CustomerAgeResponse {
  age: Array<{ label: string; value: number }>;
  productsRanking: Array<{
    rank: number;
    productName: string;
    count: number;
  }>;
  products: Array<{
    productName: string;
    ageGroups: {
      "10s": number;
      "20s": number;
      "30s": number;
      "40s": number;
      "50s": number;
      "60s": number;
      "70sPlus": number;
    };
  }>;
}

export interface OrderConversionRateParams {
  period: OrderPeriod;
}

export interface OrderConversionRateResponse {
  last: number;
  current: number;
}

export interface OrderCvrParams {
  period: OrderPeriod;
  startDate: string;
  endDate: string;
}

export interface OrderCvrResponse {
  last: number;
  current: number;
}

export interface OrderKeywordTrendParams {
  period: OrderPeriod;
  startDate: string;
  endDate: string;
}

export interface OrderKeywordTrendResponse {
  rank: number;
  keyword: string;
  searchCount: number;
  bounceRate: number;
}
