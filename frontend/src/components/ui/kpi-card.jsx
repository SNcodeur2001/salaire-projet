import * as React from "react"
import { cn } from "@/lib/utils"

const KPICard = React.forwardRef(
  ({ title, value, subtitle, icon: Icon, trend, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("kpi-card stat-card group", className)}
        {...props}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {title}
              </p>
            </div>
            
            {Icon && (
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-primary group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300 shadow-lg">
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground font-medium">
                {subtitle}
              </p>
            )}
          </div>
          
          {trend && (
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full",
                trend.value > 0 ? "bg-success/10 text-success" : 
                trend.value < 0 ? "bg-destructive/10 text-destructive" : 
                "bg-muted text-muted-foreground"
              )}>
                {trend.value > 0 && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                {trend.value < 0 && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
              {trend.label && (
                <span className="text-xs text-muted-foreground font-medium">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
)
KPICard.displayName = "KPICard"

export { KPICard }