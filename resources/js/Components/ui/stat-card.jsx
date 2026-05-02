import React from "react";
import { Card, CardHeader, CardTitle } from "@/Components/ui/card";

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  change,
  changeType,
  colorScheme,
  color
}) {
  const scheme = colorScheme || color || 'blue';

  const colorVariants = {
    blue: {
      bg: 'from-blue-50/20 to-blue-50/10 dark:from-blue-900/10 dark:to-blue-800/10',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500 dark:text-blue-400',
      accent: 'from-blue-400/10 to-transparent'
    },
    green: {
      bg: 'from-green-50/20 to-green-50/10 dark:from-green-900/10 dark:to-green-800/10',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500 dark:text-green-400',
      accent: 'from-green-400/10 to-transparent'
    },
    amber: {
      bg: 'from-amber-50/20 to-amber-50/10 dark:from-amber-900/10 dark:to-amber-800/10',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500 dark:text-amber-400',
      accent: 'from-amber-400/10 to-transparent'
    },
    red: {
      bg: 'from-red-50/20 to-red-50/10 dark:from-red-900/10 dark:to-red-800/10',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500 dark:text-red-400',
      accent: 'from-red-400/10 to-transparent'
    },
    purple: {
      bg: 'from-purple-50/20 to-purple-50/10 dark:from-purple-900/10 dark:to-purple-800/10',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500 dark:text-purple-400',
      accent: 'from-purple-400/10 to-transparent'
    },
    indigo: {
      bg: 'from-indigo-50/20 to-indigo-50/10 dark:from-indigo-900/10 dark:to-indigo-800/10',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500 dark:text-indigo-400',
      accent: 'from-indigo-400/10 to-transparent'
    },
    emerald: {
      bg: 'from-emerald-50/20 to-emerald-50/10 dark:from-emerald-900/10 dark:to-emerald-800/10',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      accent: 'from-emerald-400/10 to-transparent'
    },
    orange: {
      bg: 'from-orange-50/20 to-orange-50/10 dark:from-orange-900/10 dark:to-orange-800/10',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500 dark:text-orange-400',
      accent: 'from-orange-400/10 to-transparent'
    }
  };

  const colors = colorVariants[scheme];

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-sm border border-border/40 bg-gradient-to-br ${colors.bg} w-full max-w-full`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 gap-2 min-w-0 w-full">
        <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</CardTitle>
          <div className="text-lg sm:text-2xl font-bold tracking-tight break-words">{value}</div>
          {subtitle && (
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
          {change && (
            <p className={`text-[10px] sm:text-xs font-medium truncate ${
              changeType === 'increase' ? 'text-green-600 dark:text-green-400' :
              changeType === 'decrease' ? 'text-red-600 dark:text-red-400' :
              'text-muted-foreground'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="shrink-0 flex-shrink-0">
          <div className={`${colors.iconBg} p-2 sm:p-3 rounded-full`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.iconColor}`} />
          </div>
        </div>
      </CardHeader>
      <div className={`absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br ${colors.accent} rounded-bl-full`}></div>
    </Card>
  );
}