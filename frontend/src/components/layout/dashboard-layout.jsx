import * as React from "react"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"

function hexToRgb(hex) {
  try {
    if (!hex) return null
    let c = (hex + '').trim().replace('#','')
    if (c.length === 3) c = c.split('').map(x => x + x).join('')
    if (!/^[0-9a-fA-F]{6}$/.test(c)) return null
    const num = parseInt(c, 16)
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
  } catch { return null }
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = 0; s = 0 }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}
function parseToHslString(color) {
  const rgb = hexToRgb(color)
  if (!rgb) return null
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return `${h} ${s}% ${l}%`
}
function toBrandVars(color) {
  const hsl = parseToHslString(color)
  if (!hsl) return null
  const [hStr, sStr, lStr] = hsl.split(' ')
  const h = Number(hStr)
  const s = Number(sStr.replace('%',''))
  const l = Number(lStr.replace('%',''))
  const glowL = Math.min(l + 8, 92)
  return { ['--primary']: `${h} ${s}% ${l}%`, ['--primary-glow']: `${h} ${s}% ${glowL}%` }
}

const DashboardLayout = React.forwardRef(
  ({ children, userRole, userName, entreprise, onLogout, className }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
      <div ref={ref} className={cn("flex h-screen w-full bg-background", className)} style={toBrandVars(entreprise?.color) || undefined}>
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
            <div className="container mx-auto p-6 max-w-7xl animate-slide-up">
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