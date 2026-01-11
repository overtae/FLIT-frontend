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
} from "../../_components/sales-tab";

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
    <div className="flex min-h-screen flex-col space-y-4 pb-12 sm:space-y-6 sm:pb-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="overflow-x-auto">
          <Tabs
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as "weekly" | "monthly" | "yearly")}
          >
            <TabsList className="inline-flex w-full min-w-max sm:w-auto">
              <TabsTrigger value="weekly" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="w-full text-xs sm:w-auto sm:text-sm">
          <Download className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

      <div
        ref={reportRef}
        data-report-content
        className="grid flex-1 grid-cols-1 gap-4 pt-12 pb-16 sm:grid-cols-5 sm:gap-6 sm:pt-24 sm:pb-32"
      >
        <div className="col-span-1 flex h-full w-full items-center justify-center sm:col-span-2">
          <ConversionRateChart period={selectedPeriod} />
        </div>

        <div className="col-span-1 h-full sm:col-span-3">
          <OTabs
            value={activeChartTab}
            onValueChange={(value) => setActiveChartTab(value as "cvr" | "search")}
            className="flex h-full flex-col"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="overflow-x-auto">
                <OTabsList className="inline-flex w-full min-w-max sm:w-auto">
                  <OTabsTrigger value="cvr" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                    CVR | 구매전환율
                  </OTabsTrigger>
                  <OTabsTrigger value="search" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                    검색어 트렌드
                  </OTabsTrigger>
                </OTabsList>
              </div>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left text-xs font-normal sm:w-[150px] sm:text-sm"
                  >
                    <Calendar className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
            <OTabsContent
              value="cvr"
              className="flex min-h-[300px] grow flex-col items-center justify-center sm:min-h-[400px]"
            >
              <CvrChart period={selectedPeriod} selectedDate={selectedDate} />
            </OTabsContent>
            <OTabsContent
              value="search"
              className="flex min-h-[300px] grow flex-col items-center justify-center sm:min-h-[400px]"
            >
              <SearchTrendTable period={selectedPeriod} selectedDate={selectedDate} />
            </OTabsContent>
          </OTabs>
        </div>
      </div>
    </div>
  );
}
