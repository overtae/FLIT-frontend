import type { Transaction, CanceledTransaction, TransactionDetail } from "@/types/transaction.type";

const customerNames = ["고객A", "고객B", "고객C", "고객D", "고객E", "고객F", "고객G", "고객H"];
const shopNames = ["상점A", "상점B", "상점C", "상점D", "상점E"];
const floristNames = ["플로리스트A", "플로리스트B", "플로리스트C", "플로리스트D"];
const productNames = ["장미 꽃다발", "튤립 꽃다발", "동양난", "서양난", "꽃바구니", "화환", "공간연출", "정기배송"];
const paymentMethods: Array<"CARD" | "POS" | "BANK_TRANSFER" | "FLIT"> = ["CARD", "POS", "BANK_TRANSFER", "FLIT"];
const transactionTypes: Array<"BAROGO" | "PICKUP" | "REFUND" | "ORDERING" | "ETC"> = [
  "BAROGO",
  "PICKUP",
  "REFUND",
  "ORDERING",
  "ETC",
];

export const mockTransactions: Transaction[] = Array.from({ length: 150 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (i % 30));
  const isShop = i % 2 === 0;
  const toName = isShop ? shopNames[i % shopNames.length] : floristNames[i % floristNames.length];
  const toLoginId = isShop
    ? `shop${String((i % shopNames.length) + 1).padStart(3, "0")}`
    : `florist${String((i % floristNames.length) + 1).padStart(3, "0")}`;

  return {
    transactionId: i + 1,
    transactionNumber: `TXN-2024-${String(i + 1).padStart(6, "0")}`,
    fromNickname: customerNames[i % customerNames.length],
    fromLoginId: `customer${String((i % customerNames.length) + 1).padStart(3, "0")}`,
    toNickname: toName,
    toLoginId,
    productName: productNames[i % productNames.length],
    productImageUrl: `https://example.com/product-${(i % productNames.length) + 1}.jpg`,
    paymentAmount: Math.floor(Math.random() * 200000) + 30000,
    orderDate: date.toISOString().split("T")[0],
    paymentDate: date.toISOString().split("T")[0],
    paymentMethod: paymentMethods[i % paymentMethods.length],
    type: transactionTypes[i % transactionTypes.length],
  };
});

export const mockCanceledTransactions: CanceledTransaction[] = Array.from({ length: 120 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (i % 60));
  const isShop = i % 2 === 0;
  const toName = isShop ? shopNames[i % shopNames.length] : floristNames[i % floristNames.length];
  const toLoginId = isShop
    ? `shop${String((i % shopNames.length) + 1).padStart(3, "0")}`
    : `florist${String((i % floristNames.length) + 1).padStart(3, "0")}`;

  return {
    transactionId: 1000 + i + 1,
    transactionNumber: `TXN-2024-C${String(i + 1).padStart(6, "0")}`,
    fromNickname: customerNames[i % customerNames.length],
    fromLoginId: `customer${String((i % customerNames.length) + 1).padStart(3, "0")}`,
    toNickname: toName,
    toLoginId,
    productName: productNames[i % productNames.length],
    productImageUrl: `https://example.com/product-${(i % productNames.length) + 1}.jpg`,
    paymentAmount: Math.floor(Math.random() * 200000) + 30000,
    orderDate: date.toISOString().split("T")[0],
    paymentDate: date.toISOString().split("T")[0],
    status: i % 2 === 0 ? "REFUNDED" : "PENDING",
  };
});

export const mockTransactionDetails: Record<number, TransactionDetail> = Object.fromEntries(
  mockTransactions.slice(0, 50).map((transaction, i) => {
    const date = new Date(transaction.orderDate);
    date.setHours(15, 30, 0);

    return [
      transaction.transactionId,
      {
        transactionId: transaction.transactionId,
        transactionNumber: transaction.transactionNumber,
        from: {
          nickname: transaction.fromNickname,
          loginId: transaction.fromLoginId,
          phoneNumber: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
          address: "서울시 강남구",
          detailAddress: `${Math.floor(Math.random() * 100)}동 ${Math.floor(Math.random() * 100)}호`,
        },
        to: {
          nickname: transaction.toNickname,
          loginId: transaction.toLoginId,
          phoneNumber: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
          address: "서울시 서초구",
          detailAddress: `${Math.floor(Math.random() * 100)}동 ${Math.floor(Math.random() * 100)}호`,
        },
        productName: transaction.productName,
        productImageUrl: transaction.productImageUrl,
        paymentAmount: transaction.paymentAmount,
        reserve: Math.floor(transaction.paymentAmount * 0.01),
        customerRequest: i % 3 === 0 ? "오후 3시 이후 배송 부탁드립니다" : "",
        orderDate: transaction.orderDate,
        paymentDate: transaction.paymentDate,
        paymentMethod: transaction.paymentMethod,
        deliveryStatus: i % 3 === 0 ? "PREPARING" : i % 3 === 1 ? "SHIPPING" : "COMPLETED",
        type: transaction.type,
        ...(transaction.type === "BAROGO" && {
          deliveryInformation: {
            deliveryDate: date.toISOString(),
            deliveryDistance: Math.floor(Math.random() * 20) + 1,
            totalDeliveryAmount: Math.floor(Math.random() * 10000) + 3000,
            distanceDeliveryAmount: Math.floor(Math.random() * 8000) + 2000,
            rainSurcharge: i % 5 === 0 ? Math.floor(Math.random() * 3000) : 0,
            vat: Math.floor(Math.random() * 1000) + 500,
          },
        }),
      },
    ];
  }),
);
