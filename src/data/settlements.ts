import { Settlement, SettlementDetail, SettlementDetailTransaction } from "@/types/dashboard";

const baseSettlements: Settlement[] = [
  {
    id: "1",
    nickname: "매장A",
    nicknameId: "shop001",
    phone: "010-1234-5678",
    email: "shop@example.com",
    totalRevenue: 1000000,
    commission: 100000,
    revenueExcludingCommission: 900000,
    deliveryFee: 50000,
    status: "completed",
    settlementDate: "2025-12-01",
    type: "shop",
  },
  {
    id: "2",
    nickname: "플로리스트B",
    nicknameId: "florist001",
    phone: "010-2345-6789",
    email: "florist@example.com",
    totalRevenue: 800000,
    commission: 80000,
    revenueExcludingCommission: 720000,
    deliveryFee: 40000,
    status: "pending",
    settlementDate: "2025-12-01",
    type: "florist",
  },
];

const types: Settlement["type"][] = ["shop", "florist"];
const statuses: Settlement["status"][] = ["pending", "completed", "cancelled"];
const shopNames = ["매장", "플라워샵", "꽃집", "식물원", "가든센터"];
const floristNames = ["플로리스트", "꽃 디자이너", "플라워 아티스트"];

export const mockSettlements: Settlement[] = [
  ...baseSettlements,
  ...Array.from({ length: 198 }, (_, i) => {
    const id = (i + 3).toString();
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];
    const year = 2025;
    const month = String((i % 12) + 1).padStart(2, "0");
    const day = String((i % 28) + 1).padStart(2, "0");
    const nameBase = type === "shop" ? shopNames[i % shopNames.length] : floristNames[i % floristNames.length];
    const totalRevenue = Math.floor(Math.random() * 2000000 + 500000);
    const commission = Math.floor(totalRevenue * 0.1);
    const deliveryFee = Math.floor(totalRevenue * 0.05);

    return {
      id,
      nickname: `${nameBase}${String.fromCharCode(65 + (i % 26))}`,
      nicknameId: `${type === "shop" ? "shop" : "florist"}${String(i + 1).padStart(3, "0")}`,
      phone: `010-${String(i % 10000).padStart(4, "0")}-${String((i * 3) % 10000).padStart(4, "0")}`,
      email: `${type === "shop" ? "shop" : "florist"}${i}@example.com`,
      totalRevenue,
      commission,
      revenueExcludingCommission: totalRevenue - commission,
      deliveryFee,
      status,
      settlementDate: `${year}-${month}-${day}`,
      type,
    };
  }),
];

export const mockSettlementDetail: SettlementDetail = {
  id: "1",
  nickname: "매장A",
  nicknameId: "shop001",
  phone: "010-1234-5678",
  email: "shop@example.com",
  settlementDate: new Date(2024, 0, 15),
  lastUpdated: new Date(2024, 0, 20, 14, 30),
  settlementAmount: 950000,
  paymentAmount: 1000000,
  paymentCount: 25,
  deliveryCount: 20,
  commission: 100000,
  refundCancelAmount: 50000,
  refundCancelCount: 2,
  deliveryFee: 50000,
  paymentMethodBreakdown: {
    card: 600000,
    account: 300000,
    pos: 100000,
  },
};

export const mockSettlementDetailTransactions: SettlementDetailTransaction[] = [
  {
    id: "1",
    orderNumber: "AAD0123AB10",
    from: "아미화 (sm101)",
    fromId: "sm101",
    to: "규팀장 (QQQ)",
    toId: "QQQ",
    productName: "엔티크 장미 꽃다발",
    paymentAmount: 50000,
    orderDate: "2024-01-10",
    paymentDate: "2024-01-10",
    paymentMethod: "카드결제",
    type: "바로고",
    subCategory: "florist",
    floristInfo: {
      phone: "010-0000-000",
      address: "서울시 강남구 도산대로 00-0",
      detailedAddress: "00빌딩 1층 12호",
    },
    customerInfo: {
      phone: "010-0000-0000",
      address: "서울시 강남구 테헤란로00-0",
      detailedAddress: "000아파트 102동 11호",
    },
    deliveryInfo: {
      status: "배달중",
      type: "바로고",
      distance: 1.5,
      agencyFee: 3000,
      rainyDaySurcharge: 800,
      vat: 380,
      estimatedTime: "30분 후 배달 완료 예상",
    },
    rewardPoints: 500,
    customerRequest: "꽃 안망가지게 배달 부탁드립니당",
  },
  {
    id: "2",
    orderNumber: "CVD0123AC43",
    from: "오후 (Jeon)",
    fromId: "Jeon",
    to: "지니 (jini)",
    toId: "jini",
    productName: "장미 | 튤립 꽃바구니",
    paymentAmount: 123000,
    orderDate: "2024-01-11",
    paymentDate: "2024-01-11",
    paymentMethod: "POS결제",
    type: "픽업",
    subCategory: "shop",
    floristInfo: {
      phone: "010-1111-1111",
      address: "서울시 서초구 서초대로 11-1",
      detailedAddress: "11빌딩 2층 21호",
    },
    customerInfo: {
      phone: "010-2222-2222",
      address: "서울시 서초구 강남대로 22-2",
      detailedAddress: "22아파트 201동 22호",
    },
    deliveryInfo: {
      status: "상품 준비중",
      type: "픽업",
    },
    rewardPoints: 1230,
  },
  {
    id: "3",
    orderNumber: "CDA0123CB11",
    from: "매장A (shop001)",
    fromId: "shop001",
    to: "고객A",
    toId: "customerA",
    productName: "장미 꽃다발",
    paymentAmount: 45000,
    orderDate: "2024-01-12",
    paymentDate: "2024-01-12",
    paymentMethod: "계좌이체",
    type: "바로고",
    subCategory: "florist",
    floristInfo: {
      phone: "010-3333-3333",
      address: "서울시 마포구 홍대로 33-3",
      detailedAddress: "33빌딩 3층 33호",
    },
    customerInfo: {
      phone: "010-4444-4444",
      address: "서울시 마포구 연남로 44-4",
      detailedAddress: "44아파트 301동 44호",
    },
    deliveryInfo: {
      status: "배달완료",
      type: "바로고",
      distance: 2.3,
      agencyFee: 4000,
      rainyDaySurcharge: 0,
      vat: 400,
    },
    rewardPoints: 450,
  },
];
