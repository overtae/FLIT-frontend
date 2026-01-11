"use client";

import { useEffect, useRef } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { ConversionRateChartPdf } from "@/app/(main)/dashboard/sales/orders/_components/conversion-rate-chart-pdf";

import { CvrChart } from "./cvr-chart";
import { SearchTrendTable } from "./search-trend-table";

interface OrdersReportPDFProps {
  period: "weekly" | "monthly" | "yearly";
  selectedDate?: Date;
}

export function OrdersReportPDF({ period, selectedDate }: OrdersReportPDFProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const periodLabel = period === "weekly" ? "주간" : period === "monthly" ? "월간" : "연간";
  const title = `주문 분석 - ${periodLabel}`;

  useEffect(() => {
    if (!containerRef.current) return;

    const convertAllColors = (element: HTMLElement) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);
      let node: Node | null;

      while ((node = walker.nextNode())) {
        const el = node as HTMLElement;
        if (!(el instanceof HTMLElement)) continue;

        try {
          const computedStyle = window.getComputedStyle(el);
          const colorProps = [
            "color",
            "backgroundColor",
            "borderColor",
            "borderTopColor",
            "borderRightColor",
            "borderBottomColor",
            "borderLeftColor",
            "fill",
            "stroke",
          ];

          colorProps.forEach((prop) => {
            try {
              const value = computedStyle.getPropertyValue(prop);
              if (
                value &&
                value.trim() &&
                value !== "rgba(0, 0, 0, 0)" &&
                value !== "transparent" &&
                value !== "none"
              ) {
                if (value.startsWith("rgb") || value.startsWith("#")) {
                  el.style.setProperty(prop, value, "important");
                } else if (value.includes("var(") || value.includes("oklch") || value.includes("lab")) {
                  const tempEl = document.createElement("div");
                  tempEl.style.setProperty(prop, value);
                  document.body.appendChild(tempEl);
                  const resolved = window.getComputedStyle(tempEl).getPropertyValue(prop);
                  document.body.removeChild(tempEl);
                  if (resolved && (resolved.startsWith("rgb") || resolved.startsWith("#"))) {
                    el.style.setProperty(prop, resolved, "important");
                  }
                }
              }
            } catch {
              // Ignore
            }
          });

          if (el instanceof SVGElement) {
            ["fill", "stroke"].forEach((attr) => {
              try {
                const value = el.getAttribute(attr) ?? computedStyle.getPropertyValue(attr);
                if (value && value.trim() && value !== "none") {
                  if (value.startsWith("rgb") || value.startsWith("#")) {
                    el.setAttribute(attr, value);
                  } else if (value.includes("var(") || value.includes("oklch") || value.includes("lab")) {
                    const tempEl = document.createElement("div");
                    tempEl.style.color = value;
                    document.body.appendChild(tempEl);
                    const resolved = window.getComputedStyle(tempEl).color;
                    document.body.removeChild(tempEl);
                    if (resolved && (resolved.startsWith("rgb") || resolved.startsWith("#"))) {
                      el.setAttribute(attr, resolved);
                    }
                  }
                }
              } catch {
                // Ignore
              }
            });
          }
        } catch {
          // Ignore
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        convertAllColors(containerRef.current);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [period, selectedDate]);

  return (
    <div
      ref={containerRef}
      className="bg-white"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "0mm",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div className="mb-8 border-b border-gray-300 pb-4" style={{ borderBottomWidth: "2px" }}>
        <h1
          className="mb-3 text-3xl font-bold text-gray-900"
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}
        >
          {title}
        </h1>
        <div className="flex flex-wrap gap-6 text-sm text-gray-700" style={{ fontSize: "12px" }}>
          <div>
            <span style={{ fontWeight: "600" }}>기간:</span> {periodLabel}
          </div>
          {selectedDate && (
            <div>
              <span style={{ fontWeight: "600" }}>날짜:</span>{" "}
              {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}
            </div>
          )}
          <div>
            <span style={{ fontWeight: "600" }}>생성일:</span> {format(new Date(), "yyyy년 MM월 dd일", { locale: ko })}
          </div>
        </div>
      </div>

      <div
        className="mb-8 grid grid-cols-2 gap-6"
        style={{ gridTemplateColumns: "1fr 2fr", gap: "24px", marginBottom: "32px" }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-6"
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "24px",
            minHeight: "200px",
            overflow: "hidden",
          }}
        >
          <h2
            className="mb-4 text-lg font-semibold text-gray-900"
            style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}
          >
            Conversion Rate
          </h2>
          <div style={{ width: "100%" }}>
            <ConversionRateChartPdf period={period} />
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-6"
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "4px",
            minHeight: "200px",
            overflow: "hidden",
          }}
        >
          <h2
            className="mb-4 text-lg font-semibold text-gray-900"
            style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}
          >
            CVR | 구매전환율
          </h2>
          <div style={{ width: "100%", height: "200px" }}>
            <CvrChart period={period} selectedDate={selectedDate} />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-gray-300 bg-white p-6">
        <h2
          className="mb-4 text-lg font-semibold text-gray-900"
          style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}
        >
          검색어 트렌드
        </h2>
        <div className="rounded-lg bg-white p-4">
          <SearchTrendTable period={period} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
