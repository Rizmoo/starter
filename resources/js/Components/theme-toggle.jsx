import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useColorTheme } from "@/Components/color-theme-provider";
import { cn } from "@/Lib/utils";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/Components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const themes = [
    { name: 'Green', value: 'default', color: 'bg-[#22c55e]' },
    { name: 'Purple', value: 'purple', color: 'bg-[#a855f7]' },
    { name: 'Red', value: 'red', color: 'bg-[#ef4444]' },
    { name: 'Blue', value: 'blue', color: 'bg-[#3b82f6]' },
    { name: 'Orange', value: 'orange', color: 'bg-[#f97316]' },
    { name: 'Indigo', value: 'indigo', color: 'bg-[#6366f1]' },
  ];

  const Icon = !mounted
    ? Sun
    : theme === 'dark'
    ? Moon
    : theme === 'system'
    ? Monitor
    : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full border border-border/40 hover:bg-muted focus-visible:ring-0 focus-visible:ring-offset-0">
          <Icon className="h-[1.1rem] w-[1.1rem]" />
          <span className="sr-only">Toggle appearance</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2 shadow-2xl border-border/50">
        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-2">
          Appearance Mode
        </DropdownMenuLabel>
        <div className="grid grid-cols-3 gap-1 p-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme("light")} 
            className={cn("flex-col h-auto py-2 gap-1.5", theme === 'light' && "bg-accent")}
          >
            <Sun className="h-4 w-4" />
            <span className="text-[10px]">Light</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme("dark")} 
            className={cn("flex-col h-auto py-2 gap-1.5", theme === 'dark' && "bg-accent")}
          >
            <Moon className="h-4 w-4" />
            <span className="text-[10px]">Dark</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme("system")} 
            className={cn("flex-col h-auto py-2 gap-1.5", theme === 'system' && "bg-accent")}
          >
            <Monitor className="h-4 w-4" />
            <span className="text-[10px]">System</span>
          </Button>
        </div>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-2">
          Brand Color
        </DropdownMenuLabel>
        <div className="grid grid-cols-6 gap-2 p-1">
          {themes.map((t) => (
            <button
              key={t.value}
              title={t.name}
              onClick={() => setColorTheme(t.value)}
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center transition-all ring-offset-2 ring-offset-background",
                t.color,
                colorTheme === t.value ? "ring-2 ring-primary scale-110 shadow-lg" : "opacity-80 hover:opacity-100 hover:scale-110"
              )}
            >
              {colorTheme === t.value && <div className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
