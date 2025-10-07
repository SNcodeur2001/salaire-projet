import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:shadow-md hover:scale-105",
        secondary: "border-secondary/20 bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:shadow-md hover:scale-105",
        destructive: "border-destructive/20 bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:shadow-md hover:scale-105",
        outline: "text-foreground border-border hover:bg-accent hover:scale-105",
        success: "border-success/20 bg-gradient-to-r from-success to-success/90 text-success-foreground hover:shadow-md hover:scale-105",
        warning: "border-warning/20 bg-gradient-to-r from-warning to-warning/90 text-warning-foreground hover:shadow-md hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
