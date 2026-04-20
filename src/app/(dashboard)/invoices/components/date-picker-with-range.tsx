"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { type DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  const now = new Date();
  const startMonth = new Date(now.getFullYear() - 2, now.getMonth());

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="relative group/picker">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal h-9 pr-8",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              autoFocus
              mode="range"
              defaultMonth={date?.from || now}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={1}
              captionLayout="dropdown"
              startMonth={startMonth}
              endMonth={now}
              disabled={{ after: now }}
            />
          </PopoverContent>
        </Popover>

        {date && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-50 hover:opacity-100 transition-opacity active:-translate-y-1/2"
            onMouseDown={(e) => {
              e.preventDefault();
              onDateChange(undefined);
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear date</span>
          </Button>
        )}
      </div>
    </div>
  );
}
