"use client";

import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type View = "month" | "year";

function MonthYearPicker({
  date,
  setDate,
  disabled = false
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?:boolean
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("month");
  const [viewYear, setViewYear] = useState(
    date?.getFullYear() ?? new Date().getFullYear()
  );
  const [decadeStart, setDecadeStart] = useState(
    () => Math.floor((date?.getFullYear() ?? new Date().getFullYear()) / 12) * 12
  );

  const selectedMonth = date?.getMonth() ?? null;
  const selectedYear = date?.getFullYear() ?? null;

  const handleMonthSelect = (monthIndex: number) => {
    setDate(new Date(viewYear, monthIndex, 1));
    setOpen(false);
    setView("month");
  };

  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setView("month");
  };

  const toggleView = () => {
    if (view === "month") {
      setDecadeStart(Math.floor(viewYear / 12) * 12);
      setView("year");
    } else {
      setView("month");
    }
  };

  const decadeEnd = decadeStart + 11;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button disabled={disabled} variant="outline" className="w-full justify-start gap-2 font-normal">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {date ? format(date, "MMMM yyyy") : "Select month & year"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4" align="start">
        {/* Header nav */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() =>
              view === "month"
                ? setViewYear((y) => y - 1)
                : setDecadeStart((d) => d - 12)
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Clicking the label toggles between month and year views */}
          <button
            onClick={toggleView}
            className="flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-medium hover:bg-muted"
          >
            {view === "month"
              ? viewYear
              : `${decadeStart}–${decadeEnd}`}
            {view === "month"
              ? <ChevronDown className="h-3 w-3 text-muted-foreground" />
              : <ChevronUp className="h-3 w-3 text-muted-foreground" />}
          </button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() =>
              view === "month"
                ? setViewYear((y) => y + 1)
                : setDecadeStart((d) => d + 12)
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-3 h-px bg-border" />

        {/* Month grid */}
        {view === "month" && (
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((month, index) => {
              const isSelected = index === selectedMonth && viewYear === selectedYear;
              return (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  className={cn(
                    "rounded-md py-2 text-sm transition-colors",
                    isSelected
                      ? "bg-foreground font-medium text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {month}
                </button>
              );
            })}
          </div>
        )}

        {/* Year grid */}
        {view === "year" && (
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 12 }, (_, i) => decadeStart + i).map((year) => {
              const isSelected = year === selectedYear;
              return (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={cn(
                    "rounded-md py-2 text-sm transition-colors",
                    isSelected
                      ? "bg-foreground font-medium text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {year}
                </button>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default MonthYearPicker;