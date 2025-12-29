import type { Settlement, SettlementDetail } from "@/types/settlement.type";

const shopNames = ["상점A", "상점B", "상점C", "상점D", "상점E", "상점F", "상점G", "상점H"];
const floristNames = ["플로리스트A", "플로리스트B", "플로리스트C", "플로리스트D", "플로리스트E"];
const statuses: Array<"PENDING" | "CANCELED" | "COMPLETED"> = ["PENDING", "CANCELED", "COMPLETED"];

export const mockSettlements: Settlement[] = Array.from({ length: 150 }, (_, i) => {
  const isShop = i % 2 === 0;
  const nickname = isShop ? shopNames[i % shopNames.length] : floristNames[i % floristNames.length];
  const loginId = isShop
    ? `shop${String((i % shopNames.length) + 1).padStart(3, "0")}`
    : `florist${String((i % floristNames.length) + 1).padStart(3, "0")}`;
  const date = new Date();
  date.setDate(date.getDate() - (i % 90));

  return {
    settlementId: i + 1,
    nickname,
    loginId,
    phoneNumber: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    mail: `${loginId}@example.com`,
    totalSales: Math.floor(Math.random() * 10000000) + 1000000,
    commission: Math.floor(Math.random() * 500000) + 50000,
    deliveryAmount: Math.floor(Math.random() * 200000) + 10000,
    status: statuses[i % statuses.length],
    settlementDate: date.toISOString().split("T")[0],
  };
});

export const mockSettlementDetails: Record<number, SettlementDetail> = Object.fromEntries(
  mockSettlements.slice(0, 50).map((settlement, i) => {
    const transactionCount = Math.floor(Math.random() * 20) + 5;

    return [
      settlement.settlementId,
      {
        settlementId: settlement.settlementId,
        totalPaymentAmount: settlement.totalSales,
        cardPaymentAmount: Math.floor(settlement.totalSales * 0.6),
        bankTransferPaymentAmount: Math.floor(settlement.totalSales * 0.3),
        posPaymentAmount: Math.floor(settlement.totalSales * 0.1),
        paymentCount: transactionCount,
        deliveryAmount: settlement.deliveryAmount,
        deliveryCount: Math.floor(transactionCount * 0.7),
        commission: settlement.commission,
        refundCancelAmount: Math.floor(Math.random() * 500000),
        refundCancelCount: Math.floor(Math.random() * 5),
        settlementAmount: settlement.totalSales - settlement.commission - settlement.deliveryAmount,
        lastUpdatedAt: new Date().toISOString(),
        user: {
          userId: settlement.settlementId + 1000,
          nickname: settlement.nickname,
          loginId: settlement.loginId,
          phoneNumber: settlement.phoneNumber,
          mail: settlement.mail,
        },
        transactions: Array.from({ length: transactionCount }, (_, j) => {
          const transactionDate = new Date(settlement.settlementDate);
          transactionDate.setDate(transactionDate.getDate() - (j % 7));

          return {
            transactionId: settlement.settlementId * 1000 + j + 1,
            transactionNumber: `TXN-${settlement.settlementDate.replace(/-/g, "")}-${String(j + 1).padStart(3, "0")}`,
            fromNickname: `고객${String.fromCharCode(65 + (j % 26))}`,
            fromLoginId: `customer${String(j + 1).padStart(3, "0")}`,
            toNickname: settlement.nickname,
            toLoginId: settlement.loginId,
            productName: ["장미 꽃다발", "튤립 꽃다발", "동양난", "서양난", "꽃바구니"][j % 5],
            productImageUrl: `https://example.com/product-${(j % 5) + 1}.jpg`,
            paymentAmount: Math.floor(Math.random() * 200000) + 30000,
            orderDate: transactionDate.toISOString().split("T")[0],
            paymentDate: transactionDate.toISOString().split("T")[0],
            paymentMethod: ["CARD", "BANK_TRANSFER", "POS", "FLIT"][j % 4],
            type: ["BAROGO", "PICKUP", "ORDERING"][j % 3],
          };
        }),
      },
    ];
  }),
);
