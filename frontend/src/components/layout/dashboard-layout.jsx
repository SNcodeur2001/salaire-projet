import * as React from "react"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"

const DashboardLayout = React.forwardRef(
  ({ children, userRole, userName, entreprise, onLogout, className }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
      <div ref={ref} className={cn("flex h-screen w-full bg-background", className)}>
        <Sidebar
          userRole={userRole}
          isCollapsed={isCollapsed}
          onToggleCollapsed={() => setIsCollapsed(!isCollapsed)}
          userName={userName}
          entreprise={entreprise}
          onLogout={onLogout}
        />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="container mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    )
  }
)
DashboardLayout.displayName = "DashboardLayout"

export { DashboardLayout }