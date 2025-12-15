import { Transaction } from "@/types/dashboard";

const paymentMethods: Transaction["paymentMethod"][] = ["카드결제", "계좌이체", "POS결제", "플릿결제"];
const transactionTypes: Transaction["type"][] = ["바로고", "픽업", "기타"];
const subCategories: Transaction["subCategory"][] = ["shop", "florist", "order-request"];
const productNames = [
  "장미 꽃다발",
  "튤립 꽃바구니",
  "동양난",
  "서양난",
  "다육식물",
  "화분",
  "공기정화식물",
  "축하화환",
  "근조화환",
  "플랜테리어",
];
const fromNames = ["아미화", "오후", "모아", "플라워샵", "꽃집", "식물원", "가든센터"];
const toNames = ["고객", "회원", "주문자"];
const districts = ["강남구", "서초구", "마포구", "송파구"];
const deliveryStatuses = ["배달중", "배달완료", "상품 준비중"];
const generateOrderNumber = (i: number): string =>
  `${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i * 3) % 26))}${String.fromCharCode(65 + ((i * 5) % 26))}${String(i % 10000).padStart(4, "0")}${String.fromCharCode(65 + ((i * 7) % 26))}${String.fromCharCode(65 + ((i * 11) % 26))}`;
const generateFloristInfo = (i: number, type: Transaction["type"]) => {
  if (type !== "바로고" && type !== "기타") return undefined;
  const phone = `010-${String(i % 10000).padStart(4, "0")}-${String((i * 3) % 10000).padStart(4, "0")}`;
  return {
    phone,
    address: `서울시 ${districts[i % 4]} 도산대로 ${i}`,
    detailedAddress: `${i}빌딩 ${(i % 10) + 1}층 ${i % 100}호`,
  };
};
const generateDeliveryInfo = (i: number, type: Transaction["type"]) => {
  if (type === "바로고") {
    const rand = Math.random();
    return {
      status: deliveryStatuses[i % 3],
      type,
      distance: Math.round((rand * 5 + 0.5) * 10) / 10,
      agencyFee: Math.floor(rand * 5 + 1) * 1000,
      rainyDaySurcharge: i % 10 === 0 ? Math.floor(rand * 2 + 1) * 500 : 0,
      vat: Math.floor(rand * 5 + 1) * 100,
      estimatedTime: i % 2 === 0 ? `${Math.floor(rand * 30 + 10)}분 후 배달 완료 예상` : undefined,
    };
  }
  return { status: type === "픽업" ? "상품 준비중" : "배달완료", type };
};
const generateCustomerInfo = (i: number) => ({
  phone: `010-${String((i * 2) % 10000).padStart(4, "0")}-${String((i * 5) % 10000).padStart(4, "0")}`,
  address: `서울시 ${districts[(i * 2) % 4]} 테헤란로 ${i}`,
  detailedAddress: `${i}아파트 ${(i % 10) + 1}동 ${i % 100}호`,
});
const generateTransaction = (i: number): Transaction => {
  const year = 2022 + (i % 3);
  const month = String((i % 12) + 1).padStart(2, "0");
  const day = String((i % 28) + 1).padStart(2, "0");
  const dateStr = `${year}.${month}.${day}`;
  const paymentAmount = (Math.floor(Math.random() * 20) + 1) * 10000;
  const type = transactionTypes[i % transactionTypes.length];
  const sizeSuffix = i % 10 === 0 ? "대형" : i % 5 === 0 ? "중형" : "소형";
  return {
    id: (i + 8).toString(),
    orderNumber: generateOrderNumber(i),
    from: `${fromNames[i % fromNames.length]}${i} (user${i})`,
    fromId: `user${i}`,
    to: `${toNames[i % toNames.length]}${i} (customer${i})`,
    toId: `customer${i}`,
    productName: `${productNames[i % productNames.length]} ${sizeSuffix}`,
    paymentAmount,
    orderDate: dateStr,
    paymentDate: dateStr,
    paymentMethod: paymentMethods[i % paymentMethods.length],
    type,
    subCategory: subCategories[i % subCategories.length],
    refundStatus: i % 20 === 0 ? (i % 2 === 0 ? "환불처리" : "환불미처리") : undefined,
    floristInfo: generateFloristInfo(i, type),
    customerInfo: generateCustomerInfo(i),
    deliveryInfo: generateDeliveryInfo(i, type),
    rewardPoints: Math.floor(paymentAmount / 100),
    customerRequest: i % 5 === 0 ? `요청사항 ${i}` : undefined,
  };
};
export const mockTransactions: Transaction[] = [...Array.from({ length: 493 }, (_, i) => generateTransaction(i))];
