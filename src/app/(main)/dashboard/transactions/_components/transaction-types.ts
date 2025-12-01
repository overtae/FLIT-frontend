export type TransactionType = "바로고" | "픽업" | "기타";
export type PaymentMethod = "카드결제" | "계좌이체" | "POS결제" | "플릿결제";
export type RefundStatus = "환불처리" | "환불미처리";

export interface Transaction {
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
}
