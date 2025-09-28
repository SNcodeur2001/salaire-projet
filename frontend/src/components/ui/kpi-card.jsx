import * as React from "react"
import { cn } from "@/lib/utils"

const KPICard = React.forwardRef(
  ({ title, value, subtitle, icon: Icon, trend, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("kpi-card group", className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight">
                {value}
              </p>
              {subtitle && (
                <p className="text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.value > 0 ? "text-success" : trend.value < 0 ? "text-destructive" : "text-muted-foreground"
            )}>
              {trend.value > 0 && "↗"}
              {trend.value < 0 && "↘"}
              {trend.value === 0 && "→"}
              <span>{Math.abs(trend.value)}%</span>
            </div>
            {trend.label && (
              <span className="text-xs text-muted-foreground">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)
KPICard.displayName = "KPICard"

export { KPICard }