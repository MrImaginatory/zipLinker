"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Link2, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"

const navItems = [
  { href: "/dashboard/insights", label: "Insights", icon: BarChart3 },
  { href: "/dashboard/links", label: "Add Links", icon: Link2 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    document.cookie = "connect.sid=; path=/; max-age=0"
    router.push("/")
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-beige-deep bg-cream">
      <div className="flex items-center px-6 pt-8 pb-7">
        <Logo appearance="color" />
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-charcoal hover:bg-cream-deeper hover:text-ink"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-beige-deep px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-cream-deeper hover:text-ink"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
