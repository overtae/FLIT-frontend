import * as XLSX from "@e965/xlsx";
import { format } from "date-fns";

import type { Settlement } from "@/types/settlement.type";

export const downloadSettlement = (settlement: Settlement) => {
  const data = [
    ["닉네임(ID)", "번호", "mail", "총매출", "수수료", "수수료 제외", "배달료", "상태"],
    [
      `${settlement.nickname} (${settlement.loginId})`,
      settlement.phoneNumber,
      settlement.mail,
      settlement.totalSales.toString(),
      settlement.commission.toString(),
      (settlement.totalSales - settlement.commission).toString(),
      settlement.deliveryAmount.toString(),
      settlement.status,
    ],
  ];

  const csvContent = data.map((row) => row.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `정산_${settlement.nickname}_${format(new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadSettlementsAll = (settlements: Settlement[]) => {
  if (settlements.length === 0) return;

  const data = settlements.map((settlement) => ({
    "닉네임(ID)": `${settlement.nickname} (${settlement.loginId})`,
    번호: settlement.phoneNumber,
    mail: settlement.mail,
    총매출: settlement.totalSales.toLocaleString(),
    수수료: settlement.commission.toLocaleString(),
    "수수료 제외": (settlement.totalSales - settlement.commission).toLocaleString(),
    배달료: settlement.deliveryAmount.toLocaleString(),
    상태: settlement.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "정산 목록");

  const fileName = `정산목록_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
