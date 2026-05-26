"use client"

import { useRouter } from "next/navigation"
import { Calendar, LogOut, Mail, Shield, User } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()

  function handleLogout() {
    document.cookie = "connect.sid=; path=/; max-age=0"
    router.push("/")
  }

  const user = {
    username: "johndoe",
    email: "john@example.com",
    joined: "January 2025",
    role: "Free Plan",
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl tracking-tight text-ink">
        Profile
      </h1>
      <p className="mt-1.5 text-sm text-steel">
        Manage your account settings.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary">
              <span className="font-display text-3xl text-primary-foreground">
                JD
              </span>
            </div>
            <p className="mt-4 font-display text-xl tracking-tight text-ink">
              {user.username}
            </p>
            <p className="mt-0.5 text-sm text-steel">{user.role}</p>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl tracking-tight text-ink">
              Account Details
            </h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-steel">Username</p>
                  <p className="text-sm font-medium text-ink">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-steel">Email</p>
                  <p className="text-sm font-medium text-ink">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-steel">Member Since</p>
                  <p className="text-sm font-medium text-ink">{user.joined}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-steel">Plan</p>
                  <p className="text-sm font-medium text-ink">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl tracking-tight text-ink">
              Danger Zone
            </h2>
            <p className="mt-1 text-sm text-steel">
              Sign out of your account. This will end your current session.
            </p>
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-on-dark transition-colors hover:bg-ink/90"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
