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
  Clock,
  ChevronLeft,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/enhanced-button"

const roleMenuItems = {
  'super-admin': [
    { path: '/super-admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/super-admin/entreprises', label: 'Entreprises', icon: Building2 },
    { path: '/super-admin/users', label: 'Utilisateurs', icon: Users },
  ],
  'admin': [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/employes', label: 'Employés', icon: UserCheck },
    { path: '/admin/payruns', label: 'Cycles de Paie', icon: Calculator },
    { path: '/admin/payslips', label: 'Bulletins', icon: FileText },
    { path: '/admin/attendance', label: 'Pointage', icon: Clock },
  ],
  'caissier': [
    { path: '/caissier', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/caissier/payslips', label: 'Bulletins', icon: FileText },
    { path: '/caissier/paiements', label: 'Paiements', icon: CreditCard },
  ],
  'vigile': [
    { path: '/vigile', label: 'Pointage Employés', icon: Clock },
  ],
  'employe': [
    { path: '/employe', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employe/attendance', label: 'Pointage', icon: Clock },
  ]
}

const Sidebar = React.forwardRef(({
  userRole,
  isCollapsed = false,
  onToggleCollapsed,
  userName = "Utilisateur",
  entreprise,
  onLogout
}, ref) => {
  const location = useLocation()
  const menuItems = roleMenuItems[userRole]

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super-admin': return 'Super Admin'
      case 'admin': return 'Administrateur'
      case 'caissier': return 'Caissier'
      case 'vigile': return 'Vigile'
      default: return role
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-screen flex-col border-r border-border/50 bg-gradient-to-b from-card to-card/95 backdrop-blur-xl transition-[width] duration-300 ease-in-out shadow-xl",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex h-20 items-center justify-between border-b border-border/50 px-6 sticky top-0 z-10 bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl shadow-sm">
        {!isCollapsed && (
          <div className="flex items-center gap-3 animate-fade-in">
            {entreprise?.logo ? (
              <img
                src={entreprise.logo}
                alt={`${entreprise.name} logo`}
                className="h-8 w-8 rounded-lg object-cover"
                style={{ backgroundColor: entreprise.color || '#3b82f6' }}
              />
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-lg rounded-xl" />
                <div
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary-glow shadow-lg"
                  style={{ backgroundColor: entreprise?.color || undefined }}
                >
                  <Calculator className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base font-bold gradient-text">
                {entreprise?.name || 'GES-Salary'}
              </span>
              <span className="text-xs text-muted-foreground font-medium">{getRoleDisplayName(userRole)}</span>
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
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

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
      <div className="border-t border-border/50 p-4 bg-gradient-to-t from-muted/30 to-transparent">
        {!isCollapsed && (
          <div className="mb-3 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 p-4 border border-border/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-sm font-bold shadow-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{userName}</p>
                <p className="text-xs text-muted-foreground font-medium">{getRoleDisplayName(userRole)}</p>
              </div>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium">Déconnexion</span>}
        </Button>
      </div>
    </div>
  )
})
Sidebar.displayName = "Sidebar"

export { Sidebar }
