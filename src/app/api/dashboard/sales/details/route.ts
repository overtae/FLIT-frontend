import { NextResponse } from "next/server";

import { mockSalesDetails } from "@/data/sales";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);
  const search = searchParams.get("search")?.trim();
  const categories = searchParams.get("categories")?.trim();
  const paymentMethods = searchParams.get("paymentMethods")?.trim();
  const regions = searchParams.get("regions")?.trim();
  const today = searchParams.get("today") === "true";
  const dateFrom = searchParams.get("dateFrom")?.trim();
  const dateTo = searchParams.get("dateTo")?.trim();

  let filteredData = [...mockSalesDetails];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.nickname.toLowerCase().includes(searchLower) ||
        item.nicknameId.toLowerCase().includes(searchLower) ||
        item.phone.includes(search) ||
        item.address.toLowerCase().includes(searchLower) ||
        item.productName.toLowerCase().includes(searchLower),
    );
  }

  if (categories) {
    const categoryArray = categories.split(",");
    filteredData = filteredData.filter((item) => {
      // Map productName to categories
      const productCategory = item.productName.includes("꽃다발")
        ? "꽃"
        : item.productName.includes("꽃바구니")
          ? "꽃"
          : item.productName.includes("난")
            ? "식물"
            : item.productName.includes("식물")
              ? "식물"
              : item.productName.includes("화환")
                ? "화환"
                : "기타";
      return categoryArray.includes(productCategory);
    });
  }

  if (paymentMethods) {
    const methodArray = paymentMethods.split(",");
    filteredData = filteredData.filter((item) => {
      // Map paymentMethod to match filter values
      const mappedMethod =
        item.paymentMethod === "카드"
          ? "카드"
          : item.paymentMethod === "계좌이체"
            ? "계좌 이체"
            : item.paymentMethod === "현장결제"
              ? "POS"
              : "기타";
      return methodArray.includes(mappedMethod);
    });
  }

  if (regions) {
    const regionArray = regions.split(",");
    filteredData = filteredData.filter((item) => {
      const addressRegion = item.address.includes("서울")
        ? "서울"
        : item.address.includes("경기")
          ? "경기"
          : item.address.includes("인천")
            ? "인천"
            : "기타";
      return regionArray.includes(addressRegion);
    });
  }

  // Note: SalesDetail doesn't have orderStatus field
  // This filter would need to be implemented based on actual data structure

  if (today) {
    // Filter by today's date if date field exists in data
    // This is a placeholder - adjust based on actual data structure
  }

  if (dateFrom && dateTo) {
    // Filter by date range if date field exists in data
    // This is a placeholder - adjust based on actual data structure
  }

  const total = filteredData.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedData,
    total,
    page,
    pageSize,
  });
}
