"use client"

import Link from "next/link"

export default function DashboardPage() {
  function handleLogout() {
    document.cookie = "auth-token=; path=/; max-age=0"
    window.location.href = "/"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="font-display text-4xl mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome to your protected dashboard. You can only see this if you have an auth-token cookie.
      </p>
      
      <div className="flex gap-4">
        <button 
          onClick={handleLogout}
          className="rounded bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary-deep"
        >
          Sign Out
        </button>
        <Link 
          href="/"
          className="rounded border border-input px-4 py-2 transition-colors hover:bg-muted"
        >
          Go to Landing Page
        </Link>
      </div>
    </div>
  )
}
