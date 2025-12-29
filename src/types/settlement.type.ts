export type SettlementStatus = "PENDING" | "CANCELED" | "COMPLETED";
export type SettlementPeriod = "ONE_WEEK" | "TWO_WEEK" | "MONTH";

export interface SettlementListParams {
  page?: number;
  size?: number;
  period?: SettlementPeriod;
  type?: "ALL" | "SHOP" | "FLORIST";
  year?: string;
  month?: string;
}

export interface Settlement {
  settlementId: number;
  nickname: string;
  loginId: string;
  phoneNumber: string;
  mail: string;
  totalSales: number;
  commission: number;
  deliveryAmount: number;
  status: SettlementStatus;
  settlementDate: string;
}

export interface SettlementDetailParams {
  page?: number;
  size?: number;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface SettlementDetail {
  settlementId: number;
  totalPaymentAmount: number;
  cardPaymentAmount: number;
  bankTransferPaymentAmount: number;
  posPaymentAmount: number;
  paymentCount: number;
  deliveryAmount: number;
  deliveryCount: number;
  commission: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  settlementAmount: number;
  lastUpdatedAt: string;
  user: {
    userId: number;
    nickname: string;
    loginId: string;
    phoneNumber: string;
    mail: string;
  };
  transactions: Array<{
    transactionId: number;
    transactionNumber: string;
    fromNickname: string;
    fromLoginId: string;
    toNickname: string;
    toLoginId: string;
    productName: string;
    productImageUrl: string;
    paymentAmount: number;
    orderDate: string;
    paymentDate: string;
    paymentMethod: string;
    type: string;
  }>;
}
