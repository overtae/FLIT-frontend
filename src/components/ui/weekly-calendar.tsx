"use client";

import { useEffect, useRef, useState } from "react";

import { endOfWeek, format, startOfWeek } from "date-fns";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DateRange, DayPicker, getDefaultClassNames, rangeIncludesDate } from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface WeeklyCalendarProps {
  selectedWeekRange?: DateRange;
  onWeekSelect: (range: DateRange) => void;
  placeholder?: string;
  buttonClassName?: string;
}

export function WeeklyCalendar({ selectedWeekRange, onWeekSelect, placeholder = "주 선택", buttonClassName }: WeeklyCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const getWeekRange = (date: Date): DateRange => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
    return { from: weekStart, to: weekEnd };
  };

  const getDisplayText = () => {
    if (selectedWeekRange?.from && selectedWeekRange?.to) {
      return `${format(selectedWeekRange.from, "yyyy-MM-dd")} ~ ${format(selectedWeekRange.to, "yyyy-MM-dd")}`;
    }
    return placeholder;
  };

  const getHoveredWeekRange = (): DateRange | undefined => {
    if (!hoveredDate) return undefined;
    return getWeekRange(hoveredDate);
  };

  const hoveredWeekRange = getHoveredWeekRange();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button[aria-label]');
      if (button) {
        const ariaLabel = button.getAttribute('aria-label');
        if (ariaLabel) {
          try {
            const date = new Date(ariaLabel);
            if (!isNaN(date.getTime())) {
              setHoveredDate(date);
              return;
            }
          } catch {
            const dateMatch = ariaLabel.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (dateMatch) {
              const [, month, day, year] = dateMatch;
              const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              if (!isNaN(date.getTime())) {
                setHoveredDate(date);
              }
            }
          }
        }
      }
    };

    const handleMouseLeave = () => {
      setHoveredDate(undefined);
    };

    root.addEventListener('mousemove', handleMouseMove);
    root.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      root.removeEventListener('mousemove', handleMouseMove);
      root.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const modifiers = {
    selected: selectedWeekRange,
    range_start: selectedWeekRange?.from,
    range_end: selectedWeekRange?.to,
    range_middle: (date: Date) => (selectedWeekRange ? rangeIncludesDate(selectedWeekRange, date, true) : false),
    week_hover: (date: Date) => {
      if (hoveredWeekRange?.from && hoveredWeekRange?.to) {
        return date >= hoveredWeekRange.from && date <= hoveredWeekRange.to;
      }
      return false;
    },
  };

  const modifiersClassNames = {
    week_hover: "bg-accent/50 hover:bg-accent/70",
  };

  return (
    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={buttonClassName ?? "w-[250px] justify-start text-left font-normal"}>
          {getDisplayText()}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <DayPicker
          mode="range"
          selected={selectedWeekRange}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          showOutsideDays
          className={cn(
            "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
            String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
            String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
          )}
          classNames={{
            root: cn("w-fit", getDefaultClassNames().root),
            months: cn(
              "flex gap-4 flex-col md:flex-row relative",
              getDefaultClassNames().months
            ),
            month: cn("flex flex-col w-full gap-4", getDefaultClassNames().month),
            nav: cn(
              "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
              getDefaultClassNames().nav
            ),
            button_previous: cn(
              buttonVariants({ variant: "ghost" }),
              "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
              getDefaultClassNames().button_previous
            ),
            button_next: cn(
              buttonVariants({ variant: "ghost" }),
              "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
              getDefaultClassNames().button_next
            ),
            month_caption: cn(
              "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
              getDefaultClassNames().month_caption
            ),
            caption_label: cn(
              "select-none font-medium text-sm",
              getDefaultClassNames().caption_label
            ),
            table: "w-full border-collapse",
            weekdays: cn("flex", getDefaultClassNames().weekdays),
            weekday: cn(
              "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
              getDefaultClassNames().weekday
            ),
            week: cn("flex w-full mt-2", getDefaultClassNames().week),
            day: cn(
              "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
              "[&:first-child[data-selected=true]_button]:rounded-l-md",
              getDefaultClassNames().day
            ),
            day_button: cn(
              "flex aspect-square size-auto w-full min-w-(--cell-size) h-(--cell-size) items-center justify-center text-sm font-normal transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "[&:not([data-range-start]):not([data-range-end]):not([data-range-middle])]:rounded-md",
              getDefaultClassNames().day_button
            ),
            range_start: cn(
              "!rounded-l-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              getDefaultClassNames().range_start
            ),
            range_middle: cn(
              "rounded-none bg-primary/80 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
              getDefaultClassNames().range_middle
            ),
            range_end: cn(
              "rounded-r-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              getDefaultClassNames().range_end
            ),
            today: cn(
              "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
              getDefaultClassNames().today
            ),
            outside: cn(
              "text-muted-foreground aria-selected:text-muted-foreground",
              getDefaultClassNames().outside
            ),
            disabled: cn(
              "text-muted-foreground opacity-50",
              getDefaultClassNames().disabled
            ),
            hidden: cn("invisible", getDefaultClassNames().hidden),
          }}
          components={{
            Root: ({ className, rootRef: dayPickerRootRef, ...props }) => {
              return (
                <div
                  data-slot="calendar"
                  ref={(node) => {
                    rootRef.current = node;
                    if (typeof dayPickerRootRef === 'function') {
                      dayPickerRootRef(node);
                    } else if (dayPickerRootRef) {
                      dayPickerRootRef.current = node;
                    }
                  }}
                  className={cn(className)}
                  {...props}
                />
              );
            },
            Chevron: ({ className, orientation, ...props }) => {
              if (orientation === "left") {
                return (
                  <ChevronLeftIcon className={cn("size-4", className)} {...props} />
                );
              }
              if (orientation === "right") {
                return (
                  <ChevronRightIcon
                    className={cn("size-4", className)}
                    {...props}
                  />
                );
              }
              return (
                <ChevronDownIcon className={cn("size-4", className)} {...props} />
              );
            },
          }}
          onDayClick={(day, dayModifiers) => {
            if (dayModifiers.disabled || dayModifiers.hidden) return;
            if (dayModifiers.selected) {
              onWeekSelect({ from: undefined, to: undefined });
              return;
            }
            const weekRange = getWeekRange(day);
            onWeekSelect(weekRange);
            setIsDatePickerOpen(false);
          }}
          onDayKeyDown={(day, dayModifiers, e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              if (dayModifiers.disabled || dayModifiers.hidden) return;
              if (dayModifiers.selected) {
                onWeekSelect({ from: undefined, to: undefined });
                return;
              }
              const weekRange = getWeekRange(day);
              onWeekSelect(weekRange);
              setIsDatePickerOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

