"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Link2, LogOut, User, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { fetchApi } from "@/lib/api"

const navItems = [
  { href: "/dashboard/insights", label: "Insights", icon: BarChart3 },
  { href: "/dashboard/links", label: "Add Links", icon: Link2 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem("sidebar_collapsed")
    if (saved !== null) {
      setIsCollapsed(saved === "true")
    }
  }, [])

  function toggleCollapse() {
    const nextState = !isCollapsed
    setIsCollapsed(nextState)
    localStorage.setItem("sidebar_collapsed", String(nextState))
  }

  async function handleLogout() {
    try {
      await fetchApi("/users/logout", { method: "POST" }).catch(() => null)
    } finally {
      localStorage.clear()
      sessionStorage.clear()
      document.cookie = "connect.sid=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      router.push("/")
    }
  }

  return (
    <aside
      className={cn(
        "relative hidden h-screen flex-col border-r border-beige-deep bg-cream transition-all duration-300 ease-in-out md:flex z-20 shrink-0",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle Button */}
      {isMounted && (
        <button
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-beige-deep bg-cream text-charcoal shadow-sm hover:bg-cream-deeper hover:text-ink transition-colors focus:outline-none"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}

      {/* Logo Area */}
      <div
        className={cn(
          "flex items-center pt-8 pb-7 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "px-6"
        )}
      >
        <Logo appearance="color" showText={!isCollapsed} />
      </div>

      {/* Nav Items */}
      <nav className={cn("flex-1 space-y-1.5 px-3 transition-all duration-300", isCollapsed && "px-2")}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                isCollapsed 
                  ? "h-10 w-10 justify-center mx-auto" 
                  : "gap-3 px-4 py-2.5",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-charcoal hover:bg-cream-deeper hover:text-ink"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer Area with Sign Out */}
      <div className={cn("border-t border-beige-deep py-4 px-3 transition-all duration-300", isCollapsed && "px-2")}>
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sign Out" : undefined}
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-charcoal transition-all duration-200 hover:bg-cream-deeper hover:text-ink",
            isCollapsed 
              ? "h-10 w-10 justify-center mx-auto" 
              : "gap-3 px-4 py-2.5 w-full"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
