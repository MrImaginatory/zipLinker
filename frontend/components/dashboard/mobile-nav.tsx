"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

export function MobileNav() {
  const pathname = usePathname()

  const isInsightsActive = pathname.startsWith("/dashboard/insights")
  const isLinksActive = pathname.startsWith("/dashboard/links")
  const isProfileActive = pathname.startsWith("/dashboard/profile")

  return (
    <div className="md:hidden">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-beige-deep bg-cream/90 px-4 backdrop-blur-md">
        <Logo appearance="color" />
        <ThemeToggle />
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-beige-deep bg-cream/95 pb-safe-bottom shadow-lg backdrop-blur-md">
        <div className="flex justify-around items-end h-16 px-4 pb-2 relative">
          
          {/* Insights Button (Left) */}
          <Link
            href="/dashboard/insights"
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 w-20 h-12 transition-all duration-200",
              isInsightsActive ? "text-primary font-semibold" : "text-charcoal hover:text-ink font-medium"
            )}
          >
            {isInsightsActive && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-primary animate-pulse" />
            )}
            <BarChart3 className={cn("h-5.5 w-5.5 transition-transform duration-200", isInsightsActive && "scale-110 text-primary")} />
            <span className="text-[10px] tracking-wide">
              Insights
            </span>
          </Link>

          {/* Add Link 3D Circular Button (Center, Big, Protruding) */}
          <div className="relative -top-4 flex flex-col items-center z-50">
            <Link
              href="/dashboard/links"
              aria-label="Add Link"
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-150 shadow-md",
                "bg-gradient-to-br from-primary via-primary to-primary-deep",
                "border-4 border-cream",
                "shadow-[0_4px_0_var(--color-primary-deep,oklch(0.52_0.19_33))]",
                "active:translate-y-[3px] active:shadow-[0_1px_0_var(--color-primary-deep,oklch(0.52_0.19_33))]",
                isLinksActive ? "scale-105" : "hover:scale-105"
              )}
              style={{
                // Fallback direct styling in case var(--color-*) isn't registered yet
                boxShadow: isLinksActive 
                  ? "0 4px 0 oklch(0.52 0.19 33)" 
                  : "0 4px 0 oklch(0.52 0.19 33)"
              }}
            >
              <Plus className="h-7 w-7 stroke-[3px]" />
            </Link>
            <span className={cn(
              "text-[10px] tracking-wide mt-1 font-semibold transition-colors duration-200",
              isLinksActive ? "text-primary font-bold" : "text-charcoal"
            )}>
              Add Link
            </span>
          </div>

          {/* Profile Button (Right) */}
          <Link
            href="/dashboard/profile"
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 w-20 h-12 transition-all duration-200",
              isProfileActive ? "text-primary font-semibold" : "text-charcoal hover:text-ink font-medium"
            )}
          >
            {isProfileActive && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-primary animate-pulse" />
            )}
            <User className={cn("h-5.5 w-5.5 transition-transform duration-200", isProfileActive && "scale-110 text-primary")} />
            <span className="text-[10px] tracking-wide">
              Profile
            </span>
          </Link>

        </div>
      </nav>
    </div>
  )
}
