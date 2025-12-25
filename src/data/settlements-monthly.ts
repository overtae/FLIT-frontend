import { Settlement } from "@/types/dashboard";
import { SettlementDateData } from "@/types/settlements-monthly";

const generateSettlementsForDate = (date: string, count: number): Settlement[] => {
  const types: Settlement["type"][] = ["shop", "florist"];
  const statuses: Settlement["status"][] = ["pending", "completed", "cancelled"];
  const shopNames = ["매장", "플라워샵", "꽃집", "식물원", "가든센터"];
  const floristNames = ["플로리스트", "꽃 디자이너", "플라워 아티스트"];

  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];
    const nameBase = type === "shop" ? shopNames[i % shopNames.length] : floristNames[i % floristNames.length];
    const totalRevenue = Math.floor(Math.random() * 2000000 + 500000);
    const commission = Math.floor(totalRevenue * 0.1);
    const deliveryFee = Math.floor(totalRevenue * 0.05);

    return {
      id: `${date}-${i + 1}`,
      nickname: `${nameBase}${String.fromCharCode(65 + (i % 26))}`,
      nicknameId: `${type === "shop" ? "shop" : "florist"}${String(i + 1).padStart(3, "0")}`,
      phone: `010-${String(i % 10000).padStart(4, "0")}-${String((i * 3) % 10000).padStart(4, "0")}`,
      email: `${type === "shop" ? "shop" : "florist"}${i}@example.com`,
      totalRevenue,
      commission,
      revenueExcludingCommission: totalRevenue - commission,
      deliveryFee,
      status,
      settlementDate: date,
      type,
    };
  });
};

export const generateSettlementsMonthly = (year: number, month: number): SettlementDateData[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: SettlementDateData[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const hasItems = Math.random() > 0.3;
    const itemCount = hasItems ? Math.floor(Math.random() * 10) + 1 : 0;

    result.push({
      date,
      items: itemCount > 0 ? generateSettlementsForDate(date, itemCount) : [],
    });
  }

  return result;
};
