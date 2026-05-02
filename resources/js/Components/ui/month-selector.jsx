import * as React from "react"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/Lib/utils"
import { Button } from "@/Components/ui/button"
import { DateRangePicker } from "@/Components/ui/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"

export function MonthSelector({
  className,
  date,
  onDateChange
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState("current");

  // Prevent hydration mismatch by only setting theme after mount
  React.useEffect(() => {
    setMounted(true);
    setIsDark(theme === 'dark');
  }, [theme]);

  // Initialize with current month
  React.useEffect(() => {
    if (!date) {
      const now = new Date();
      onDateChange({
        from: startOfMonth(now),
        to: endOfMonth(now),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    
    if (value === "current") {
      const now = new Date();
      onDateChange({
        from: startOfMonth(now),
        to: endOfMonth(now),
      });
    } else if (value === "custom") {
      // Keep current date range for custom - don't change dates
      // The DateRangePicker will handle updates
    } else {
      // value is "prev-N" where N is number of months ago
      const monthsAgo = parseInt(value.replace("prev-", ""));
      const targetDate = subMonths(new Date(), monthsAgo);
      onDateChange({
        from: startOfMonth(targetDate),
        to: endOfMonth(targetDate),
      });
    }
  };

  // Detect if current date range matches a specific month and update selectedMonth accordingly
  React.useEffect(() => {
    if (!date?.from || !date?.to) return;

    const now = new Date();
    const isCurrentMonth = 
      format(date.from, "yyyy-MM-dd") === format(startOfMonth(now), "yyyy-MM-dd") &&
      format(date.to, "yyyy-MM-dd") === format(endOfMonth(now), "yyyy-MM-dd");

    if (isCurrentMonth) {
      setSelectedMonth((prev) => prev !== "current" ? "current" : prev);
      return;
    }

    // Check if it matches any previous month
    for (let i = 1; i <= 12; i++) {
      const targetDate = subMonths(now, i);
      const isThisMonth = 
        format(date.from, "yyyy-MM-dd") === format(startOfMonth(targetDate), "yyyy-MM-dd") &&
        format(date.to, "yyyy-MM-dd") === format(endOfMonth(targetDate), "yyyy-MM-dd");
      
      if (isThisMonth) {
        setSelectedMonth((prev) => prev !== `prev-${i}` ? `prev-${i}` : prev);
        return;
      }
    }

    // If it doesn't match current or previous months, it must be custom
    if (!isCurrentMonth) {
      setSelectedMonth((prev) => prev !== "custom" ? "custom" : prev);
    }
  }, [date]);

  // Generate list of previous months (last 12 months)
  const previousMonths = React.useMemo(() => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      const date = subMonths(new Date(), i);
      months.push({
        value: `prev-${i}`,
        label: format(date, "MMM yyyy"),
      });
    }
    return months;
  }, []);

  const displayText = React.useMemo(() => {
    if (date?.from && date?.to) {
      if (
        format(date.from, "yyyy-MM-dd") === format(startOfMonth(new Date()), "yyyy-MM-dd") &&
        format(date.to, "yyyy-MM-dd") === format(endOfMonth(new Date()), "yyyy-MM-dd")
      ) {
        return "Current Month";
      }
      return `${format(date.from, "MMM dd, y")} - ${format(date.to, "MMM dd, y")}`;
    }
    return "Select month";
  }, [date]);

  // Don't render theme-dependent styles until mounted
  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Month</SelectItem>
            {previousMonths.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select value={selectedMonth} onValueChange={handleMonthChange}>
        <SelectTrigger className={cn(
          "w-[180px]",
          isDark 
            ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-slate-600" 
            : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400"
        )}>
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}>
          <SelectItem value="current">Current Month</SelectItem>
          {previousMonths.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      
      {selectedMonth === "custom" && (
        <DateRangePicker date={date} onDateChange={onDateChange} />
      )}
    </div>
  );
}
