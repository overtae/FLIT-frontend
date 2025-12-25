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

const categories = ["전체", "꽃", "식물", "화환", "공간연출", "정기배송"];
const paymentMethods = ["전체", "카드", "POS", "계좌 이체", "기타"];
const regions = ["전체", "서울", "경기", "인천", "기타"];
const orderStatuses = ["전체", "접수", "배송중", "배송완료", "주문취소"];

interface FilterPanelProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

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
        <div className="bg-card space-y-6 rounded-md p-6">
          <div className="grid grid-cols-7 gap-2">
            <Label className="font-semibold">일자</Label>
            <div className="flex items-center space-x-2">
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
              />
              <Label htmlFor="today" className="cursor-pointer font-normal">
                오늘
              </Label>
            </div>
            <div className="col-span-3 flex items-center space-x-2">
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
              />
              <Label htmlFor="dateRange" className="mr-8 cursor-pointer font-normal">
                기간 설정
              </Label>
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

          <div className="grid grid-cols-7 gap-2 py-2">
            <Label className="font-semibold">카테고리</Label>
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

          <div className="grid grid-cols-7 gap-2 py-2">
            <Label className="font-semibold">결제 방법</Label>
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

          <div className="grid grid-cols-7 gap-2 py-2">
            <Label className="font-semibold">지역 단위</Label>
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

          <div className="grid grid-cols-7 gap-2 py-2">
            <Label className="font-semibold">주문 현황</Label>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              className="bg-background border-primary text-primary hover:text-primary-dark hover:bg-gray-100"
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
