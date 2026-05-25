import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { SunsetStripe } from "@/components/landing/sunset-stripe"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink dark:text-zinc-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 text-primary"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Ziplinker
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-6 py-12">
        {children}
      </main>

      <SunsetStripe />
    </div>
  )
}
