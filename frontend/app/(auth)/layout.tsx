import Link from "next/link"
import { SunsetStripe } from "@/components/landing/sunset-stripe"
import { Logo } from "@/components/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-6 py-12">
        {children}
      </main>

      <SunsetStripe />
    </div>
  )
}
