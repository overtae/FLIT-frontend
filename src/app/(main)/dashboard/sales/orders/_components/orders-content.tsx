"use client";

import { useState, useRef } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Calendar, Download } from "lucide-react";

import { PasswordVerification } from "@/components/password-verification";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Tabs as OTabs,
  TabsContent as OTabsContent,
  TabsList as OTabsList,
  TabsTrigger as OTabsTrigger,
} from "../../_components/sales-tabs";

import { ConversionRateChart } from "./conversion-rate-chart";
import { CvrChart } from "./cvr-chart";
import { OrdersReportPDF } from "./orders-report-pdf";
import { SearchTrendTable } from "./search-trend-table";

interface OrdersContentProps {
  initialVerified: boolean;
}

export function OrdersContent({ initialVerified }: OrdersContentProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<"cvr" | "search">("cvr");
  const reportRef = useRef<HTMLDivElement>(null);

  const periodLabel = selectedPeriod === "weekly" ? "주간" : selectedPeriod === "monthly" ? "월간" : "연간";
  const fileName = `orders-report-${periodLabel}-${selectedDate?.toISOString().split("T")[0] ?? "all"}.pdf`;
  const targetRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!targetRef.current) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(targetRef.current, {
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      if (imgHeight > pageHeight - margin * 2) {
        const ratio = (pageHeight - margin * 2) / imgHeight;
        const adjustedWidth = contentWidth * ratio;
        const adjustedHeight = imgHeight * ratio;
        pdf.addImage(imgData, "PNG", margin, margin, adjustedWidth, adjustedHeight);
      } else {
        pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);
      }

      pdf.save(fileName);
    } catch (error) {
      console.error("PDF 생성 실패:", error);
    }
  };

  if (!initialVerified) {
    return (
      <PasswordVerification
        title="비밀번호 재확인"
        description="매출관리에 접근하기 위해 비밀번호를 입력해주세요."
        page="sales"
        onVerified={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <Tabs
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value as "weekly" | "monthly" | "yearly")}
        >
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleDownloadPdf} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          리포트 다운로드
        </Button>
      </div>

      <div
        ref={targetRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "210mm",
          height: "auto",
        }}
      >
        <OrdersReportPDF period={selectedPeriod} selectedDate={selectedDate} />
      </div>

      <div ref={reportRef} data-report-content className="grid flex-1 grid-cols-5 gap-6 pt-24 pb-32">
        <div className="col-span-2 flex h-full w-full items-center justify-center">
          <ConversionRateChart period={selectedPeriod} />
        </div>

        <div className="col-span-3 h-full">
          <OTabs
            value={activeChartTab}
            onValueChange={(value) => setActiveChartTab(value as "cvr" | "search")}
            className="flex h-full flex-col"
          >
            <div className="flex items-center justify-between">
              <OTabsList>
                <OTabsTrigger value="cvr">CVR | 구매전환율</OTabsTrigger>
                <OTabsTrigger value="search">검색어 트렌드</OTabsTrigger>
              </OTabsList>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-[150px] justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "yyyy-MM-dd", { locale: ko }) : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setIsDatePickerOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <OTabsContent value="cvr" className="flex grow flex-col items-center justify-center">
              <CvrChart period={selectedPeriod} selectedDate={selectedDate} />
            </OTabsContent>
            <OTabsContent value="search" className="flex grow flex-col items-center justify-center">
              <SearchTrendTable period={selectedPeriod} selectedDate={selectedDate} />
            </OTabsContent>
          </OTabs>
        </div>
      </div>
    </div>
  );
}
