export type PaymentMethod = "CARD" | "POS" | "BANK_TRANSFER" | "FLIT" | "CASH" | "ETC";
export type TransactionType = "BAROGO" | "PICKUP" | "REFUND" | "ORDERING" | "ETC";
export type RefundStatus = "REFUNDED" | "PENDING";
export type DeliveryStatus = "PREPARING" | "SHIPPING" | "COMPLETED";
export type OrderStatus = "REGISTER" | "PROGRESS" | "COMPLETED" | "CANCELED";

export interface TransactionOrderParams {
  page?: number;
  size?: number;
  type?: "ALL" | "SHOP" | "FLORIST";
  paymentDate?: string;
  paymentMethod?: string;
}

export interface Transaction {
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
  paymentMethod?: string;
  type?: string;
  status?: string;
}

export interface TransactionOrderingParams {
  page?: number;
  size?: number;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface TransactionCanceledParams {
  page?: number;
  size?: number;
  type?: "ALL" | "SHOP" | "FLORIST" | "ORDERING";
  status?: string;
  orderDate?: string;
}

export type CanceledTransaction = Transaction;

export interface TransactionDetail {
  transactionId: number;
  transactionNumber: string;
  from: {
    nickname: string;
    loginId: string;
    phoneNumber: string;
    address: string;
    detailAddress: string;
  };
  to: {
    nickname: string;
    loginId: string;
    phoneNumber: string;
    address: string;
    detailAddress: string;
  };
  productName: string;
  productImageUrl: string;
  paymentAmount: number;
  reserve: number;
  customerRequest: string;
  orderDate: string;
  paymentDate: string;
  paymentMethod?: string;
  deliveryStatus: string;
  type?: string;
  deliveryInformation?: {
    deliveryDate: string;
    deliveryDistance: number;
    totalDeliveryAmount: number;
    distanceDeliveryAmount: number;
    rainSurcharge: number;
    vat: number;
  };
}
