import * as React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCheck, 
  Calculator, 
  FileText, 
  CreditCard,
  ChevronLeft,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/enhanced-button"

const roleMenuItems = {
  'super-admin': [
    { path: '/super-admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/super-admin/entreprises', label: 'Entreprises', icon: Building2 },
  ],
  'admin': [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/employes', label: 'Employés', icon: UserCheck },
    { path: '/admin/payruns', label: 'Cycles de Paie', icon: Calculator },
    { path: '/admin/payslips', label: 'Bulletins', icon: FileText },
  ],
  'caissier': [
    { path: '/caissier', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/caissier/payslips', label: 'Bulletins', icon: FileText },
    { path: '/caissier/paiements', label: 'Paiements', icon: CreditCard },
  ]
}

const Sidebar = React.forwardRef(({
  userRole,
  isCollapsed = false,
  onToggleCollapsed,
  userName = "Utilisateur",
  onLogout
}, ref) => {
  const location = useLocation()
  const menuItems = roleMenuItems[userRole]

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super-admin': return 'Super Admin'
      case 'admin': return 'Administrateur'
      case 'caissier': return 'Caissier'
      default: return role
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold gradient-text">PayrollPro</span>
              <span className="text-xs text-muted-foreground">{getRoleDisplayName(userRole)}</span>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapsed}
          className={cn(
            "h-8 w-8 transition-transform",
            isCollapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== `/${userRole}` && location.pathname.startsWith(item.path))

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-nav-item",
                isActive && "active"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-3">
        {!isCollapsed && (
          <div className="mb-3 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplayName(userRole)}</p>
              </div>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-destructive",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Déconnexion</span>}
        </Button>
      </div>
    </div>
  )
})
Sidebar.displayName = "Sidebar"

export { Sidebar }
