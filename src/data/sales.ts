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
