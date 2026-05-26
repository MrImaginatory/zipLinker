"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, LogOut, Mail, Shield, User } from "lucide-react"
import { fetchApi } from "@/lib/api"

interface UserProfile {
  userName: string
  email: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchApi("/users/profile")
        if (res && res.success && res.data) {
          setProfile(res.data)
        }
      } catch (err: any) {
        console.error("Failed to load profile details:", err)
        setError(err?.message || "Failed to load profile details")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

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

  const username = profile?.userName || "User"
  const email = profile?.email || "Email"
  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "N/A"
  const role = "Free Plan"
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl tracking-tight text-ink">
        Profile
      </h1>
      <p className="mt-1.5 text-sm text-steel">
        Manage your account settings.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium border border-destructive/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center py-12">
          <div className="loader" />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                <span className="font-display text-3xl text-primary-foreground">
                  {initials}
                </span>
              </div>
              <p className="mt-4 font-display text-xl tracking-tight text-ink">
                {username}
              </p>
              <p className="mt-0.5 text-sm text-steel">{role}</p>
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
                    <p className="text-sm font-medium text-ink">{username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-steel">Email</p>
                    <p className="text-sm font-medium text-ink">{email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-steel">Member Since</p>
                    <p className="text-sm font-medium text-ink">{joined}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-steel">Plan</p>
                    <p className="text-sm font-medium text-ink">{role}</p>
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
                className="mt-4 flex items-center gap-2 rounded-md bg-destructive px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-destructive/90 shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
