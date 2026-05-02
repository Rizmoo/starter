import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/Lib/utils"
import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"

export function DateRangePicker({
  className,
  date,
  onDateChange
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  // Prevent hydration mismatch by only setting theme after mount
  React.useEffect(() => {
    setMounted(true);
    setIsDark(theme === 'dark');
  }, [theme]);

  // Don't render theme-dependent styles until mounted
  if (!mounted) {
    return (
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className="w-auto sm:w-[260px] justify-start text-left font-normal text-xs sm:text-sm h-10"
            >
              <CalendarIcon className="mr-1 sm:mr-2 h-4 w-4 shrink-0" />
              {date?.from ? (
                date.to ? (
                  <span className="truncate">
                    {format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}
                  </span>
                ) : (
                  <span className="truncate">{format(date.from, "MMM dd, y")}</span>
                )
              ) : (
                <span className="truncate">Pick dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={1}
              className="sm:hidden"
            />
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={2}
              className="hidden sm:block"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-auto sm:w-[260px] justify-start text-left font-normal text-xs sm:text-sm h-10",
              isDark 
                ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-slate-600" 
                : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400",
              !date && (isDark ? "text-slate-400" : "text-gray-500")
            )}
          >
            <CalendarIcon className="mr-1 sm:mr-2 h-4 w-4 shrink-0" />
            {date?.from ? (
              date.to ? (
                <span className="truncate">
                  {format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}
                </span>
              ) : (
                <span className="truncate">{format(date.from, "MMM dd, y")}</span>
              )
            ) : (
              <span className="truncate">Pick dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-auto p-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`} align="end">
          {/* Single month calendar on mobile */}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={1}
            className={cn("sm:hidden", isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900')}
          />
          {/* Two month calendar on desktop */}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            className={cn("hidden sm:block", isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900')}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
