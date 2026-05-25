import Link from "next/link"
import { ChainScene } from "@/components/landing/chain-scene"
import { ThemeToggle } from "@/components/theme-toggle"
import { SunsetStripe } from "@/components/landing/sunset-stripe"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ChainScene />

      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-100">
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
        <nav className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-deep active:translate-y-px"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Now in public beta
        </div>

        <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-zinc-100 sm:text-6xl md:text-7xl lg:text-[5.25rem]">
          Short links that{" "}
          <span className="text-primary">zip</span>
        </h1>

        <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
          Ziplinker turns your long messy URLs into short, snappy links you can
          share anywhere. Fast, trackable, and yours.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-deep active:translate-y-px"
          >
            Start shortening
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-800 px-6 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-20 grid w-full max-w-lg grid-cols-3 gap-6">
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 text-center backdrop-blur-sm">
            <p className="font-display text-3xl leading-[1.1] text-zinc-100">10ms</p>
            <p className="mt-1 text-xs text-zinc-500">Avg. redirect</p>
          </div>
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 text-center backdrop-blur-sm">
            <p className="font-display text-3xl leading-[1.1] text-zinc-100">99.9%</p>
            <p className="mt-1 text-xs text-zinc-500">Uptime</p>
          </div>
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 text-center backdrop-blur-sm">
            <p className="font-display text-3xl leading-[1.1] text-zinc-100">∞</p>
            <p className="mt-1 text-xs text-zinc-500">Custom links</p>
          </div>
        </div>
      </main>

      <SunsetStripe />

      <footer className="bg-cream px-6 py-12 text-center text-sm text-slate dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl">
          <p className="font-display text-lg text-ink dark:text-zinc-100">Ziplinker</p>
          <p className="mt-1 text-xs text-steel">Short links that zip.</p>
          <p className="mt-6 text-xs text-stone dark:text-zinc-600">
            &copy; 2026 Ziplinker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
