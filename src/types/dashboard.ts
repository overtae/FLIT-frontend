export type User = {
  id: string;
  category: "customer" | "shop" | "florist" | "seceder";
  grade: string;
  name: string;
  nickname: string;
  email: string;
  address: string;
  phone: string;
  lastAccessDate: string;
  joinDate: string;
};

export type TransactionType = "바로고" | "픽업" | "기타";
export type PaymentMethod = "카드결제" | "계좌이체" | "POS결제" | "플릿결제";
export type RefundStatus = "환불처리" | "환불미처리";

export type Transaction = {
  id: string;
  orderNumber: string;
  from: string;
  fromId?: string;
  to: string;
  toId?: string;
  productName: string;
  productImage?: string;
  paymentAmount: number;
  orderDate: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  type: TransactionType;
  subCategory?: "all" | "shop" | "florist" | "order-request";
  refundStatus?: RefundStatus;
  floristInfo?: {
    phone: string;
    address: string;
    detailedAddress: string;
  };
  customerInfo?: {
    phone: string;
    address: string;
    detailedAddress: string;
  };
  deliveryInfo?: {
    status: string;
    type: TransactionType;
    distance?: number;
    agencyFee?: number;
    rainyDaySurcharge?: number;
    vat?: number;
    estimatedTime?: string;
  };
  rewardPoints?: number;
  customerRequest?: string;
};

export type ScheduleEvent = {
  id: string;
  date: Date;
  time: string;
  endTime?: string;
  title: string;
  description?: string;
  type: "green" | "orange";
};

export type Settlement = {
  id: string;
  nickname: string;
  nicknameId: string;
  phone: string;
  email: string;
  totalRevenue: number;
  commission: number;
  revenueExcludingCommission: number;
  deliveryFee: number;
  status: "pending" | "completed" | "cancelled";
  settlementDate: string;
  type: "shop" | "florist";
};

export type SettlementDetail = {
  id: string;
  nickname: string;
  nicknameId: string;
  phone: string;
  email: string;
  settlementDate: Date;
  lastUpdated: Date;
  settlementAmount: number;
  paymentAmount: number;
  paymentCount: number;
  deliveryCount: number;
  commission: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  deliveryFee: number;
  paymentMethodBreakdown: {
    card: number;
    account: number;
    pos: number;
  };
};

export type SettlementDetailTransaction = {
  id: string;
  orderNumber: string;
  from: string;
  fromId?: string;
  to: string;
  toId?: string;
  productName: string;
  productImage?: string;
  paymentAmount: number;
  orderDate: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  type: TransactionType;
  subCategory?: "all" | "shop" | "florist" | "order-request";
  refundStatus?: RefundStatus;
  floristInfo?: {
    phone: string;
    address: string;
    detailedAddress: string;
  };
  customerInfo?: {
    phone: string;
    address: string;
    detailedAddress: string;
  };
  deliveryInfo?: {
    status: string;
    type: TransactionType;
    distance?: number;
    agencyFee?: number;
    rainyDaySurcharge?: number;
    vat?: number;
    estimatedTime?: string;
  };
  rewardPoints?: number;
  customerRequest?: string;
};

export type DashboardSection = {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
};

export type SalesDetail = {
  id: string;
  name: string;
  nickname: string;
  nicknameId: string;
  phone: string;
  address: string;
  productName: string;
  amount: number;
  paymentMethod: string;
};

export type RevenueDetail = {
  id: string;
  nickname: string;
  nicknameId: string;
  phone: string;
  address: string;
  revenueAmount: number;
  revenueCount: number;
  cancelAmount: number;
  cancelCount: number;
  refundAmount: number;
  refundCount: number;
};

export type ChartDataPoint = {
  date: string;
  desktop?: number;
  mobile?: number;
  total?: number;
  card?: number;
  pos?: number;
  transfer?: number;
  revenue?: number;
  [key: string]: string | number | undefined;
};

export type CategoryChartData = {
  name: string;
  revenue: number;
};

export type RevenueChartData = {
  date?: string;
  year?: string;
  total?: number;
  card?: number;
  pos?: number;
  transfer?: number;
  revenue?: number;
  thisMonth?: number;
  lastMonth?: number;
  [key: string]: string | number | undefined;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
