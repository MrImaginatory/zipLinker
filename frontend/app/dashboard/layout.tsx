import { SunsetStripe } from "@/components/landing/sunset-stripe"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden flex-col md:flex-row bg-background">
      <MobileNav />
      <Sidebar />
      <main className="flex flex-1 flex-col min-w-0 overflow-y-auto pb-16 md:pb-0">
        <div className="flex-1">{children}</div>
        <SunsetStripe />
      </main>
    </div>
  )
}
