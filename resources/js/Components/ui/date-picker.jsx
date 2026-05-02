import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/Lib/utils"
import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"

export function DatePicker({ date, onDateChange, placeholder="Pick a date", disabled=false}) {
  const [open, setOpen] = React.useState(false);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isDateDisabled = (dateToCheck) => {
    const dateToCheckStart = new Date(dateToCheck);
    dateToCheckStart.setHours(0, 0, 0, 0);
    return dateToCheckStart > today;
  };

  const handleDateSelect = (selectedDate) => {
    onDateChange(selectedDate);
    if (selectedDate) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <span className="inline-flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </span>
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={isDateDisabled}
          />
        </PopoverContent>
      )}
    </Popover>
  )
}
