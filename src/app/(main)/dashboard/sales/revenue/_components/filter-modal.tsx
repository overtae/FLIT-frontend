"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = ["전체", "꽃", "식물", "화환", "공간연출", "정기배송"];
const paymentMethods = ["전체", "카드", "POS", "계좌 이체", "기타"];
const regions = ["전체", "서울", "경기", "인천", "기타"];
const orderStatuses = ["전체", "접수", "배송중", "배송완료", "주문취소"];

export function FilterModal({ open, onOpenChange }: FilterModalProps) {
  const [todayChecked, setTodayChecked] = useState(false);
  const [dateRangeChecked, setDateRangeChecked] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["전체"]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(["전체"]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["전체"]);
  const [selectedOrderStatuses, setSelectedOrderStatuses] = useState<string[]>(["전체"]);

  const handleCategoryToggle = (category: string) => {
    if (category === "전체") {
      setSelectedCategories(["전체"]);
    } else {
      setSelectedCategories((prev) => {
        const newSelection = prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev.filter((c) => c !== "전체"), category];
        return newSelection.length === 0 ? ["전체"] : newSelection;
      });
    }
  };

  const handlePaymentMethodToggle = (method: string) => {
    if (method === "전체") {
      setSelectedPaymentMethods(["전체"]);
    } else {
      setSelectedPaymentMethods((prev) => {
        const newSelection = prev.includes(method)
          ? prev.filter((m) => m !== method)
          : [...prev.filter((m) => m !== "전체"), method];
        return newSelection.length === 0 ? ["전체"] : newSelection;
      });
    }
  };

  const handleRegionToggle = (region: string) => {
    if (region === "전체") {
      setSelectedRegions(["전체"]);
    } else {
      setSelectedRegions((prev) => {
        const newSelection = prev.includes(region)
          ? prev.filter((r) => r !== region)
          : [...prev.filter((r) => r !== "전체"), region];
        return newSelection.length === 0 ? ["전체"] : newSelection;
      });
    }
  };

  const handleOrderStatusToggle = (status: string) => {
    if (status === "전체") {
      setSelectedOrderStatuses(["전체"]);
    } else {
      setSelectedOrderStatuses((prev) => {
        const newSelection = prev.includes(status)
          ? prev.filter((s) => s !== status)
          : [...prev.filter((s) => s !== "전체"), status];
        return newSelection.length === 0 ? ["전체"] : newSelection;
      });
    }
  };

  const handleReset = () => {
    setTodayChecked(false);
    setDateRangeChecked(false);
    setDateRange(undefined);
    setSelectedCategories(["전체"]);
    setSelectedPaymentMethods(["전체"]);
    setSelectedRegions(["전체"]);
    setSelectedOrderStatuses(["전체"]);
  };

  const handleDone = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>필터 설정</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 일자 */}
          <div className="space-y-3">
            <Label className="font-semibold">일자</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="today"
                checked={todayChecked}
                onCheckedChange={(checked) => setTodayChecked(checked === true)}
              />
              <Label htmlFor="today" className="cursor-pointer font-normal">
                오늘
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dateRange"
                checked={dateRangeChecked}
                onCheckedChange={(checked) => setDateRangeChecked(checked === true)}
              />
              <Label htmlFor="dateRange" className="cursor-pointer font-normal">
                기간 설정
              </Label>
              {dateRangeChecked && (
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Input
                      readOnly
                      value={
                        dateRange?.from && dateRange.to
                          ? `${format(dateRange.from, "yyyy.MM.dd", { locale: ko })} - ${format(dateRange.to, "yyyy.MM.dd", { locale: ko })}`
                          : ""
                      }
                      className="w-[300px] cursor-pointer"
                      onClick={() => setIsDatePickerOpen(true)}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range);
                        setIsDatePickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* 카테고리 */}
          <div className="space-y-3">
            <Label className="font-semibold">카테고리</Label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="cursor-pointer font-normal">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 방법 */}
          <div className="space-y-3">
            <Label className="font-semibold">결제 방법</Label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={`payment-${method}`}
                    checked={selectedPaymentMethods.includes(method)}
                    onCheckedChange={() => handlePaymentMethodToggle(method)}
                  />
                  <Label htmlFor={`payment-${method}`} className="cursor-pointer font-normal">
                    {method}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 지역 단위 */}
          <div className="space-y-3">
            <Label className="font-semibold">지역 단위</Label>
            <div className="grid grid-cols-3 gap-2">
              {regions.map((region) => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox
                    id={`region-${region}`}
                    checked={selectedRegions.includes(region)}
                    onCheckedChange={() => handleRegionToggle(region)}
                  />
                  <Label htmlFor={`region-${region}`} className="cursor-pointer font-normal">
                    {region}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 주문 현황 */}
          <div className="space-y-3">
            <Label className="font-semibold">주문 현황</Label>
            <div className="grid grid-cols-3 gap-2">
              {orderStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedOrderStatuses.includes(status)}
                    onCheckedChange={() => handleOrderStatusToggle(status)}
                  />
                  <Label htmlFor={`status-${status}`} className="cursor-pointer font-normal">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" className="bg-gray-600 text-white hover:bg-gray-700" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="outline" onClick={handleDone}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
