"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterPanelProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const categories = ["전체", "꽃", "식물", "화환", "공간연출", "정기배송"];
const paymentMethods = ["전체", "카드", "현금", "계좌이체", "기타"];
const regions = ["전체", "서울", "경기", "인천", "기타"];
const orderStatuses = ["전체", "접수", "배송중", "배송완료", "주문취소"];

export function FilterPanel({ open: controlledOpen, onOpenChange }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  const [todayChecked, setTodayChecked] = useState(() => {
    return searchParams.get("today") === "true";
  });
  const [dateRangeChecked, setDateRangeChecked] = useState(() => {
    return searchParams.get("dateFrom") !== null && searchParams.get("dateTo") !== null;
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    if (dateFrom && dateTo) {
      return {
        from: new Date(dateFrom),
        to: new Date(dateTo),
      };
    }
    return undefined;
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cats = searchParams.get("categories");
    return cats ? cats.split(",") : ["전체"];
  });
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(() => {
    const methods = searchParams.get("paymentMethods");
    return methods ? methods.split(",") : ["전체"];
  });
  const [selectedRegions, setSelectedRegions] = useState<string[]>(() => {
    const regs = searchParams.get("regions");
    return regs ? regs.split(",") : ["전체"];
  });
  const [selectedOrderStatuses, setSelectedOrderStatuses] = useState<string[]>(() => {
    const statuses = searchParams.get("orderStatuses");
    return statuses ? statuses.split(",") : ["전체"];
  });

  const handleCategoryToggle = (category: string) => {
    let newCategories: string[];
    if (category === "전체") {
      newCategories = ["전체"];
    } else {
      const current = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories.filter((c) => c !== "전체"), category];
      newCategories = current.length === 0 ? ["전체"] : current;
    }
    setSelectedCategories(newCategories);
    const params = new URLSearchParams(searchParams.toString());
    if (newCategories.length > 0 && !newCategories.includes("전체")) {
      params.set("categories", newCategories.join(","));
    } else {
      params.delete("categories");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePaymentMethodToggle = (method: string) => {
    let newMethods: string[];
    if (method === "전체") {
      newMethods = ["전체"];
    } else {
      const current = selectedPaymentMethods.includes(method)
        ? selectedPaymentMethods.filter((m) => m !== method)
        : [...selectedPaymentMethods.filter((m) => m !== "전체"), method];
      newMethods = current.length === 0 ? ["전체"] : current;
    }
    setSelectedPaymentMethods(newMethods);
    const params = new URLSearchParams(searchParams.toString());
    if (newMethods.length > 0 && !newMethods.includes("전체")) {
      params.set("paymentMethods", newMethods.join(","));
    } else {
      params.delete("paymentMethods");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleRegionToggle = (region: string) => {
    let newRegions: string[];
    if (region === "전체") {
      newRegions = ["전체"];
    } else {
      const current = selectedRegions.includes(region)
        ? selectedRegions.filter((r) => r !== region)
        : [...selectedRegions.filter((r) => r !== "전체"), region];
      newRegions = current.length === 0 ? ["전체"] : current;
    }
    setSelectedRegions(newRegions);
    const params = new URLSearchParams(searchParams.toString());
    if (newRegions.length > 0 && !newRegions.includes("전체")) {
      params.set("regions", newRegions.join(","));
    } else {
      params.delete("regions");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleOrderStatusToggle = (status: string) => {
    let newStatuses: string[];
    if (status === "전체") {
      newStatuses = ["전체"];
    } else {
      const current = selectedOrderStatuses.includes(status)
        ? selectedOrderStatuses.filter((s) => s !== status)
        : [...selectedOrderStatuses.filter((s) => s !== "전체"), status];
      newStatuses = current.length === 0 ? ["전체"] : current;
    }
    setSelectedOrderStatuses(newStatuses);
    const params = new URLSearchParams(searchParams.toString());
    if (newStatuses.length > 0 && !newStatuses.includes("전체")) {
      params.set("orderStatuses", newStatuses.join(","));
    } else {
      params.delete("orderStatuses");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setTodayChecked(false);
    setDateRangeChecked(false);
    setDateRange(undefined);
    setSelectedCategories(["전체"]);
    setSelectedPaymentMethods(["전체"]);
    setSelectedRegions(["전체"]);
    setSelectedOrderStatuses(["전체"]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("today");
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("categories");
    params.delete("paymentMethods");
    params.delete("regions");
    params.delete("orderStatuses");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden transition-all">
        <div className="bg-card space-y-4 rounded-md p-4 sm:space-y-6 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-7 sm:gap-2">
            <Label className="text-sm font-semibold sm:text-base">일자</Label>
            <div className="flex items-center space-x-2 sm:col-span-1">
              <Checkbox
                id="today"
                checked={todayChecked}
                onCheckedChange={(checked) => {
                  const newChecked = checked === true;
                  setTodayChecked(newChecked);
                  const params = new URLSearchParams(searchParams.toString());
                  if (newChecked) {
                    params.set("today", "true");
                  } else {
                    params.delete("today");
                  }
                  router.push(`?${params.toString()}`, { scroll: false });
                }}
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
              <Label htmlFor="today" className="cursor-pointer text-xs font-normal sm:text-sm">
                오늘
              </Label>
            </div>
            <div className="col-span-1 flex flex-col gap-2 sm:col-span-5 sm:flex-row sm:items-center sm:space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dateRange"
                  checked={dateRangeChecked}
                  onCheckedChange={(checked) => {
                    const newChecked = checked === true;
                    setDateRangeChecked(newChecked);
                    const params = new URLSearchParams(searchParams.toString());
                    if (!newChecked) {
                      params.delete("dateFrom");
                      params.delete("dateTo");
                      setDateRange(undefined);
                    }
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
                <Label htmlFor="dateRange" className="mr-0 cursor-pointer text-xs font-normal sm:mr-8 sm:text-sm">
                  기간 설정
                </Label>
              </div>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Input
                    readOnly
                    value={
                      dateRange?.from && dateRange.to
                        ? `${format(dateRange.from, "yyyy.MM.dd", { locale: ko })} - ${format(dateRange.to, "yyyy.MM.dd", { locale: ko })}`
                        : ""
                    }
                    className="w-full cursor-pointer text-xs sm:w-[300px] sm:text-sm"
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
                      const params = new URLSearchParams(searchParams.toString());
                      if (range && range.from && range.to) {
                        params.set("dateFrom", format(range.from, "yyyy-MM-dd"));
                        params.set("dateTo", format(range.to, "yyyy-MM-dd"));
                      } else {
                        params.delete("dateFrom");
                        params.delete("dateTo");
                      }
                      router.push(`?${params.toString()}`, { scroll: false });
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-7 sm:gap-2">
            <Label className="text-sm font-semibold sm:text-base">카테고리</Label>
            <div className="col-span-1 grid grid-cols-2 gap-2 sm:col-span-6 sm:grid-cols-6 sm:gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-1.5 sm:space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <Label htmlFor={`category-${category}`} className="cursor-pointer text-xs font-normal sm:text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-7 sm:gap-2">
            <Label className="text-sm font-semibold sm:text-base">결제 방법</Label>
            <div className="col-span-1 grid grid-cols-2 gap-2 sm:col-span-6 sm:grid-cols-6 sm:gap-2">
              {paymentMethods.map((method) => (
                <div key={method} className="flex items-center space-x-1.5 sm:space-x-2">
                  <Checkbox
                    id={`payment-${method}`}
                    checked={selectedPaymentMethods.includes(method)}
                    onCheckedChange={() => handlePaymentMethodToggle(method)}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <Label htmlFor={`payment-${method}`} className="cursor-pointer text-xs font-normal sm:text-sm">
                    {method}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-7 sm:gap-2">
            <Label className="text-sm font-semibold sm:text-base">지역 단위</Label>
            <div className="col-span-1 grid grid-cols-2 gap-2 sm:col-span-6 sm:grid-cols-6 sm:gap-2">
              {regions.map((region) => (
                <div key={region} className="flex items-center space-x-1.5 sm:space-x-2">
                  <Checkbox
                    id={`region-${region}`}
                    checked={selectedRegions.includes(region)}
                    onCheckedChange={() => handleRegionToggle(region)}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <Label htmlFor={`region-${region}`} className="cursor-pointer text-xs font-normal sm:text-sm">
                    {region}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-7 sm:gap-2">
            <Label className="text-sm font-semibold sm:text-base">주문 현황</Label>
            <div className="col-span-1 grid grid-cols-2 gap-2 sm:col-span-6 sm:grid-cols-6 sm:gap-2">
              {orderStatuses.map((status) => (
                <div key={status} className="flex items-center space-x-1.5 sm:space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedOrderStatuses.includes(status)}
                    onCheckedChange={() => handleOrderStatusToggle(status)}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <Label htmlFor={`status-${status}`} className="cursor-pointer text-xs font-normal sm:text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 sm:pt-4">
            <Button
              variant="outline"
              className="bg-background border-primary text-primary hover:text-primary-dark text-xs hover:bg-gray-100 sm:text-sm"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
