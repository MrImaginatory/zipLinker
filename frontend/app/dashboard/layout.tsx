import { SunsetStripe } from "@/components/landing/sunset-stripe"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <SunsetStripe />
      </main>
    </div>
  )
}
